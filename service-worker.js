// Versão do cache - atualize sempre que modificar os recursos
const CACHE_NAME = 'nexuscalc-quantum-v4';
const OFFLINE_CACHE = 'nexuscalc-offline-v1';

// Lista de todos os recursos necessários
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  
  // Ícones
  './icons/icon-192x192.png',
  './icons/icon-256x256.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  
  // Recursos externos
  'https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.2.0/math.min.js',
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  
  // Fallback offline
  './offline.html'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting());
      })
      .catch(err => {
        console.error('Falha ao adicionar ao cache:', err);
      })
  );
});

// Estratégia de Cache: Cache First, com fallback para network
self.addEventListener('fetch', event => {
  // Ignora requisições não GET e de outras origens
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Retorna do cache se disponível
        if (cachedResponse) {
          return cachedResponse;
        }

        // Busca na rede e atualiza o cache
        return fetch(event.request)
          .then(response => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para adicionar ao cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback para páginas offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./offline.html');
            }
            
            // Fallback para outros recursos
            return new Response(JSON.stringify({
              error: 'Você está offline e este recurso não está disponível no cache.'
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
      })
  );
});

// Limpeza de caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, OFFLINE_CACHE];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Atualização em segundo plano
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
