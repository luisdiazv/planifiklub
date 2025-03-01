import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import { getEventType } from "../Ctrl/TiposEventosCtrl";
import { getNombresApellidosById,  getUsuarioByID } from "../Ctrl/UsuarioCtrl";
import { getPedidosByIdEvento, getPedidosAdicionalesByIdPedido } from "../Ctrl/PedidoCtrl";
import { getEdificiosByIdEvento } from "../Ctrl/EdificiosCtrl";
import "./ShowEventStyles.css";
import { formatCurrency } from "../Util/MoneyFormat";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { getEventById, updateEventBalance } from "../Ctrl/EventosCtrl";
import { handleAcceso } from "../Util/AccessControl";

const ResumenPago = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Instancia de navigate
    const [eventInfo, setEventInfo] = useState(null);
    const [userName, setUserName] = useState("");
    const [eventType, setEventType] = useState("");
    const [edificios, setEdificios] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);
    const [inputValue, setInputValue] = useState(""); // Estado para el valor del campo de entrada
    const [price, setPrice] = useState(0); // Estado para el valor del precio
    const [pedidosAdicionales, setPedidosAdicionales] = useState("");
    const [cliente, setCliente] = useState(null);
    const porcentajeSocio = 0.3;
    const porcentajeNoSocio = 0.5;

    useEffect(() => {
        const verificarAcceso = async () => {
            const acceso = await handleAcceso(2);
            // Si no hay acceso, se asume que handleAcceso redirige a /404
            if (!acceso) {
                return;
            }
        };
        verificarAcceso();
    }, []);

    useEffect(() => {
        if (eventInfo?.id_usuario) {
            getUsuarioByID(eventInfo.id_usuario).then(setCliente).catch(console.error);
        }
    }, [eventInfo]);

    initMercadoPago('APP_USR-559230ce-2f09-4179-959c-855f9d01f382', {
        locale: "es-CO"
    });

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

    useEffect(() => {
        if (eventInfo) {
            const saldoPendiente = Number(eventInfo.saldo_pendiente);
            const costoTotal = Number(eventInfo.costo_total);
            if (saldoPendiente < costoTotal) {
                setPrice(saldoPendiente);
            }
        }
    }, [eventInfo]);

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

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Solo números
            setInputValue(value);
            if (eventInfo.saldo_pendiente !== eventInfo.costo_total) {
                const porcentajeMinimo = cliente.socio ? 0.3 : 0.5;
                const pagoMinimo = Math.ceil(eventInfo.costo_total * porcentajeMinimo);
                if (Number(value) >= pagoMinimo) {
                    setPrice(parseInt(value, 10) || 0);
                } else {
                    setPrice(0);
                }
            } else {
                setPrice(parseInt(value, 10) || 0);
            }
        }
    };

    const createPreference = async () => {
        try {
            const requestUrl = `${process.env.REACT_APP_MERCADOPAGO_API_URL}/create_preference`;
            const currentUrl = window.location.href;
            
            const response = await axios.post(requestUrl, {
                title: "Reserva de evento",
                quantity: 1,
                price: price,
                success_url: currentUrl,
                failure_url: currentUrl,
                pending_url: currentUrl,
            });
            
            if (response.data?.id) {
                return response.data.id;
            } else {
                throw new Error("No se recibió un ID de preferencia válido.");
            }
        } catch (error) {
            console.error("Error al crear la preferencia:", error);
            return null;
        }
    };    

    const handleBuy = async () => {
        const porcentajeMinimo = cliente.socio ? 0.3 : 0.5;
        const pagoMinimo = Math.ceil(eventInfo.costo_total * porcentajeMinimo);
        if (price < pagoMinimo) {
            alert(`El monto mínimo a pagar es ${formatCurrency(pagoMinimo)}.`);
            return;
        }
        const id = await createPreference();
        if (id) {
            setPreferenceId(id);
        }
        /*
            const saldoPendiente = Number(eventInfo.saldo_pendiente);
            const saldonuevo = saldoPendiente - price;
            await updateEventBalance(eventInfo.idevento, saldonuevo.toString());
        */
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
                            <p className="detail-label">Nombre del Usuario:</p>
                            <p className="detail-value">{userName}</p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Tipo de Evento:</p>
                            <p className="detail-value">{eventType}</p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Fecha:</p>
                            <p className="detail-value">{eventInfo.fecha}</p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Hora de Inicio:</p>
                            <p className="detail-value">{eventInfo.hora_inicio}</p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Hora de Fin:</p>
                            <p className="detail-value">{eventInfo.hora_fin}</p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Detalles:</p>
                            <p className="detail-value">{eventInfo.detalles}</p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Número de Personas:</p>
                            <p className="detail-value">{eventInfo.personas}</p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Estado:</p>
                            <p className="detail-value">{eventInfo.estado}</p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Costo Total:</p>
                            <p className="detail-value">{formatCurrency(eventInfo.costo_total)}</p>
                        </div>
                        <div className="detail-item">
                            <p className="detail-label">Saldo Pendiente:</p>
                            <p className="detail-value">{formatCurrency(eventInfo.saldo_pendiente)}</p>
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
                                            <p className="detail-label">Edificio:</p>
                                            <p className="detail-value">{edificio.nombre_edificio}</p>
                                        </div>
                                        <div className="detail-item">
                                            <p className="detail-label">Montaje:</p>
                                            <p className="detail-value">{edificio.nombre_montaje}</p>
                                        </div>
                                        <div className="detail-item">
                                            <p className="detail-label">Subtotal:</p>
                                            <p className="detail-value">{formatCurrency(edificio.subtotal_alquiler)}</p>
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
                                            <p className="detail-label">Producto:</p>
                                            <p className="detail-value">{pedido.nombre_producto}</p>
                                        </div>
                                        <div className="detail-item">
                                            <p className="detail-label">Cantidad:</p>
                                            <p className="detail-value">{pedido.cantidad}</p>
                                        </div>
                                        <div className="detail-item">
                                            <p className="detail-label">Subtotal:</p>
                                            <p className="detail-value">{formatCurrency(pedido.subtotal)}</p>
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
            <div className="event-section">
                <h2 className="section-title">Pedidos Adicionales</h2>
                <div className="detail-item">
                    <p className="detail-label">Pedidos Adicionales:</p>
                    {pedidosAdicionales.split("%%").map((pedido, index) => (
                        <p key={index} className="pedido-item">{pedido}</p>
                    ))}
                </div>
            </div>

            <h2>Pago restante del evento: {eventInfo && formatCurrency(eventInfo.saldo_pendiente)}</h2>
            {eventInfo && Number(eventInfo.saldo_pendiente) === Number(eventInfo.costo_total) && (
                <div className="input-container">
                    <label htmlFor="saldo-pendiente-input" style={{ color: "#3D0C01" }}>Cantidad a pagar:</label>
                    <input
                        id="saldo-pendiente-input"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Ingrese la cantidad a pagar"
                    />
                </div>
            )}
            <button className="pagar" onClick={handleBuy}>Pagar</button>
            {preferenceId && (
                <Wallet 
                    initialization={{
                        preferenceId,
                        redirectMode: "modal"
                    }}
                    customization={{
                        texts: { valueProp: 'smart_option' },
                        button: { label: 'Pagar', color: 'default', textColor: 'white' }
                    }}
                    onReady={() => console.log("Pago iniciado")}
                    onSubmit={() => console.log("Pago enviado")}
                    onApprove={async (response) => {
                        console.log("Pago aprobado:", response);
                        // Se asume que el paymentId viene en response.data.id o response.id
                        const paymentId = response.data?.id || response.id;
                        if (!paymentId) {
                            console.error("No se pudo obtener el paymentId de la respuesta");
                            alert("Error al obtener el ID del pago");
                            return;
                        }
                        try {
                            const statusUrl = `${process.env.REACT_APP_MERCADOPAGO_API_URL}/payment-status`;
                            const resStatus = await axios.post(statusUrl, { paymentId });
                            console.log("Estado del pago:", resStatus.data);
                            if (resStatus.data.status === "success") {
                                const saldoPendiente = Number(eventInfo.saldo_pendiente);
                                const saldonuevo = saldoPendiente - price;
                                await updateEventBalance(eventInfo.idevento, saldonuevo.toString());
                                alert("Pago confirmado");
                                // navigate("/ruta-exito");
                            } else {
                                alert("El pago no se realizó correctamente. Estado: " + resStatus.data.status);
                            }
                        } catch (error) {
                            console.error("Error al verificar el estado del pago:", error);
                            alert("Error al verificar el estado del pago");
                        }
                    }}
                />
            )}
        </div>
    );
};

export default ResumenPago;
