// BuyerPocket Service Worker
const CACHE = "buyerpocket-v1";

const PRECACHE = [
  "/offline",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon.svg",
];

// Hosts that must never be intercepted
const PASSTHROUGH_HOSTS = ["supabase.co", "stripe.com", "posthog.com", "fcm.googleapis.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== "GET") return;

  // Never intercept external APIs or auth
  if (PASSTHROUGH_HOSTS.some((h) => url.hostname.includes(h))) return;

  // Never intercept Next.js API routes or webhooks
  if (url.pathname.startsWith("/api/")) return;

  // Navigation requests: network-first, fall back to offline page
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          // Cache a fresh copy of the page shell
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match("/offline"))
    );
    return;
  }

  // Static assets (_next/static, images, fonts): cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff2?|ico)$/)
  ) {
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then((c) => c.put(request, clone));
            }
            return res;
          })
      )
    );
    return;
  }

  // Everything else: network-first, no offline fallback
  e.respondWith(fetch(request).catch(() => new Response("", { status: 503 })));
});
