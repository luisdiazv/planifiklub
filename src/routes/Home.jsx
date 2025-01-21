import React from 'react';
import './HomeStyles.css'
import ImageSlider from '../Components/ImageSlider';
import logoRed from '../Components/imgs/LogoRed.png'
import image1 from '../Components/imgs/homeSliderImage1.jpg'
import image2 from '../Components/imgs/homeSliderImage2.jpg'
import image3 from '../Components/imgs/homeSliderImage3.jpg'
import contentImg1 from '../Components/imgs/homeSliderImage1.jpg'
import contentImg2 from '../Components/imgs/homeSliderImage1.jpg'

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

const Home = () => {
    return (
        <div className="home-Container">
            <ImageSlider images={images} />
            <div className="home-content">
                <div className="what-is-PK">
                    <h1>¿Qué es PlanifiKlub?</h1>
                    <p1>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p1>
                    <p1>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p1>
                </div>
                <div className='why-PK'>
                    <img className="home-image-content" alt="contentImg1" src={contentImg1} />
                    <div className="why-PK-content">
                        <h1>¿Por qué usar PlanifiKlub?</h1>
                        <p1>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p1>
                    </div>
                </div>

                <div className="how-PK">
                    <div className="content">
                        <h1>¿Cómo puedo probar PlanifiKlub?</h1>
                        <p1>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p1>
                    </div>
                    <img className="image-content" alt="contentImg2" src={contentImg2} />
                </div>
                <div className="demo-PK-container">
                    <button className="prove-PK">
                        Agendar una demo
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Home;