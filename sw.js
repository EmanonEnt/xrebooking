// Optimized Service Worker - Lightweight Cache Strategy
const CACHE_NAME = 'xrebooking-v2';
const STATIC_ASSETS = [
    './',
    './index.html'
];

// Install - Pre-cache critical resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).catch(() => {})
    );
    self.skipWaiting();
});

// Activate - Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch - Network first strategy with cache fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests and chrome-extension
    if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Skip cross-origin requests
    if (!request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(request).then((cachedResponse) => {
                    return cachedResponse || new Response('Offline', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});
