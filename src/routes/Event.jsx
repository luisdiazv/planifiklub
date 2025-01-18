import React, { useState, useEffect } from "react";
import { getEventTypes } from "../Ctrl/UsuarioCtrl";
import "./Event.css";

const EventDetails = () => {
    const [eventTypes, setEventTypes] = useState([]); // Estado para almacenar los tipos de eventos
    const [expandedIndex, setExpandedIndex] = useState(null); // Estado para controlar qué descripción se muestra
    const [invitados, setInvitados] = useState("");
    const [error, setError] = useState(""); // Estado para manejar errores
    const [selectedIndex, setSelectedIndex] = useState(null); // Índice del checkbox seleccionado

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

    const handleCheckboxChange = (index) => {
        // Cambia el índice seleccionado al checkbox que fue clicado
        setSelectedIndex(index);
    };

    return (
        <div className="login-container">
            <h2>Detalles del Evento</h2>
            <p>Inserte aquí el calendario, etc...</p>

            {error && <p className="error-message">{error}</p>} {/* Muestra un mensaje de error si ocurre */}

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
                                    onChange={() => handleCheckboxChange(index)} // Cambia el índice seleccionado
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
            </div>

            <br />

            <div className="form-grouper">
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
        </div>
    );
};

export default EventDetails;