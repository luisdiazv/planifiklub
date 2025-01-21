import { getVistaRolByRol } from "../Ctrl/VistasRol";
import { getRolByUser } from "../Ctrl/Accesos";
import { getUserByEmail } from "../Ctrl/UsuarioCtrl";

class AccessControl {
    constructor() {
        if (!AccessControl.instance) {
            this.currentUser = null;
            AccessControl.instance = this;
        }
        return AccessControl.instance;
    }

    setCurrentUser = async (user) => {
        this.currentUser = await getUserByEmail(user.email);
    }

    setLogOut = () => {
        this.currentUser = null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    tieneAcceso = async (vista) => {
        if (!this.currentUser) {
            console.error("No hay usuario logueado");
            return false;
        }

        const roles = await getRolByUser(this.currentUser.idusuario);
        if (roles.length === 0) {
            console.error("El usuario no tiene roles asignados");
            return false;
        }
        const rolesIds = roles.map(rol => rol.id_rol);

        const vistasPermitidas = await getVistaRolByRol(rolesIds);
        if (vistasPermitidas.length === 0) {
            console.error("El usuario no tiene vistas asignadas");
            return false;
        }
        const vistasPermitidasIds = vistasPermitidas.map(vistaPermitida => vistaPermitida.id_vista);

        if (vistasPermitidasIds.includes(vista)) {
            console.error("El usuario tiene acceso a la vista solicitada");
            return true;
        } else {
            console.error("El usuario no tiene acceso a la vista");
            return false;
        }
    }
}

const instance = new AccessControl();
export default instance;