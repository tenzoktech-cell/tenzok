// Kill-switch service worker.
//
// A service worker registered on localhost:3000 by a previous project keeps
// serving stale cached assets for this app. The browser re-fetches /sw.js on
// page loads (previously a 404, which kept the old worker alive); serving
// this file replaces it with a worker that unregisters itself, clears every
// cache, and reloads open tabs so they load fresh from the network.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })(),
  );
});
