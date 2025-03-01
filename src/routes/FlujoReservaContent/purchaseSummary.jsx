import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllAdmins } from "../../Ctrl/RolCtrl";
import { createEvent } from "../../Ctrl/EventosCtrl";
import { getNombreMontajeByIdMontaje } from "../../Ctrl/MontajesCtrl";
import { createEdificioEvento, getEdificioName } from "../../Ctrl/EdificiosCtrl";
import { createPedido, createProductoPedido } from "../../Ctrl/PedidoCtrl";
import { getProductoByID } from "../../Ctrl/ProductoCtrl";
import axios from "axios";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
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
  const [productosNombres, setProductosNombres] = useState({});
  const [nombresEdificios, setNombresEdificios] = useState({});
  // Estado para almacenar los nombres de montaje
  const [nombresMontajes, setNombresMontajes] = useState({});

  useEffect(() => {
    const fetchEdificioNames = async () => {
      const nombres = {};
      await Promise.all(
        edificiosDummy.map(async (edificio) => {
          try {
            const nombre = await getEdificioName(edificio.id_edificio);
            nombres[edificio.id_edificio] = nombre;
          } catch (error) {
            console.error("Error obteniendo el nombre del edificio:", error);
            nombres[edificio.id_edificio] = `Edificio ${edificio.id_edificio}`;
          }
        })
      );
      setNombresEdificios(nombres);
    };

    if (edificiosDummy.length > 0) {
      fetchEdificioNames();
    }
  }, [edificiosDummy]);

  useEffect(() => {
    const fetchProductNames = async () => {
      if (!productosPedido || !productosPedido.cantidad) return;

      const nombres = {};
      await Promise.all(
        Object.keys(productosPedido.cantidad).map(async (productId) => {
          try {
            const producto = await getProductoByID(productId);
            nombres[productId] = producto.nombre || `Producto ${productId}`;
          } catch (error) {
            console.error(`Error obteniendo el nombre del producto ${productId}:`, error);
            nombres[productId] = `Producto ${productId}`;
          }
        })
      );

      setProductosNombres(nombres);
    };

    fetchProductNames();
  }, [productosPedido]);

  // Nuevo useEffect para obtener los nombres de montaje
  useEffect(() => {
    const fetchMontajes = async () => {
      const nombres = {};
      await Promise.all(
        edificiosDummy.map(async (edificio) => {
          try {
            const nombre = await getNombreMontajeByIdMontaje(edificio.id_montaje_elegido);
            nombres[edificio.id_montaje_elegido] = nombre;
          } catch (error) {
            console.error("Error obteniendo el nombre del montaje:", error);
            nombres[edificio.id_montaje_elegido] = "Nombre no disponible";
          }
        })
      );
      setNombresMontajes(nombres);
    };

    if (edificiosDummy.length > 0) {
      fetchMontajes();
    }
  }, [edificiosDummy]);

  useEffect(() => {
    const servicioExtra = JSON.parse(sessionStorage.getItem("pedidoDummy"));

    if (servicioExtra && servicioExtra.pedidos_adicionales) {
      setPedidosAdicionales(servicioExtra.pedidos_adicionales);
    } else {
      setPedidosAdicionales("No aplica");
    }
  }, [pedidoDummy]);

  useEffect(() => {
    // Actualiza cada 500ms los datos del sessionStorage
    const interval = setInterval(() => {
      const newEvento = JSON.parse(sessionStorage.getItem("eventoDummy")) || {};
      const newEdificios = JSON.parse(sessionStorage.getItem("edificiosDummy")) || [];
      const newPedido = JSON.parse(sessionStorage.getItem("pedidoDummy")) || {};
      const newProductoPedido = JSON.parse(sessionStorage.getItem("productoPedidoDummy")) || [];

      setEventoDummy((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newEvento) ? newEvento : prev
      );
      setEdificiosDummy((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newEdificios) ? newEdificios : prev
      );
      setPedidoDummy((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newPedido) ? newPedido : prev
      );
      setProductoPedidoDummy((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newProductoPedido) ? newProductoPedido : prev
      );
      setProductosPedido((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newProductoPedido) ? newProductoPedido : prev
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const edificiosDummy = JSON.parse(sessionStorage.getItem("edificiosDummy")) || [];

    // Calcular la suma de los subtotales de los edificios
    const subtotalEdificios = edificiosDummy.reduce(
      (sum, edificio) => sum + (edificio.subtotal_alquiler || 0),
      0
    );

    const pedidoDummy = JSON.parse(sessionStorage.getItem("pedidoDummy")) || {};

    const subtotalProductos = pedidoDummy.costo_total ? Number(pedidoDummy.costo_total) : 0;

    // Calcular el costo total
    const total = subtotalEdificios + subtotalProductos;

    setTotalCost(total);

    // Actualizar el eventoDummy con el costo total
    const eventoDummy = JSON.parse(sessionStorage.getItem("eventoDummy")) || {};
    eventoDummy.costo_total = total;

    sessionStorage.setItem("eventoDummy", JSON.stringify(eventoDummy));
    setEventoDummy(eventoDummy);
  }, [pedidoDummy, productoPedidoDummy]);

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
      await axios.post(
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
      const correos = usuarios.map((usuario) => usuario.correo);
      if (!Array.isArray(correos) || correos.some((correo) => typeof correo !== "string")) {
        throw new Error("La lista de correos no es válida.");
      }
      await axios.post(
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

      // Guardar el evento y obtener su ID
      const eventId = await createEvent(eventoDummy);
      setMessage(`Cotización confirmada con éxito. ID del evento: ${eventId}`);

      eventoDummy.id_evento = eventId;
      sessionStorage.setItem("eventoDummy", JSON.stringify(eventoDummy));

      // Actualizar los edificios con el ID del evento
      let edificiosDummy = JSON.parse(sessionStorage.getItem("edificiosDummy")) || [];
      edificiosDummy = edificiosDummy.map((edificio) => ({
        ...edificio,
        id_evento: eventId,
      }));
      sessionStorage.setItem("edificiosDummy", JSON.stringify(edificiosDummy));

      // Actualizar el pedido con el ID del evento
      let pedidoDummy = JSON.parse(sessionStorage.getItem("pedidoDummy"));
      if (Array.isArray(pedidoDummy)) {
        pedidoDummy = pedidoDummy.map((pedido) => ({
          ...pedido,
          id_evento: eventId,
        }));
      } else if (pedidoDummy && typeof pedidoDummy === "object") {
        pedidoDummy.id_evento = eventId;
      }
      sessionStorage.setItem("pedidoDummy", JSON.stringify(pedidoDummy));

      // Forzar la actualización de productosPedido
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
        pedidoDummy.id_pedido = pedidoId;
        sessionStorage.setItem("pedidoDummy", JSON.stringify(pedidoDummy));
        setProductosPedido({ ...pedidoDummy });

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
                return;
              }

              if (subtotal === null || subtotal <= 0) {
                console.error(`Error: subtotal inválido para el producto ${productId}:`, subtotal);
                return;
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
                subtotalLimpio,
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
                  <p1 className="detail-label">Edificio:</p1>
                  <p1 className="detail-value">
                    {nombresEdificios[edificio.id_edificio] || "Cargando..."}
                  </p1>
                </div>
                <div className="detail-item">
                  <p1 className="detail-label">Montaje Seleccionado:</p1>
                  <p1 className="detail-value">
                    {nombresMontajes[edificio.id_montaje_elegido] || "Cargando..."}
                  </p1>
                </div>
                <div className="detail-item">
                  <p1 className="detail-label">Subtotal:</p1>
                  <p1 className="detail-value">
                    {formatCurrency(edificio.subtotal_alquiler)}
                  </p1>
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
                  <p1 className="detail-label">Producto:</p1>
                  <p1 className="detail-value">
                    {productosNombres[productId] || "Cargando..."}
                  </p1>
                </div>
                <div className="detail-item">
                  <p1 className="detail-label">Cantidad:</p1>
                  <p1 className="detail-value">
                    {productosPedido.cantidad[productId]}
                  </p1>
                </div>
                <div className="detail-item">
                  <p1 className="detail-label">Subtotal:</p1>
                  <p1 className="detail-value">
                    {formatCurrency(productosPedido.subtotal[productId])}
                  </p1>
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
                <p key={index} className="pedido-item">
                  {pedido}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <h2>Total de la cotización: ${totalCost}</h2>
      <div>
        <button
          onClick={handleConfirmarCotizacion}
          disabled={loading}
          className="confirm-button"
        >
          {loading ? "Confirmando..." : "Confirmar la cotización"}
        </button>
        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  );
};

export default PurchaseSummary;
