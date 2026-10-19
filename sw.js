const CACHE = 'ipa-trainer-v2.0.0';
const ASSETS = [
    './', './index.html', './manifest.json',
    './static/style.css', './static/script.js', './static/router.js',
    './static/dialog.js', './static/pwa.js',
    './data/ipa.json', './data/words.json',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {}))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    if (!e.request.url.startsWith('http')) return;
    e.respondWith(
        caches.match(e.request).then((cached) => {
            const fetched = fetch(e.request).then((res) => {
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE).then((c) => c.put(e.request, clone));
                }
                return res;
            }).catch(() => cached);
            return cached || fetched;
        })
    );
});