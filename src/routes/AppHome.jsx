import React, { useContext, useEffect, useState } from 'react';
import './HomeStyles.css';
import { ClubInfoContext } from '../context/infoClubContext';

const AppHome = () => {
  const { logo, clubName, clubDesc } = useContext(ClubInfoContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log('Datos del club en AppHome:', { logo, clubName });
    const user = sessionStorage.getItem('currentUser');
    setIsLoggedIn(!!user);
  }, [logo, clubName]);

  return (
    <div className="app-home-container">
      <div className="logo-container">
        {logo && <img src={logo} alt="Logo Club" className="club-logo" />}
      </div>
      <div className="club-info">
        <h1>{clubName}</h1>
        <p>{clubDesc}</p>
      </div>
      <div className="buttons-container">
        {!isLoggedIn ? (
          <>
            <button className="btn ingresar">Ingresar</button>
            <button className="btn registrarse">Registrarse</button>
          </>
        ) : (
          <button className="btn reservar">Reservar</button>
        )}
      </div>
    </div>
  );
};

export default AppHome;
