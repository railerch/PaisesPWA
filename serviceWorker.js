const CACHE_STATICO = "cache-static-v1";
const CACHE_DINAMICO = "cache-dinamico-v1";

// ALMACENAR EL 'APP SHELL' EN CACHE AL INSTALAR
// Nota: El App Shell es todo lo necesario para que la app funcione
self.addEventListener("install", evt => {

    let cacheStatico = caches.open(CACHE_STATICO)
        .then(cache => {
            return cache.addAll([
                "/index.html",
                "/responsive-layout.html",
                "/public/css/main-style.css",
                "/public/css/fontello.css",
                "/public/font/fontello.woff2?35656611",
                "/public/js/main.js",
                "/public/js/main-fn.js",
                "/public/img/icon.png",
                "/public/img/icon.ico",
                "/public/img/preloader.gif"
            ])
        })

    // Ejecutar la instalacion una vez el trabajo con la cache este listo
    evt.waitUntil(cacheStatico);
});

// MANEJAR PETICIONES FETCH
self.addEventListener("fetch", evt => {
    // console.log(evt);
    // console.log(evt.request);

    // cache dinamica (Network Fallback)
    let cacheDinamico = caches.match(evt.request)
        .then(res => {
            // Si existe el archivo en cache se retorna
            if (res) return res;

            // No existe el archivo y hay que recuperarlo desde la web
            console.log("Erro 404: " + evt.request.url);

            // Se solicita nuevamente y se reemplaza la solicitud en cache con la nueva peticion 
            return fetch(evt.request).then(newRes => {
                caches.open(CACHE_DINAMICO).then(cache => {
                    cache.put(evt.request, newRes);
                })

                return newRes.clone();
            })

        })

    evt.waitUntil(cacheDinamico);
})