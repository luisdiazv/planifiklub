import React, { useState, useRef } from "react";
import './BalanzaDePagosStyles.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { sections } from "./BalanzaDePagosSection.jsx";

const Balanzadepagos = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [serviceQuantities, setServiceQuantities] = useState({});
    const [activeSection, setActiveSection] = useState(0);

    // Referencia al contenedor de las secciones para el deslizamiento
    const sliderRef = useRef(null);

    // Lista de servicios con nombre y precio
    const services = [
        { name: "Servicio 1", price: 50000 },
        { name: "Servicio 2", price: 30000 },
        { name: "Servicio 3", price: 20000 },
    ];

    // Inicialización de MercadoPago
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

            const request =  "https://" + process.env.REACT_APP_MERCADOPAGO_API_URL + "/create_preference";

            const response = await axios.post(request, {
                title: "Reserva de evento",
                quantity: 1,
                price: totalPrice,
            });

            //console.log("Respuesta del servidor:", response.data);
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

    // Función para manejar la selección de las secciones de la línea del tiempo
    const handleSectionClick = (index) => {
        setActiveSection(index);
        sliderRef.current.scrollTo({
            left: index * sliderRef.current.offsetWidth,
            behavior: "smooth",
        });
    };

    // Función para mover el timeline hacia la derecha
    const handleNext = () => {
        if (activeSection < sections.length - 1) {
            setActiveSection(prev => prev + 1);
            sliderRef.current.scrollTo({
                left: (activeSection + 1) * sliderRef.current.offsetWidth,
                behavior: "smooth",
            });
        }
    };

    // Función para mover el timeline hacia la izquierda
    const handlePrev = () => {
        if (activeSection > 0) {
            setActiveSection(prev => prev - 1);
            sliderRef.current.scrollTo({
                left: (activeSection - 1) * sliderRef.current.offsetWidth,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="balanza-pagos-container">
            {/* Línea del Tiempo */}
            <div className="timeline-container">
                <div className="timeline">
                    {/* Línea conectando los puntos */}
                    <div className="timeline-line">
                        <div
                            className="timeline-progress"
                            style={{ width: `${(activeSection / (sections.length - 1)) * 100}%` }}
                        />
                    </div>
                    <div className="timeline-points">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className={`timeline-point ${activeSection === index ? "active" : ""}`}
                                onClick={() => handleSectionClick(index)}
                            >
                                <div className="circle" />
                                <span>{section.title}</span>
                            </div>
                        ))}
                    </div>
                </div>



                <div
                    ref={sliderRef}
                    className="ServicesSlider"
                >
                    {sections.map((section, index) => (
                        <div key={index} className="section">
                            <h2>{section.title}</h2>
                            <p>{section.description}</p>

                            <>{section.content}</>

                            {/* Mostrar el bloque extra solo si es el último elemento */}
                            {index === sections.length - 1 && (
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
                            )}
                        </div>
                    ))}
                </div>
                {/* Botones de Navegación */}
                <div className="navigation-buttons">
                    {/* Botón de mover hacia la izquierda */}
                    <button
                        onClick={handlePrev}
                        disabled={activeSection === 0}  // Deshabilitado si está en el primer timeline
                    >
                        Anterior
                    </button>

                    {/* Botón de mover hacia la derecha */}
                    <button
                        onClick={handleNext}
                        disabled={activeSection === sections.length - 1}  // Deshabilitado si está en el último timeline
                    >
                        Siguiente
                    </button>
                </div>
            </div>



            {/* Formulario de Pago */}
        </div>
    );
};

export default Balanzadepagos;
