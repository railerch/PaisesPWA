import * as fn from "./main-fn.js";

window.onload = () => {
    // ACTIVAR EL SERVICE WORKER DE LA APP
    // Validar que no este un SW cargado previamente
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/serviceWorker.js")
            .then(res => console.log("ServiceWorker registrado."))
            .catch(err => console.log("ServiceWorker NO registrado.", err))
    }
}

// BOTON DE INSTALACION PARA LA PWA

// Variable global que tendra la captura del evento 'beforeinstallprompt'
let deferredPrompt;

/* Boton de instalacion, con un 'display=none' para solo mostrarlo cuando
el evento 'beforeinstallpromt' sea activado, esto limitara la visualizacion
del boton solo en aquellos navegadores compatibles con la instalacion de PWA */
let installLnk = document.getElementById("install-txt");

// Captura del evento ya mencionado
window.addEventListener("beforeinstallprompt", function (evt) {
    evt.preventDefault();
    deferredPrompt = evt;
    installLnk.style.display = "inline";
})

// Configuracion del boton que activara el evento cuando sea requerido por el usuario
installLnk.addEventListener("click", async function () {
    // Validar que el evento haya sido capturado
    if (deferredPrompt !== null) {
        // Mostrar la ventana emergente de instalacion
        deferredPrompt.prompt();
        // Esperar por la eleccion del usuario
        const { outcome } = await deferredPrompt.userChoice;

        // Si escoge instalar outcome es 'accepted' de lo contrario sera 'dismiss'
        if (outcome === "accepted") {
            deferredPrompt = null;
        }
    }
})

