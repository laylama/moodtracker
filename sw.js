self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('mood-tracker-cache').then((cache) => {
      return cache.addAll([
        'index.html',
        'scripts.js',
        'styles.css',
        // 添加其他需要缓存的资源（如图标、图片等）
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
