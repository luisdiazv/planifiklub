import React, { useState } from "react";
import './OurServicesStyles.css';

const OurServices = () => {
    const services = [
        { name: "Servicio 1", price: 50000 },
        { name: "Servicio 2", price: 30000 },
        { name: "Servicio 3", price: 20000 },
    ];

    const [serviceQuantities, setServiceQuantities] = useState({});
    const [selectedServices, setSelectedServices] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [showSummary, setShowSummary] = useState(false);

    const handleQuantityChange = (serviceName, quantity) => {
        if (selectedServices[serviceName]) {
            setServiceQuantities((prevQuantities) => {
                const newQuantities = { ...prevQuantities, [serviceName]: quantity };
                calculateTotalPrice(newQuantities);
                return newQuantities;
            });
        }
    };

    const handleCheckboxChange = (serviceName, isSelected) => {
        setSelectedServices((prevSelected) => {
            const newSelected = { ...prevSelected, [serviceName]: isSelected };
            if (!isSelected) {
                setServiceQuantities((prevQuantities) => {
                    const newQuantities = { ...prevQuantities, [serviceName]: 0 };
                    calculateTotalPrice(newQuantities);
                    return newQuantities;
                });
            } else {
                calculateTotalPrice(serviceQuantities);
            }
            return newSelected;
        });
    };

    const calculateTotalPrice = (quantities) => {
        let total = 0;
        services.forEach(service => {
            if (selectedServices[service.name]) {
                total += (quantities[service.name] || 0) * service.price;
            }
        });
        setTotalPrice(total);
    };

    const handleBuy = () => {
        setShowSummary(true); // Muestra el resumen de la compra
    };

    return (
        <div className="card-product-container">
            <div className="card-product">
                <div className="card">
                    <h3>Servicios disponibles</h3>
                    <ul>
                        {services.map((service, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedServices[service.name] || false}
                                        onChange={(e) => handleCheckboxChange(service.name, e.target.checked)}
                                    />
                                    {service.name} - {service.price} $
                                </label>
                                {selectedServices[service.name] && (
                                    <input
                                        type="number"
                                        min="0"
                                        value={serviceQuantities[service.name] || 0}
                                        onChange={(e) => handleQuantityChange(service.name, parseInt(e.target.value) || 0)}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                    <h4>precio total de servicios: {totalPrice} $</h4>
                    <p style={{ fontSize: "0.8rem", textAlign: "end" }}>* no olvides guardar</p>
                    <button onClick={handleBuy} disabled={totalPrice === 0}>Guardar</button>

                    {/* Mostrar resumen cuando sea necesario */}
                    {showSummary && (
                        <div className="purchase-summary">
                            <h3>Resumen de la Compra</h3>
                            <ul>
                                {services.map((service) => {
                                    if (selectedServices[service.name]) {
                                        return (
                                            <li key={service.name}>
                                                {service.name} - Cantidad: {serviceQuantities[service.name] || 0} - Precio: {(serviceQuantities[service.name] || 0) * service.price} $
                                            </li>
                                        );
                                    }
                                    return null;
                                })}
                            </ul>
                            <h4>Total: {totalPrice} $</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OurServices;
