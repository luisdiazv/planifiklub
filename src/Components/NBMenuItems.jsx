export const MenuItems = [
    {
        title: "¿Quienes somos?",
        url: "/AboutUs",
        cName: "nav-links",
        icon: ""
    },
    {
        title: "¿Qué es PK?",
        url: "/AboutPk",
        cName: "nav-links",
        icon: ""
    },
    {
        title: "Iniciar Sesión",
        url: "/app/LogIn",
        cName: "nav-links",
        icon: ""
    },
    {
        title: "Registrarse",
        url: "/app/SignUp",
        cName: "nav-links-button",
        icon: ""
    }
];

export const dropdownOptions = [
    { path: "/app/payment", label: "Nuestros Servicios" },
    { path: "/app/EditProfile", label: "Editar perfil" },
    { path: "/app/ChangePassword", label: "Cambiar contraseña" },
    { path: "/app/CalendarioEventos", label: "Eventos y cotizaciones [ADMIN]" },
    { path: "/", label: "Cerrar sesión" }, // Sin referencia directa a handleLogout
];
