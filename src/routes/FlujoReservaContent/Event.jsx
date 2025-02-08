import React, { useState, useEffect } from "react";
import { getEventTypes } from "../../Ctrl/TiposEventosCtrl";
import "./EventStyles.css";
import SmallCallendar from "../../Components/smallCallendar";
import HourSelector from "../../Components/hourSelector";

const EventDetails = () => {
    const [eventTypes, setEventTypes] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [invitados, setInvitados] = useState("");
    const [error, setError] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHours, setSelectedHours] = useState({ start: null, end: null });

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const data = await getEventTypes();
                setEventTypes(data);
            } catch (err) {
                console.error("Error obteniendo los tipos de eventos:", err);
                setError("Ocurrió un error al cargar los tipos de eventos.");
            }
        };

        fetchEventTypes();
    }, []);

    const handleDateChange = (newDate) => setSelectedDate(newDate);

    const handleHourChange = (start, end) => setSelectedHours({ start, end });

    const handleInfoClick = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleCheckboxChange = (index, idtipos_eventos) => {
        setSelectedIndex(index);
        setSelectedEventId(idtipos_eventos);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedIndex === null) {
            window.alert("Debes seleccionar al menos un tipo de evento.");
            return;
        }

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

        if (localStorage.getItem("eventoDummy") != null) {
            localStorage.removeItem("eventoDummy");
        }
        localStorage.setItem("eventoDummy", JSON.stringify(evento));
        console.log(evento);
    };

    return (
        <div className="login-container">
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <div className="calendar-container">
                        <SmallCallendar onDateChange={handleDateChange} />
                        <HourSelector onChange={handleHourChange} />
                    </div>
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
                                        checked={selectedIndex === index}
                                        onChange={() => handleCheckboxChange(index, eventType.idtipos_eventos)}
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
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default EventDetails;
