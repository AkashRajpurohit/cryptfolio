self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const method = event.request.method;

  // Only handle GET requests
  if (method.toLowerCase() !== 'get') {
    return;
  }

  // Only handle requests to the same origin
  if (url.origin !== location.origin) {
    return;
  }

  // If the request is for the favicons, fonts, or the build files (which are hashed in the name)
  // then return the cached version
  if (url.pathname.match(/\/(favicon\/.*.*|fonts|build\/.*\.js)/)) {
    event.respondWith(
      // We will open the assets cache
      caches.open('assets').then(async (cache) => {
        // If the request is cached, we will use the cache
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If the request is not cached, we will fetch the request, cache it and return it
        // This way the next time this asset is needed, it will load from the cache
        const fetchReponse = await fetch(event.request);
        cache.put(event.request, fetchReponse.clone());

        return fetchReponse;
      })
    );
  }
});
