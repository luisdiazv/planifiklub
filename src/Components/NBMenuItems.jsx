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
        url: "/App/LogIn",
        cName: "nav-links",
        icon: ""
    },
    {
        title: "Registrarse",
        url: "/App/SignUp",
        cName: "nav-links-button",
        icon: ""
    }
];

export const dropdownOptions = [
    { path: "/App/payment", label: "Nuestros Servicios" },
    { path: "/App/EditProfile", label: "Editar perfil" },
    { path: "/", label: "Cerrar sesión" }, // Sin referencia directa a handleLogout
];