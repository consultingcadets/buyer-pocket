// BuyerPocket Service Worker
// Strategy:
//   _next/static/* → cache-first (immutable assets, content-hashed)
//   /api/* + supabase → network-only (never cache buyer data)
//   navigation (HTML) → network-first, fallback to /offline
//   everything else  → network-first

const SHELL_CACHE = "buyerpocket-shell-v1";
const STATIC_CACHE = "buyerpocket-static-v1";

const OFFLINE_URL = "/offline";

const NEVER_CACHE = [
  "/api/",
  "supabase.co",
  "googleapis.com",
  "firebaseio.com",
  "stripe.com",
];

// ── Install: pre-cache offline page ──────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll([OFFLINE_URL]).catch(() => {
        // offline page may not exist yet during first deploy — that's OK
      })
    )
  );
  self.skipWaiting();
});

// ── Activate: clean up old caches ────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin + https
  if (
    url.origin !== location.origin &&
    !url.hostname.endsWith("supabase.co")
  ) {
    return;
  }

  // Never cache: API routes and external data services
  if (NEVER_CACHE.some((p) => request.url.includes(p))) {
    event.respondWith(networkOnly(request));
    return;
  }

  // Immutable static assets — cache-first
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigation requests — network-first with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Everything else — network-first
  event.respondWith(networkFirst(request, SHELL_CACHE));
});

// ── Strategies ────────────────────────────────────────────────────────────────

async function networkOnly(request) {
  return fetch(request);
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response("Network error", { status: 503 });
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const offlinePage = await caches.match(OFFLINE_URL);
    return (
      offlinePage ??
      new Response("You are offline.", {
        status: 503,
        headers: { "Content-Type": "text/html" },
      })
    );
  }
}

// ── Push notifications ────────────────────────────────────────────────────────

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "BuyerPocket", body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title ?? "BuyerPocket", {
      body: payload.body ?? "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: payload.tag ?? "buyerpocket",
      data: payload.data ?? {},
      requireInteraction: false,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/today";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      const existing = windowClients.find((c) => c.url === url && "focus" in c);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
