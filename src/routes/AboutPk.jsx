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

                </div>
                <img className="image" alt="VisionImg" src={LogoRed} />
            </div>
        </>
    )


}
export default AboutPk;