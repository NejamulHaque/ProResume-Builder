const CACHE_NAME = 'proresume-pwa-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/app-icon-512.svg'
]

// Install: precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {})
    }).then(() => self.skipWaiting())
  )
})

// Activate: clean up older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k)
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch: stale-while-revalidate for assets, network-first for navigation
self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  // Skip non-GET requests and API/Chrome-extension requests
  if (req.method !== 'GET' || url.pathname.startsWith('/api') || url.protocol.startsWith('chrome-extension')) {
    return
  }

  // Navigation requests: network first with offline fallback to cached index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => {
        const cache = await caches.open(CACHE_NAME)
        return (await cache.match('/index.html')) || (await cache.match('/'))
      })
    )
    return
  }

  // Static assets (scripts, styles, images, fonts): stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const networked = fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
        }
        return res
      }).catch(() => cached)

      return cached || networked
    })
  )
})
