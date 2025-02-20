import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { getAllAdmins } from "../../Ctrl/RolCtrl";
import { createEvent } from "../../Ctrl/EventosCtrl"; 
import { createEdificioEvento } from "../../Ctrl/EdificiosCtrl"; 
import {createPedido, createProductoPedido} from "../../Ctrl/PedidoCtrl"
import htmlToPdfMake from "html-to-pdfmake";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import "./PurchaseSummaryStyles.css";

pdfMake.vfs = pdfFonts;

const PurchaseSummary = () => {
    const location = useLocation();
    const { selectedServices, serviceQuantities, totalPrice } = location.state || {};
    const [eventoDummy, setEventoDummy] = useState(() => 
        JSON.parse(sessionStorage.getItem("eventoDummy")) || {}
      );
      const [edificiosDummy, setEdificiosDummy] = useState(() => 
        JSON.parse(sessionStorage.getItem("edificiosDummy")) || []
      );
    const [pedido, setPedido] = useState(null);
    const [productosPedido, setProductosPedido] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [totalCost, setTotalCost] = useState(0);
    const [pedidoDummy, setPedidoDummy] = useState(() => 
        JSON.parse(sessionStorage.getItem("pedidoDummy")) || []
      );
      const [productoPedidoDummy, setProductoPedidoDummy] = useState(() => 
        JSON.parse(sessionStorage.getItem("productoPedidoDummy")) || []
      );

      useEffect(() => {
        sessionStorage.removeItem("eventoDummy");
        sessionStorage.removeItem("edificiosDummy");
        sessionStorage.removeItem("pedidoDummy");
        sessionStorage.removeItem("productoPedidoDummy");
      }, []);      
      
      useEffect(() => {
        const interval = setInterval(() => {
          const newEvento = JSON.parse(sessionStorage.getItem("eventoDummy")) || {};
          const newEdificios = JSON.parse(sessionStorage.getItem("edificiosDummy")) || [];
          const newPedido = JSON.parse(sessionStorage.getItem("pedidoDummy")) || [];
          const newProductoPedido = JSON.parse(sessionStorage.getItem("productoPedidoDummy")) || [];
      
          setEventoDummy(prev => JSON.stringify(prev) !== JSON.stringify(newEvento) ? newEvento : prev);
          setEdificiosDummy(prev => JSON.stringify(prev) !== JSON.stringify(newEdificios) ? newEdificios : prev);
          setPedidoDummy(prev => JSON.stringify(prev) !== JSON.stringify(newPedido) ? newPedido : prev);
          setProductoPedidoDummy(prev => JSON.stringify(prev) !== JSON.stringify(newProductoPedido) ? newProductoPedido : prev);
          setProductosPedido(prev => JSON.stringify(prev) !== JSON.stringify(newProductoPedido) ? newProductoPedido : prev); // Agregar esto
        }, 500);
      
        return () => clearInterval(interval);
      }, []);
      useEffect(() => {
        // Obtener los edificios guardados en sessionStorage
        const edificiosDummy = JSON.parse(sessionStorage.getItem("edificiosDummy")) || [];
    
        // Calcular la suma de los subtotales de los edificios
        const subtotalEdificios = edificiosDummy.reduce((sum, edificio) => sum + (edificio.subtotal_alquiler || 0), 0);

        const pedidoDummy = JSON.parse(sessionStorage.getItem("pedidoDummy")) || {};
            
        const subtotalProductos = pedidoDummy.costo_total ? Number(pedidoDummy.costo_total) : 0;
    
        // Calcular el costo total
        const total = subtotalEdificios + subtotalProductos;
    
        setTotalCost(total);
    
        // Obtener eventoDummy, actualizar su costo total y guardarlo en sessionStorage
        const eventoDummy = JSON.parse(sessionStorage.getItem("eventoDummy")) || {};
        eventoDummy.costo_total = total;
        
        sessionStorage.setItem("eventoDummy", JSON.stringify(eventoDummy));
        setEventoDummy(eventoDummy);  // 🔥 Actualizar el estado para reflejar el cambio en la UI
    
    }, [pedidoDummy, productoPedidoDummy]); // 🔄 Se ejecuta cuando cambian los pedidos o productos
    

    useEffect(() => {
        const storedDummy = sessionStorage.getItem("eventoDummy");
        const storedEdificios = sessionStorage.getItem("edificiosDummy");
        const pedidoDummy = sessionStorage.getItem("pedidoDummy");
        const productoPedidoDummy = sessionStorage.getItem("productoPedidoDummy");

        if (storedDummy) {
            setEventoDummy(JSON.parse(storedDummy));
        }
        if (storedEdificios) {
            setEdificiosDummy(JSON.parse(storedEdificios));
        }
        if (pedidoDummy) {
            setPedido(JSON.parse(pedidoDummy));
        }
        if (productoPedidoDummy) {
            setProductosPedido(JSON.parse(productoPedidoDummy));
        }
    }, []);

    if (!eventoDummy) {
        return <p className="no-data-message">No hay información del evento disponible.</p>;
    }

    

    const handleConfirmarCotizacion = async () => {
        setLoading(true);
        setMessage("");
    
        try {
            const eventoDummy = JSON.parse(sessionStorage.getItem("eventoDummy"));
            if (!eventoDummy) {
                setMessage("Error: No se encontró la información del evento.");
                setLoading(false);
                return;
            }
    
            // Guardar el evento en la base de datos y obtener el ID generado
            const eventId = await createEvent(eventoDummy);
            setMessage(`Cotización confirmada con éxito. ID del evento: ${eventId}`);
    
            // Actualizar el eventoDummy con el nuevo ID del evento y guardarlo en sessionStorage
            eventoDummy.id_evento = eventId;
            sessionStorage.setItem("eventoDummy", JSON.stringify(eventoDummy));
    
            // Actualizar los edificiosDummy con el nuevo ID del evento
            let edificiosDummy = JSON.parse(sessionStorage.getItem("edificiosDummy")) || [];
            edificiosDummy = edificiosDummy.map(edificio => ({
                ...edificio,
                id_evento: eventId
            }));
            sessionStorage.setItem("edificiosDummy", JSON.stringify(edificiosDummy));
    
            // Actualizar los pedidoDummy con el nuevo ID del evento
            let pedidoDummy = JSON.parse(sessionStorage.getItem("pedidoDummy"));

            if (Array.isArray(pedidoDummy)) {
                pedidoDummy = pedidoDummy.map(pedido => ({
                    ...pedido,
                    id_evento: eventId
                }));
            } else if (pedidoDummy && typeof pedidoDummy === "object") {
                pedidoDummy.id_evento = eventId;
            }

            sessionStorage.setItem("pedidoDummy", JSON.stringify(pedidoDummy));

    
            // 🔹 Forzar actualización de productosPedido en el estado
            setProductosPedido(JSON.parse(sessionStorage.getItem("pedidoDummy")) || []);

            
            await Promise.all(
                edificiosDummy.map(async (edificio) => {
                    if (!edificio.id_edificio) {
                        console.error("Error: id_edificio es null o undefined en", edificio);
                    }
                    await createEdificioEvento(edificio);
                })
            );
            
            // Insertar el pedido en la base de datos
            if (pedidoDummy) {
                const pedidoId = await createPedido(pedidoDummy);
            
                // Actualizar el pedidoDummy con el nuevo ID y guardarlo en sessionStorage
                pedidoDummy.id_pedido = pedidoId;
                sessionStorage.setItem("pedidoDummy", JSON.stringify(pedidoDummy));

                setProductosPedido({ ...pedidoDummy });
            
                // Recuperar datos del sessionStorage
                const productoPedidoDummy = JSON.parse(sessionStorage.getItem("productoPedidoDummy")) || {};

                if (!productoPedidoDummy || !pedidoId) {
                    console.error("Error: productoPedidoDummy o pedidoId no están definidos.");
                } else {

                    await Promise.all(
                        Object.keys(productoPedidoDummy.cantidad || {}).map(async (productId) => {
                            const cantidad = productoPedidoDummy.cantidad?.[productId] ?? null;
                            const subtotal = productoPedidoDummy.subtotal?.[productId] ?? null;

                           
                            if (cantidad === null || cantidad <= 0) {
                                console.error(`Error: cantidad inválida para el producto ${productId}:`, cantidad);
                                return; // Evitar inserciones con cantidad inválida
                            }

                            if (subtotal === null || subtotal <= 0) {
                                console.error(`Error: subtotal inválido para el producto ${productId}:`, subtotal);
                                return; // Evitar inserciones con subtotal inválido
                            }

                            const productoPedido = {
                                id_pedido: pedidoId,
                                id_producto: productId,
                                cantidad,
                                subtotal,
                            };
                            const cantidadLimpia = parseInt(productoPedido.cantidad ?? 0, 10);
                            const subtotalLimpio = parseFloat(productoPedido.subtotal ?? 0);

                        const productoPedidoLimpio = {
                            ...productoPedido,
                            cantidadLimpia,
                            subtotalLimpio
                        };

                        await createProductoPedido(productoPedidoLimpio);
                        })
                    );
                }


            }
            
                
            alert("Cotización confirmada.");
            sessionStorage.removeItem("eventoDummy");
            sessionStorage.removeItem("edificiosDummy");
            sessionStorage.removeItem("pedidoDummy");
            sessionStorage.removeItem("productoPedidoDummy");
            window.location.href = "/app"; 

    
    
        } catch (error) {
            setMessage(`Error al confirmar la cotización: ${error.message}`);
        }
    
        setLoading(false);
    };
    
    
    

    const generatePDF = async () => {
        try {
            setLoading(true);
    
            // Construye el contenido PDFMake basado en la información de los dummies
            const content = [
                { text: 'Resumen de Cotización', style: 'eventTitle' },
                eventoDummy ? (
                    [
                        { text: 'Detalles del Evento', style: 'sectionTitle' },
                        {
                            table: {
                                widths: ['50%', '50%'],
                                body: [
                                    ['Fecha:', eventoDummy.fecha || 'No especificada'],
                                    ['Hora de Inicio:', eventoDummy.hora_inicio || 'No especificada'],
                                    ['Hora de Fin:', eventoDummy.hora_fin || 'No especificada'],
                                    ['Asistentes:', eventoDummy.personas || 'No especificado'],
                                    ['Descripción:', eventoDummy.detalles || 'Sin detalles'],
                                ],
                            },
                            layout: 'lightHorizontalLines'
                        },
                        { text: '', margin: [0, 10] },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
                        { text: 'Edificios Seleccionados', style: 'sectionTitle' },
                        edificiosDummy && edificiosDummy.length > 0 ? {
                            table: {
                                widths: ['40%', '40%', '20%'],
                                body: [
                                    ['ID Edificio', 'Montaje Seleccionado', 'Subtotal'],
                                    ...edificiosDummy.map(edificio => [
                                        edificio.id_edificio || 'Desconocido',
                                        edificio.id_montaje_elegido || 'Desconocido',
                                        `$${edificio.subtotal_alquiler || 0}`
                                    ])
                                ]
                            },
                            layout: 'lightHorizontalLines'
                        } : { text: 'No hay edificios seleccionados.', style: 'noDataMessage' },
                        { text: '', margin: [0, 10] },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
                        { text: 'Productos Seleccionados', style: 'sectionTitle' },
                        productosPedido && Object.keys(productosPedido.cantidad || {}).length > 0 ? {
                            table: {
                                widths: ['40%', '30%', '30%'],
                                body: [
                                    ['ID Producto', 'Cantidad', 'Subtotal'],
                                    ...Object.keys(productosPedido.cantidad).map(productId => [
                                        productId || 'Desconocido',
                                        productosPedido.cantidad[productId] || 0,
                                        `$${productosPedido.subtotal[productId] || 0}`
                                    ])
                                ]
                            },
                            layout: 'lightHorizontalLines'
                        } : { text: 'No hay productos seleccionados.', style: 'noDataMessage' },
                        { text: '', margin: [0, 10] },
                        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
                        { text: 'Total de la Cotización', style: 'sectionTitle' },
                        {
                            table: {
                                widths: ['50%', '50%'],
                                body: [
                                    ['Total:', `$${totalCost || 0}`]
                                ]
                            },
                            layout: 'lightHorizontalLines'
                        }
                    ]
                ) : { text: 'No hay información del evento disponible.', style: 'noDataMessage' }
            ];
    
            // Definición del documento con estilos
            const documentDefinition = {
                content,
                styles: {
                    eventTitle: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
                    sectionTitle: { fontSize: 14, bold: true, color: '#333', margin: [0, 10, 0, 5] },
                    noDataMessage: { fontSize: 12, color: '#777', italics: true, alignment: 'center', margin: [0, 5, 0, 5] }
                }
            };
    
            // Genera y descarga el PDF
            pdfMake.createPdf(documentDefinition).download(`Resumen_Cotizacion_${eventoDummy.id || "evento"}.pdf`);
        } catch (error) {
            console.error("Error generando el PDF:", error.message);
            alert("Ocurrió un error al generar el PDF. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="purchase-summary-container">
            <h2 className="summary-title">Resumen de Compra</h2>
            {eventoDummy && (
                <div className="event-section">
                    <h3 className="section-title">Detalles del Evento</h3>
                    <div className="detail-item">
                        <span className="detail-label">Fecha:</span>
                        <span className="detail-value">{eventoDummy.fecha}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Hora de Inicio:</span>
                        <span className="detail-value">{eventoDummy.hora_inicio}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Hora de Fin:</span>
                        <span className="detail-value">{eventoDummy.hora_fin}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Asistentes:</span>
                        <span className="detail-value">{eventoDummy.personas}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Descripción:</span>
                        <span className="detail-value">{eventoDummy.detalles}</span>
                    </div>
                </div>
            )}

            {edificiosDummy.length > 0 ? (
                <div className="event-section">
                    <h3 className="section-title">Edificios Seleccionados</h3>
                    <ul className="list-container">
                        {edificiosDummy.map((edificio, index) => (
                            <li key={index} className="list-item">
                                <div className="detail-item">
                                    <span className="detail-label">ID Edificio:</span>
                                    <span className="detail-value">{edificio.id_edificio}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Montaje Seleccionado:</span>
                                    <span className="detail-value">{edificio.id_montaje_elegido}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Subtotal:</span>
                                    <span className="detail-value">${edificio.subtotal_alquiler}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="no-data-message">No hay edificios seleccionados.</p>
            )}

            {productosPedido && Object.keys(productosPedido.cantidad || {}).length > 0 ? (
                <div className="event-section">
                    <h3 className="section-title">Productos Seleccionados</h3>
                    <ul className="list-container">
                        {Object.keys(productosPedido.cantidad).map((productId, index) => (
                            <li key={index} className="list-item">
                                <div className="detail-item">
                                    <span className="detail-label">ID Producto:</span>
                                    <span className="detail-value">{productId}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Cantidad:</span>
                                    <span className="detail-value">{productosPedido.cantidad[productId]}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Subtotal:</span>
                                    <span className="detail-value">${productosPedido.subtotal[productId]}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="no-data-message">No hay productos seleccionados.</p>
            )}

            <h3>Total de la cotización: ${totalCost}</h3>

            {/* Botón para generar el PDF */}
            <div className="pdf-buttons">
                <button
                    onClick={generatePDF}
                    disabled={loading}                
                >
                    {loading ? "Generando PDF..." : "Generar Resumen en PDF"}
                </button>
            </div>
            <div>
                <button onClick={handleConfirmarCotizacion} disabled={loading} className="confirm-button">
                    {loading ? "Confirmando..." : "Confirmar la cotización"}
                </button>
                {message && <p className="status-message">{message}</p>}
            </div>
        </div>
    );
};

export default PurchaseSummary;