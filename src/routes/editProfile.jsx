import React, { useState, } from "react";
import { updateUsuario } from "../Ctrl/UsuarioCtrl";  // Importing the API calls
import hash from "../Util/Hash";
import AccessControl from '../Util/accessControl'; // Importa AccessControl
import "./editProfileStyles.css";

const EditProfile = () => {
    const [correo, setCorreo] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [teléfono, setTeléfono] = useState("");
    const [tipo_documento, setTipo_documento] = useState("");
    const [documento, setDocumento] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [actualizando, setActualizando] = useState(false);
    

    const tiposDocumento = [
        "Cedula de Ciudadanía",
        "NIT",
        "Pasaporte",
        "Cedula de Extranjería",
    ];

    const cargarDatosUsuario = async () => {
        try {
            const usuario = AccessControl.getCurrentUser();
            if (usuario) {
                setCorreo(usuario.correo);
                setNombres(usuario.nombres);
                setApellidos(usuario.apellidos);
                setTeléfono(usuario.teléfono);
                setTipo_documento(usuario.tipo_documento);
                setDocumento(usuario.documento);
            }
        } catch (err) {
            console.error("Error al cargar los datos del usuario:", err);
            alert("Hubo un problema al cargar los datos.");
        }
    };
    
    cargarDatosUsuario();

    // Handle input change for user data
    const handleChange = (e) => {
        const { id, value } = e.target; // Acceder al 'id' y al 'value' del campo
        if (id === "nombres") setNombres(value);
        if (id === "apellidos") setApellidos(value);
        if (id === "teléfono") setTeléfono(value);
        if (id === "tipo_documento") setTipo_documento(value);
        if (id === "documento") setDocumento(value);
    };

    // Submit the form for updating user data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setActualizando(true);
        try {
            const usuarioActualizado = {
                nombres,
                apellidos,
                teléfono,
                tipo_documento,
                documento
            };

            console.log("Datos a actualizar:", usuarioActualizado);


            const respuesta = updateUsuario(correo, usuarioActualizado);

            if (respuesta.error) {
                setErrorMessage("Hubo un problema al actualizar el perfil.");
                alert("Hubo un problema al actualizar el perfil.");
            } else {
                alert("Perfil actualizado exitosamente.");
            }
        } catch (err) {
            console.error("Error durante la actualización del perfil:", err);
            setErrorMessage("Hubo un error al actualizar el perfil.");
        } finally {
            setActualizando(false);
        }
    };

    return (
        <div className="edit-container">
            <div className="editter-container">
                <h2>Editar Información de Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-grouper">
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                id="nombres"
                                value={nombres}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellidos:</label>
                            <input
                                type="text"
                                id="apellidos"
                                value={apellidos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Teléfono:</label>
                        <input
                            type="number"
                            id="teléfono"
                            value={teléfono}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-grouper">
                        <div className="form-group" style={{ width: "10%" }}>
                            <label>ID:</label>
                            <select
                                id="tipo_documento"
                                value={tipo_documento}
                                onChange={handleChange}
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
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button type="submit" className="register-button" disabled={actualizando}>
                        {actualizando ? "Actualizando..." : "Actualizar"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
