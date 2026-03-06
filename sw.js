// XRE BOOKING - Service Worker
// 优化版本：减少缓存大小，提升性能

const CACHE_NAME = 'xre-booking-v2';
const STATIC_CACHE = 'xre-static-v2';
const IMAGE_CACHE = 'xre-images-v2';

// 核心静态资源（必须缓存）
const STATIC_ASSETS = [
    './index.html',
    './events.html'
];

// 图片资源（可选缓存）
const IMAGE_ASSETS = [
    './images/webtop.png',
    './images/xrelogoL.png',
    './images/p-p-3.jpg',
    './images/xre-adbg.jpg'
];

// 安装：预缓存核心资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                return caches.open(IMAGE_CACHE);
            })
            .then((cache) => {
                // 图片缓存失败不阻止安装
                return cache.addAll(IMAGE_ASSETS).catch(() => {
                    console.log('Some images failed to cache');
                });
            })
            .then(() => self.skipWaiting())
    );
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => {
                        return name.startsWith('xre-') && 
                               name !== STATIC_CACHE && 
                               name !== IMAGE_CACHE;
                    })
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// 获取：缓存策略
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 跳过非GET请求
    if (request.method !== 'GET') {
        return;
    }

    // 跳过Chrome扩展和第三方分析
    if (url.protocol === 'chrome-extension:' || 
        url.hostname.includes('google-analytics') ||
        url.hostname.includes('googletagmanager')) {
        return;
    }

    // 图片资源：Stale-While-Revalidate策略
    if (request.destination === 'image') {
        event.respondWith(
            caches.open(IMAGE_CACHE).then((cache) => {
                return cache.match(request).then((cached) => {
                    const fetchPromise = fetch(request)
                        .then((networkResponse) => {
                            if (networkResponse.ok) {
                                cache.put(request, networkResponse.clone());
                            }
                            return networkResponse;
                        })
                        .catch(() => cached);

                    return cached || fetchPromise;
                });
            })
        );
        return;
    }

    // HTML页面：Network-First策略
    if (request.destination === 'document' || request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse.ok) {
                        const clone = networkResponse.clone();
                        caches.open(STATIC_CACHE).then((cache) => {
                            cache.put(request, clone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(request).then((cached) => {
                        return cached || caches.match('./index.html');
                    });
                })
        );
        return;
    }

    // 其他资源：Cache-First策略
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) {
                // 后台更新缓存
                fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse.ok) {
                            caches.open(STATIC_CACHE).then((cache) => {
                                cache.put(request, networkResponse);
                            });
                        }
                    })
                    .catch(() => {});
                return cached;
            }

            return fetch(request)
                .then((networkResponse) => {
                    if (networkResponse.ok) {
                        const clone = networkResponse.clone();
                        caches.open(STATIC_CACHE).then((cache) => {
                            cache.put(request, clone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return new Response('Offline', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
        })
    );
});

// 消息处理
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
