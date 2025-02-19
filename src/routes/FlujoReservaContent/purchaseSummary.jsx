import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { getAllAdmins } from "../../Ctrl/RolCtrl";
import htmlToPdfMake from "html-to-pdfmake";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import "./PurchaseSummaryStyles.css";

pdfMake.vfs = pdfFonts;

const PurchaseSummary = () => {
    const location = useLocation();
    const { selectedServices, serviceQuantities, totalPrice } = location.state || {};
    const [eventoDummy, setEventoDummy] = useState(null);
    const [edificiosDummy, setEdificiosDummy] = useState([]);
    const [pedido, setPedido] = useState(null);
    const [productosPedido, setProductosPedido] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const generatePDF = async () => {
        try {
            setLoading(true);

            // Construye el contenido HTML dinámico basado en la información de los dummies
            const htmlContent = `
                <h1 style="text-align: center;">Resumen de Compra</h1>
                <h3>Detalles del Evento</h3>
                <p><strong>Fecha:</strong> ${eventoDummy.fecha || "No especificada"}</p>
                <p><strong>Hora de Inicio:</strong> ${eventoDummy.hora_inicio || "No especificada"}</p>
                <p><strong>Hora de Fin:</strong> ${eventoDummy.hora_fin || "No especificada"}</p>
                <p><strong>Asistentes:</strong> ${eventoDummy.personas || "No especificado"}</p>
                <p><strong>Descripción:</strong> ${eventoDummy.detalles || "Sin detalles"}</p>

                <h3>Edificios Seleccionados</h3>
                ${
                    edificiosDummy && edificiosDummy.length > 0
                        ? edificiosDummy
                              .map(
                                  (edificio) => `
                        <div>
                            <p><strong>ID Edificio:</strong> ${edificio.id_edificio || "Desconocido"}</p>
                            <p><strong>Montaje Seleccionado:</strong> ${edificio.id_montaje_elegido || "Desconocido"}</p>
                            <p><strong>Subtotal:</strong> $${edificio.subtotal_alquiler || 0}</p>
                            <hr/>
                        </div>
                    `
                              )
                              .join("")
                        : "<p>No hay edificios seleccionados.</p>"
                }

                <h3>Productos Seleccionados</h3>
                ${
                    productosPedido && Object.keys(productosPedido.cantidad).length > 0
                        ? Object.keys(productosPedido.cantidad)
                              .map(
                                  (productId) => `
                        <div>
                            <p><strong>ID Producto:</strong> ${productId || "Desconocido"}</p>
                            <p><strong>Cantidad:</strong> ${productosPedido.cantidad[productId] || 0}</p>
                            <p><strong>Subtotal:</strong> $${productosPedido.subtotal[productId] || 0}</p>
                            <hr/>
                        </div>
                    `
                              )
                              .join("")
                        : "<p>No hay productos seleccionados.</p>"
                }
            `;

            // Convierte el contenido HTML a formato PDFMake
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

            // Genera y descarga el PDF
            pdfMake.createPdf(documentDefinition).download(`Resumen_cotizacion.pdf`);
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

            {productosPedido && Object.keys(productosPedido.cantidad).length > 0 ? (
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

            {/* Botón para generar el PDF */}
            <div className="pdf-buttons">
                <button
                    onClick={generatePDF}
                    disabled={loading}
                    className="btn-pdf"
                >
                    {loading ? "Generando PDF..." : "Generar Resumen en PDF"}
                </button>
            </div>
        </div>
    );
};

export default PurchaseSummary;