import React from 'react';
import './HomeStyles.css'
import ImageSlider from '../Components/ImageSlider';
import logoRed from '../Components/imgs/LogoRed.png'
import image1 from '../Components/imgs/homeSliderImage1.jpg'
import image2 from '../Components/imgs/homeSliderImage2.jpg'
import image3 from '../Components/imgs/homeSliderImage3.jpg'
import contentImg1 from '../Components/imgs/why.jpeg'

const images = [
    {
        url: logoRed,
        description: "Optimiza las reservas de tu club privado de manera simple y eficiente.",
        cn: "logo-image"
    },
    {
        url: image1,
        description: "Centralizamos y gestionamos toda la reserva de eventos en clubes campestres, facilitando la planificación y coordinación.",
        cn: "slider-image"
    },
    {
        url: image2,
        description: "Facilitamos la organización de eventos de forma rápida y sencilla.",
        cn: "slider-image"
    },
    {
        url: image3,
        description: "Digitalizamos y simplificamos la gestión operativa, concentrando en un solo lugar toda la información de logística de eventos.",
        cn: "slider-image"
    }
];

const AppHome = () => {
    return (
        <div className="app-home-Container">
            <p>APP HOME</p>
        </div>
    );
};

export default AppHome;