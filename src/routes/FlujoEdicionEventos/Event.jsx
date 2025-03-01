import React, { useState, useEffect } from "react";
import { getEventTypes } from "../../Ctrl/TiposEventosCtrl";
import { getFotoTipoEvento } from "../../API/StorageAPI"; 
import "./EventStyles.css";
import SmallCallendar from "../../Components/smallCallendar";
import HourSelector from "../../Components/hourSelector";
import userControl from "../../Util/UserControl";
import { getEventById } from "../../Ctrl/EventosCtrl"; 

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

const EventDetails = ({ id, handleNext }) => {
    const [eventTypes, setEventTypes] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [invitados, setInvitados] = useState(null);
    const [error, setError] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHours, setSelectedHours] = useState({ start: null, end: null });
    const [description, setDescription] = useState("");
    const [isEditable, setIsEditable] = useState(true);

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

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const event = await getEventById(id);
                setSelectedEventId(event.id_tipo_evento);
                if (event.fecha) {
                    const formattedDate = new Date(event.fecha).toISOString().split('T')[0]; // Asegura el formato correcto
                    setSelectedDate(formattedDate);
                }
                setSelectedHours({
                    start: formatHour(event.hora_inicio),
                    end: formatHour(event.hora_fin)
                });
                setDescription(event.detalles);
                setInvitados(event.personas);
    
                // Almacena el evento en eventoDummy por defecto
                const eventoDummy = {
                    id_usuario: event.id_usuario,
                    id_tipo_evento: event.id_tipo_evento,
                    fecha: new Date(event.fecha).toISOString().split('T')[0], // YYYY-MM-DD
                    hora_inicio: formatHour(event.hora_inicio),
                    hora_fin: formatHour(event.hora_fin),
                    detalles: event.detalles,
                    personas: parseInt(event.personas, 10),
                    estado: event.estado,
                    costo_total: event.costo_total,
                    saldo_pendiente: event.saldo_pendiente,
                };

                if (sessionStorage.getItem("eventoDummy") != null) {
                    sessionStorage.removeItem("eventoDummy");
                }
                sessionStorage.setItem("eventoDummy", JSON.stringify(eventoDummy));

                // Verifica el estado del evento
                if (eventoDummy.estado === "Aprobado") {
                    setIsEditable(false);
                }
                
            } catch (err) {
                console.error("Error obteniendo los detalles del evento:", err);
                setError("Ocurrió un error al cargar los detalles del evento.");
            }
        };
    
        fetchEventDetails();
    }, [id]);

    useEffect(() => {
        if (eventTypes.length > 0 && selectedEventId !== null) {
            const index = eventTypes.findIndex(et => et.idtipos_eventos === selectedEventId);
            if (index !== -1) {
                setSelectedIndex(index);
            }
        }
    }, [eventTypes, selectedEventId]);

    const formatHour = (hour) => {
        if (!hour) return null;
    
        // Si la hora ya tiene formato HH:mm:00, devolverla sin cambios
        if (/^\d{2}:\d{2}:00$/.test(hour)) {
            return hour;
        }
    
        // Si la hora tiene formato HH:mm:ss, convertirla a HH:mm:00
        if (/^\d{2}:\d{2}:\d{2}$/.test(hour)) {
            return hour.substring(0, 5) + ":00";
        }
    
        // Si la hora viene en otro formato, parsearla y formatearla correctamente
        return new Date(`1970-01-01T${hour}`)
            .toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false }) + ":00";
    };

    const handleHourChange = (start, end) => {
        setSelectedHours({ start, end });
    };

    const handleInfoClick = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleCheckboxChange = (index, idtipos_eventos) => {
        setSelectedIndex(index);
        setSelectedEventId(idtipos_eventos);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Submit button clicked");

        if (selectedDate === null || selectedHours.start === null || selectedHours.end === null) {
            window.alert("Debes seleccionar la fecha y horas del evento.");
            //return;
        }

        if (selectedIndex === null) {
            window.alert("Debes seleccionar al menos un tipo de evento.");
            //return;
        }

        if (invitados === null) {
            window.alert("Debes ingresar la cantidad de asistentes que tendrá el evento.");
            //return;
        }

        const formattedStart = selectedHours.start.format ? selectedHours.start.format("HH:mm:ss") : formatHour(selectedHours.start);
        const formattedEnd = selectedHours.end.format ? selectedHours.end.format("HH:mm:ss") : formatHour(selectedHours.end);

        const evento = {
            id_usuario: userControl.getCurrentUser().idusuario,
            id_tipo_evento: selectedEventId,
            fecha: new Date(selectedDate).toISOString().split('T')[0], // YYYY-MM-DD
            hora_inicio: formattedStart,
            hora_fin: formattedEnd,
            detalles: description,
            personas: parseInt(invitados, 10)
        };
        const existingDummy = JSON.parse(sessionStorage.getItem("eventoDummy"));
        if (existingDummy) {
            evento.estado = existingDummy.estado;
            evento.costo_total = existingDummy.costo_total;
            evento.saldo_pendiente = existingDummy.saldo_pendiente;
        }

        if (sessionStorage.getItem("eventoDummy") != null) {
            sessionStorage.removeItem("eventoDummy");
        }
        sessionStorage.setItem("eventoDummy", JSON.stringify(evento));

        if(handleNext){
           handleNext();
       }
    };

    return (
        <div className="event-container">
            {error && <p className="error-message">{error}</p>}
            <form className="event-detail-container" onSubmit={handleSubmit}>
            {!isEditable && <p>Debido al estado de su solicitud, para realizar modificaciones en este evento, comuníquese con la administración.</p>}
                <div className="calendar-container">
                <SmallCallendar 
                    selectedDate={selectedDate} 
                    onDateChange={setSelectedDate} 
                    disabled={!isEditable}
                />
                <HourSelector 
                    onChange={handleHourChange} 
                    selectedHours={selectedHours} 
                    disabled={!isEditable}
                />
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
                                            <button type="button" onClick={() => handleInfoClick(index)} disabled={!isEditable}>
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
                                                    disabled={!isEditable}
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
                        disabled={!isEditable}
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
                        disabled={!isEditable}
                    />
                </div>

                <button type="submit" >Siguiente</button>
            </form>
        </div>
    );
};

export default EventDetails;