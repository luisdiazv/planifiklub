import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import hash from "../Util/Hash";
import "./SignUpStyles.css";
import { registrarUsuario } from "../Ctrl/UsuarioCtrl";
import { codigoAuth } from "../Util/EmailService";

const Register = () => {
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

    const navegar = useNavigate();

    const tiposDocumento = [
        "Cédula de Ciudadanía",
        "NIT",
        "Pasaporte",
        "Cédula de Extranjería",
    ];

    const validarPassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:'",.<>?/\\-]).{8,}$/;
        const testResult = regex.test(password);
        console.log("Resultado de la prueba de password:", testResult);
        return testResult;
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

        if (documento.length < 10 || !/^\d{10,}$/.test(documento)) {
            setErrorMessage("El número de documento debe contener al menos 10 dígitos.");
            return;
        }

        if (!validarPassword(password)) {
            setErrorMessage("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo especial.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const code = codigoAuth();
            if(true){
                console.log(code);
            }
            setAuthCode(code);
            await enviarCodigoAuth(correo, nombres, code);
            //setIsPopupVisible(true);  //Desconmentar para activar el popup de verificación de ser necesario, correos no funcionando
        } catch (error) {
            console.error("Error durante el registro del usuario:", error);
            setErrorMessage("Hubo un problema al verificar las credenciales");
            alert(errorMessage);
        }
    };

    const enviarCodigoAuth = async (correo, nombres, codigo) => {
        try {
            const API_URL = `${process.env.REACT_APP_NODEMAILER_URL}send_auth_code`;
            const response = await axios.post(
                API_URL,
                { correo, nombres, codigo },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Respuesta del servidor:", response.data);
            setIsPopupVisible(true);
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    return (
        <div className="register-container">
            <h2>Registro de Nuevo Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grouper">
                    <div className="form-group">
                        <label>{tipo_documento === "NIT" ? "Nombre de la Empresa" : "Nombre"} *</label>
                        <input
                            type="text"
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{tipo_documento === "NIT" ? "Persona Encargada" : "Apellidos"}</label>
                        <input
                            type="text"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Correo Electrónico *</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                        type="number"
                        value={teléfono}
                        onChange={(e) => setTeléfono(e.target.value)}
                        required
                    />
                </div>
                <div className="form-grouper">
                    <div className="form-group" style={{ width: "10%" }}>
                        <label>ID *</label>
                        <select
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
                        <label>Número de Documento *</label>
                        <input
                            type="number"
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Contraseña *</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Confirmar Contraseña *</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
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