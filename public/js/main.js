import * as fn from "./main-fn.js";

window.onload = () => {
    console.log("JS active...");
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
            for (let i = 0; i < 6; i++) {
                let div = document.createElement("div");
                div.classList.add("lorem-ipsum")
                div.style.width = `${col * 3}px`;
                div.style.margin = "5px";
                div.style.padding = "5px";
                div.style.border = "1px solid gray";
                div.style.borderRadius = "5px";
                div.style.boxShadow = "1px 1px 3px gray";

                let divImg = document.createElement("div");
                divImg.style.display = "flex";

                let img = document.createElement("img");
                img.setAttribute("src", `img/img${i + 1}.png`);
                img.style.width = "20%";
                img.style.marginRight = "1em";

                let h = document.createElement("h3");
                h.textContent = "Lorem ipsum";

                divImg.appendChild(img);
                divImg.appendChild(h);

                let hr = document.createElement("hr");
                let p = document.createElement("p");
                p.textContent = "Lorem ipsum es el texto que se usa habitualmente en diseño gráfico en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final.";

                div.appendChild(divImg);
                div.appendChild(hr);
                div.appendChild(p);
                contenido.appendChild(div);
            }

            // Probar solicitudes y validacion de sesion mediante cookies
            document.getElementById("probar-btn").addEventListener("click", function () {
                const serverResDiv = document.getElementById("respuesta-div");
                fetch("/probar-cookies")
                    .then(res => res.text())
                    .then(res => {
                        if (res == "Unauthorized") {
                            // Cerrar la sesion en caso de no estar autorizado (si cambian las creds en las cookies)
                            window.location.replace("/");
                        } else {
                            // Mostrar respuesta del servidor si la sesion es valida
                            serverResDiv.innerText = res;
                        }
                    }).catch(err => {
                        alert("Error en servidor: " + err);
                    })
            })

            //Limpiar contenedor de respuesta
            document.getElementById("reiniciar-btn").addEventListener("click", function () {
                document.getElementById("respuesta-div").innerText = "";
            })

            // Salir de la aplicacion
            document.getElementById("salir-btn").addEventListener("click", function () {
                console.log("Cerrar sesion...")
                window.location.replace("/");
            })
        } else {
            window.location.replace("/")
        }
    } else {
        // LOGIN
        sessionStorage.removeItem("sesion");
        document.getElementById("login-frm").addEventListener("submit", function (evt) {
            evt.preventDefault();
            let usuario = this.querySelector("input[name=usuario]").value;
            let clave = this.querySelector("input[name=clave]").value;
            let clav

            /*
            if (res.code == 200) {
                        sessionStorage.setItem("sesion", true);

                        fn.aviso_usuario("Redirigiendo...", "aviso-ok");

                        setTimeout(() => {
                            window.location.replace("/responsive-layout");
                        }, 2500);
                    } else {
                        fn.aviso_usuario("Datos invalidos", "aviso-error");
                    }
            */

        })
    }

}