import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllAdmins } from "../../Ctrl/RolCtrl";
import { updateEventByID } from "../../Ctrl/EventosCtrl"; 
import { upsertEdificiosEvento } from "../../Ctrl/EdificiosCtrl"; 
import { updatePedidoById, upsertProductoPedido} from "../../Ctrl/PedidoCtrl"
import axios from "axios";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import "./purchaseSummaryStyles.css";
import { formatCurrency } from "../../Util/MoneyFormat";
pdfMake.vfs = pdfFonts;

const PurchaseSummary = ({id}) => {

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
        sessionStorage.setItem("edificiosDummy", JSON.stringify(edificiosDummy));

      
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
            setPedidoDummy(JSON.parse(pedidoDummy));
        }
        if (productoPedidoDummy) {
            setProductosPedido(JSON.parse(productoPedidoDummy));
        }
    }, []);
/*
    useEffect(() => {
        sessionStorage.removeItem("eventoDummy");
        sessionStorage.removeItem("edificiosDummy");
        sessionStorage.removeItem("pedidoDummy");
        sessionStorage.removeItem("productoPedidoDummy");
    }, []);   */

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
            //console.log("Respuesta del servidor:", response.data);
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
           // console.log("Respuesta del servidor, admin:", response.data);
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return "Hora no disponible";
        
        // Si el formato es "HH:MM" o similar, simplemente lo devolvemos
        if (timeString.includes(":")) return timeString;
    
        // Intentamos parsear la hora si viene como timestamp o formato extraño
        const date = new Date(timeString);
        if (isNaN(date.getTime())) {
            console.error("Formato de hora inválido:", timeString);
            return "Formato inválido";
        }
        return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false });
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
    
            // Resto del código para confirmar la cotización...
            const horaInicio = formatTime(eventoDummy.hora_inicio);
            const horaFin = formatTime(eventoDummy.hora_fin);
            console.log(eventoDummy.costo_total);
            const eventoEditado = {
                idevento: Number(id),
                id_usuario: eventoDummy.id_usuario,
                fecha: new Date(eventoDummy.fecha).toISOString().split('T')[0], // YYYY-MM-DD
                hora_inicio: horaInicio,
                hora_fin: horaFin,
                id_tipo_evento: eventoDummy.id_tipo_evento,
                detalles: eventoDummy.detalles,
                estado: eventoDummy.estado,
                personas: eventoDummy.personas,
                costo_total: eventoDummy.costo_total,
                saldo_pendiente: (eventoDummy.costo_total).toString()
            };
    
            // Guardar el evento en la base de datos y obtener el ID generado
            console.log("eventoEditado:", eventoEditado);
            console.log("id:", id);
            try {
                console.log("Antes de llamar a updateEventByID");
                await updateEventByID(id, eventoEditado);
                console.log("Después de llamar a updateEventByID");
            } catch (error) {
                console.error("Error en updateEventByID:", error);
            }
    
            const edificiosDummy = JSON.parse(sessionStorage.getItem("edificiosDummy")) || [];
            const edificiosEvento = edificiosDummy.map(edificio => ({
                id_edificio: edificio.id_edificio,
                id_evento: edificio.id_evento,
                id_montaje_elegido: edificio.id_montaje_elegido,
                subtotal_alquiler: edificio.subtotal_alquiler
            }));
    
            console.log("Edificios:", edificiosEvento);
            try {
                console.log("Antes de llamar a upsertEdificiosEvento");
                await upsertEdificiosEvento(id, edificiosEvento);
                console.log("Después de llamar a upsertEdificiosEvento");
            } catch (error) {
                console.error("Error en upsertEdificiosEvento:", error);
            }
    
            const productoPedidoDummy = JSON.parse(sessionStorage.getItem("productoPedidoDummy")) || {};
            console.log("productoPedidoDummy:", productoPedidoDummy);
    
            const productoPedido = {
                id_pedido: productoPedidoDummy.id_pedido,
                productos: productoPedidoDummy.id_producto.map(id => ({
                    id_producto: id,
                    cantidad: productoPedidoDummy.cantidad[id],
                    subtotal: productoPedidoDummy.subtotal[id]
                }))
            };
    
            console.log("productoPedido:", productoPedido);
    
            const pedidoDummy = JSON.parse(sessionStorage.getItem("pedidoDummy"));
            if (!pedidoDummy) throw new Error("pedidoDummy es null o undefined");
    
            const pedidoactual = {
                id_evento: pedidoDummy.id_evento,
                idpedido: productoPedido.id_pedido,
                fecha_pedido: pedidoDummy.fecha_pedido,
                costo_total: pedidoDummy.costo_total,
                pedidos_adicionales: pedidoDummy.pedidos_adicionales
            };
    
            console.log("Pedido Actual:", pedidoactual);
    
            // Llamar a la función updatePedidoById
            try {
                console.log("Antes de llamar a updatePedidoById");
                await updatePedidoById(pedidoactual.idpedido, pedidoactual);
                console.log("Después de llamar a updatePedidoById");
            } catch (error) {
                console.error("Error en updatePedidoById:", error);
            }
    
            // Llamar a la función upsertProductoPedido
            try {
                console.log("Antes de llamar a upsertProductoPedido");
                await upsertProductoPedido(productoPedido.id_pedido, productoPedido);
                console.log("Después de llamar a upsertProductoPedido");
            } catch (error) {
                console.error("Error en upsertProductoPedido:", error);
            }
            
            
            /*
            const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
            const nombre = currentUser.nombres;
            const apellido = currentUser.apellidos;
            const correo = currentUser.correo;*/
            alert("Modificación realizada.");/*
            enviarCorreoSocio(correo, `${nombre} ${apellido}`);
            enviarCorreoAdmin();*/

            sessionStorage.removeItem("eventoDummy");
            sessionStorage.removeItem("edificiosDummy");
            sessionStorage.removeItem("pedidoDummy");
            sessionStorage.removeItem("productoPedidoDummy");
            window.location.href = "/app"; 

    
    
        } catch (error) {
            //setMessage(`Error al confirmar la cotización: ${error.message}`);
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
                        <p1 className="detail-label">Pedidos Adicionales:</p1>
                        <p1 className="detail-value">{pedidosAdicionales}</p1>
                    </div>
                </div>
            )}

            <h2>Total de la cotización: {formatCurrency(totalCost)}</h2>
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