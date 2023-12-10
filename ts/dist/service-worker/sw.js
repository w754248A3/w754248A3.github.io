"use strict";
const myself = self;
const CACHE_NAME = `temperature-converter-v1`;
// Use the install event to pre-cache all initial resources.
myself.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll([
            './',
            './main.js',
            './converter.css'
        ]);
    })());
});
myself.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const load = async () => {
            try {
                // If the resource was not in the cache, try the network.
                const fetchResponse = await fetch(event.request);
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
                // Save the resource in the cache and return it.
            }
            catch {
                return Response.error();
            }
        };
        // Get the resource from the cache.
        const cachedResponse = await cache.match(event.request.clone());
        if (cachedResponse) {
            load();
            return cachedResponse;
        }
        else {
            return await load();
        }
    })());
});
//# sourceMappingURL=sw.js.map