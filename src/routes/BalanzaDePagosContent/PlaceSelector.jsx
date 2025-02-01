import React, { useState } from "react";
import './PlaceSelectorStyles.css';

const PlaceSelector = () => {
    // Lista de servicios
    const services = [
        { name: "Servicio 1", price: 50000 },
        { name: "Servicio 2", price: 30000 },
        { name: "Servicio 3", price: 20000 },
    ];

    // Estado para almacenar las cantidades y selección de los servicios
    const [serviceQuantities, setServiceQuantities] = useState({});
    const [selectedServices, setSelectedServices] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    // Manejar el cambio de cantidad de un servicio
    const handleQuantityChange = (serviceName, quantity) => {
        if (selectedServices[serviceName]) {
            setServiceQuantities((prevQuantities) => {
                const newQuantities = { ...prevQuantities, [serviceName]: quantity };
                calculateTotalPrice(newQuantities);
                return newQuantities;
            });
        }
    };

    // Manejar el cambio del checkbox
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

    // Calcular el precio total
    const calculateTotalPrice = (quantities) => {
        let total = 0;
        services.forEach(service => {
            if (selectedServices[service.name]) {
                total += (quantities[service.name] || 0) * service.price;
            }
        });
        setTotalPrice(total);
    };

    // Lógica para manejar el proceso de compra
    const handleBuy = () => {
        console.log("Procesando compra...");
        // Aquí podrías agregar la lógica de compra o redirigir a otra página
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
                    <h4>Total a pagar: {totalPrice} $</h4>
                    <button onClick={handleBuy} disabled={totalPrice === 0}>Pagar</button>
                </div>
            </div>
        </div>
    );
};

export default PlaceSelector;