// INTERFACE
if (window.location.pathname.includes("responsive-layout")) {
    // Permitir ingreso si la sesion esta activa
    if (sessionStorage.getItem("sesion")) {
        // Reconocer el tamaño de la pantalla
        let anchoDisplay;
        let winWidth = window.innerWidth;
        if (winWidth >= 1400) {
            anchoDisplay = "XXL";
        } else if (winWidth >= 1200) {
            anchoDisplay = "XL";
        } else if (winWidth >= 992) {
            anchoDisplay = "LG";
        } else if (winWidth >= 768) {
            anchoDisplay = "MD";
        } else if (winWidth >= 576) {
            anchoDisplay = "SM";
        } else {
            anchoDisplay = "SX";
        }

        // Mostrar tipo de display segun el ancho en pixeles
        document.getElementById("pantalla-lbl").innerText = `Display: ${anchoDisplay} (${window.innerWidth}px)`;

        // Ancho de columna segun la pantalla
        const col = parseInt(winWidth / 12);

        // Generar contenido
        let contenido = document.getElementById("contenido");
        let conteoPaises = document.getElementById("conteo-paises");
        fetch("https://restcountries.com/v3.1/all")
            .then(res => res.json())
            .then(res => {
                contenido.innerHTML = "";
                conteoPaises.innerText = res.length;
                res.forEach(pais => {
                    // TARJETA
                    let div = document.createElement("div");
                    let str = pais.translations.spa.official.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-")
                    div.setAttribute("id", str)
                    div.classList.add("tarjetas")
                    div.style.width = `${col * 3}px`;
                    div.style.margin = "5px";
                    div.style.boxSizing = "border-box";
                    div.style.padding = "10px";
                    div.style.border = "1px solid gray";
                    div.style.borderRadius = "5px";
                    div.style.boxShadow = "1px 1px 3px gray";
                    div.style.backgroundColor = "lightgray";
                    div.style.color = "#333";
                    contenido.appendChild(div);

                    // ENCABEZADO
                    // ======> Imagen
                    let divImg = document.createElement("div");
                    let img = document.createElement("img");
                    let imgNum = 0;
                    do { imgNum = parseInt(Math.random() * 40) } while (imgNum == 0);
                    img.setAttribute("src", pais.flags.png);
                    img.style.width = "100%";
                    divImg.appendChild(img);
                    div.appendChild(divImg);

                    // ======> Nombre pais
                    let divEnc = document.createElement("div")
                    let h = document.createElement("h3");
                    h.style.marginBottom = "5px"
                    h.textContent = pais.translations.spa.official;
                    let continente = document.createElement("small");
                    continente.innerText = pais.continents[0]

                    divEnc.appendChild(h);
                    divEnc.appendChild(continente);
                    divImg.appendChild(divEnc);

                    // ======> Separador
                    let hr = document.createElement("hr");
                    div.appendChild(hr);

                    // DETALLES DEL PAIS
                    let lista = ["Capital", "Moneda", "Idioma", "Población", "Zona horaria", "Mapa"];
                    let ul = document.createElement("ul");
                    lista.forEach(dat => {
                        let li = document.createElement("li");
                        switch (dat) {
                            case "Capital":
                                li.style.wordWrap = "break-word";
                                li.innerHTML = `<b>${dat}</b>: ${pais.capital}`;
                                ul.appendChild(li);
                                break;
                            case "Población":
                                // Cantidad con separador de miles
                                let poblacion = parseInt(pais.population).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                li.style.wordWrap = "break-word";
                                li.innerHTML = `<b>${dat}</b>: ${poblacion}`;
                                ul.appendChild(li);
                                break;
                            case "Idioma":
                                let lang = [];
                                for (let l in pais.languages) {
                                    lang.push(pais.languages[l]);
                                }
                                li.style.wordWrap = "break-word";
                                li.innerHTML = `<b>${dat}</b>: ${lang.toString()}`;
                                ul.appendChild(li);
                                break;
                            case "Moneda":
                                let coin = [];
                                for (let cur in pais.currencies) {
                                    coin.push(pais.currencies[cur].name);
                                }
                                li.style.wordWrap = "break-word";
                                li.innerHTML = `<b>${dat}</b>: ${coin.toString()}`;
                                ul.appendChild(li);
                                break;
                            case "Zona horaria":
                                li.style.wordWrap = "break-word";
                                li.innerHTML = `<b>${dat}</b>: ${pais.timezones}`;
                                ul.appendChild(li);
                                break;
                            case "Mapa":
                                li.innerHTML = `${dat}: <a href='${pais.maps.googleMaps}' target='_blank'><i class="icon-eye"></i>Ver mapa<a/>`;
                                ul.appendChild(li);
                                break;
                        }
                    })
                    div.appendChild(ul);
                })

                // FILTRO DE BUSQUEDA
                document.getElementById("buscar-ico").addEventListener("click", function () {
                    let contenido = document.getElementById("contenido");
                    if (contenido.querySelector("#err-404")) {
                        contenido.querySelector("#err-404").remove();
                    }

                    let busqueda = document.getElementById("filtro").value.toLowerCase();
                    let encontrado = false;

                    contenido.querySelectorAll(".tarjetas").forEach(el => {
                        let pais = el.getAttribute("id").toLowerCase();
                        if (!pais.includes(busqueda)) {
                            el.style.display = "none";
                        } else {
                            el.style.display = "block";
                            encontrado = true;
                        }
                    })

                    // Mostrar mensaje en caso de no haber coincidencias
                    if (!encontrado) {
                        // Evitar duplicar mensaje anterior
                        if (contenido.querySelector("#err-404")) {
                            contenido.querySelector("#err-404").remove();
                        }

                        // Mostrar mensaje 
                        let h3 = document.createElement("h3");
                        h3.setAttribute("id", "err-404");
                        h3.style.color = "orange";
                        h3.innerHTML = "<i class='icon-frown'></i>Sin coincidencias...";
                        contenido.prepend(h3);
                    }
                })

                // ======> Limpiar filtro
                document.getElementById("limpiar-filtro-ico").addEventListener("click", function () {
                    document.getElementById("filtro").value = "";

                    if (contenido.querySelector("#err-404")) {
                        contenido.querySelector("#err-404").remove();
                    }

                    document.querySelectorAll(".tarjetas").forEach(el => {
                        el.style.display = "block";
                    })
                })

            }).catch(err => {
                let contenido = document.getElementById("contenido");
                contenido.innerHTML = "<h3 style='color:red'><i class='icon-wifi'></i> Sin conexión a internet.</h3>";
                console.log("Error en API fetch\n" + err)
            })

        // Boton Scroll Top
        window.scrollTo();
        let goTopBtn = document.getElementById("go-top");

        // =====> Posicion por defecto
        goTopBtn.style.top = window.scrollY + (window.innerHeight * 90 / 100);

        // =====> Hacer scroll con el documento
        window.addEventListener("scroll", function () {
            let btnPos = window.scrollY + (window.innerHeight * 90 / 100);
            goTopBtn.style.top = `${btnPos}px`
        })

        // =====> Hacer scroll hasta el inicio
        goTopBtn.addEventListener("click", function () {
            // Posicion actual del tope de la ventana
            let top = window.scrollY;

            // Razon de aceleracion del scroll
            let R = 1;

            // Animacion del scroll
            let scrollTimer = setInterval(() => {
                top = top - (100 * R);
                window.scrollTo({
                    top: top
                });

                // Si el tope de la ventana es menor a cero se cancela el timer
                if (top < 0) {
                    clearInterval(scrollTimer);
                }

                // Aumentar la razon de aceleracion
                R++;

            }, 10)
        })

        // Salir de la aplicacion
        document.getElementById("salir-txt").addEventListener("click", function () {
            console.log("Cerrar sesion...")
            window.location.replace("index.html");
        })
    } else {
        // Retornar al login
        window.location.replace("/")
    }
} else {
    // LOGIN
    sessionStorage.removeItem("sesion");
    document.cookie = "";
    document.getElementById("login-frm").addEventListener("submit", function (evt) {
        evt.preventDefault();
        let usuario = this.querySelector("input[name=usuario]").value.toLowerCase();
        let clave = this.querySelector("input[name=clave]").value;

        if (usuario == "root" && clave == 1234) {
            // Agregar cookies con fecha de expiracion para 5 dias
            let fecVen = new Date();
            fecVen.setTime(fecVen.getTime() + (5 * 24 * 60 * 60 * 1000));

            document.cookie = `credenciales=${usuario}|${clave};expires=${fecVen.toGMTString()}`;
            document.cookie = `dominio=localhost;expires=${fecVen.toGMTString()}`;

            sessionStorage.setItem("sesion", true);

            fn.aviso_usuario("Redirigiendo...", "aviso-ok");

            setTimeout(() => {
                window.location.replace("responsive-layout.html");
            }, 2500);
        } else {
            fn.aviso_usuario("Datos invalidos", "aviso-error");
        }
    })


}
