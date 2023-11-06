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
Ten en cuenta que las PWA se ejecutan solo en https porque el service workers puede acceder a la solicitud y manejarla. Por lo tanto, se requiere seguridad.

Un service worker es un script que tu navegador ejecuta en segundo plano en un hilo separado. Eso significa que se ejecuta en un lugar diferente y está completamente separado de tu página web. Esa es la razón por la que no puede manipular elementos en el DOM.

Sin embargo, es superpoderoso. El service worker puede interceptar y manejar solicitudes de red, administrar el caché para habilitar el soporte fuera de línea o enviar notificaciones push a tus usuarios.

Entonces, creemos nuestro primer service worker en la carpeta raíz nombrándolo serviceWorker.js (el nombre depende de ti). Pero tienes que ponerlo en la raíz para no limitar su alcance a una sola carpeta.

>IMPORTANTE: El serviceWorker se crea en la carpeta raiz del proyecto.

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
```

Declaramos el nombre de nuestro caché **staticDevCoffee** y los recursos (assets) para almacenar en el mismo. Para realizar esta acción, necesitamos adjuntar un event listener a **self**.

**self** es el propio service worker. Nos permite escuchar los eventos del ciclo de vida y hacer algo a cambio.

El service worker tiene varios ciclos de vida y uno de ellos es el evento **install**. Se ejecuta cuando se instala el service worker. Se activa tan pronto se ejecuta y solo es llamado una vez por cada service worker.

Cuando se dispara el evento **install**, ejecutamos el callback que nos da acceso al objecto **event**.

Almacenar cosas en la caché del navegador puede tardar un tiempo en finalizar porque es asíncrono.

Entonces, para manejarlo necesitamos usar el método **waitUntil()**, el cual espera a que termine la acción.

Una vez que la API de caché este lista, podemos ejecutar el método **open()** y crear nuestra caché pasando su nombre como argumento a **caches.open(staticDevCoffee)**.

Luego esta devuelve una promesa, que nos ayuda a almacenar nuestros recursos en la caché con **cache.addAll(assets)**.

En el evento **fetch** para recuperar nuestros datos. El callback nos da acceso a **fetchEvent**. Luego le adjuntamos **respondWith()** para evitar la respuesta predeterminada del navegador. En su lugar devuelve una promesa, ya que la acción de recuperación puede tardar un tiempo en completarse.

Y una vez listo el caché, aplicamos el método **caches.match(fetchEvent.request)**. Este verificará si algo en el caché coincide con **fetchEvent.request**. Por cierto, fetchEvent.request es solo nuestro arreglo de recursos.

Luego, este devuelve una promesa. Y finalmente, podemos devolver el resultado si existe o el fetch inicial si no.

Ahora, nuestros recursos pueden ser almacenados en caché y recuperados por el service worker, lo que aumenta bastante el tiempo de carga de nuestras imágenes.

Y lo más importante, hace que nuestra aplicación esté disponible en modo fuera de línea.

Pero un service worker por si solo no puede hacer el trabajo. Necesitamos registrarlo en nuestro proyecto.

## Registrando el Service Worker

En **js/app.js**

```
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
```

Aquí, comenzamos verificando si **serviceWorker** es compatible con el navegador actual (ya que todavía no es compatible con todos los navegadores).

Luego, escuchamos el evento de carga de la página para registrar nuestro service worker pasando el nombre de nuestro archivo **serviceWorker.js** a **navigator.serviceWorker.register()** como parámetro para registrar nuestro worker.

Con esta actualización, ahora hemos transformado nuestra aplicación web habitual en una PWA.

Service Worker - https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
Manifest.json - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json