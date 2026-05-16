// Killer service worker: clears all PWA caches and unregisters itself.
// Deployed at /sw.js so browsers with the old vite-plugin-pwa registration
// pick this up as an "update" and self-destruct cleanly.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
  );
});
