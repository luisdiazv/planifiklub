import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import { getEventType } from "../Ctrl/TiposEventosCtrl";
import { getNombresApellidosById } from "../Ctrl/UsuarioCtrl";
import {getPedidosByIdEvento} from "../Ctrl/PedidoCtrl";
import { getEdificiosByIdEvento } from "../Ctrl/EdificiosCtrl";
import { getPagosbyEventID } from "../Ctrl/PagosCtrl";
import "./ShowEventStyles.css";

import { getEventById, updateEventStatus } from "../Ctrl/EventosCtrl";
//import pdfMake from "../Util/FontsForPDFS";
import htmlToPdfMake from "html-to-pdfmake";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts;

//pdfMake.vfs = { ...pdfFonts, ...customFonts };

const ShowEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Crear la instancia de navigate
    const [eventInfo, setEventInfo] = useState(null);
    const [userName, setUserName] = useState("");
    const [eventType, setEventType] = useState("");
    const [edificios, setEdificios] = useState([]);
    const [pedidos, setPedidos] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventInfo = async () => {
            try {
                const data = await getEventById(id);
                setEventInfo(data);
            } catch (err) {
                console.error("Error obteniendo los datos del evento:", err);
                setError("Ocurrió un error al cargar los datos del evento.");
            }
        };
        fetchEventInfo();
    }, [id]);

    useEffect(() => {
        if (eventInfo?.id_usuario) {
            const fetchUserName = async () => {
                try {
                    const fullName = await getNombresApellidosById(eventInfo.id_usuario);
                    setUserName(fullName);
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
        if (eventInfo?.id) {
            const fetchPedidos = async () => {
                try {
                    const pedidos = await getPedidosByIdEvento(eventInfo.id);
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
        if (eventInfo?.id) {
            const fetchEdificios = async () => {
                try {
                    const ListEdificios = await getEdificiosByIdEvento(eventInfo.id);
                    setEdificios(ListEdificios);
                } catch (err) {
                    console.error("Error obteniendo el tipo de evento:", err);
                    setEdificios("Evento desconocido");
                }
            };
            fetchEdificios();
        }
    }, [eventInfo]);   

    // Función para cambiar el estado a "Confirmado" y redirigir al calendario
    const handleGenerarEvento = async () => {
        try {
            await updateEventStatus(id, "Aprobado"); // Actualiza el estado a Confirmado
            setEventInfo({ ...eventInfo, estado: "Aprobado" }); // Actualiza el estado local
            navigate("/app/CalendarioEventos"); // Redirige al calendario
        } catch (err) {
            console.error("Error al cambiar el estado del evento:", err);
        }
    };
  
    const [loading, setLoading] = useState(false);

    const generatePDF = async () => {
        try {
            setLoading(true);
    
            // Construye el contenido HTML dinámico basado en la información del evento
            const htmlContent = `
                <h1 style="text-align: center;">Informe General del Evento</h1>
                <h3>Detalles del Evento</h3>
                <p><strong>Nombre del Usuario:</strong> ${userName || "Usuario desconocido"}</p>
                <p><strong>Tipo de Evento:</strong> ${eventType || "Evento desconocido"}</p>
                <p><strong>Fecha:</strong> ${eventInfo?.fecha || "No especificada"}</p>
                <p><strong>Hora de Inicio:</strong> ${eventInfo?.hora_inicio || "No especificada"}</p>
                <p><strong>Hora de Fin:</strong> ${eventInfo?.hora_fin || "No especificada"}</p>
                <p><strong>Detalles:</strong> ${eventInfo?.detalles || "Sin detalles"}</p>
                <p><strong>Número de Personas:</strong> ${eventInfo?.personas || "No especificado"}</p>
                <p><strong>Estado:</strong> ${eventInfo?.estado || "No especificado"}</p>
                <p><strong>Costo Total:</strong> $${eventInfo?.costo_total || 0}</p>
                <p><strong>Saldo Pendiente:</strong> $${eventInfo?.saldo_pendiente || 0}</p>
                
                <h3>Lista de Edificios</h3>
                ${
                    edificios && edificios.length > 0
                        ? edificios
                              .map(
                                  (edificio) => `
                        <div>
                            <p><strong>Edificio:</strong> ${edificio.nombre_edificio || "Desconocido"}</p>
                            <p><strong>Montaje:</strong> ${edificio.nombre_montaje || "Desconocido"}</p>
                            <p><strong>Hora de Inicio:</strong> ${edificio.hora_inicio || "No especificada"}</p>
                            <p><strong>Hora de Fin:</strong> ${edificio.hora_fin || "No especificada"}</p>
                            <p><strong>Subtotal:</strong> $${edificio.subtotal_alquiler || 0}</p>
                            <hr/>
                        </div>
                    `
                              )
                              .join("")
                        : "<p>No hay edificios registrados para este evento.</p>"
                }
    
                <h3>Lista de Pedidos</h3>
                ${
                    pedidos && pedidos.length > 0
                        ? pedidos
                              .map(
                                  (pedido) => `
                        <div>
                            <p><strong>Producto:</strong> ${pedido.nombre_producto || "Desconocido"}</p>
                            <p><strong>Cantidad:</strong> ${pedido.cantidad || 0}</p>
                            <p><strong>Subtotal:</strong> $${pedido.subtotal || 0}</p>
                            <hr/>
                        </div>
                    `
                              )
                              .join("")
                        : "<p>No hay pedidos registrados para este evento.</p>"
                }
            `;
    
            // Convierte el contenido HTML a formato PDFMake
            const pdfContent = htmlToPdfMake(htmlContent);
    
            // Configuración básica del documento PDF
            const documentDefinition = {
                content: pdfContent,
                styles: {
                    header: { fontSize: 18, margin: [0, 10, 0, 10]},
                    subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5]},
                    paragraph: { fontSize: 12, margin: [0, 5, 0, 5]},
                },
            };
    
            // Genera y descarga el PDF
            pdfMake.createPdf(documentDefinition).download(`Reporte_Evento_${id}.pdf`);
    
        } catch (error) {
            console.error("Error generando el reporte en PDF:", error.message);
            alert("Ocurrió un error al generar el reporte. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const generateBill = async () => {
        try {
            setLoading(true);
            const facturas = await getPagosbyEventID(id);
    
            // Construye el contenido HTML dinámico basado en la información del evento
            const htmlContent = `
                <h1 style="text-align: center;">Facturación General del Evento</h1>
                <h3>Detalles del Evento</h3>
                <p><strong>Nombre del Usuario:</strong> ${userName || "Usuario desconocido"}</p>
                <p><strong>Fecha:</strong> ${eventInfo?.fecha || "No especificada"}</p>
                <p><strong>Hora de Inicio:</strong> ${eventInfo?.hora_inicio || "No especificada"}</p>
                <p><strong>Hora de Fin:</strong> ${eventInfo?.hora_fin || "No especificada"}</p>
                <p><strong>Estado:</strong> ${eventInfo?.estado || "No especificado"}</p>
                <p><strong>Costo Total:</strong> $${eventInfo?.costo_total || 0}</p>
                <p><strong>Saldo Pendiente:</strong> $${eventInfo?.saldo_pendiente || 0}</p>

                <h3>Lista de Facturas</h3>
                ${
                    facturas && facturas.length > 0
                        ? facturas
                              .map(
                                  (factura) => `
                        <div>
                            <p><strong>Detalles:</strong> ${factura.detalles || "Desconocido"}</p>
                            <p><strong>Fecha de Pago:</strong> ${factura.fecha_pago || "Desconocido"}</p>
                            <p><strong>Método:</strong> ${factura.metodo || "Desconocido"}</p>
                            <p><strong>Monto Pagado:</strong> ${factura.monto || "Desconocido"}</p>
                            <hr/>
                        </div>
                    `
                              )
                              .join("")
                        : "<p>No hay edificios registrados para este evento.</p>"
                }
            `;
    
            // Convierte el contenido HTML a formato PDFMake
            const pdfContent = htmlToPdfMake(htmlContent);
    
            // Configuración básica del documento PDF
            const documentDefinition = {
                content: pdfContent,
                styles: {
                    header: { fontSize: 18, margin: [0, 10, 0, 10]},
                    subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5]},
                    paragraph: { fontSize: 12, margin: [0, 5, 0, 5]},
                },
            };
    
            // Genera y descarga el PDF
            pdfMake.createPdf(documentDefinition).download(`Facturacion_Evento_${id}.pdf`);
    
        } catch (error) {
            console.error("Error generando la facturación en PDF:", error.message);
            alert("Ocurrió un error al generar la facturacion. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    };
  
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

                    {eventInfo.estado === "En Cotizacion" && (
                        <button className="generate-event-button" onClick={handleGenerarEvento}>Generar evento</button>
                    )}
                </div>
            ) : (
                <p>Cargando información del evento...</p>
            )}

        <button
            onClick={generatePDF}
            disabled={loading} // Deshabilitar el botón mientras se genera el PDF
            style={{
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
            }}
        >
            {loading ? "Generando PDF..." : "Generar Reporte en PDF"}
        </button>

        <button
            onClick={generateBill}
            disabled={loading} // Deshabilitar el botón mientras se genera el PDF
            style={{
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
            }}
        >
            {loading ? "Generando Facturación..." : "Generar Facturación en PDF"}
        </button>

        </div>
    );
};

export default ShowEvent;
