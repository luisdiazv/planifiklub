import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar.jsx';
import Footer from './Components/footer.jsx';

import Home from './routes/Home.jsx';
import AboutUs from './routes/AboutUs.jsx';
import AboutPk from './routes/AboutPk.jsx';
import LogIn from './routes/LogIn.jsx';
import SignUp from './routes/SignUp.jsx';
import EditProfile from './routes/editProfile.jsx';
import NotFound from './routes/NotFound.jsx';

function App() {

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
            <Route path="*" element={<NotFound />} />  {/* Ruta no encontrada */}
          </Routes>
        </div>
        <Footer />
      </div>

    </>

  );
}

export default App;