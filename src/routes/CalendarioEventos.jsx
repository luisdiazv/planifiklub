import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CiCalendarDate } from "react-icons/ci";
import "dayjs/locale/es";
import { getAllEventIds, getEventInfo, getEdificios } from "../Ctrl/EventosCtrl";
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
            console.log("Iniciando la carga de eventos...");
            const eventIds = await getAllEventIds();
            console.log("IDs de eventos obtenidos:", eventIds);

            if (!eventIds || eventIds.length === 0) {
                console.warn("No se encontraron eventos en la base de datos.");
                return;
            }

            const eventDetails = await Promise.all(
                eventIds.map(async (id) => {
                    // Obtenemos los detalles del evento
                    const event = await getEventInfo(id);
                    console.log(`Datos del evento con ID ${id}:`, event);

                    if (!event) {
                        console.warn(`No se encontraron datos del evento con ID ${id}.`);
                        return null;
                    }

                    // Obtener la idusuario del evento
                    const userId = event.id_usuario;
                    if (!userId) {
                        console.warn(`No se encontró un usuario asociado al evento con ID ${id}.`);
                        return null; // Si no hay idusuario, no continuamos con este evento
                    }

                    // Buscar el nombre y apellido del usuario usando la idusuario
                    const user = await getUserById(userId);
                    if (!user) {
                        console.warn(`No se encontró el usuario con ID ${userId}.`);
                        return null; // Si no se encuentra el usuario, no continuamos con este evento
                    }

                    // Construir el nombre completo del usuario
                    const userFullName = `${user.nombres} ${user.apellidos}`;

                    // Obtener el nombre del edificio del evento
                    const edificios = await getEdificios(id);
                    const edificioName = edificios && edificios[0] ? edificios[0].nombre_edificio : "Edificio Desconocido";

                    // Concatenar el título actual con el nombre del edificio
                    const updatedTitle = `${userFullName} - ${edificioName}`;

                    // Incluir el título actualizado en el evento
                    const eventWithUserAndBuilding = {
                        ...event,
                        title: updatedTitle, // Título con el nombre del usuario y el edificio
                        id_usuario: user.id_usuario, // Almacenar el idusuario en el evento
                    };

                    return eventWithUserAndBuilding;
                })
            );

            // Filtramos y formateamos los eventos
            const formattedEvents = eventDetails
                .filter((event) => event !== null && event.fecha) // Verifica que el evento no sea null y que tenga una fecha
                .map((event) => {
                    // Verificación de la fecha y horas de inicio y fin
                    const start = dayjs(`${event.fecha}T${event.hora_inicio || "00:00:00"}`);
                    const end = dayjs(`${event.fecha}T${event.hora_fin || "23:59:59"}`);

                    // Verificar si las fechas y horas son válidas
                    if (!start.isValid() || !end.isValid()) {
                        console.error(`Fecha u hora inválida para el evento con ID ${event.id}:`, {
                            fecha: event.fecha,
                            hora_inicio: event.hora_inicio,
                            hora_fin: event.hora_fin,
                        });
                        return null; // Si la fecha no es válida, no agregamos este evento
                    }

                    console.log("Evento formateado:", {
                        start: start.toDate(),
                        end: end.toDate(),
                        title: event.title || "Evento sin título",
                        id: event.id,
                        idusuario: event.idusuario,
                    });

                    return {
                        start: start.toDate(),
                        end: end.toDate(),
                        title: event.title || "Evento sin título", // Usar el título con el nombre completo
                        id: event.id,
                        idusuario: event.idusuario,
                    };
                })
                .filter((event) => event !== null); // Filtrar los eventos que no son null

            console.log("Eventos formateados para el calendario:", formattedEvents);
            setEvents(formattedEvents); // Establecer los eventos en el estado
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
        navigate(`/evento/${event.id}`); // Redirigir a la vista con el ID. Aqui Chara modifica el codigo
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
