import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllAdmins } from "../../Ctrl/RolCtrl";
import { createEvent } from "../../Ctrl/EventosCtrl";
import { createEdificioEvento } from "../../Ctrl/EdificiosCtrl";
import { createPedido, createProductoPedido } from "../../Ctrl/PedidoCtrl"
import axios from "axios";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import "./PurchaseSummaryStyles.css";
import { formatCurrency } from "../../Util/MoneyFormat";
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
        JSON.parse(sessionStorage.getItem("pedidoDummy")) || {}
    );
    const [productoPedidoDummy, setProductoPedidoDummy] = useState(() =>
        JSON.parse(sessionStorage.getItem("productoPedidoDummy")) || []
    );
    const [pedidosAdicionales, setPedidosAdicionales] = useState("");

    useEffect(() => {
        const servicioExtra = JSON.parse(sessionStorage.getItem("pedidoDummy"));
        
        if (servicioExtra && servicioExtra.pedidos_adicionales) {
            setPedidosAdicionales(servicioExtra.pedidos_adicionales);
        } else {
            setPedidosAdicionales("No aplica");
        }
    }, [pedidoDummy]);

    useEffect(() => {
        
    }, [pedidosAdicionales]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newEvento = JSON.parse(sessionStorage.getItem("eventoDummy")) || {};
            const newEdificios = JSON.parse(sessionStorage.getItem("edificiosDummy")) || [];
            const newPedido = JSON.parse(sessionStorage.getItem("pedidoDummy")) || {};
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
        setEventoDummy(eventoDummy);  // Actualizar el estado para reflejar el cambio en la UI

    }, [pedidoDummy, productoPedidoDummy]); // Se ejecuta cuando cambian los pedidos o productos


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
            setPedidoDummy(JSON.parse(pedidoDummy));
        }
        if (productoPedidoDummy) {
            setProductosPedido(JSON.parse(productoPedidoDummy));
        }
    }, []);

    useEffect(() => {
        sessionStorage.removeItem("eventoDummy");
        sessionStorage.removeItem("edificiosDummy");
        sessionStorage.removeItem("pedidoDummy");
        sessionStorage.removeItem("productoPedidoDummy");
    }, []);

    if (!eventoDummy) {
        return <p className="no-data-message">No hay información del evento disponible.</p>;
    }

    const enviarCorreoSocio = async (correo, nombres) => {
        try {
            const API_URL = `${process.env.REACT_APP_NODEMAILER_URL}send_cotizacion_conf`;
            const response = await axios.post(
                API_URL,
                { correo, nombres },
                { headers: { "Content-Type": "application/json" } }
            );
            
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    const enviarCorreoAdmin = async () => {
        try {
            const API_URL = `${process.env.REACT_APP_NODEMAILER_URL}send_cotizacion_admin`;
            const usuarios = await getAllAdmins();
            const correos = usuarios.map(usuario => usuario.correo);
            if (!Array.isArray(correos) || correos.some(correo => typeof correo !== 'string')) {
                throw new Error("La lista de correos no es válida.");
            }
            const response = await axios.post(
                API_URL,
                { correos },
                { headers: { "Content-Type": "application/json" } }
            );
            
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

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
          
            // Forzar actualización de productosPedido en el estado
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

            const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
            const nombre = currentUser.nombres;
            const apellido = currentUser.apellidos;
            const correo = currentUser.correo;
            alert("Cotización confirmada.");
            await enviarCorreoSocio(correo, `${nombre} ${apellido}`);
            await enviarCorreoAdmin();
            

            // Mover las líneas de eliminación de sessionStorage aquí
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

    return (
        <div className="purchase-summary-container">
            {eventoDummy && (
                <div className="event-section">
                    <h2 className="section-title">Detalles del Evento</h2>
                    <div className="detail-item">
                        <p1 className="detail-label">Fecha:</p1>
                        <p1 className="detail-value">{eventoDummy.fecha}</p1>
                    </div>
                    <div className="detail-item">
                        <p1 className="detail-label">Hora de Inicio:</p1>
                        <p1 className="detail-value">{eventoDummy.hora_inicio}</p1>
                    </div>
                    <div className="detail-item">
                        <p1 className="detail-label">Hora de Fin:</p1>
                        <p1 className="detail-value">{eventoDummy.hora_fin}</p1>
                    </div>
                    <div className="detail-item">
                        <p1 className="detail-label">Asistentes:</p1>
                        <p1 className="detail-value">{eventoDummy.personas}</p1>
                    </div>
                    <div className="detail-item">
                        <p1 className="detail-label">Descripción:</p1>
                        <p1 className="detail-value">{eventoDummy.detalles}</p1>
                    </div>
                </div>
            )}

            {edificiosDummy.length > 0 ? (
                <div className="event-section">
                    <h2 className="section-title">Edificios Seleccionados</h2>
                    <ul className="list-container">
                        {edificiosDummy.map((edificio, index) => (
                            <li key={index} className="list-item">
                                <div className="detail-item">
                                    <p1 className="detail-label">ID Edificio:</p1>
                                    <p1 className="detail-value">{edificio.id_edificio}</p1>
                                </div>
                                <div className="detail-item">
                                    <p1 className="detail-label">Montaje Seleccionado:</p1>
                                    <p1 className="detail-value">{edificio.id_montaje_elegido}</p1>
                                </div>
                                <div className="detail-item">
                                    <p1 className="detail-label">Subtotal:</p1>
                                    <p1 className="detail-value">{formatCurrency(edificio.subtotal_alquiler)}</p1>
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
                    <h2 className="section-title">Productos Seleccionados</h2>
                    <ul className="list-container">
                        {Object.keys(productosPedido.cantidad).map((productId, index) => (
                            <li key={index} className="list-item">
                                <div className="detail-item">
                                    <p1 className="detail-label">ID Producto:</p1>
                                    <p1 className="detail-value">{productId}</p1>
                                </div>
                                <div className="detail-item">
                                    <p1 className="detail-label">Cantidad:</p1>
                                    <p1 className="detail-value">{productosPedido.cantidad[productId]}</p1>
                                </div>
                                <div className="detail-item">
                                    <p1 className="detail-label">Subtotal:</p1>
                                    <p1 className="detail-value">{formatCurrency(productosPedido.subtotal[productId])}</p1>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="no-data-message">No hay productos seleccionados.</p>
            )}

            {pedidoDummy && (
            <div className="event-section">
                <h2 className="section-title">Pedidos Adicionales</h2>
                <div className="detail-item">
                <p className="detail-label">Pedidos Adicionales:</p>
                <div className="pedidos-list">
                    {pedidosAdicionales.split("%%").map((pedido, index) => (
                    <p key={index} className="pedido-item">{pedido}</p>
                    ))}
                </div>
                </div>
            </div>
            )}

            <h2>Total de la cotización: ${totalCost}</h2>
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