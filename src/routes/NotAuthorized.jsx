import './NotFoundStyles.css';
import { Link } from 'react-router-dom';

function NotAuthorized() {
    return (
        <div className='error-container'>
            <div>
                <h2> error 502: error de autorización</h2>
                <Link to="/">
                    <button>
                        Volver al inicio
                    </button>
                </Link>
            </div>

        </div>
    );
}

export default NotAuthorized;
