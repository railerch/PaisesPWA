import * as fn from "./main-fn.js";

window.onload = () => {
    console.log("JS active...");

    // BOTON DE INSTALACION PARA LA PWA

    // Variable global que tendra la captura del evento 'beforeinstallprompt'
    let deferredPrompt;

    /* Boton de instalacion, con un 'display=none' para solo mostrarlo cuando
    el evento 'beforeinstallpromt' sea activado, esto limitara la visualizacion
    del boton solo en aquellos navegadores compatibles con la instalacion de PWA */
    let installLnk = document.getElementById("install-lnk");

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
        if (sessionStorage.getItem("sesion")) {
            console.log("Section: Responsive Layout");
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
            fetch("https://restcountries.com/v3.1/all")
                .then(res => res.json())
                .then(res => {
                    contenido.innerHTML = "";
                    console.log(res[0]);

                    res.forEach(pais => {
                        // TARJETA
                        let div = document.createElement("div");
                        div.classList.add("tarjetas")
                        div.style.width = `${col * 3}px`;
                        div.style.margin = "5px";
                        div.style.padding = "5px";
                        div.style.border = "1px solid gray";
                        div.style.borderRadius = "5px";
                        div.style.boxShadow = "1px 1px 3px gray";
                        div.style.backgroundColor = "beige";

                        let divImg = document.createElement("div");
                        divImg.style.display = "flex";
                        contenido.appendChild(div);

                        // IMAGEN
                        let img = document.createElement("img");
                        let imgNum = 0;
                        do { imgNum = parseInt(Math.random() * 40) } while (imgNum == 0);
                        img.setAttribute("src", pais.flags.png);
                        img.style.width = "25%";
                        img.style.marginRight = "1em";
                        div.appendChild(divImg);

                        // ENCABEZADO
                        let divEnc = document.createElement("div")
                        let h = document.createElement("h3");
                        h.style.marginBottom = "5px"
                        h.textContent = pais.translations.spa.official;
                        let continente = document.createElement("small");
                        continente.innerText = pais.continents[0]
                        divEnc.appendChild(h);
                        divEnc.appendChild(continente);

                        divImg.appendChild(img);
                        divImg.appendChild(divEnc);

                        let hr = document.createElement("hr");
                        div.appendChild(hr);

                        // LISTA
                        let lista = ["Capital", "Moneda", "Idioma", "Población", "Zona horaria", "Mapa"];
                        let ul = document.createElement("ul");
                        lista.forEach(dat => {
                            let li = document.createElement("li");
                            switch (dat) {
                                case "Capital":
                                    li.innerText = `${dat}: ${pais.capital}`;
                                    ul.appendChild(li);
                                    break;
                                case "Población":
                                    li.innerText = `${dat}: ${parseInt(pais.population)}`;
                                    ul.appendChild(li);
                                    break;
                                case "Idioma":
                                    let lang = [];
                                    for (let l in pais.languages) {
                                        lang.push(pais.languages[l]);
                                    }
                                    li.innerText = `${dat}: ${lang.toString()}`;
                                    ul.appendChild(li);
                                    break;
                                case "Moneda":
                                    let coin = [];
                                    for (let cur in pais.currencies) {
                                        coin.push(pais.currencies[cur].name);
                                    }
                                    li.innerText = `${dat}: ${coin.toString()}`;
                                    ul.appendChild(li);
                                    break;
                                case "Zona horaria":
                                    li.innerText = `${dat}: ${pais.timezones}`;
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
                }).catch(err => alert("Error en API fetch\n" + err))

            // Salir de la aplicacion
            document.getElementById("salir-btn").addEventListener("click", function () {
                console.log("Cerrar sesion...")
                window.location.replace("index.html");
            })
        } else {
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
}