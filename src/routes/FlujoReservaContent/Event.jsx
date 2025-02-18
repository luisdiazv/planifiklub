import React, { useState, useEffect } from "react";
import { getEventTypes } from "../../Ctrl/TiposEventosCtrl";
import "./EventStyles.css";
import SmallCallendar from "../../Components/smallCallendar";
import HourSelector from "../../Components/hourSelector";
import userControl from "../../Util/UserControl";

const EventDetails = () => {
    const [eventTypes, setEventTypes] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [invitados, setInvitados] = useState(null);
    const [error, setError] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHours, setSelectedHours] = useState({ start: null, end: null });
    const [description, setDescription] = useState("");

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

        if (selectedDate === null || selectedHours.start === null || selectedHours.end === null) {
            window.alert("Debes seleccionar la fecha y horas del evento.");
            return;
        }

        if (selectedIndex === null) {
            window.alert("Debes seleccionar al menos un tipo de evento.");
            return;
        }

        if (invitados === null) {
            window.alert("Debes ingresar la cantidad de asistentes que tendrá el evento.");
            return;
        }

        const evento = {
            id_usuario: userControl.getCurrentUser().idusuario,
            id_tipo_evento: selectedEventId,
            fecha: new Date(selectedDate).toISOString().split('T')[0], // YYYY-MM-DD
            hora_inicio: new Date(selectedHours.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) + ':00', // Formato HH:MM:00
            hora_fin: new Date(selectedHours.end).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) + ':00', // Formato HH:MM:00
            detalles: description,
            personas: parseInt(invitados, 10),
            estado: 'En Cotizacion',
            costo_total: 0,
            saldo_pendiente: 0
        };

        if (sessionStorage.getItem("eventoDummy") != null) {
            sessionStorage.removeItem("eventoDummy");
        }
        sessionStorage.setItem("eventoDummy", JSON.stringify(evento));
        // console.log(evento);


    };

    return (
        <div className="event-container">
            {error && <p className="error-message">{error}</p>}
            <form className="event-detail-container" onSubmit={handleSubmit}>
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
                            min="1"
                            step="1"
                        />
                    </div>
                </div>

                <div className="form-grouper">
                    <div className="form-group">
                        <label className="textarea-label">Descripción Adicional del Evento</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onInput={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            rows="1"
                            className="custom-textarea"
                        />
                    </div>
                </div>



                <button type="submit">Guardar y Pasar a la Siguiente Sección</button>
            </form>
        </div >
    );
};

export default EventDetails;
