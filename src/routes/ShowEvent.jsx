import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import { getEventType } from "../Ctrl/TiposEventosCtrl";
import { getNombresApellidosById } from "../Ctrl/UsuarioCtrl";
import {getPedidosByIdEvento} from "../Ctrl/PedidoCtrl";
import { getEdificiosByIdEvento } from "../Ctrl/EdificiosCtrl";
import { getPagosbyEventID } from "../Ctrl/PagosCtrl";
import "./ShowEventStyles.css";
import { formatCurrency } from "../Util/MoneyFormat";
import { handleAcceso } from "../Util/AccessControl";

import { getEventById, updateEventStatus } from "../Ctrl/EventosCtrl";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts;

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
        const verificarAcceso = async () => {
            const acceso = await handleAcceso(3);
            // Si no hay acceso, se asume que handleAcceso redirige a /404
            if (!acceso) {
                return;
            }
        };
        verificarAcceso();
    }, []);

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
        if (!id) return;
        const fetchPedidos = async () => {
            try {
                const pedidos = await getPedidosByIdEvento(id);
                setPedidos(pedidos);
            } catch (err) {
                console.error("Error obteniendo pedidos:", err);
                setPedidos([]);
            }
        };
        fetchPedidos();
    }, [id]);
       

    useEffect(() => {
        if (!id) return;
        const fetchEdificios = async () => {
            try {
                const ListEdificios = await getEdificiosByIdEvento(id);
                setEdificios(ListEdificios);
            } catch (err) {
                console.error("Error obteniendo edificios:", err);
                setEdificios([]);
            }
        };
        fetchEdificios();
    }, [id]);
       

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

    const handleCancelarEvento = async () => {
        try {
            await updateEventStatus(id, "Cancelado"); // Actualiza el estado a Cancelado
            setEventInfo({ ...eventInfo, estado: "Cancelado" }); // Actualiza el estado local
            navigate("/app/CalendarioEventos"); // Redirige al calendario
        } catch (err) {
            console.error("Error al cambiar el estado del evento:", err);
        }
    };
  
    const [loading, setLoading] = useState(false);

    const generatePDF = async () => {
        try {
            setLoading(true);
    
            // Construye el contenido PDFMake basado en la información del evento
            const content = [
                { text: 'Informe General del Evento', style: 'eventTitle' },
                error ? { text: error, style: 'errorMessage' } : {},
                eventInfo ? (
                    [
                        { text: 'Detalles del Evento', style: 'sectionTitle' },
                        {
                            table: {
                                widths: ['50%', '50%'],
                                body: [
                                    ['Nombre del Usuario:', userName],
                                    ['Tipo de Evento:', eventType],
                                    ['Fecha:', eventInfo.fecha],
                                    ['Hora de Inicio:', eventInfo.hora_inicio],
                                    ['Hora de Fin:', eventInfo.hora_fin],
                                    ['Detalles:', eventInfo.detalles],
                                    ['Número de Personas:', eventInfo.personas],
                                    ['Estado:', eventInfo.estado],
                                    ['Costo Total:', `${formatCurrency(eventInfo.costo_total)}`],
                                    ['Saldo Pendiente:', `${formatCurrency(eventInfo.saldo_pendiente)}`],
                                ],
                            },
                            layout: 'lightHorizontalLines'
                        },
                        { text: '', margin: [0, 10] },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
                        { text: 'Lista de Edificios', style: 'sectionTitle' },
                        edificios && edificios.length > 0 ? {
                            table: {
                                widths: ['40%', '40%', '20%'],
                                body: [
                                    ['Edificio', 'Montaje', 'Subtotal'],
                                    ...edificios.map(edificio => [
                                        edificio.nombre_edificio,
                                        edificio.nombre_montaje,
                                        `${formatCurrency(edificio.subtotal_alquiler)}`
                                    ])
                                ]
                            },
                            layout: 'lightHorizontalLines'
                        } : { text: 'No hay edificios registrados para este evento.', style: 'noDataMessage' },
                        { text: '', margin: [0, 10] },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
                        { text: 'Lista de Pedidos', style: 'sectionTitle' },
                        pedidos && pedidos.length > 0 ? {
                            table: {
                                widths: ['40%', '30%', '30%'],
                                body: [
                                    ['Producto', 'Cantidad', 'Subtotal'],
                                    ...pedidos.map(pedido => [
                                        pedido.nombre_producto,
                                        pedido.cantidad,
                                        `${formatCurrency(pedido.subtotal)}`
                                    ])
                                ]
                            },
                            layout: 'lightHorizontalLines'
                        } : { text: 'No hay pedidos registrados para este evento.', style: 'noDataMessage' }
                    ]
                ) : { text: 'Cargando información del evento...', style: 'loadingMessage' }
            ];
    
            // Definición del documento con estilos
            const documentDefinition = {
                content,
                styles: {
                    eventTitle: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
                    errorMessage: { color: '#dc3545', alignment: 'center', margin: [0, 0, 0, 10] },
                    sectionTitle: { fontSize: 14, bold: true, color: '#333', margin: [0, 10, 0, 5] },
                    noDataMessage: { fontSize: 12, color: '#777', italics: true, alignment: 'center', margin: [0, 5, 0, 5] },
                    loadingMessage: { fontSize: 12, color: '#555', alignment: 'center', margin: [0, 5, 0, 5] }
                }
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
    
            // Configuración del contenido en formato PDFMake
            const documentDefinition = {
                content: [
                    { text: 'Facturación General del Evento', style: 'header' },
                    { text: 'Detalles del Evento', style: 'subheader' },
                    {
                        table: {
                            widths: ['30%', '70%'],
                            body: [
                                ['Nombre del Usuario:', userName || 'Usuario desconocido'],
                                ['Fecha:', eventInfo?.fecha || 'No especificada'],
                                ['Hora de Inicio:', eventInfo?.hora_inicio || 'No especificada'],
                                ['Hora de Fin:', eventInfo?.hora_fin || 'No especificada'],
                                ['Estado:', eventInfo?.estado || 'No especificado'],
                                ['Costo Total:', `${formatCurrency(eventInfo.costo_total)}`],
                                ['Saldo Pendiente:', `${formatCurrency(eventInfo.saldo_pendiente)}`],
                            ],
                        },
                        layout: 'lightHorizontalLines',
                        margin: [0, 0, 0, 20],
                    },
                    { text: 'Lista de Facturas', style: 'subheader' },
                    facturas && facturas.length > 0
                        ? {
                              table: {
                                  headerRows: 1,
                                  widths: ['30%', '20%', '20%', '30%'],
                                  body: [
                                      ['Fecha de Pago', 'Monto Pagado'],
                                      ...facturas.map(factura => [
                                          factura.fecha_pago || 'Desconocido',
                                          `${formatCurrency(factura.monto) || 'Desconocido'}`,
                                      ]),
                                  ],
                              },
                              layout: 'lightHorizontalLines',
                          }
                        : { text: 'No hay facturas registradas para este evento.', style: 'noData' },
                ],
                styles: {
                    header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10], alignment: 'center' },
                    subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                    noData: { fontSize: 12, italics: true, margin: [0, 5, 0, 10], alignment: 'center' },
                },
            };
    
            // Genera y descarga el PDF
            pdfMake.createPdf(documentDefinition).download(`Facturacion_Evento_${id}.pdf`);
        } catch (error) {
            console.error('Error generando la facturación en PDF:', error.message);
            alert('Ocurrió un error al generar la facturación. Inténtalo nuevamente.');
        } finally {
            setLoading(false);
        }
    }; 
  
    return (
        <div className="showevent-container">
            <h2 className="event-title">Informe General del Evento</h2>
            {error && <p className="error-message">{error}</p>}
            {eventInfo ? (
                <div className="event-details">
                    {/* Sección de Detalles del Evento */}
                    <div className="event-section">
                        <h2 className="section-title">Detalles del Evento</h2>
                        <div className="detail-item">
                            <span className="detail-label">Nombre del Usuario:</span>
                            <span className="detail-value">{userName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Tipo de Evento:</span>
                            <span className="detail-value">{eventType}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Fecha:</span>
                            <span className="detail-value">{eventInfo.fecha}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Hora de Inicio:</span>
                            <span className="detail-value">{eventInfo.hora_inicio}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Hora de Fin:</span>
                            <span className="detail-value">{eventInfo.hora_fin}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Detalles:</span>
                            <span className="detail-value">{eventInfo.detalles}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Número de Personas:</span>
                            <span className="detail-value">{eventInfo.personas}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Estado:</span>
                            <span className="detail-value">{eventInfo.estado}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Costo Total:</span>
                            <span className="detail-value">{formatCurrency(eventInfo.costo_total)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Saldo Pendiente:</span>
                            <span className="detail-value">{formatCurrency(eventInfo.saldo_pendiente)}</span>
                        </div>
                    </div>
    
                    {/* Sección de Edificios */}
                    <div className="event-section">
                        <h2 className="section-title">Lista de Edificios</h2>
                        {edificios && edificios.length > 0 ? (
                            <ul className="list-container">
                                {edificios.map((edificio) => (
                                    <li key={edificio.idedificio} className="list-item">
                                        <div className="detail-item">
                                            <span className="detail-label">Edificio:</span>
                                            <span className="detail-value">{edificio.nombre_edificio}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Montaje:</span>
                                            <span className="detail-value">{edificio.nombre_montaje}</span>
                                        </div>                                        
                                        <div className="detail-item">
                                            <span className="detail-label">Subtotal:</span>
                                            <span className="detail-value">{formatCurrency(edificio.subtotal_alquiler)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-data-message">No hay edificios registrados para este evento.</p>
                        )}
                    </div>
    
                    {/* Sección de Pedidos */}
                    <div className="event-section">
                        <h2 className="section-title">Lista de Pedidos</h2>
                        {pedidos && pedidos.length > 0 ? (
                            <ul className="list-container">
                                {pedidos.map((pedido) => (
                                    <li key={pedido.idproducto_pedido} className="list-item">
                                        <div className="detail-item">
                                            <span className="detail-label">Producto:</span>
                                            <span className="detail-value">{pedido.nombre_producto}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Cantidad:</span>
                                            <span className="detail-value">{pedido.cantidad}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Subtotal:</span>
                                            <span className="detail-value">{formatCurrency(pedido.subtotal)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-data-message">No hay pedidos registrados para este evento.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="loading-message">Cargando información del evento...</p>
            )}

            {/* Botones de Acción */}
            <div className="pdf-buttons">
                {eventInfo?.estado && (
                    <>
                        {eventInfo.estado === "En Cotizacion" ? (
                            <>
                                <div>
                                    <button className="btn-approve" onClick={handleGenerarEvento}>Aprobar Cotización</button>
                                </div>
                                <div>
                                    <button className="btn-cancel" onClick={handleCancelarEvento}>Cancelar Cotización</button>
                                </div>
                            </>
                        ) : (
                            <button className="btn-cancel" onClick={handleCancelarEvento}>Cancelar Evento</button>
                        )}
                    </>
                )}
            </div>

    
            {/* Botones de Generación de PDF */}
            <div className="pdf-buttons">
                <button
                    onClick={generatePDF}
                    disabled={loading}
                    className="btn-pdf"
                >
                    {loading ? "Generando PDF..." : "Generar Reporte en PDF"}
                </button>
                <button
                    onClick={generateBill}
                    disabled={loading}
                    className="btn-pdf"
                >
                    {loading ? "Generando Facturación..." : "Generar Facturación en PDF"}
                </button>
            </div>
        </div>
    );
};

export default ShowEvent;