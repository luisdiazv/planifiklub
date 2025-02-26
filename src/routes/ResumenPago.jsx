import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import { getEventType } from "../Ctrl/TiposEventosCtrl";
import { getNombresApellidosById } from "../Ctrl/UsuarioCtrl";
import { getPedidosByIdEvento, getPedidosAdicionalesByIdPedido } from "../Ctrl/PedidoCtrl";
import { getEdificiosByIdEvento } from "../Ctrl/EdificiosCtrl";
import "./ShowEventStyles.css";
import { formatCurrency } from "../Util/MoneyFormat";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { getEventById } from "../Ctrl/EventosCtrl";

const ResumenPago = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Crear la instancia de navigate
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
        if (/^\d*$/.test(value)) { // Verifica que solo se ingresen números
            setInputValue(value);
            setPrice(parseInt(value, 10) || 0);
        }
    };

    const createPreference = async () => {
        try {
            const request = process.env.REACT_APP_MERCADOPAGO_API_URL + "/create_preference";

            const response = await axios.post(request, {
                title: "Reserva de evento",
                quantity: 1,
                price: price,
            });

            const { id } = response.data;
            return id;
        } catch (error) {
            console.error("Error al crear la preferencia:", error);
        }
    };

    const handleBuy = async () => {
        const id = await createPreference();
        if (id) {
            setPreferenceId(id);  // Setea el ID de la preferencia si se recibe correctamente
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
            <div className="event-section">
                <h2 className="section-title">Pedidos Adicionales</h2>
                <div className="detail-item">
                    <span className="detail-label">Pedidos Adicionales:</span>
                    <span className="detail-value">{pedidosAdicionales}</span>
                </div>
            </div>    

            <h2>Pago restante del evento: {eventInfo && formatCurrency(eventInfo.saldo_pendiente)}</h2>
            {eventInfo && Number(eventInfo.saldo_pendiente) === Number(eventInfo.costo_total) && (
                <div className="input-container">
                    <label htmlFor="saldo-pendiente-input" style={{color : "#3D0C01"}}>Cantidad a pagar:</label>
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
                    initialization={{ preferenceId, redirectMode: "modal" }}
                    customization={{ texts: { valueProp: 'smart_option' }, button: { label: 'Pagar', color: 'default', textColor: 'white' } }}
                    className="mercado-pago-button"
                />
            )}
        </div>
    );
};

export default ResumenPago;