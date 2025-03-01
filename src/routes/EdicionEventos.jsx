import React, { useState, useRef, useEffect } from "react";
import './ReservationStyles.css';
import { useParams } from 'react-router-dom';
import { sections } from "./EdicionEventosSection.jsx";
import { handleAcceso } from "../Util/AccessControl";

const EdicionEventos = () => {
    const { id } = useParams(); // Obtener el id de la URL
    const [activeSection, setActiveSection] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
            const verificarAcceso = async () => {
                const acceso = await handleAcceso(2);
                // Si no hay acceso, se asume que handleAcceso redirige a /404
                if (!acceso) {
                    return;
                }
            };
            verificarAcceso();
        }, []);

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
        if (activeSection < sections(id, handleNext).length - 1) {
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
                            style={{ width: `${(activeSection / (sections(id, handleNext).length - 1)) * 100}%` }}
                        />
                    </div>
                    <div className="timeline-points">
                        {sections(id, handleNext).map((section, index) => (
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
                    <button type="button" id="prevScreenSlider" onClick={handlePrev} disabled={activeSection === 0}>
                        Anterior
                    </button>
                    <button type="button" id="nextScreenSlider" onClick={handleNext} disabled={activeSection === sections.length - 1} hidden>
                        Siguiente
                    </button>
                </div>

                {/* Contenedor del slider, se muestra únicamente la sección activa */}
                <div ref={sliderRef} className="ServicesSlider">
                    {sections(id, handleNext).map((section, index) => (
                        <div key={index} className={`section ${activeSection === index ? '' : 'hidden'}`}>
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