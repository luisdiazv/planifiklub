import { patch } from "@mui/material";

export const MenuItems = [
    {
        title: "¿Quienes somos?",
        url: "/AboutUs",
        cName: "nav-links",
    },
    {
        title: "¿Qué es PK?",
        url: "/AboutPk",
        cName: "nav-links",
    },
    {
        title: "Iniciar Sesión",
        url: "/app/LogIn",
        cName: "nav-links",
    },
    {
        title: "Ingresar a App",
        url: "/app",
        cName: "nav-links-button",
    },
    {
        title: "Registrarse",
        url: "/app/SignUp",
        cName: "nav-links-button",
    },


];

export const dropdownOptions = [
    { path: "/app/reservation", label: "Reservar" },
    { path: "/app/EditProfile", label: "Editar perfil" },
    { path: "/app/ChangePassword", label: "Cambiar contraseña" },
    { path: "/", label: "Cerrar sesión" }, // Sin referencia directa a handleLogout
    { path: "/app/CalendarioEventos", label: "Eventos y cotizaciones [ADMIN]" },
    { path: "/app/rolesConfig", label: "Configurador de roles [ADMIN]" },
    { path: "/app/sociosConfig", label: "Configurador de socios [ADMIN]" },
    { path: "/app/productosConfig", label: "Configurador de productos [ADMIN]" },
    { path: "/app/edificiosConfig", label: "Configurador de edificios [ADMIN]" },
    { path: "/app/montajesConfig", label: "Configurador de montajes [ADMIN]" },
    { path: "/app/tiposeventoConfig", label: "Configurador de tipos de evento [ADMIN]" },
    { path: "/app/pageConfig", label: "Configurador de página del club [ADMIN]" },
];

