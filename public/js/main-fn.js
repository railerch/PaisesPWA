export function aviso_usuario(msj, tipo) {
    let avisoErr = document.getElementById("aviso-usuario");
    avisoErr.style.display = "block"
    avisoErr.removeAttribute("class");;
    avisoErr.classList.add(tipo);
    avisoErr.innerText = msj;

    setTimeout(() => {
        avisoErr.style.display = "none"
    }, 2000);
}