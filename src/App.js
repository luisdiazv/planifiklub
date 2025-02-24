import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { getColors } from './Util/Colors.js';

// Componentes básicos
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/footer.jsx';

<<<<<<< HEAD
// Empresa
import Home from './routes/Home.jsx'; 
import AboutUs from './routes/AboutUs.jsx'; 
import AboutPk from './routes/AboutPk.jsx'; 
=======
//Empresa
import Home from './routes/Home.jsx';
import AboutUs from './routes/AboutUs.jsx';
import AboutPk from './routes/AboutPk.jsx';
>>>>>>> 95a67280a938ff9fb231bbc322fd949c2244d7f0

// App
import AppHome from './routes/AppHome.jsx';

<<<<<<< HEAD
// Manejo de usuarios
import LogIn from './routes/LogIn.jsx'; 
import SignUp from './routes/SignUp.jsx'; 
=======
//App manejo de usuarios
import LogIn from './routes/LogIn.jsx';
import SignUp from './routes/SignUp.jsx';
>>>>>>> 95a67280a938ff9fb231bbc322fd949c2244d7f0
import EditProfile from './routes/editProfile.jsx';
import ChangePassword from './routes/changePassword.jsx';

// Manejo de eventos
import Reservation from './routes/Reservation.jsx';
import ShowEvent from './routes/ShowEvent.jsx';
import CalendarioEventos from './routes/CalendarioEventos.jsx';

// Configuradores
import ConfiguradorPaginaClub from './routes/Service/ColorService.jsx';
import ConfiguradorRoles from './routes/Service/RolesService.jsx';
import ConfiguradorSocio from './routes/Service/MemberService.jsx';
import ConfiguradorProductos from './routes/Service/ProductosService.jsx';
import ConfiguradorEdificios from './routes/Service/EdificiosService.jsx';
import ConfiguradorMontajes from './routes/Service/MontajesService.jsx';
import ConfiguradorTipoEventos from './routes/Service/TipoEventoService.jsx';

<<<<<<< HEAD
// Ruta no encontrada
import NotFound from './routes/NotFound.jsx';

// Envolver la aplicación con el ClubInfoProvider
import { ClubInfoProvider } from './context/infoClubContext';
=======
//Ruta no encontrada
import NotFound from './routes/NotFound.jsx'; //404
import NotAuthorized from './routes/NotAuthorized.jsx';
//TODO SERGIO: No Autorizado <-- 502
>>>>>>> 95a67280a938ff9fb231bbc322fd949c2244d7f0

function App() {

  useEffect(() => {
    const colors = getColors();
    document.documentElement.style.setProperty('--container-color', colors[0]);
    document.documentElement.style.setProperty('--secondary-container-color', colors[1]);
    document.documentElement.style.setProperty('--text-color', colors[2]);
    document.documentElement.style.setProperty('--secondary-text-color', colors[3]);
    document.documentElement.style.setProperty('--button-color', colors[4]);
    document.documentElement.style.setProperty('--secondary-button-color', colors[5]);
    document.documentElement.style.setProperty('--background-color', colors[6]);
    document.documentElement.style.setProperty('--footer-color', colors[7]);
    document.documentElement.style.setProperty('--disabled-color', colors[8]);
  }, []);

  return (
    <ClubInfoProvider>
      <div className="App">
        <Navbar />
        <div className="App-container">
          <Routes>
            {/* Empresa */}
            <Route path="/" element={<Home />} />
            <Route path="/app" element={<AppHome />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/AboutPk" element={<AboutPk />} />

            {/* App */}
            <Route path="/app" element={<AppHome />} />

            {/* Manejo de usuarios */}
            <Route path="/app/LogIn" element={<LogIn />} />
            <Route path="/app/SignUp" element={<SignUp />} />
            <Route path="/app/EditProfile" element={<EditProfile />} />
            <Route path="/app/ChangePassword" element={<ChangePassword />} />

            {/* Manejo de eventos */}
            <Route path="/app/reservation" element={<Reservation />} />
            <Route path="/app/ShowEvent" element={<ShowEvent />} />
            <Route path="/app/CalendarioEventos" element={<CalendarioEventos />} />
            <Route path="/app/evento/:id" element={<ShowEvent />} />  {/* Ruta para evento específico */}

            {/* Configuradores */}
<<<<<<< HEAD
            <Route path="/app/rolesConfig" element={<ConfiguradorRoles />} /> {/* Solo Admin */}
            <Route path="/app/sociosConfig" element={<ConfiguradorSocio />} /> {/* Solo Admin */}
            <Route path="/app/productosConfig" element={<ConfiguradorProductos />} /> {/* Solo Admin */}
            <Route path="/app/edificiosConfig" element={<ConfiguradorEdificios />} /> {/* Solo Admin */}
            <Route path="/app/montajesConfig" element={<ConfiguradorMontajes />} /> {/* Solo Admin */}
            <Route path="/app/pageConfig" element={<ConfiguradorPaginaClub />} /> {/* Solo Admin */}

            {/* Ruta no encontrada */}
            <Route path="*" element={<NotFound />} />
=======
            <Route path="/app/rolesConfig" element={<ConfiguradorRoles />} /> {/*Solo Admin */}
            <Route path="/app/sociosConfig" element={<ConfiguradorSocio />} /> {/*Solo Admin */}
            <Route path="/app/productosConfig" element={<ConfiguradorProductos />} /> {/*Solo Admin */}
            <Route path="/app/edificiosConfig" element={<ConfiguradorEdificios />} /> {/*Solo Admin */}
            <Route path="/app/montajesConfig" element={<ConfiguradorMontajes />} /> {/*Solo Admin */}
            <Route path="/app/tiposeventoConfig" element={<ConfiguradorTipoEventos />} /> {/*Solo Admin */}

            {/* Ruta no encontrada */}
            <Route path="*" element={<NotFound />} />

>>>>>>> 95a67280a938ff9fb231bbc322fd949c2244d7f0
          </Routes>
        </div>
        <Footer />
      </div>
    </ClubInfoProvider>
  );
}

export default App;
