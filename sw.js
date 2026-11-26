// 비교견적 - 아주 단순한 오프라인 캐시 (설치/홈화면 추가 조건을 맞추기 위한 최소 구성)
// 파일을 직접 열 때(file://)는 등록되지 않습니다. '모바일접속_서버.bat'로 접속했을 때만 동작합니다.
const CACHE = 'bjgcmp-v1';
const CORE = ['./비교견적.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request)
        .then((res) => {
          try {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          } catch (err) {}
          return res;
        })
        .catch(() => hit);
    })
  );
});
