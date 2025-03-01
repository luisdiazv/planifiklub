import userControl from './UserControl';

export const handleAcceso = async (idVista) => {
    try {
        const acceso = await userControl.tieneAcceso(idVista);
        
        if (!acceso) {
            console.log("DENEGADO");
            console.error("Acceso denegado: el usuario no tiene permisos para esta vista.");
            window.location.href = "/app/404";
        } else {
            console.log("PERMITIDO");
            console.log("Acceso permitido a la vista solicitada.");
        }
        return acceso;
    } catch (error) {
        console.error("Error al verificar el acceso:", error);
        window.location.href = "/app/404";
        return false;
    }
};
