import React, { useState, useEffect } from "react";
import "./ShowEvent.css";
import { getEventInfo, getUserName } from "../Ctrl/Eventos";
import htmlToPdfMake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"; // Importa las fuentes


pdfMake.vfs = pdfFonts;

const ShowEvent = () => {
    const [eventInfo, setEventInfo] = useState(null); // Información del evento
    const [userName, setUserName] = useState(""); // Nombre del usuario
    const [eventType, setEventType] = useState("");
    const [error, setError] = useState(null); // Manejo de errores

    useEffect(() => {
        const fetchEventInfo = async () => {
            try {
                const data = await getEventInfo(2); // Llama a la función con un ID de ejemplo
                setEventInfo(data); // Guarda los datos del evento en el estado
            } catch (err) {
                console.error("Error obteniendo los datos del evento:", err);
                setError("Ocurrió un error al cargar los datos del evento.");
            }
        };
        fetchEventInfo();
    }, []);

    useEffect(() => {
        if (eventInfo?.id_usuario) {
            const fetchUserName = async () => {
                try {
                    const fullName = await getUserName(eventInfo.id_usuario);
                    setUserName(fullName); // Guarda el nombre completo
                } catch (err) {
                    console.error("Error obteniendo el nombre del usuario:", err);
                    setUserName("Usuario desconocido");
                }
            };
            fetchUserName();
        }
    }, [eventInfo]);

    return (
        <div className="showevent-container">
            <h2>Informe General del Evento</h2>
            {error && <p className="error">{error}</p>}
            {eventInfo ? (
                <div className="event-details">
                    <h3>Detalles del Evento</h3>
                    <p><strong>Nombre del Usuario:</strong> {userName}</p>
                    <p><strong>Tipo de Evento:</strong> {eventInfo.id_tipo_evento}</p>
                    <p><strong>Fecha:</strong> {eventInfo.fecha}</p>
                    <p><strong>Hora de Inicio:</strong> {eventInfo.hora_inicio}</p>
                    <p><strong>Hora de Fin:</strong> {eventInfo.hora_fin}</p>
                    <p><strong>Detalles:</strong> {eventInfo.detalles}</p>
                    <p><strong>Número de Personas:</strong> {eventInfo.personas}</p>
                    <p><strong>Estado:</strong> {eventInfo.estado}</p>
                    <p><strong>Costo Total:</strong> ${eventInfo.costo_total}</p>
                    <p><strong>Saldo Pendiente:</strong> ${eventInfo.saldo_pendiente}</p>
                </div>
            ) : (
                <p>Cargando información del evento...</p>
            )}
        </div>
    );
};

export default ShowEvent;