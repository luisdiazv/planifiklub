import React, { useState } from "react";
import hash from "../Util/Hash";
import { actualizarPassword } from "../Ctrl/UsuarioCtrl";
import { codigoAuth, enviarCorreo } from "../Util/emailService";

const ChangePassword = ({ userEmail }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [inputCode, setInputCode] = useState("");
    const [authCode, setAuthCode] = useState("");

    const handleSendCode = async () => {
        try {
            const codigo = codigoAuth();
            setAuthCode(codigo);

            const emailSent = await enviarCorreo({ correo: userEmail }, codigo);

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

    const handleCodeVerification = async () => {
        if (inputCode === authCode.toString()) {
            try {
                const hashedNewPassword = await hash(newPassword);
                const updateSuccess = await actualizarPassword(userEmail, hashedNewPassword);

                if (updateSuccess) {
                    setSuccessMessage("Contraseña actualizada correctamente.");
                    setErrorMessage("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setInputCode("");
                    setIsPopupVisible(false); // Solo se cierra el popup al confirmar éxito
                    alert("Cambio de contraseña confirmado: La contraseña se ha actualizado correctamente.");
                } else {
                    setErrorMessage("Hubo un problema al actualizar la contraseña. Por favor, inténtalo de nuevo.");
                    alert("Error del sistema: No se pudo actualizar la contraseña.");
                }
            } catch (error) {
                console.error("Error al actualizar la contraseña:", error);
                setErrorMessage("Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.");
                alert("Error del sistema: No se pudo completar la operación.");
            }
        } else {
            setErrorMessage("El código de verificación es incorrecto.");
            alert("Código incorrecto: La contraseña no se ha actualizado.");
        }
    };

    return (
        <div className="change-password-container">
            <h2>Cambiar Contraseña</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }}>
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
                    <label>Confirmar Nueva Contraseña</label>
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
