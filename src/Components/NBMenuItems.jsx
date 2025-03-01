import { getRolByUser } from "../Ctrl/AccesosCtrl";
import { getVistaRolByRol } from "../Ctrl/VistaRolCtrl";

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

//    { path: "/app/VisorDeCotizaciones", label: "Mis eventos" }

export const getDropdownOptions = async () => {
    const options = [];
    if ( sessionStorage.getItem("currentUser") == null){
        return [
            { path: "/", label: "Cerrar sesión" }
        ]
    }
    const user  = JSON.parse(sessionStorage.getItem("currentUser"));
    console.log(user)
    const roles = await getRolByUser(user.idusuario);
    console.log(roles)
    const acceso = await getVistaRolByRol(roles.map(objeto => objeto.id_rol));
    console.log(acceso)
    const vistaIdle = acceso.map(objeto => objeto.id_vista);
    console.log(vistaIdle)
   

    for (let i = 1; i <= 10; i++) {
        console.log("A"+i+": "+vistaIdle.includes(1))
      }
      
  
    // 2: Reservar
    if (vistaIdle.includes(2)) {
      options.push({ path: "/app/reservation", label: "Reservar" });
    }
  
    // 1: Editar perfil
    if (vistaIdle.includes(1)) {
      options.push({ path: "/app/EditProfile", label: "Editar perfil" });
    }
  
    // Cambiar contraseña (sin id, se incluye siempre)
    if (true){
        options.push({ path: "/app/ChangePassword", label: "Cambiar contraseña" });
    }

    // 4: Eventos y cotizaciones
    if (vistaIdle.includes(4)) {
      options.push({ path: "/app/CalendarioEventos", label: "*Eventos y cotizaciones" });
    }
  
    // 5: Configurador de usuarios
    if (vistaIdle.includes(5)) {
      options.push({ path: "app/usuarioConfig", label: "*Configurador de usuarios" });
    }
  
    // 10: Configurador de productos
    if (vistaIdle.includes(10)) {
      options.push({ path: "/app/productosConfig", label: "*Configurador de productos" });
    }
  
    // 6: Configurador de edificios
    if (vistaIdle.includes(6)) {
      options.push({ path: "/app/edificiosConfig", label: "*Configurador de edificios" });
    }
  
    // 7: Configurador de montajes
    if (vistaIdle.includes(7)) {
      options.push({ path: "/app/montajesConfig", label: "*Configurador de montajes" });
    }
  
    // 8: Configurador de tipos de evento
    if (vistaIdle.includes(8)) {
      options.push({ path: "/app/tiposeventoConfig", label: "*Configurador de tipos de evento" });
    }
  
    // 9: Configurador de página del club
    if (vistaIdle.includes(9)) {
      options.push({ path: "/app/pageConfig", label: "*Configurador de página del club" });
    }
  
    // La opción de "Cerrar sesión" siempre se muestra
    options.push({ path: "/", label: "Cerrar sesión" });
  
    return options;
  };

export const dropdownOptions = await getDropdownOptions();