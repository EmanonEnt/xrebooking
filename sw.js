// Optimized Service Worker - Minimal & Fast
const CACHE_NAME = 'xrebooking-v2';
const STATIC_ASSETS = [
    './',
    './index.html'
];

// Install - cache minimal assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).catch(() => {})
    );
    self.skipWaiting();
});

// Activate - clean old caches
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

// Fetch - network first, cache fallback for static only
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET and cross-origin
    if (request.method !== 'GET') return;
    if (!request.url.startsWith(self.location.origin)) return;

    // Only cache HTML and static assets
    const url = new URL(request.url);
    const isStatic = url.pathname.endsWith('.html') || 
                     url.pathname.endsWith('.css') || 
                     url.pathname.endsWith('.js') ||
                     url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/);

    if (!isStatic) return;

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
                return caches.match(request);
            })
    );
});
