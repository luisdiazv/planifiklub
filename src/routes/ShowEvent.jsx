import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import { getEventType } from "../Ctrl/TiposEventosCtrl";
import { getNombresApellidosById } from "../Ctrl/UsuarioCtrl";
import {getPedidosByIdEvento, getPedidosAdicionalesByIdPedido} from "../Ctrl/PedidoCtrl";
import { getEdificiosByIdEvento } from "../Ctrl/EdificiosCtrl";
import { getPagosbyEventID } from "../Ctrl/PagosCtrl";
import "./ShowEventStyles.css";
import { formatCurrency } from "../Util/MoneyFormat";
import { handleAcceso } from "../Util/AccessControl";

import { getEventById, updateEventStatus, updateEventCostAndBalance } from "../Ctrl/EventosCtrl";
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
    const [pedidosAdicionales, setPedidosAdicionales] = useState("");
    const [extraCharge, setExtraCharge] = useState(0);
    const [message, setMessage] = useState("");

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
                console.log(pedidos)
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

    useEffect(() => {
        const fetchPedidosAdicionales = async () => {
            if (pedidos && pedidos.length > 0) {
                try {
                    const adicionales = await getPedidosAdicionalesByIdPedido(pedidos[0].id_pedido);
                    setPedidosAdicionales(adicionales || "No aplica");
                } catch (error) {
                    console.error("Error obteniendo pedidos adicionales:", error.message);
                    setPedidosAdicionales("No aplica");
                }
            }
        };
        fetchPedidosAdicionales();
    }, [pedidos]); 
    
    const handleExtraChargeChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Verifica que solo se ingresen números
            setExtraCharge(parseInt(value, 10) || 0);
        }
    };
    const handleAddExtraCharge = async () => {
        const newTotalCost = eventInfo.costo_total + extraCharge;
        const originalSaldoPendiente = parseFloat(eventInfo.saldo_pendiente);
        const newSaldoPendiente = originalSaldoPendiente + extraCharge;
        console.log(newSaldoPendiente);
    
        try {
            await updateEventCostAndBalance(id, newTotalCost, newSaldoPendiente.toString());
            setEventInfo({ ...eventInfo, costo_total: newTotalCost, saldo_pendiente: newSaldoPendiente.toString() });
            setMessage("Cobro extra agregado y valores actualizados.");
        } catch (error) {
            setMessage(`Error al agregar el cobro extra: ${error.message}`);
        }
    };

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
    
            if (!facturas || facturas.length === 0) {
                alert('No hay facturación para este evento.');
                setLoading(false);
                return;
            }
    
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
                            <p1 className="detail-label">Nombre del Usuario:</p1>
                            <p1 className="detail-value">{userName}</p1>
                        </div>
                        <div className="detail-item">
                            <p1 className="detail-label">Tipo de Evento:</p1>
                            <p1 className="detail-value">{eventType}</p1>
                        </div>
                        <div className="detail-item">
                            <p1 className="detail-label">Fecha:</p1>
                            <p1 className="detail-value">{eventInfo.fecha}</p1>
                        </div>
                        <div className="detail-item">
                            <p1 className="detail-label">Hora de Inicio:</p1>
                            <p1 className="detail-value">{eventInfo.hora_inicio}</p1>
                        </div>
                        <div className="detail-item">
                            <p1 className="detail-label">Hora de Fin:</p1>
                            <p1 className="detail-value">{eventInfo.hora_fin}</p1>
                        </div>
                        <div className="detail-item">
                            <p1 className="detail-label">Detalles:</p1>
                            <p1 className="detail-value">{eventInfo.detalles}</p1>
                        </div>
                        <div className="detail-item">
                            <p1 className="detail-label">Número de Personas:</p1>
                            <p1 className="detail-value">{eventInfo.personas}</p1>
                        </div>
                        <div className="detail-item">
                            <p1 className="detail-label">Estado:</p1>
                            <p1 className="detail-value">{eventInfo.estado}</p1>
                        </div>
                        <div className="detail-item">
                            <p1 className="detail-label">Costo Total:</p1>
                            <p1 className="detail-value">{formatCurrency(eventInfo.costo_total)}</p1>
                        </div>
                        <div className="detail-item">
                            <p1 className="detail-label">Saldo Pendiente:</p1>
                            <p1 className="detail-value">{formatCurrency(eventInfo.saldo_pendiente)}</p1>
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
                                            <p1 className="detail-label">Edificio:</p1>
                                            <p1 className="detail-value">{edificio.nombre_edificio}</p1>
                                        </div>
                                        <div className="detail-item">
                                            <p1 className="detail-label">Montaje:</p1>
                                            <p1 className="detail-value">{edificio.nombre_montaje}</p1>
                                        </div>                                        
                                        <div className="detail-item">
                                            <p1 className="detail-label">Subtotal:</p1>
                                            <p1 className="detail-value">{formatCurrency(edificio.subtotal_alquiler)}</p1>
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
                                            <p1 className="detail-label">Producto:</p1>
                                            <p1 className="detail-value">{pedido.nombre_producto}</p1>
                                        </div>
                                        <div className="detail-item">
                                            <p1 className="detail-label">Cantidad:</p1>
                                            <p1 className="detail-value">{pedido.cantidad}</p1>
                                        </div>
                                        <div className="detail-item">
                                            <p1 className="detail-label">Subtotal:</p1>
                                            <p1 className="detail-value">{formatCurrency(pedido.subtotal)}</p1>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-data-message">No hay pedidos registrados para este evento.</p>
                        )}
                    </div>

                    <div className="event-section">
                        <h2 className="section-title">Pedidos Adicionales</h2>
                        <div className="detail-item">
                            <p1 className="detail-label">Pedidos Adicionales:</p1>
                            <p1 className="detail-value">{pedidosAdicionales || "No aplica"}</p1>
                        </div>
                    </div>

                    <div className="event-section">
                        <h2 className="section-title">Costo Total</h2>
                        <div className="detail-item">
                            <p1 className="detail-label">Costo Total:</p1>
                            <p1 className="detail-value">{formatCurrency(eventInfo.costo_total)}</p1>
                        </div>
                    </div>
                    <div className="event-section">
                        <h2 className="section-title">Cobro servicios extra</h2>
                        <div className="detail-item">
                            <p1 className="detail-label">Cobro Extra:</p1>
                            <input
                                type="text"
                                value={extraCharge}
                                onChange={handleExtraChargeChange}
                                placeholder="Ingrese el cobro extra"
                            />
                        </div>
                        <button onClick={handleAddExtraCharge} className="confirm-button">
                            Agregar Cobro Extra
                        </button>
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
                                <button className="btn-approve" onClick={handleGenerarEvento}>Aprobar Cotización</button>

                                <button className="btn-cancel" onClick={handleCancelarEvento}>Cancelar Cotización</button>

                            </>
                        ) : (
                            <button className="btn-cancel" onClick={handleCancelarEvento}>Cancelar Evento</button>
                        )}
                    </>
                )}
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