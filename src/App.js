import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar.jsx';
import Footer from './Components/footer.jsx';

import Home from './routes/Home.jsx';  // Asegúrate de que la importación sea correcta
import AboutUs from './routes/AboutUs.jsx';  // Asegúrate de que la importación sea correcta
import AboutPk from './routes/AboutPk.jsx';  // Asegúrate de que la importación sea correcta
import LogIn from './routes/LogIn.jsx';  // Asegúrate de que la importación sea correcta
import SignUp from './routes/SignUp.jsx';  // Asegúrate de que la importación sea correcta
import EditProfile from './routes/editProfile.jsx';
import Balanzadepagos from './routes/BalanzaDePagos.jsx';
import AppHome from './routes/AppHome.jsx';
import NotFound from './routes/NotFound.jsx';

import EventDetails from './routes/BalanzaDePagosContent/Event.jsx';
import ShowEvent from './routes/ShowEvent.jsx';

import CalendarioEventos from './routes/CalendarioEventos.jsx';

import ConfiguradorRoles from './routes/Service/RolesService.jsx';
import ChangePassword from './routes/changePassword.jsx';

function App() {
  return (
    <>

      <div className="App">
        <Navbar />
        <div className="App-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/app" element={<AppHome />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/AboutPk" element={<AboutPk />} />
              
            <Route path="evento/:id" element={<ShowEvent />} />  {/* Ruta para evento específico */}

            <Route path="/app/changePassword" element={<ChangePassword />} />  
            <Route path="/app/CalendarioEventos" element={<CalendarioEventos />} />
            <Route path="/app/LogIn" element={<LogIn />} />
            <Route path="/app/SignUp" element={<SignUp />} />
            <Route path="/app/EditProfile" element={<EditProfile />} />
            <Route path="/app/ShowEvent" element={<ShowEvent />} />
            <Route path="/app/RolesService" element={<ConfiguradorRoles />} />
            <Route path="/app/payment" element={<Balanzadepagos />} />
            <Route path="*" element={<NotFound />} />  {/* Ruta no encontrada */}

          </Routes>
        </div>
        <Footer />
      </div>

    </>



  );
}

export default App;
