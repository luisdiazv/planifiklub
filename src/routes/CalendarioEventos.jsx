import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CiCalendarDate } from "react-icons/ci";
import "dayjs/locale/es";
import {getEdificiosByIdEvento} from "../Ctrl/EdificiosCtrl";
import { getAllEventIds, getEventById, getAllEventIdsByMonth } from "../Ctrl/EventosCtrl";
import { getUsuarioByID, getNombresApellidosById } from "../Ctrl/UsuarioCtrl";
import { useNavigate } from 'react-router-dom';
import './CalendarioEventosStyles.css';

import htmlToPdfMake from "html-to-pdfmake";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts;

dayjs.locale("es");

const Calendario = () => {
    const localizer = dayjsLocalizer(dayjs);
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('todos');  // Filtro para los eventos
    const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM")); 
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [currentView, setCurrentView] = useState("month");
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
                    const event = await getEventById(id);
                    //console.log(event)
                    if (!event || (event.estado !== "Aprobado" && event.estado !== "En Cotizacion" && event.estado !== "En Curso")) {
                        console.warn(`Evento con ID ${id} tiene un estado no válido.`);
                        console.log(event.estado)
                        return null;
                    }

                    const user = await getUsuarioByID(event.id_usuario);
                    if (!user) {
                        console.warn(`No se encontró el usuario con ID ${event.id_usuario}.`);
                        return null;
                    }
                    const edificios = await getEdificiosByIdEvento(id);
                    const edificioName = edificios && edificios[0] ? edificios[0].nombre_edificio : "Edificio Desconocido";

                    return {
                        ...event,
                        title: `${user.nombres} ${user.apellidos} - ${edificioName}`,
                        color: event.estado === "En Cotizacion" ? "#7C0A01" : "##CC9901",
                        estado:event.estado
                    };
                })
            );

            const formattedEvents = eventDetails.filter(event => event !== null).map(event => ({
                start: dayjs(`${event.fecha}T${event.hora_inicio || "00:00:00"}`).toDate(),
                end: dayjs(`${event.fecha}T${event.hora_fin || "23:59:59"}`).toDate(),
                title: event.title || "Evento sin título",
                id: event.idevento, // El ID debe estar presente aquí
                color: event.color,
                estado: event.estado
            }));

            if (filter !== 'todos') {
                setEvents(formattedEvents.filter(event => event.estado === filter));
            } else {
                setEvents(formattedEvents);
            }

        } catch (error) {
            console.error("Error cargando eventos:", error.message);
        }
    };

    useEffect(() => {
        fetchEvents(currentMonth);
    }, [filter, currentMonth]);

    const handleNavigate = (date) => {
        if (currentView === "month") {
            setCurrentMonth(dayjs(date).format("YYYY-MM"));
            console.log(currentMonth);
        }
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
        setIsButtonVisible(view === "month");
    };

    const generateBill = async () => {
        try {
            setLoading(true);
            const eventos = await getAllEventIdsByMonth(currentMonth);
    
            // Si no hay eventos, generar un mensaje vacío
            if (!eventos || eventos.length === 0) {
                alert("No hay eventos para facturar este mes.");
                setLoading(false);
                return;
            }
    
            // Obtener los usuarios de los eventos de forma asíncrona
            const eventosConUsuarios = await Promise.all(
                eventos.map(async (evento) => {
                    const usuario = await getNombresApellidosById(evento.id_usuario);
                    return {
                        ...evento,
                        usuario: usuario || "No especificada",
                    };
                })
            );
    
            // Construcción del HTML dinámico
            const htmlContent = `
                <h1 style="text-align: center;">Facturación General del Mes</h1>
                <h3>Lista de Edificios</h3>
                ${
                    eventosConUsuarios.length > 0
                        ? eventosConUsuarios
                              .map(
                                  (evento) => `
                        <div>
                            <p><strong>Persona:</strong> ${evento.usuario}</p>
                            <p><strong>Fecha:</strong> ${evento.fecha || "No especificada"}</p>
                            <p><strong>Costo Total:</strong> ${evento.costo_total || "No especificada"}</p>
                            <p><strong>Saldo Pendiente:</strong> ${evento.saldo_pendiente || "No especificada"}</p>
                            <p><strong>Estado:</strong> ${evento.estado || "No especificada"}</p>
                            <hr/>
                        </div>
                    `
                              )
                              .join("")
                        : "<p>No hay edificios registrados para este evento.</p>"
                }
            `;
    
            // Convertir el contenido HTML a formato PDFMake
            const pdfContent = htmlToPdfMake(htmlContent);
    
            // Configuración básica del documento PDF
            const documentDefinition = {
                content: pdfContent,
                styles: {
                    header: { fontSize: 18, margin: [0, 10, 0, 10] },
                    subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                    paragraph: { fontSize: 12, margin: [0, 5, 0, 5] },
                },
            };
    
            // Generar y descargar el PDF
            pdfMake.createPdf(documentDefinition).download(`Facturacion_${currentMonth}.pdf`);
        } catch (error) {
            console.error("Error generando la facturación en PDF:", error.message);
            alert("Ocurrió un error al generar la facturación. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    };
    

    // Llamamos a la función de obtención de eventos al montar el componente
    useEffect(() => {
        fetchEvents();
    }, [filter]); // Dependemos del filtro para actualizar la vista de eventos

    const handleEventClick = (event) => {
        console.log(event.id); // Verifica que el evento tenga un id
        if (event.id) {
            navigate(`/app/evento/${event.id}`);
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
                <button onClick={() => handleFilterChange('todos')}>Eventos y cotizaciones</button>
                <button onClick={() => handleFilterChange('Aprobado' && 'En Curso')}>Eventos</button>
                <button onClick={() => handleFilterChange('En Cotizacion')}>Cotizaciones</button>
            </div>

            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    views={["month", "day", "agenda"]}
                    components={components}
                    messages={messages}
                    onNavigate={handleNavigate}
                    onView={handleViewChange}
                    onSelectEvent={handleEventClick}
                />
            </div>

            {isButtonVisible && (
                <button
                    onClick={generateBill}
                    disabled={loading} // Deshabilitar el botón mientras se genera el PDF
                    style={{
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    {loading 
                        ? `Generando Facturación de ${dayjs(currentMonth).format("MMMM [del] YYYY")}...` 
                        : `Generar Facturación de ${dayjs(currentMonth).format("MMMM [del] YYYY")} en PDF`}
                </button>
            )}
        </div>
    );
};

export default Calendario;
