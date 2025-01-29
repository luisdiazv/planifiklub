import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CiCalendarDate } from "react-icons/ci";
import "dayjs/locale/es";
import { getAllEventIds, getEventInfo } from "../Ctrl/EventosCtrl";
import { getUserById } from "../Ctrl/UsuarioCtrl";
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
            const eventIds = await getAllEventIds();
    
            if (!eventIds || eventIds.length === 0) {
                console.warn("No se encontraron eventos en la base de datos.");
                return;
            }
    
            const eventDetails = await Promise.all(
                eventIds.map(async (id) => {
                    const event = await getEventInfo(id);
                    if (!event || event.estado !== "Confirmado") {
                        console.warn(`Evento con ID ${id} no está confirmado o no tiene datos.`);
                        return null;
                    }
    
                    const userId = event.id_usuario;
                    if (!userId) {
                        console.warn(`No se encontró un usuario asociado al evento con ID ${id}.`);
                        return null;
                    }
    
                    const user = await getUserById(userId);
                    if (!user) {
                        console.warn(`No se encontró el usuario con ID ${userId}.`);
                        return null;
                    }
    
                    const userFullName = `${user.nombres} ${user.apellidos}`;
    
                    return {
                        ...event,
                        title: userFullName,
                        id_usuario: user.id_usuario,
                    };
                })
            );
    
            const formattedEvents = eventDetails
                .filter((event) => event !== null && event.fecha)
                .map((event) => {
                    const start = dayjs(`${event.fecha}T${event.hora_inicio || "00:00:00"}`);
                    const end = dayjs(`${event.fecha}T${event.hora_fin || "23:59:59"}`);
    
                    if (!start.isValid() || !end.isValid()) {
                        console.error(`Fecha u hora inválida para el evento con ID ${event.id}:`, {
                            fecha: event.fecha,
                            hora_inicio: event.hora_inicio,
                            hora_fin: event.hora_fin,
                        });
                        return null;
                    }
    
                    return {
                        start: start.toDate(),
                        end: end.toDate(),
                        title: event.title || "Evento sin título",
                        id: event.id,
                        idusuario: event.idusuario,
                    };
                })
                .filter((event) => event !== null);
    
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error cargando eventos:", error.message);
        }
    };
    
    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEventClick = (event) => {
        navigate(`/evento/${event.id}`);
    };

    const components = {
        event: props => {
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
        noEventsInRange: "Sin eventos en este rango."
        
    };

    return (
        <div className="calendar-container" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <h2 style={{ marginBottom: "10px" }}>Calendario de eventos</h2>
            <div style={{
                //height: "90vh",
                //width: "80vw",
                background: "#907665",
             }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    views={["month", "day", "agenda"]}
                    components={components}
                    messages={messages}
                    onSelectEvent={handleEventClick}
                />
            </div>
        </div>
    );
};

export default Calendario;
