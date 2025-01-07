import React, { useState } from "react";
import hash from "../Util/Hash"; // Para hashear la contraseña
import "./testing.css";
import { registrarUsuario } from "../Ctrl/UsuarioCtrl";

const Register = () => {
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [teléfono, setTeléfono] = useState("");
    const [tipo_documento, setTipo_documento] = useState("");
    const [documento, setDocumento] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
            console.warn(passwordHash);

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

            console.log("User Created!", user);
            const response = await registrarUsuario(user);
            console.log("Response: ", response);

        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            setErrorMessage("Hubo un problema al verificar las credenciales");
            alert(errorMessage);
        }
    }

    return (
        <div className="register-container">
            <h2>Registro de Nuevo Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        id="nombres"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Apellidos</label>
                    <input
                        type="text"
                        id="apellidos"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                    />
                </div>
                <div className="form-group">   
                    <label>Correo Electrónico</label>
                    <input
                        type="email"
                        id="correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">   
                    <label>Teléfono</label>
                    <input
                        type="number"
                        id="teléfono"
                        value={teléfono}
                        onChange={(e) => setTeléfono(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">   
                    <label>Tipo de Documento</label>
                    <select
                        id="tipo_documento"
                        value={tipo_documento}
                        onChange={(e) => setTipo_documento(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                        Selecciona una opción
                        </option>
                        {tiposDocumento.map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">   
                    <label>Número de Documento</label>
                    <input
                        type="number"
                        id="documento"
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">   
                    <label>Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="register-button">
                    Registrarme
                </button>
            </form>
        </div>
    )
};

export default Register;