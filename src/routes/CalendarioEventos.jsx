import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CiCalendarDate } from "react-icons/ci";
import "dayjs/locale/es";
import { getAllEventIds, getEventInfo } from "../Ctrl/EventosCtrl";
import { getUsuarioByID } from "../Ctrl/UsuarioCtrl";
import { useNavigate } from 'react-router-dom';
import './CalendarioEventosStyles.css';

dayjs.locale("es");

const Calendario = () => {
    const localizer = dayjsLocalizer(dayjs);
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('todos');  // Filtro para los eventos
    const navigate = useNavigate();

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
                        console.warn(`Evento con ID ${id} tiene un estado no válido.`);
                        return null;
                    }

                    const user = await getUsuarioByID(event.id_usuario);
                    if (!user) {
                        console.warn(`No se encontró el usuario con ID ${event.id_usuario}.`);
                        return null;
                    }

                    return {
                        ...event,
                        title: `${user.nombres} ${user.apellidos}`,
                        color: event.estado === "Confirmado" ? "#CC9901" : "#7C0A01"
                    };
                })
            );

            const formattedEvents = eventDetails.filter(event => event !== null).map(event => ({
                start: dayjs(`${event.fecha}T${event.hora_inicio || "00:00:00"}`).toDate(),
                end: dayjs(`${event.fecha}T${event.hora_fin || "23:59:59"}`).toDate(),
                title: event.title || "Evento sin título",
                id: event.idevento, // El ID debe estar presente aquí
                color: event.color
            }));

            // Aplica el filtro seleccionado
            if (filter !== 'todos') {
                setEvents(formattedEvents.filter(event => event.estado === filter));
            } else {
                setEvents(formattedEvents);
            }

        } catch (error) {
            console.error("Error cargando eventos:", error.message);
        }
    };

    // Llamamos a la función de obtención de eventos al montar el componente
    useEffect(() => {
        fetchEvents();
    }, [filter]); // Dependemos del filtro para actualizar la vista de eventos

    const handleEventClick = (event) => {
        console.log(event.id); // Verifica que el evento tenga un id
        if (event.id) {
            navigate(`/evento/${event.id}`);
        } else {
            console.error("El evento no tiene un ID válido.");
        }
    };

    // Cambia el filtro de eventos
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const components = {
        event: props => {
            return (
                <button 
                    onClick={() => handleEventClick(props.event)} 
                    style={{ 
                        background: props.event.color, 
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
            <h2 style={{ marginBottom: "10px" }}>Calendario de eventos y cotizaciones</h2>
            
            {/* Filtro de eventos */}
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
