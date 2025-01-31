import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CiCalendarDate } from "react-icons/ci";
import "dayjs/locale/es";
import { getAllEventIds, getEventInfo } from "../Ctrl/EventosCtrl";
import { getUserById } from "../Ctrl/UsuarioCtrl";
import { useNavigate } from 'react-router-dom';
import './CalendarioEventosStyles.css';

dayjs.locale("es");

const Calendario = () => {
    const localizer = dayjsLocalizer(dayjs);
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('todos');  // Estado para el filtro
    const navigate = useNavigate();

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

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
                    if (!event || (event.estado !== "Confirmado" && event.estado !== "Pendiente")) {
                        return null;
                    }
    
                    const user = await getUserById(event.id_usuario);
                    if (!user) {
                        return null;
                    }
    
                    return {
                        ...event,
                        title: `${user.nombres} ${user.apellidos}`,
                        color: event.estado === "Confirmado" ? "#CC9901" : "#7C0A01"
                    };
                })
            );
    
            // Filtrar eventos según el filtro seleccionado
            const filteredEvents = eventDetails.filter(event => event !== null).filter(event => {
                if (filter === 'todos') return true;  // Mostrar todos los eventos
                return event.estado === filter;  // Filtrar por estado
            }).map(event => ({
                start: dayjs(`${event.fecha}T${event.hora_inicio || "00:00:00"}`).toDate(),
                end: dayjs(`${event.fecha}T${event.hora_fin || "23:59:59"}`).toDate(),
                title: event.title || "Evento sin título",
                id: event.id,
                color: event.color
            }));
    
            setEvents(filteredEvents);
        } catch (error) {
            console.error("Error cargando eventos:", error.message);
        }
    };
    

    useEffect(() => {
        fetchEvents();  // Llama a la función para cargar los eventos según el filtro
    }, [filter]);  // Este efecto se ejecuta cada vez que cambia `filter`
    

    const handleEventClick = (event) => {
        navigate(`/evento/${event.id}`);  // Navegar a la ruta del evento con el ID
    };
    

    const components = {
        event: props => {
            return (
                <button 
                    onClick={() => handleEventClick(props.event)} 
                    style={{ 
                        background: props.event.color,  // Aquí se aplica el color dinámico del evento
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
        <div className="calendar-container">
            <h2 style={{ marginBottom: "10px" }}>Calendario de eventos</h2>
    
            {/* Filtro */}
            <div className="filter-buttons">
                <button onClick={() => handleFilterChange('Todo')}>Eventos y cotizaciones</button>
                <button onClick={() => handleFilterChange('Confirmado')}>Eventos</button>
                <button onClick={() => handleFilterChange('Pendiente')}>Cotizaciones</button>
            </div>
    
            <div style={{ background: "#907665" }}>
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
