import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { getAllAdmins } from "../../Ctrl/RolCtrl";

const PurchaseSummary = () => {
    const location = useLocation();
    const { selectedServices, serviceQuantities, totalPrice } = location.state || {};

    const enviarCorreoSocio = async (correo, nombres) => {
        try {
            const API_URL = `${process.env.REACT_APP_NODEMAILER_URL}send_cotizacion_conf`;
            const response = await axios.post(
                API_URL,
                { correo, nombres },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Respuesta del servidor:", response.data);
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    const enviarCorreoAdmin = async () => {
        try {
            const API_URL = `${process.env.REACT_APP_NODEMAILER_URL}send_cotizacion_admin`;
            const correos = getAllAdmins();
            const response = await axios.post(
                API_URL,
                { correos },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Respuesta del servidor:", response.data);
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    // Verifica si los datos existen antes de intentar renderizarlos
    if (!selectedServices || !serviceQuantities || totalPrice === undefined) {
        return <p>No se ha seleccionado nada aún.</p>;
    }

    return (
        <div>

            <h2>Resumen de Compra</h2>
            <div>
                <h3>Servicios seleccionados:</h3>
                <ul>
                    {Object.keys(selectedServices).map((serviceName) => (
                        <li key={serviceName}>
                            {serviceName}: {selectedServices[serviceName] ? "Seleccionado" : "No seleccionado"} - Cantidad: {serviceQuantities[serviceName]} - Precio: {(serviceQuantities[serviceName] || 0) * 50000} $
                        </li>
                    ))}
                </ul>
            </div>
            <h4>Total: {totalPrice} $</h4>
        </div>
    );
};

export default PurchaseSummary;
