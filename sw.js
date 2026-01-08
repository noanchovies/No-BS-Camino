const CACHE_NAME = 'camino-v2'; // Bumped version number
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './camino-master-data.js',       // The new brain
  './daily-check/daily-weather-page.html', // The new page
  './daily-check/daily-widget.js',     // The new logic
  'https://cdn.tailwindcss.com',   // External lib
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
