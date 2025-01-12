import React, { useState } from "react";
import { verificarUsuario } from "../Ctrl/UsuarioCtrl";
import accessControl from "../Util/accessControl";
import hash from "../Util/Hash";
import "./LogInStyles.css";
import { Link } from 'react-router-dom';

const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const passwordHash = await hash(password);
            const isValidUser = await verificarUsuario(email, passwordHash);
            if (isValidUser) {
                await accessControl.setCurrentUser({ email }); // Establecer el usuario logueado
                //DESCOMENTAR ESTA LINEA PARA EL TESTING
                //await accessControl.tieneAcceso(1);
                alert("Inicio de sesión exitoso");
            } else {
                setErrorMessage("Credenciales incorrectas");
                alert(errorMessage);
            }
        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            setErrorMessage("Ocurrió un error durante el inicio de sesión");
            alert(errorMessage);
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button type="submit" className="login-button">
                    Iniciar Sesión
                </button>
            </form>
            <div className="forgot-password">
                <Link className="new-account" to='/SignUp'>
                    ¿Aún no tienes cuenta?
                </Link>
                <Link className="forgot-password-link" onClick={() => alert("Redirigir a recuperación de contraseña")}>
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>
        </div>
    );
};

export default LogIn;
