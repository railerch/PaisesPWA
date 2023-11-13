## Manifiesto de Aplicación Web
El manifiesto de aplicación web es un archivo JSON simple que informa al navegador sobre tu aplicación web. Indica cómo debe comportarse cuando se instala en el dispositivo móvil o escritorio del usuario. Si queremos que se muestre el mensaje Agregar a la Pantalla de Inicio, requeriremos el manifiesto de aplicación web.

Ahora que sabemos qué es un manifiesto web, creemos un nuevo archivo llamado manifest.json (tienes que nombrarlo así) en el directorio raíz. Luego agrega el siguiente bloque de código.

```
{
    "name": "My 1st PWA",
    "short_name": "MyPWA",
    "start_url": "index.js",
    "display": "standalone",
    "dir": "ltr",
    "background_color": "#fff",
    "theme_color": "#1ebddd",
    "orientation": "portrait-primary",
    "icons": [
        {
            "src": "./public/img/icon.png",
            "type": "image/png",
            "sizes": "512x512"
        },
        {
        "src": "/images/icons/icon-96x96.png",
        "type": "image/png", 
        "sizes": "96x96"
        }
    ]
}
```

**name** (nombre): Cuando el navegador inicie la pantalla de bienvenida, será el nombre que se muestre en la pantalla.

**short_name** (nombre corto): Será el nombre que se muestre debajo del acceso directo de la aplicación en la pantalla de inicio.

**start_url** (url de inicio): Será la página que se muestre al usuario una vez abierta tu aplicación.

**display** Le dice al navegador cómo mostrar la aplicación. Hay varios modos como _minimal-ui_, _fullscreen_, _browser_, etc. Aquí, utilizamos el modo _standalone_ para ocultar todo lo relacionado con el navegador.

**dir** Direccion del texto.
Ejemplo: _ltr_ (left to right), _rtl_ (right to left).

**description** Provee informacion adicional sobre la aplicacion.

**background_color** (color de fondo): Cuando el navegador inicie la pantalla de bienvenida, será el fondo pantalla.

**theme_color** (color de tema): Será el color de fondo de la barra de estado cuando abramos la aplicación.

**orientation** (orientación): Le dice al navegador la orientación que debe tener al mostrar la aplicación:
any
natural
landscape
landscape-primary
landscape-secondary
portrait
portrait-primary
portrait-secondary

**icons** (iconos): arreglo de iconos que puede usar el navegador para la aplicacion.
[{
   "src": source,
   "sizes": i.e. "192x192",
   "type": i.e. "image/png",
   "purpose": el proposito de la imagen en el contexto del OS anfitrion: badge, maskable, any
}]

**scope** representa el conjunto de URL que se pueden ver a través del contexto web instalable, si
el usuario navega fuera de este alcance, esas páginas se abrirán en un navegador estándar.
Ejemplo: "scope": "https://example.com/subdirectory/"

**categories** Esto está destinado a ser utilizado por las tiendas de aplicaciones para categorizar su aplicación.
Ejemplo: "categories": ["negocios", "tecnología", "web"]

**lang** lenguaje de la aplicacion.
Ejemplo: "lang": en (English)

>IMPORTANTE: Se debe agregar el manifest.json en el head del archivo HTML.

En **index.html** _(etiqueta head)_

```
<link rel="manifest" href="manifest.json" />
```
## Service Worker
Un service worker es un script que el navegador ejecuta en segundo plano en un hilo separado. Eso significa que se ejecuta en un lugar diferente y está completamente separado del sitio web. Esa es la razón por la que no puede manipular elementos en el DOM.

Las PWA se ejecutan solo en https ya que el service worker puede interceptar y manejar solicitudes de red, administrar el caché para habilitar el soporte fuera de línea o enviar notificaciones push a los usuarios, por lo tanto, se requiere seguridad.

