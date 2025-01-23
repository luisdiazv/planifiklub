import React, { useState, useEffect } from "react";
import "./ShowEvent.css";
import { getEventInfo, getUserName, getEventType, getPedidos, getEdificios } from "../Ctrl/Eventos";
import htmlToPdfMake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts"; // Importa las fuentes

const event_ID = 2;
pdfMake.vfs = pdfFonts;

const ShowEvent = () => {
    const [eventInfo, setEventInfo] = useState(null); // Información del evento
    const [userName, setUserName] = useState(""); // Nombre del usuario
    const [eventType, setEventType] = useState("");
    const [edificios, setEdificios] = useState([]);
    const [pedidos, setPedidos] = useState();
    const [error, setError] = useState(null); // Manejo de errores

    useEffect(() => {
        const fetchEventInfo = async () => {
            try {
                const data = await getEventInfo(event_ID); // Llama a la función con un ID de ejemplo
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

    useEffect(() => {
        if (eventInfo?.id_tipo_evento) {
            const fetchEventType = async () => {
                try {
                    const event_type = await getEventType(eventInfo.id_tipo_evento);
                    setEventType(event_type); 
                } catch (err) {
                    console.error("Error obteniendo el tipo de evento:", err);
                    setEventType("Evento desconocido");
                }
            };
            fetchEventType();
        }
    }, [eventInfo]);  

    useEffect(() => {
        if (eventInfo?.idevento) {
            const fetchPedidos = async () => {
                try {
                    const pedidos = await getPedidos(eventInfo.idevento);
                    setPedidos(pedidos); 
                } catch (err) {
                    console.error("Error obteniendo el tipo de evento:", err);
                    setPedidos("Evento desconocido");
                }
            };
            fetchPedidos();
        }
    }, [eventInfo]);   

    useEffect(() => {
        if (eventInfo?.idevento) {
            const fetchEdificios = async () => {
                try {
                    const ListEdificios = await getEdificios(eventInfo.idevento);
                    setEdificios(ListEdificios); 
                } catch (err) {
                    console.error("Error obteniendo el tipo de evento:", err);
                    setEdificios("Evento desconocido");
                }
            };
            fetchEdificios();
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
                    <p><strong>Tipo de Evento:</strong> {eventType}</p>
                    <p><strong>Fecha:</strong> {eventInfo.fecha}</p>
                    <p><strong>Hora de Inicio:</strong> {eventInfo.hora_inicio}</p>
                    <p><strong>Hora de Fin:</strong> {eventInfo.hora_fin}</p>
                    <p><strong>Detalles:</strong> {eventInfo.detalles}</p>
                    <p><strong>Número de Personas:</strong> {eventInfo.personas}</p>
                    <p><strong>Estado:</strong> {eventInfo.estado}</p>
                    <p><strong>Costo Total:</strong> ${eventInfo.costo_total}</p>
                    <p><strong>Saldo Pendiente:</strong> ${eventInfo.saldo_pendiente}</p>

                    <p>--------------------------------------------</p>

                    <h3>Lista de Edificios</h3>
                    {console.log(edificios)}
                    {edificios && edificios.length > 0 ? (
                        <ul className="pedido-list">
                            {edificios.map((edificio) => (
                                <li key={edificio.idedificio} className="pedido-item">
                                    <p><strong>Edificio:</strong> {edificio.nombre_edificio}</p>
                                    <p><strong>Montaje:</strong> {edificio.nombre_montaje}</p>
                                    <p><strong>Hora de Inicio:</strong> {edificio.hora_inicio}</p>
                                    <p><strong>Hora de Fin:</strong> {edificio.hora_fin}</p>
                                    <p><strong>Subtotal:</strong> {edificio.subtotal_alquiler}</p>
                                    <p>-.-.-.-.-.-.-.-.-</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay pedidos registrados para este evento.</p>
                    )}

                    <p>--------------------------------------------</p>

                    <h3>Lista de Pedidos</h3>
                    {pedidos && pedidos.length > 0 ? (
                        <ul className="pedido-list">
                            {pedidos.map((pedido) => (
                                <li key={pedido.idproducto_pedido} className="pedido-item">
                                    <p><strong>Producto:</strong> {pedido.nombre_producto}</p>
                                    <p><strong>Cantidad:</strong> {pedido.cantidad}</p>
                                    <p><strong>Subtotal:</strong> ${pedido.subtotal}</p>
                                    <p>-.-.-.-.-.-.-.-.-</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay pedidos registrados para este evento.</p>
                    )}
        
                    
                </div>
            ) : (
                <p>Cargando información del evento...</p>
            )}
        </div>
    );
};

export default ShowEvent;