import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import hash from "../Util/Hash";
import axios from "axios";
import { actualizarPassword, getUsuarioByEmail } from "../Ctrl/UsuarioCtrl";
import { codigoAuth } from "../Util/EmailService";
import userControl from "../Util/UserControl"
import './changePasswordStyles.css';

const ChangePassword = ({ userEmail }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [inputCode, setInputCode] = useState("");
    const [authCode, setAuthCode] = useState("");

    const navegar = useNavigate();
    const handleSendCode = async () => {
        verificarCorreo(email)

        if (!validarPassword(newPassword)) {
            setErrorMessage("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo especial.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const codigo = codigoAuth();
            setAuthCode(codigo);

            const emailSent = await enviarCodigoAuth(email, codigo);
            //setIsPopupVisible(true);  //Desconmentar para activar el popup de verificación de ser necesario, correos no funcionando
            if (emailSent) {
                setIsPopupVisible(true);
                setErrorMessage("");
            } else {
                setErrorMessage("No se pudo enviar el código de verificación. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al enviar el código de verificación:", error);
            setErrorMessage("Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.");
        }
    };
    const enviarCodigoAuth = async (correo, codigo) => {
        try {
            const API_URL = `${process.env.REACT_APP_NODEMAILER_URL}send_auth_code`;
            const response = await axios.post(
                API_URL,
                { correo, codigo },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Respuesta del servidor:", response.data);
            setIsPopupVisible(true);
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    const validarPassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:'",.<>?/\\-]).{8,}$/;
        const testResult = regex.test(password);
        console.log("Resultado de la prueba de password:", testResult);
        return testResult;
    };

    const verificarCorreo = async (email) => {
        try {
          const usuario = await getUsuarioByEmail(email);
          return usuario !== null;  // Retorna true si existe, false si no.
        } catch (error) {
          console.log("El correo no está registrado.");
          setErrorMessage("Correo no registrado");
          return false;
        }
      };

      const handleCodeVerification = async () => {
    if (inputCode === authCode.toString()) {
        try {
            const hashedNewPassword = await hash(newPassword);
            const updateSuccess = await actualizarPassword(email, hashedNewPassword);

            if (updateSuccess) {
                setSuccessMessage("Contraseña actualizada correctamente.");
                setErrorMessage("");
                setEmail("");
                setNewPassword("");
                setConfirmPassword("");
                setInputCode("");
                setIsPopupVisible(false);
                alert("Cambio de contraseña confirmado: La contraseña se ha actualizado correctamente.");

                // Cerrar sesión manualmente sin modificar UserControl
                if (userControl.getCurrentUser()) {
                    sessionStorage.clear();
                    sessionStorage.clear();
                    // Recargar la página para aplicar cambios
                    window.location.href = "/app";
                } else {
                    navegar("/app");
                }
            } else {
                setErrorMessage("Hubo un problema al actualizar la contraseña. Por favor, inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            setErrorMessage("Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.");
        }
    } else {
        setErrorMessage("El código de verificación es incorrecto.");
    }
};


    

    return (
        <div className="change-password-container">
            <h2>Cambiar Contraseña</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }}>
                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirme Nueva Contraseña</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <button type="submit" className="change-password-button">
                    Enviar Código de Verificación
                </button>
            </form>

            {isPopupVisible && (
                <div className="popup-container">
                    <div className="popup">
                        <h3>Verificación de Código</h3>
                        <p>Hemos enviado un código de verificación a tu correo. Por favor, ingrésalo a continuación:</p>
                        <input
                            type="number"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="Código de verificación"
                        />
                        <button onClick={handleCodeVerification}>
                            Verificar y Cambiar Contraseña
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangePassword;