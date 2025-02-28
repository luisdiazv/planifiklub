import './AboutPkStyles.css';
import LogoRed from '../../src/Components/imgs/LogoRed.png';


function AboutPk() {
    return (
        <>
            <h1 className='catchphrase'>"Simplificando gestión, potenciando experiencias."</h1>
            <div className="separator"></div>
            <div className="About-PK-content">
                <div className="textContent">
                    <div>
                        <h2 className='title'>Nuestra Visión</h2>
                        <p className='text'>En 2030 seremos la solución tecnológica consolidada, de la gestión
                            de eventos en los clubes campestres, siendo conocidos por nuestra capacidad de
                            creación, excelencia y mejora del servicio ofertado
                            por parte de nuestros clientes.  </p>
                    </div>
                    <div>
                        <h2 className='title'>Nuestra Misión</h2>
                        <p className='text'>Impulsar la mejora en la gestión de los eventos de los clubes
                            campestres, al proveer las funciones de nuestro sitio web para que
                            puedan tener una mejor organización de sus instalaciones y recursos,
                            generando así una mayor satisfacción en los clientes de los clubes.</p>
                    </div>
                    <div>
                        <h2 className='title'>Nuestra Propuesta</h2>
                        <p className='text'>Centralizamos y gestionamos toda la reserva de eventos en clubes 
                            campestres, facilitando la planificación y coordinación. Mejoramos la experiencia 
                            de los socios y posicionamos al club como un referente moderno y eficiente.</p>
                    </div>
                    <div>
                        <h2 className='title'>Nuestros Valores</h2>
                        <p className='text'>El <b>compromiso</b> es la base de nuestro trabajo; actuamos con pasión y 
                            responsabilidad, cumpliendo nuestras promesas y dando siempre lo mejor de nosotros. 
                            Nos <b>enfocamos en resultados</b>, buscando soluciones concretas y midiendo el éxito por
                            los logros alcanzados, adaptándonos estratégicamente a los desafíos. 
                            La <b>determinación</b>  nos impulsa a superar obstáculos con perseverancia y valentía, 
                            viéndolos como oportunidades para crecer y avanzar hacia nuestras metas.</p>
                    </div>
                </div>
                <img className="image" alt="VisionImg" src={LogoRed} />
            </div>
        </>
    )


}
export default AboutPk;