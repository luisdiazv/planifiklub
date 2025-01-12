import React, { useState } from "react";
import hash from "../Util/Hash";
import "./editProfileStyles.css";
import { registrarUsuario } from "../Ctrl/UsuarioCtrl";
import { codigoAuth, enviarCorreo } from "../Util/emailService";

const EditProfile = () => {
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [teléfono, setTeléfono] = useState("");
    const [tipo_documento, setTipo_documento] = useState("");
    const [documento, setDocumento] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [inputCode, setInputCode] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [isCodeValid, setIsCodeValid] = useState(false);

    const tiposDocumento = [
        "Cedula de Ciudadanía",
        "NIT",
        "Pasaporte",
        "Cedula de Extranjería",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const passwordHash = await hash(password);

            const user = {
                nombres,
                apellidos,
                correo,
                teléfono,
                documento,
                tipo_documento,
                password: passwordHash,
                socio: false
            };

            const codigo = codigoAuth();
            setAuthCode(codigo);

            const sentEmail = await enviarCorreo(user, codigo);

            if (sentEmail) {
                console.log("Email sent");
                setIsPopupVisible(true);
            } else {
                console.log("Email NOT sent");
            }

        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            setErrorMessage("Hubo un problema al verificar las credenciales");
            alert(errorMessage);
        }
    }

    return (
        <div className="edit-container">
            <div className="register-container">
                <h2>Información de Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-grouper">
                        <div className="form-group">
                            <label>Nombre:</label>
                            <i class="fa-solid fa-pen"></i>
                            <input
                                type="text"
                                id="nombres"
                                value={nombres}
                                onChange={(e) => setNombres(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellidos:</label>
                            <input
                                type="text"
                                id="apellidos"
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Correo Electrónico:</label>
                        <input
                            type="email"
                            id="correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Teléfono:</label>
                        <input
                            type="number"
                            id="teléfono"
                            value={teléfono}
                            onChange={(e) => setTeléfono(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-grouper">
                        <div className="form-group" style={{ width: "10%" }}>
                            <label>ID:</label>
                            <select
                                id="tipo_documento"
                                value={tipo_documento}
                                onChange={(e) => setTipo_documento(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    --
                                </option>
                                {tiposDocumento.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {tipo}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Número de Documento:</label>
                            <input
                                type="number"
                                id="documento"
                                value={documento}
                                onChange={(e) => setDocumento(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p>* Espacio obligatorio</p>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button type="submit" className="register-button">
                        Registrarme
                    </button>
                </form>

                {isPopupVisible && (
                    <div className="popup-container">
                        <div className="popup">
                            <h3>Verificación de Código</h3>
                            <p>Ingresa el código de verificación que hemos enviado a tu correo:</p>
                            <input
                                type="number"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                placeholder="Código de verificación"
                            />
                            <button
                                onClick={async () => {
                                    if (inputCode === authCode.toString()) {
                                        setIsCodeValid(true);
                                        setIsPopupVisible(false);
                                        try {
                                            const user = {
                                                nombres,
                                                apellidos,
                                                correo,
                                                teléfono,
                                                documento,
                                                tipo_documento,
                                                password: await hash(password),
                                                socio: false
                                            };
                                            const response = await registrarUsuario(user);
                                            console.log("Usuario registrado: ", response);
                                            alert("Ha sido registrado con exito!")
                                        } catch (error) {
                                            console.error("Error al registrar usuario:", error);
                                        }
                                    } else {
                                        alert("Código incorrecto. Por favor, intenta de nuevo.");
                                    }
                                }}
                            >
                                Verificar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
};

export default EditProfile;