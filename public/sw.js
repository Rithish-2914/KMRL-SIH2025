// Service Worker for offline functionality
const CACHE_NAME = "kmrl-docs-v1"
const urlsToCache = [
  "/",
  "/mobile",
  "/mobile/camera",
  "/mobile/documents",
  "/mobile/search",
  "/mobile/profile",
  "/manifest.json",
]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "document-sync") {
    event.waitUntil(syncDocuments())
  }
})

// Push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New document notification",
    icon: "/kmrl-notification-icon.jpg",
    badge: "/kmrl-badge-icon.jpg",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Document",
        icon: "/view-icon.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/close-icon.jpg",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("KMRL Document Assistant", options))
})

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/mobile/documents"))
  }
})

async function syncDocuments() {
  // TODO: Implement actual sync logic with IndexedDB
  console.log("Background sync: syncing documents")
}
