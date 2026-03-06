// XRE BOOKING Service Worker - v13 (优化性能，events.html 不缓存)
const CACHE_NAME = 'xrebooking-v13';
const STATIC_CACHE = 'xrebooking-static-v13';
const IMAGE_CACHE = 'xrebooking-images-v13';

// 核心静态资源（排除 events.html）
const STATIC_ASSETS = [
    './',
    './index.html',
    './artist.html',
    './artists-data.json'
];

// 安装：缓存核心资源
self.addEventListener('install', (event) => {
    console.log('[SW] Installing XRE BOOKING SW v13...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => {
            console.log('[SW] XRE BOOKING v13 installed');
            return self.skipWaiting();
        })
    );
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating v13...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheName.includes('xrebooking-v13')) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 拦截请求
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // ===== 关键修复：events.html 使用 Network Only（不缓存）=====
    if (url.pathname.includes('events.html')) {
        event.respondWith(
            fetch(request, {
                cache: 'no-store'
            }).catch((error) => {
                console.error('[SW] events.html fetch failed:', error);
                return new Response('[]', {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // 2. 图片资源：Stale-While-Revalidate 策略
    if (request.destination === 'image') {
        event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
        return;
    }

    // 3. JSON数据：Network First
    if (url.pathname.endsWith('.json')) {
        event.respondWith(networkFirst(request, STATIC_CACHE));
        return;
    }

    // 4. HTML 导航请求：Network First
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(networkFirst(request, STATIC_CACHE));
        return;
    }

    // 5. 其他：Cache First
    event.respondWith(cacheFirst(request, STATIC_CACHE));
});

// 策略：Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cached);

    if (cached) {
        fetchPromise;
        return cached;
    }

    return fetchPromise;
}

// 策略：Network First（带3秒超时）
async function networkFirst(request, cacheName) {
    try {
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Network timeout')), 3000)
        );

        const networkResponse = await Promise.race([
            fetch(request),
            timeoutPromise
        ]);

        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cache = await caches.open(cacheName);
        const cached = await cache.match(request);
        if (cached) return cached;
        throw error;
    }
}

// 策略：Cache First
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
        return cached;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        throw error;
    }
}
