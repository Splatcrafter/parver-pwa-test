/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {
    title: 'PWA Showcase',
    body: 'Du hast eine Push-Benachrichtigung erhalten!',
    icon: '/icons/icon-192.png'
  };

  const options: NotificationOptions & { vibrate?: number[] } = {
    body: data.body,
    icon: data.icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  };

  event.waitUntil(
    // @ts-expect-error vibrate is valid in showNotification but not in TS types
    self.registration.showNotification(data.title, { ...options, vibrate: [200, 100, 200] })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      if (clients.length > 0) {
        (clients[0] as WindowClient).focus();
      } else {
        self.clients.openWindow('/');
      }
    })
  );
});
