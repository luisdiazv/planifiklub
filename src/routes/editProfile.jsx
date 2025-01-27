import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUsuario } from "../Ctrl/UsuarioCtrl"; // Importando la función de actualización
import userControl from '../Util/UserControl'; // Importa userControl
import "./editProfileStyles.css";

const EditProfile = () => {
    const [correo, setCorreo] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [teléfono, setTeléfono] = useState("");
    const [tipo_documento, setTipo_documento] = useState("");
    const [documento, setDocumento] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);
    const [datosActualizados, setDatosActualizados] = useState(false); // Nuevo estado
    const navegar = useNavigate();

    const tiposDocumento = [
        "Cedula de Ciudadanía",
        "NIT",
        "Pasaporte",
        "Cedula de Extranjería",
    ];

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        const cargarDatosUsuario = async () => {
            try {
                const usuario = userControl.getCurrentUser();
                console.log("Usuario cargado:", usuario); // Añadir para depuración
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
                navegar("/editProfile"); // Redirige a otra página si hay error
            } finally {
                setCargando(false);
            }
        };

        if (datosActualizados) {
            cargarDatosUsuario();  // Recargar los datos si han sido actualizados
            setDatosActualizados(false); // Restablecer el estado
        } else {
            cargarDatosUsuario(); // Cargar los datos al inicio
        }
    }, [navegar, datosActualizados]);

    // Manejo de cambios en los inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "nombres") setNombres(value);
        if (id === "apellidos") setApellidos(value);
        if (id === "teléfono") setTeléfono(value);
        if (id === "tipo_documento") setTipo_documento(value);
        if (id === "documento") setDocumento(value);
    };

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setActualizando(true);
        // Verifica que correo esté disponible
        if (!correo) {
            console.error("Correo no disponible.");
            setErrorMessage("Hubo un error con la recuperación del correo.");
            setActualizando(false);
            return;
        }

        try {
            const usuarioActualizado = {
                nombres,
                apellidos,
                teléfono,
                tipo_documento,
                documento,
            };

            console.log("Datos a actualizar:", usuarioActualizado);

            const respuesta = await updateUsuario(correo, usuarioActualizado); // Utiliza solo los campos que se actualizan

            if (respuesta.error) {
                setErrorMessage("Hubo un problema al actualizar el perfil.");
                alert("Hubo un problema al actualizar el perfil.");
            } else {
                // Actualiza los estados locales si la API devuelve los datos actualizados
                if (respuesta.nombres) setNombres(respuesta.nombres);
                if (respuesta.apellidos) setApellidos(respuesta.apellidos);
                if (respuesta.teléfono) setTeléfono(respuesta.teléfono);
                if (respuesta.tipo_documento) setTipo_documento(respuesta.tipo_documento);
                if (respuesta.documento) setDocumento(respuesta.documento);

                // Actualizar localStorage con los nuevos datos sin modificar el correo
                const usuarioActualizadoLocal = {
                    ...usuarioActualizado,
                    correo: respuesta.correo || correo, // Mantén el correo original
                };
                localStorage.setItem("currentUser", JSON.stringify(usuarioActualizadoLocal));

                alert("Perfil actualizado exitosamente.");

                // Marcar que los datos fueron actualizados
                setDatosActualizados(true); // Establecer el estado que indica que los datos fueron actualizados
            }
        } catch (err) {
            console.error("Error durante la actualización del perfil:", err);
            setErrorMessage("Hubo un error al actualizar el perfil.");
        } finally {
            setActualizando(false);
        }
    };

    // Mostrar mensaje de carga si aún se están cargando los datos
    if (cargando) {
        return <p className="loading-text">Cargando datos...</p>;
    }

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