El serviceWorker se crea en la carpeta raiz del proyecto para no limitar su alcance y el nombre que se le da al archivo es indiferente (serviceWorker.js, sw.js)

El serviceWorker se activa desde el archivo pricipal de JS del proyecto (main.js, app.js, etc.)

En **serviceWorker.js**

```
const staticDevCoffee = "dev-coffee-site-v1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee3.jpg",
  "/images/coffee4.jpg",
  "/images/coffee5.jpg",
  "/images/coffee6.jpg",
  "/images/coffee7.jpg",
  "/images/coffee8.jpg",
  "/images/coffee9.jpg",
]

// INSTALACION DE ARCHIVOS REQUERIDOS (App Shell)
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})

// MANEJAR PETICIONES FETCH
self.addEventListener("fetch", evt => {

    console.log(evt); // El evento (Object)
    console.log(evt.request); // El request del evento
    
    if (fetchEvt.request.url.includes(".png")) {
        // Manipular la respuesta del service worker interceptando el fetch saliente
        // let req = fetch("public/img/icon.png") // Fetch personalizado 
        // let req = fetch(fetchEvt.request.url) // Url de la peticion inicial
        // let req = fetch(fetchEvt.request) // Responder con el fetch inicial

        // Enviar el resultado
        fetchEvt.respondWith(req);
    } else {
        console.log("ANOTHER FILE: " + true);
    }

    // Manipular aun mas las respuestas con la clase Response
    if (fetchEvt.request.url.includes("main-style.css")) {
        let res = new Response(`
        body {
            background-color: red;
            color: #fff
        }
        `, {
            headers: {
                "content-type": "text/css"
            }
        });

        fetchEvt.respondWith(res);
    }

    if (fetchEvt.request.url.includes("main-fn.js")) {
        let res = new Response("alert('Hola mundo desde el service worker')", {
            headers: {
                "content-type": "text/javascript"
            }
        })

        fetchEvt.respondWith(res);
    }
})
```


## Registrando el Service Worker

En **js/app.js**

```
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/serviceWorker.js")
      .then(res => console.log("serviceWorker registrado."))
      .catch(err => console.log("ERROR al registrar el serviceWorker", err))
  })
}

// VALIDAR EL SOPORTE DE CHACHE DEL NAVEGADOR   
    // Nota: si soporta serviceWorker, tambien soporta chache 
    if ("caches" in window) {
        console.log("Tecnologia de cache soportada.");

        // Abrir un contenedor en cache, si no existe lo crea
        caches.open("prueba-1").then(console.log("Contenedor Prieba-1 inicializado"))

        // Comprobar que exista el contenedor indicado
        // Al usar console log sin parentesis como sentencia en la respuesta de una promesa 
        // este mostrara el resultado de la misma
        caches.has("prueba-1")
            .then(console.log) // true

        // Borrar un contenedor en cache
        caches.open("prueba-2").then(console.log("Contenedor Prieba-2 inicializado"))
        caches.delete("prueba-2")
            .then(console.log("Contenedor Prueba-2 eliminado"))

        // Crear un espacio en cache para almacenar los archivos
        caches.open("cache-v1.0").then(cache => {
            // Agregar solo un recurso
            cache.add("/index.html");

            // Agregar multiples recursos
            cache.addAll(["/public/css/main-style.css", "/public/css/fontello.css", "/public/js/main.js", "/public/js/main-fn.js"])
                .then(() => {
                    // Eliminar un archivo de la cache
                    cache.delete("/public/js/main-fn.js")
                });

            // Mostrar un archivo de cache por consola
            cache.match("/index.html").then(res =>
                res.text()
            ).then(console.log)

            // Modificar un rchivo de la cache
            cache.put("/public/css/main-style.css", new Response("Hola mundo"))
                .then(console.log("Archivo modificado..."))

        })

        // Mostrar los contenedores registrados
        caches.keys().then(keys => console.log(keys))
    }
```

Service Worker - https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
Manifest.json - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json