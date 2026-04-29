importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Config injected at build time via /api/fcm-sw-config, or use placeholders replaced by Next.js
// The service worker cannot read NEXT_PUBLIC_ env vars directly, so we inject via a meta tag trick
// or use self.__FIREBASE_CONFIG__ set by a script tag.
// For simplicity, hardcode via self.__FIREBASE_CONFIG__ set at registration time.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(event.data.config);
    }
  }
});

// Fallback: initialise with placeholder values overridden at runtime via postMessage
let app;
function ensureApp() {
  if (firebase.apps.length === 0) return null;
  return firebase.apps[0];
}

const messaging = firebase.messaging.isSupported()
  ? (() => {
      // Will be initialised lazily once config is available
      return null;
    })()
  : null;

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }
  const notification = payload.notification ?? {};
  const data = payload.data ?? {};

  event.waitUntil(
    self.registration.showNotification(notification.title ?? "BuyerPocket", {
      body: notification.body ?? "",
      icon: "/icon-192.png",
      badge: "/badge-72.png",
      data,
      requireInteraction: true,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data ?? {};
  const url = data.buyerId ? `/buyers/${data.buyerId}` : "/today";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// FCM background message handler (when app is closed / in background)
firebase.messaging.isSupported() &&
  self.addEventListener("install", () => {
    // Activate immediately
    self.skipWaiting();
  });
