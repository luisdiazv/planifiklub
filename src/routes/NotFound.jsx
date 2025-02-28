import './NotFoundStyles.css';
import errorImg from '../Components/imgs/error404.png';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className='error-container'>
            <img src={errorImg} alt="Error 404" className="error-image" />
            <div>
                <h2>Parces que estás perdido, esta página no existe</h2>
                <Link to="/">
                    <button>
                        Volver al inicio
                    </button>
                </Link>
            </div>

        </div>
    );
}

export default NotFound;
