// XRE BOOKING Service Worker - v11
const CACHE_NAME = 'xrebooking-v11';
const STATIC_CACHE = 'xrebooking-static-v11';
const IMAGE_CACHE = 'xrebooking-images-v11';

// 核心静态资源
const STATIC_ASSETS = [
    './',
    './index.html'
];

// 安装：缓存核心资源
self.addEventListener('install', (event) => {
    console.log('[SW] Installing XRE BOOKING SW...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => {
            console.log('[SW] XRE BOOKING installed');
            return self.skipWaiting();
        })
    );
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheName.includes('xrebooking-v11')) {
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

    // 1. 图片资源：Stale-While-Revalidate 策略
    if (request.destination === 'image') {
        event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
        return;
    }

    // 2. HTML：Network First
    if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
        event.respondWith(networkFirst(request, STATIC_CACHE));
        return;
    }

    // 3. 其他：Cache First
    event.respondWith(cacheFirst(request, STATIC_CACHE));
});

// 策略：Stale While Revalidate（缓存优先，后台更新）
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    // 后台更新缓存
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cached);

    // 立即返回缓存（如果有）
    if (cached) {
        fetchPromise; // 触发后台更新
        return cached;
    }

    // 没有缓存，等待网络
    return fetchPromise;
}

// 策略：Network First（网络优先）
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
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

// 策略：Cache First（缓存优先）
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
