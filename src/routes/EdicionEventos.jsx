import React, { useState, useRef } from "react";
import './ReservationStyles.css';
import { useLocation } from 'react-router-dom';
import { sections } from "./EdicionEventosSection.jsx";

const EdicionEventos = () => {
    const [activeSection, setActiveSection] = useState(0);
    const location = useLocation();
    const { idevento, estado } = location.state || {};

    const sliderRef = useRef(null);
    
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
                                onClick={() => handleSectionClick(index)}
                            >
                                <div className="circle" />
                                <span>{section.title}</span>
                            </div>
                        ))}
                    </div>
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



                <div
                    ref={sliderRef}
                    className="ServicesSlider"
                >
                    {sections.map((section, index) => (
                        <div key={index} className="section">
                            <h2>{section.title}</h2>
                            <p>{section.description}</p>

                            <>{section.content}</>
                        </div>
                    ))}
                </div>

            </div>



            {/* Formulario de Pago */}
        </div>
    );
};

export default EdicionEventos;
