import React from 'react';
import './HomeStyles.css'
import ImageSlider from '../Components/ImageSlider';
import logoRed from '../Components/imgs/LogoRed.png'
import image1 from '../Components/imgs/homeSliderImage1.jpg'
import image2 from '../Components/imgs/homeSliderImage2.jpg'
import image3 from '../Components/imgs/homeSliderImage3.jpg'
import contentImg1 from '../Components/imgs/homeSliderImage1.jpg'
//import contentImg2 from '../Components/imgs/homeSliderImage1.jpg'

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
                    <p1>
                        PlanifiKlub es una plataforma de gestión de eventos diseñada 
                        específicamente para clubes campestres. Ofrecemos una solución 
                        optimizada que mejora la experiencia de los socios al permitirles 
                        organizar sus eventos de manera sencilla y personalizada. Al mismo 
                        tiempo, brindamos a los administrativos herramientas para coordinar 
                        eficientemente cada detalle, asegurando que el evento se desarrolle 
                        sin contratiempos y cumpla con las expectativas del socio.
                    </p1>
                    <p1>
                        Con PlanifiKlub, los clubes pueden enfocarse en lo que realmente 
                        importa: ofrecer experiencias excepcionales a sus socios, mientras 
                        nosotros nos encargamos de optimizar el proceso de reserva y gestión 
                        de eventos.
                    </p1>
                </div>
                <div className='why-PK'>
                    <img className="home-image-content" alt="contentImg1" src={contentImg1} />
                    <div className="why-PK-content">
                        <h1>¿Por qué usar PlanifiKlub?</h1>
                        <p1>
                            <strong>Especialización en Clubes Campestres:</strong>  
                            PlanifiKlub está diseñado para satisfacer las necesidades únicas 
                            de los clubes campestres, ofreciendo funcionalidades específicas 
                            como la reserva de instalaciones y la personalización detallada 
                            de eventos.
                        </p1>
                        <p1>
                            <strong>Eficiencia y Optimización:</strong>  
                            Simplificamos los procesos de reserva y gestión, eliminando 
                            tareas manuales que consumen tiempo y son propensas a errores, 
                            asegurando una operación más ágil y efectiva.
                        </p1>
                        <p1>
                            <strong>Mejor Experiencia para los Socios:</strong>  
                            Los socios disfrutan de una experiencia más personalizada y 
                            sencilla al organizar sus eventos, con opciones para ajustar 
                            cada detalle y recibir un servicio de alta calidad que supera 
                            sus expectativas.
                        </p1>
                        <p1>
                            <strong>Facilidad para el Personal Administrativo:</strong>  
                            El equipo administrativo puede gestionar eventos de manera más 
                            eficiente, accediendo a información clave en tiempo real para 
                            garantizar una ejecución impecable en cada ocasión.
                        </p1>
                    </div>
                </div>

                {/*
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
                */}

            </div>
        </div>
    );
};

export default Home;