// Ancien service worker d'Exeter Terrain : il se retire et efface ses caches, pour que l'adresse
// renvoie toujours directement vers Orbit - Tracker (aucune ancienne page servie depuis le cache).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.registration.unregister()).then(() => self.clients.matchAll()).then((clients) => clients.forEach((c) => c.navigate(c.url)))));
