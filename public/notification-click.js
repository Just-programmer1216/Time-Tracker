// Підключається до service worker через workbox.importScripts (див. vite.config.ts).
// Клік по сповіщенню фокусує вже відкрите вікно застосунку або відкриває нове.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const existing = windowClients[0]
      if (existing) return existing.focus()
      return self.clients.openWindow('/')
    }),
  )
})
