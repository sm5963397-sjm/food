importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA9ow668puMztfqJcfAHkJcXXBlWjWFIx8",
  authDomain: "eatlo-ec2f6.firebaseapp.com",
  projectId: "eatlo-ec2f6",
  storageBucket: "eatlo-ec2f6.firebasestorage.app",
  messagingSenderId: "298601218259",
  appId: "1:298601218259:web:d8b54f5322139f42881426"
});

const messaging = firebase.messaging();

// Handle background messages (when app is closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);

  const notificationTitle = payload.notification?.title || '🍔 New Order - EatLo';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new order!',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: 'eatlo-order-' + Date.now(),
    data: payload.data,
    actions: [
      { action: 'view', title: '👀 View Order' },
      { action: 'close', title: 'Dismiss' }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('admin.html') && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow('/admin.html');
      })
    );
  }
});