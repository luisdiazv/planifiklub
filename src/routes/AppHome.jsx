import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppHomeStyles.css';
import { ClubInfoContext } from '../context/infoClubContext';

const AppHome = () => {
  const { logo, clubName, clubDesc } = useContext(ClubInfoContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    const user = sessionStorage.getItem('currentUser');
    setIsLoggedIn(!!user);
  }, [logo, clubName]);

  const handleIngresar = () => {
    navigate('/app/LogIn');
  };

  const handleRegistrarse = () => {
    navigate('/app/SignUp');
  };

  const handleReservar = () => {
    navigate('/app/reservation');
  };

  return (
    <div className="app-home-container">
      <div className="logo-container">
        {logo && <img src={logo} alt="Logo Club" className="club-logo" />}
      </div>
      <div className="app-home-content">
        <div className="club-info">
          <h1>{clubName}</h1>
          <p>{clubDesc}</p>
        </div>
        <div className="buttons-container">
          {!isLoggedIn ? (
            <>
              <button className="btn ingresar" onClick={handleIngresar}>Ingresar</button>
              <button className="btn registrarse" onClick={handleRegistrarse}>Registrarse</button>
            </>
          ) : (
            <button className="btn reservar" onClick={handleReservar}>Reservar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppHome;
