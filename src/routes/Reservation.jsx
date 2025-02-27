import React, { useState, useRef } from "react";
import './ReservationStyles.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "axios";
import { sections } from "./ReservationSection.jsx";

const Reservation = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [serviceQuantities, setServiceQuantities] = useState({});
    const [activeSection, setActiveSection] = useState(0);

    // Referencia al contenedor de las secciones para el deslizamiento
    const sliderRef = useRef(null);

    /*
    // Código para servicios y MercadoPago (comentado)
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

            const request =  "https://" + process.env.REACT_APP_MERCADOPAGO_API_URL + "/create_preference";

            const response = await axios.post(request, {
                title: "Reserva de evento",
                quantity: 1,
                price: totalPrice,
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
            setPreferenceId(id);
        }
    };

    const handleQuantityChange = (serviceName, quantity) => {
        if (quantity < 0) return;
        setServiceQuantities({
            ...serviceQuantities,
            [serviceName]: quantity,
        });
    };

    const totalPrice = Object.keys(serviceQuantities).reduce((sum, serviceName) => {
        const quantity = serviceQuantities[serviceName];
        const service = services.find(s => s.name === serviceName);
        return sum + (service.price * quantity);
    }, 0);
    */

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
                                className={`timeline-point ${index < activeSection ? "completed" : ""} ${activeSection === index ? "active" : ""}`}
                            // onClick={() => handleSectionClick(index)}
                            >
                                <div className="circle" />
                                <span>{section.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Botones de Navegación */}
                <div className="navigation-buttons">
                    <button type="button" id="prevScreenSlider" onClick={handlePrev} disabled={activeSection === 0}>
                        Anterior
                    </button>
                    <button type="button" id="nextScreenSlider" onClick={handleNext} disabled={activeSection === sections.length - 1} hidden>
                        Siguiente
                    </button>
                </div>

                {/* Contenedor del slider, se muestra únicamente la sección activa */}
                <div ref={sliderRef} className="ServicesSlider">
                    {sections.map((section, index) => (
                        <div key={index} className={`section ${activeSection === index ? '' : 'hidden'}`}>
                            <h2>{section.title}</h2>
                            <p>{section.description}</p>
                            {section.content}
                        </div>
                    ))}
                </div>
            </div>

            {/* Formulario de Pago */}
        </div>
    );
};

export default Reservation;
