import React from "react";
import { useLocation } from "react-router-dom";

const PurchaseSummary = () => {
    const location = useLocation();
    const { selectedServices, serviceQuantities, totalPrice } = location.state || {};

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
