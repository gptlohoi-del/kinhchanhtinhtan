const CACHE_NAME = 'kinh-chanh-tinh-tan-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './subtitle.srt',
    './IPA.txt',
    './audio.mp3'
];

// 1. Cài đặt và lưu toàn bộ file (bao gồm cả MP3 và SRT) vào bộ nhớ điện thoại
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 2. Xóa cache cũ nếu bạn cập nhật phiên bản mới
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Khi tắt mạng, tự động lấy file từ bộ nhớ điện thoại ra phát
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
