import React, { useState, useEffect } from "react";
import './ImageSliderStyles.css';

const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Cambiar imagen automáticamente cada 10 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval); // Limpiar intervalo al desmontar el componente
    }, [images.length]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="slider">
            <div className="slider-container">
                <div className="slider-image-container">
                    <img
                        src={images[currentIndex].url}
                        alt={`Slide ${currentIndex}`}
                        className={images[currentIndex].cn}
                    />
                    <div className="image-description">
                        <p>{images[currentIndex].description}</p>
                    </div>
                </div>
            </div>
            <button className="slider-button left" onClick={handlePrevious}>
                <i class="fa-solid fa-left-long"></i>
            </button>

            <button className="slider-button right" onClick={handleNext}>
                <i class="fa-solid fa-right-long"></i>
            </button>
            <div className="slider-indicators">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`indicator ${index === currentIndex ? "active" : ""}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;