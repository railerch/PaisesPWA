class ctrl {
    constructor() {
        this.sesiones = [];
    }

    static login(req, res) {
        res.render("login");
    }

    static iniciarSesion(req, res) {
        const usuario = req.body.usuario.toLowerCase();
        const clave = req.body.clave;
        if (usuario === "root" && clave === "root") {
            // Agregar cookies
            res.cookie("credenciales", `${usuario}|${clave}`, { httpOnly: true });
            res.cookie("dominio", "localhost:3001", { httpOnly: true });
            res.json({ code: 200 });
        } else {
            res.sendStatus(401);
        }
    }

    static responsiveLayout(req, res) {
        res.render("responsive-layout");
    }

    static cookieTest(req, res) {
        // Recuperar cookies
        if (req.cookies) {
            res.json(req.cookies);
        } else {
            res.json({ stCode: 404 })
        }
    }
}

export default ctrl;