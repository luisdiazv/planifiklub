import React, { useState } from "react";
import './BalanzaDePagosStyles.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";

const Balanzadepagos = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [serviceQuantities, setServiceQuantities] = useState({});

    // Lista de servicios con nombre y precio
    const services = [
        { name: "Servicio 1", price: 50000 },
        { name: "Servicio 2", price: 30000 },
        { name: "Servicio 3", price: 20000 },
    ];

    initMercadoPago('APP_USR-559230ce-2f09-4179-959c-855f9d01f382', {
        locale: "es-CO"
    });

    const createPreference = async () => {
        try {
            const totalPrice = Object.keys(serviceQuantities).reduce((sum, serviceName) => {
                const quantity = serviceQuantities[serviceName];
                const service = services.find(s => s.name === serviceName);
                return sum + (service.price * quantity);
            }, 0);

            const response = await axios.post("https://pk-mercadopagoserver.onrender.com/create_preference", {
                title: "Reserva de evento",
                quantity: 1,
                price: totalPrice,  // Verifica que el precio total sea correcto
            });

            console.log("Respuesta del servidor:", response.data);
            const { id } = response.data;
            return id;
        } catch (error) {
            console.error("Error al crear la preferencia:", error);
        }
    };


    const handleBuy = async () => {
        const id = await createPreference();
        console.log(id)
        if (id) {
            setPreferenceId(id);  // Setea el ID de la preferencia si se recibe correctamente
        }
    };

    const handleQuantityChange = (serviceName, quantity) => {
        if (quantity < 0) return; // No permitir cantidades negativas
        setServiceQuantities({
            ...serviceQuantities,
            [serviceName]: quantity,
        });
    };

    // Calcula el total sumando los servicios seleccionados con la cantidad especificada
    const totalPrice = Object.keys(serviceQuantities).reduce((sum, serviceName) => {
        const quantity = serviceQuantities[serviceName];
        const service = services.find(s => s.name === serviceName);
        return sum + (service.price * quantity);
    }, 0);

    return (
        <div className="card-product-container">
            <div className="card-product">
                <div className="card">
                    <h3>Servicios disponibles</h3>
                    <ul>
                        {services.map((service, index) => (
                            <li key={index}>
                                <label>
                                    {service.name} - {service.price} $
                                    <input
                                        type="number"
                                        min="0"
                                        value={serviceQuantities[service.name] || 0}
                                        onChange={(e) => handleQuantityChange(service.name, parseInt(e.target.value))}
                                    />
                                </label>
                            </li>
                        ))}
                    </ul>
                    <h4>Total a pagar: {totalPrice} $</h4>
                    <button onClick={handleBuy} disabled={totalPrice === 0}>Pagar</button>
                    {preferenceId && (
                        <Wallet
                            initialization={{ preferenceId, redirectMode: "modal" }}
                            customization={{ texts: { valueProp: 'smart_option' } }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Balanzadepagos;
