import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CiCalendarDate } from "react-icons/ci";
import "dayjs/locale/es";
import { getAllEventIds, getEventInfo } from "../Ctrl/EventosCtrl";
import { useNavigate } from 'react-router-dom'; // Para la navegación
import './CalendarioEventos.css';

dayjs.locale("es");

const Calendario = () => {
    const localizer = dayjsLocalizer(dayjs);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate(); // Hook de navegación

    // Función para cargar eventos desde la base de datos
    const fetchEvents = async () => {
        try {
            console.log("Iniciando la carga de eventos...");
            const eventIds = await getAllEventIds(); 
            console.log("IDs de eventos obtenidos:", eventIds);

            if (!eventIds || eventIds.length === 0) {
                console.warn("No se encontraron eventos en la base de datos.");
                return;
            }

            const eventDetails = await Promise.all(
                eventIds.map(async id => {
                    const event = await getEventInfo(id);
                    console.log(`Datos del evento con ID ${id}:`, event);
                    return event;
                })
            );

            const formattedEvents = eventDetails
                .filter(event => event.fecha) // Verifica que la fecha exista
                .map(event => {
                    const start = dayjs(`${event.fecha}T${event.hora_inicio || "00:00:00"}`);
                    const end = dayjs(`${event.fecha}T${event.hora_fin || "23:59:59"}`);

                    if (!start.isValid() || !end.isValid()) {
                        console.error(`Fecha u hora inválida para el evento con ID ${event.id}:`, {
                            fecha: event.fecha,
                            hora_inicio: event.hora_inicio,
                            hora_fin: event.hora_fin
                        });
                        return null;
                    }

                    console.log("Evento formateado:", {
                        start: start.toDate(),
                        end: end.toDate(),
                        title: event.nombre_evento || "Evento sin título",
                        id: event.id // Añadí el ID al evento
                    });

                    return {
                        start: start.toDate(),
                        end: end.toDate(),
                        title: event.nombre_evento || "Evento sin título",
                        id: event.id // Añadí el ID al evento
                    };
                })
                .filter(event => event !== null);

            console.log("Eventos formateados para el calendario:", formattedEvents);
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error cargando eventos:", error.message);
        }
    };

    // Cargar eventos al montar el componente
    useEffect(() => {
        fetchEvents();
    }, []);

    // Función que maneja el clic en el evento
    const handleEventClick = (event) => {
        console.log("Evento seleccionado:", event);
        // Redirigir a la vista del evento usando su ID
        navigate(`/evento/${event.id}`); // Redirigir a la vista con el ID
    };

    const components = {
        event: props => {
            console.log("Renderizando evento en el calendario:", props);
            return (
                <button 
                    onClick={() => handleEventClick(props.event)} 
                    style={{ 
                        background: "#7C0A01", 
                        color: "white", 
                        border: "none", 
                        width: "100%", 
                        height: "100%", 
                        textAlign: "left", 
                        padding: "5px", 
                        cursor: "pointer" 
                    }}
                >
                    <CiCalendarDate style={{ marginRight: "5px" }} />
                    {props.title}
                </button>
            );
        }
    };

    const messages = {
        allDay: 'Todo el día',
        previous: 'Anterior',
        next: 'Siguiente',
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        agenda: 'Agenda',
        date: 'Fecha',
        time: 'Hora',
        event: 'Evento',
    };

    return (
        <div className="calendar-container" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{
                height: "90vh",
                width: "80vw",
                background: "#907665",
             }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    views={["month", "day", "agenda"]}
                    components={components}
                    messages={messages}
                    onSelectEvent={handleEventClick} // Maneja el clic en el evento
                />
            </div>
        </div>
    );
};

export default Calendario;