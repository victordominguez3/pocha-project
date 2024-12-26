const CACHE_NAME = "mi-pwa-cache-v1";
const urlsToCache = [
  "./",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/apple-touch-icon.png",
  "/android-chrome-512x512.png",
  "/model.js",
  "/viewModel.js",
  "/basto.png",
  "/copa.png",
  "/espada.png",
  "/oro.png"
];

// Instalar el Service Worker y guardar en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar solicitudes y servir desde la caché
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      // Opcional: Proporciona un archivo de respaldo si todo falla
      return caches.match('./index.html');
  })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
      caches.keys().then((cacheNames) => {
          return Promise.all(
              cacheNames.map((cacheName) => {
                  if (!cacheWhitelist.includes(cacheName)) {
                      return caches.delete(cacheName);
                  }
              })
          );
      })
  );
});