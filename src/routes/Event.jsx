import React, { useState, useEffect } from "react";
import { getEventTypes } from "../Ctrl/EventosCtrl";
import "./EventStyles.css";

const EventDetails = () => {
    const [eventTypes, setEventTypes] = useState([]); // Estado para almacenar los tipos de eventos
    const [expandedIndex, setExpandedIndex] = useState(null); // Estado para controlar qué descripción se muestra
    const [invitados, setInvitados] = useState("");
    const [error, setError] = useState(""); // Estado para manejar errores
    const [selectedIndex, setSelectedIndex] = useState(null); // Índice del checkbox seleccionado
    const [selectedEventId, setSelectedEventId] = useState(null); // Estado para almacenar el idtipos_eventos seleccionado
    const [checkboxError, setCheckboxError] = useState(false); // Estado para manejar el error del checkbox

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const data = await getEventTypes(); // Llamada a la función asíncrona
                setEventTypes(data); // Guarda los datos en el estado
            } catch (err) {
                console.error("Error obteniendo los tipos de eventos:", err);
                setError("Ocurrió un error al cargar los tipos de eventos.");
            }
        };

        fetchEventTypes(); // Llama a la función cuando el componente se monte
    }, []);

    const handleInfoClick = (index) => {
        // Alterna la descripción al hacer clic en +Info
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleCheckboxChange = (index, idtipos_eventos) => {
        // Cambia el índice seleccionado al checkbox que fue clicado
        setSelectedIndex(index);
        setSelectedEventId(idtipos_eventos); // Almacena el idtipos_eventos correspondiente
        setCheckboxError(false); // Resetea el error al seleccionar un checkbox
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        if (selectedIndex === null) {
            setCheckboxError(true); // Si no hay checkbox seleccionado, muestra el error
        } else {
            const evento = {
                id_usuario: '',
                id_tipo_evento: selectedEventId,
                fecha: '',
                hora_inicio: '',
                hora_fin: '',
                detalles: '',
                personas: parseInt(invitados, 10),
                estado: '',
                costo_total: '',
                saldo_pendiente: ''
            };

            console.log(evento);
        }
    };

    return (
        <div className="login-container">
            <h2>Detalles del Evento</h2>
            <p>Inserte aquí el calendario, etc...</p>

            {error && <p className="error-message">{error}</p>} {/* Muestra un mensaje de error si ocurre */}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tipos de Eventos</label>
                    <div className="event-type-list">
                        {eventTypes.length > 0 ? (
                            eventTypes.map((eventType, index) => (
                                <div key={index} className="event-type-item">
                                    <span>{eventType.nombre}</span>
                                    <button onClick={() => handleInfoClick(index)}>
                                        ↓
                                    </button>
                                    <input
                                        type="checkbox"
                                        checked={selectedIndex === index} // Solo se marca si es el índice seleccionado
                                        onChange={() => handleCheckboxChange(index, eventType.idtipos_eventos)} // Cambia el índice seleccionado y almacena el idtipos_eventos
                                    />
                                    {expandedIndex === index && (
                                        <div>
                                            {eventType.descripcion}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>Cargando tipos de eventos...</p>
                        )}
                    </div>
                    {checkboxError && <p className="error-message">Debes seleccionar al menos un tipo de evento.</p>} {/* Mensaje de error */}
                </div>

                < div className="form-grouper">
                    <div className="form-group" style={{ width: "50%" }}>
                        <label>Cantidad de Invitados</label>
                    </div>
                    <div className="form-group">
                        <input
                            type="number"
                            id="Invitados"
                            value={invitados}
                            onChange={(e) => setInvitados(e.target.value)}
                            required
                            min="1"
                            step="1"
                        />
                    </div>
                </div>

                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default EventDetails;