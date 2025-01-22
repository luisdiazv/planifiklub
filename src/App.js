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
import NotFound from './routes/NotFound.jsx';

function App() {
  //Prueba balanza de pagos con mercadopago. Para realizar la prueba es necesario comentar la segunda
  //funcion return y descomentar la primera
  /*
  return(
    <>
    <Balanzadepagos />
    </>
  )
} */

  return (
        <>

      <div className="App">
        <Navbar />
        <div className="App-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/AboutPk" element={<AboutPk />} />
            <Route path="/LogIn" element={<LogIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/EditProfile" element={<EditProfile />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />  {/* Ruta no encontrada */}

            <Route path="/payment" element={<Balanzadepagos />} />*/
          </Routes>
        </div>
        <Footer />
      </div>

    </>
    


  );
}

export default App;