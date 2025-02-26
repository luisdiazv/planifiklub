import React, { useState, useEffect } from "react";
import { getEventTypes } from "../../Ctrl/TiposEventosCtrl";
import { getFotoTipoEvento } from "../../API/StorageAPI"; 
import "./EventStyles.css";
import SmallCallendar from "../../Components/smallCallendar";
import HourSelector from "../../Components/hourSelector";
import userControl from "../../Util/UserControl";

const EventTypeImage = ({ id, alt }) => {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const url = await getFotoTipoEvento(id);
      setImgUrl(url);
    };
    fetchImage();
  }, [id]);

  return <img className="event-type-image" src={imgUrl || ""} alt={alt} />;
};

const EventDetails = ({ id }) => {
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
    };

    return (
        <div className="event-container">
            {error && <p className="error-message">{error}</p>}
            <form className="event-detail-container" onSubmit={handleSubmit}>
                <div className="calendar-container">
                    <SmallCallendar onDateChange={handleDateChange} />
                    <HourSelector onChange={handleHourChange} />
                </div>
                <div className="event-types-container">
                    <h2>Tipos de Eventos</h2>
                    <div className="event-type-list">
                        {eventTypes.length > 0 ? (
                            eventTypes.map((eventType, index) => (
                                <div key={index} className="event-type-item">
                                    <div className="event-type-foto">
                                        <EventTypeImage id={eventType.idtipos_eventos} alt={eventType.nombre} />
                                    </div>
                                    <div className="event-type-info">
                                        <div className="event-type-title-container">
                                            <h2>{eventType.nombre}</h2>
                                            <button type="button" onClick={() => handleInfoClick(index)}>
                                                Ver más
                                            </button>
                                        </div>
                                        {expandedIndex === index && (
                                            <div>
                                                <p>{eventType.descripcion}</p>
                                            </div>
                                        )}
                                        <div className="button-container">
                                            <div className="basic-input-checkbox-container">
                                                <input
                                                    className="basic-input-checkbox"
                                                    type="checkbox"
                                                    checked={selectedIndex === index}
                                                    onChange={() => handleCheckboxChange(index, eventType.idtipos_eventos)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Cargando tipos de eventos...</p>
                        )}
                    </div>
                </div>
                <div className="form-grouper">
                    <label>Cantidad de Invitados</label>
                    <input
                        type="number"
                        id="Invitados"
                        value={invitados}
                        onChange={(e) => setInvitados(e.target.value)}
                        min="1"
                        step="1"
                    />
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

                <button type="submit">Guardar y Pasar a la Siguiente Sección</button>
            </form>
        </div>
    );
};

export default EventDetails;
