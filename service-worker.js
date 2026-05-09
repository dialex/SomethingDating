const CACHE_NAME = "dating-guide-v1.2.23";
const ASSETS = [
  "/DatingGuide/",
  "/DatingGuide/index.html",
  "/DatingGuide/css/styles.css",
  "/DatingGuide/js/app.js",
  "/DatingGuide/js/workflow.js",
  "/DatingGuide/js/install.js",
  "/DatingGuide/js/phases/intro.js",
  "/DatingGuide/js/phases/meeting.js",
  "/DatingGuide/js/phases/dating.js",
  "/DatingGuide/js/phases/keeping.js",
  "/DatingGuide/manifest.json",
  "/DatingGuide/icon-192.png",
  "/DatingGuide/icon-512.png",
  "/DatingGuide/images/intro.jpg",
  "/DatingGuide/images/meeting.jpg",
  "/DatingGuide/images/dating.jpg",
];

// Install: cache all assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

// Fetch: cache-first, fall back to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cached) => cached || fetch(event.request)),
  );
});
