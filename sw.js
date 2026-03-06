// 优化版 Service Worker - 轻量级缓存策略
const CACHE_NAME = 'xrebooking-v1';
const STATIC_ASSETS = [
    './',
    './index.html'
];

// 安装事件 - 预缓存关键资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).catch(() => {
            // 静默失败，不影响用户体验
        })
    );
    self.skipWaiting();
});

// 激活事件 - 清理旧缓存
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

//  fetch 事件 - 网络优先策略
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // 跳过非GET请求和chrome-extension请求
    if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
        return;
    }

    // 跳过跨域请求（如Spotify iframe）
    if (!request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // 缓存成功的响应
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // 网络失败时回退到缓存
                return caches.match(request).then((cachedResponse) => {
                    return cachedResponse || new Response('Offline', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});
