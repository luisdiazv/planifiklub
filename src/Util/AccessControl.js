import userControl from './UserControl';

export const handleAcceso = async (idVista) => {
    try {
        const acceso = await userControl.tieneAcceso(idVista);
        if (!acceso) {
            console.error("Acceso denegado: el usuario no tiene permisos para esta vista.");
            window.location.href("/404")
        } else {
            console.log("Acceso permitido a la vista solicitada.");
        }
        return acceso;
    } catch (error) {
        console.error("Error al verificar el acceso:", error);
        return false;
    }
};
