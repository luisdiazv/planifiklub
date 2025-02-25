import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ClubInfoContext } from "../context/infoClubContext";
import hash from "../Util/Hash";
import "./SignUpStyles.css";
import { registrarUsuario } from "../Ctrl/UsuarioCtrl";
import { codigoAuth } from "../Util/EmailService";
import { enviarCodigoAuth } from "../API/NodeMailer";

const Register = () => {
    const { logo, clubName } = useContext(ClubInfoContext);
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [teléfono, setTeléfono] = useState("");
    const [tipo_documento, setTipo_documento] = useState("");
    const [documento, setDocumento] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [inputCode, setInputCode] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [, setIsCodeValid] = useState(false);
    const [acceptedTC1, setAcceptedTC1] = useState(false);
    const [acceptedTC2, setAcceptedTC2] = useState(false);

    const navegar = useNavigate();

    const tiposDocumento = [
        "Cedula de Ciudadania",
        "NIT",
        "Pasaporte",
        "Cedula de Extranjeria",
    ];

    const validarPassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:'",.<>?/\\-]).{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^[A-Za-z\s]+$/.test(nombres)) {
            setErrorMessage(`${tipo_documento === "NIT" ? "El nombre de la empresa" : "El nombre"} solo puede contener letras y espacios.`);
            return;
        }

        if (!/^[A-Za-z\s]+$/.test(apellidos)) {
            setErrorMessage(`${tipo_documento === "NIT" ? "El nombre del encargado" : "Los apellidos"} solo puede contener letras y espacios.`);
            return;
        }

        if (teléfono.length !== 10 || !/^\d{10}$/.test(teléfono)) {
            setErrorMessage("El teléfono debe contener exactamente 10 dígitos.");
            return;
        }

        if (!validarPassword(password)) {
            setErrorMessage("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo especial (! @ # $ % ^ & ( ) _ + [ ] { } | ; : ' \" , . < > ? / \\ - ).");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        // Validación de aceptación de términos y condiciones
        if (!acceptedTC1 || !acceptedTC2) {
            setErrorMessage("Debes aceptar ambos términos y condiciones.");
            return;
        }

        try {
            const code = codigoAuth();
            setAuthCode(code);
            const emailSent = await enviarCodigoAuth(correo, nombres, code);

            if (emailSent) {
                setIsPopupVisible(true);
                setErrorMessage("");
            } else {
                setErrorMessage("No se pudo enviar el código de verificación. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error durante el registro del usuario:", error);
            setErrorMessage("Hubo un problema al verificar las credenciales");
            alert(errorMessage);
        }
    };

    return (
        <div className="register-container">
            <h2>Registro de Nuevo Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-name-grouper">
                    <div className="form-group">
                        <label>
                            {tipo_documento === "NIT" ? "Nombre de la Empresa" : "Nombre"}:
                            <span style={{ color: '#DAA520' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{tipo_documento === "NIT" ? "Persona Encargada" : "Apellidos:"}</label>
                        <input
                            type="text"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>
                        Correo Electrónico:
                        <span style={{ color: '#DAA520' }}>*</span>
                    </label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>
                        Teléfono:
                        <span style={{ color: '#DAA520' }}>*</span>
                    </label>
                    <input
                        type="number"
                        value={teléfono}
                        onChange={(e) => setTeléfono(e.target.value)}
                        required
                    />
                </div>
                <div className="form-grouper">
                    <div className="ID-form-group">
                        <label>
                            ID:
                            <span style={{ color: '#DAA520' }}>*</span>
                        </label>
                        <select
                            value={tipo_documento}
                            onChange={(e) => setTipo_documento(e.target.value)}
                            required
                        >
                            <option value="" disabled>--</option>
                            {tiposDocumento.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>
                            Número de Documento:
                            <span style={{ color: '#DAA520' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>
                        Contraseña:
                        <span style={{ color: '#DAA520' }}>*</span>
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        Confirmar Contraseña:
                        <span style={{ color: '#DAA520' }}>*</span>
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Checkboxes de términos y condiciones con display:flex y align-items:center 
                    Se ajusta el tamaño del checkbox y del texto */}
                <div
                    className="basic-input-checkbox-container"
                    style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
                >
                    <input
                        className="basic-input-checkbox"
                        type="checkbox"
                        id="tc1"
                        checked={acceptedTC1}
                        onChange={(e) => setAcceptedTC1(e.target.checked)}
                        style={{
                            transform: "scale(0.4)",
                            transformOrigin: "center left"
                        }}
                    />
                    <label
                        htmlFor="tc1"
                        style={{
                            marginLeft: "5px",
                            fontSize: "80%",
                        }}
                    >
                        Acepto{" "}
                        <Link to="/app/TerminosyCondiciones/PlanifiKlub" style={{ fontSize: "100%" }}>
                            términos y condiciones 
                            de PlanifiKlub
                        </Link>{" "}
                    </label>
                </div>

                <div
                    className="basic-input-checkbox-container"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <input
                        className="basic-input-checkbox"
                        type="checkbox"
                        id="tc2"
                        checked={acceptedTC2}
                        onChange={(e) => setAcceptedTC2(e.target.checked)}
                        style={{
                            transform: "scale(0.4)",
                            transformOrigin: "center left"
                        }}
                    />
                    <label
                        htmlFor="tc2"
                        style={{
                            marginLeft: "5px",
                            fontSize: "80%",
                        }}
                    >
                        Acepto{" "}
                        <Link to="/app/TerminosyCondiciones/Club" style={{ fontSize: "100%" }}>
                            términos y condiciones 
                            de {clubName.toLowerCase()}
                        </Link>{" "}
                    </label>
                </div>

                <p>* Espacio obligatorio</p>
                {!isPopupVisible && errorMessage && <p className="error-message">{errorMessage}</p>}

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
                                    alert("¡Registro exitoso!");
                                    navegar("/app/LogIn");
                                } else {
                                    alert("Código incorrecto.");
                                }
                            }}
                        >
                            Verificar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
