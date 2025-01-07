import './App.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

import Navbar from './Components/Navbar.jsx';

import Home from './routes/Home.jsx';  // Asegúrate de que la importación sea correcta
import AboutUs from './routes/AboutUs.jsx';  // Asegúrate de que la importación sea correcta
import AboutPk from './routes/AboutPk.jsx';  // Asegúrate de que la importación sea correcta
import LogIn from './routes/LogIn.jsx';  // Asegúrate de que la importación sea correcta
import SignUp from './routes/SignUp.jsx';  // Asegúrate de que la importación sea correcta

import NotFound from './routes/NotFound.jsx';  // Asegúrate de que la importación sea correcta

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/AboutPk" element={<AboutPk />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />  {/* Ruta no encontrada */}
      </Routes>
    </div>
  );
}

export default App;
