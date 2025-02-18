import './App.css';
import { Routes, Route } from 'react-router-dom';

//Componentes basicos
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/footer.jsx';

//Empresa
import Home from './routes/Home.jsx'; 
import AboutUs from './routes/AboutUs.jsx'; 
import AboutPk from './routes/AboutPk.jsx'; 

//App
import AppHome from './routes/AppHome.jsx';

//App manejo de usuarios
import LogIn from './routes/LogIn.jsx'; 
import SignUp from './routes/SignUp.jsx'; 
import EditProfile from './routes/editProfile.jsx';
import ChangePassword from './routes/changePassword.jsx';

// Manejo de eventos
import Reservation from './routes/Reservation.jsx';
import ShowEvent from './routes/ShowEvent.jsx';
import CalendarioEventos from './routes/CalendarioEventos.jsx';

//Configuradores
import ConfiguradorRoles from './routes/Service/RolesService.jsx';
import ConfiguradorSocio from './routes/Service/MemberService.jsx';
import ConfiguradorProductos from './routes/Service/ProductosService.jsx';

//Ruta no encontrada
import NotFound from './routes/NotFound.jsx';

function App() {
  return (
    <>
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
            <Route path="/app/RolesService" element={<ConfiguradorRoles />} /> {/*Solo Admin */}
            <Route path="/app/SociosService" element={<ConfiguradorSocio />} /> {/*Solo Admin */}
            <Route path="/app/ProductosService" element={<ConfiguradorProductos />} /> {/*Solo Admin */}

            {/* Ruta no encontrada */}
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
