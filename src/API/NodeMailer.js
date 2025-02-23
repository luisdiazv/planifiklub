import axios from "axios";

export const enviarCodigoAuth = async (correo, nombres, codigo) => {
    try {
        const API_URL = `${process.env.REACT_APP_NODEMAILER_URL}send_auth_code`;
        const response = await axios.post(
            API_URL,
            { correo, nombres, codigo },
            { headers: { "Content-Type": "application/json" } }
        );
        console.log("Respuesta del servidor:", response.data);
    } catch (error) {
        console.error("Error en la petición:", error);
    }
};