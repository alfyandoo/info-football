importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
if (workbox) {
  console.log(`Workbox berhasil dimuat`);
  workbox.precaching.precacheAndRoute([
    { url: "/", revision: '1' },
    { url: "/index.html", revision: '1' },
    { url: "/detail_match.html", revision: '1' },
    { url: "/manifest.json", revision: '1' },
    { url: "/pages/about.html", revision: '1' },
    { url: "/pages/favorit.html", revision: '1' },
    { url: "/pages/home.html", revision: '1' },
    { url: "/pages/jadwal.html", revision: '1' },
    { url: "/pages/nav.html", revision: '1' },
    { url: "/pages/standings.html", revision: '1' },
    { url: "/css/materialize.min.css", revision: '1' },
    { url: "/css/style.css", revision: '1' },
    { url: "/img/alfyando.png", revision: '1' },
    { url: "/img/home-image.png", revision: '1' },
    { url: "/img/logo-pl.png", revision: '1' },
    { url: "/img/maskable_icon512.png", revision: '1' },
    { url: "/img/maskable_icon192.png", revision: '1' },
    { url: "/js/api.js", revision: '1' },
    { url: "/js/fav.js", revision: '1' },
    { url: "/js/idb.js", revision: '1' },
    { url: "/js/main.js", revision: '1' },
    { url: "/js/materialize.min.js", revision: '1' },
    { url: "/js/nav.js", revision: '1' },
    { url: "/js/show.js", revision: '1' },
    { url: "https://fonts.googleapis.com/css?family=Quicksand:400,700&display=swap", revision: '1' },
    { url: "https://fonts.gstatic.com/s/quicksand/v21/6xKtdSZaM9iE8KbpRA_hK1QN.woff2", revision: '1' },
  ], {
    ignoreUrlParametersMatching: [/.*/]
  });
  
  workbox.routing.registerRoute(
    new RegExp("/pages/"),
      workbox.strategies.staleWhileRevalidate({
          cacheName: "pages"
      })
  );
  
  workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'premier-league',
    })
  );
  
  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );
  
  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ]
    })
  );
} else {
  console.log(`Workbox gagal dimuat`);
}


self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/logo-pl.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
