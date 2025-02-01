import { getVistaRolByRol } from "../Ctrl/VistaRolCtrl";
import { getRolByUser } from "../Ctrl/AccesosCtrl";
import { getUsuarioByEmail } from "../Ctrl/UsuarioCtrl";

class UserControl {
    constructor() {
        if (!UserControl.instance) {
            this.currentUser = null;
            UserControl.instance = this;
        }
        return UserControl.instance;
    }

    Login = async (userEmail) => {
        const user = await getUsuarioByEmail(userEmail);
        localStorage.setItem("currentUser", JSON.stringify(user));
        this.currentUser = user;
    }

    Logout = () => {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    getCurrentUser() {
        const userObject = JSON.parse(localStorage.getItem('currentUser'));
        if (!userObject) {
            return null;
        }
        this.currentUser = userObject;
        return this.currentUser;
    }

    tieneAcceso = async (vista) => {
        if (!this.currentUser) {
            console.error("No hay usuario logueado");
            return false;
        }

        const roles = await getRolByUser(this.currentUser.idusuario);
        console.log(roles.length)
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

const instance = new UserControl();
export default instance;