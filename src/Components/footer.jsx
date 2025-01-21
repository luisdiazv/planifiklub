import React from "react";
import "./footerStyles.css";
import { Link } from "react-router-dom";
import logo from "./imgs/LogoGolden.gif";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="bottom">
                    <div className="resp-footer1">
                        <div className="top">
                            <div>
                                <Link className="nav-link-logo" to="/">
                                    <div className="logoContainer">
                                        <img src={logo} alt="Logo" />
                                    </div>
                                </Link>

                            </div>
                            {/* <div className="User-Manual" >
                            <p1>
                                <Link to="https://seen-ear-f66.notion.site/Manual-de-usuario-Compostify-13ee1dfa63fe406b877961e63e50c8dd?pvs=4" target="_blank" rel="noopener noreferrer" onClick={() => setTermsAccepted(true)}>
                                    Manual de usuario
                                </Link>
                            </p1>
                        </div> */}
                            {/* <div className="User-Manual" >
                            <p1>
                                <Link to="https://seen-ear-f66.notion.site/Manual-t-cnico-Compostify-a845c8fe673b4ecca1cbdbce83ef30c4?pvs=4" target="_blank" rel="noopener noreferrer" onClick={() => setTermsAccepted(true)}>
                                    Manual Técnico
                                </Link>
                            </p1>
                        </div> */}

                        </div>
                    </div>

                    <div className="our-socials">
                        <div className="footer-columns">
                            <div>
                                <h1>Nuestras Redes: </h1>
                                <div className="social-links">
                                    {/* <Link to="https://www.instagram.com/compostify_col/" target="_blank" rel="noopener noreferrer">
                                        <i className="fa-brands fa-square-instagram"></i>
                                    </Link>
                                    <Link to="https://www.facebook.com/profile.php?id=61560271725752" target="_blank" rel="noopener noreferrer">
                                        <i class="fa-brands fa-square-facebook"></i>
                                    </Link> */}

                                    <Link to="https://github.com/luisdiazv/planifiklub/tree/deploy" target="_blank" rel="noopener noreferrer">
                                        <i className="fa-brands fa-square-github"></i>
                                    </Link>

                                </div>
                            </div>
                            <div style={{ textAlign: 'end' }}>
                                <h1>Contáctanos: </h1>
                                <div className="mails">
                                    <Link to="mailto:ludiazv@unal.edu.co" target="_blank" rel="noopener noreferrer">
                                        <i class="fa-solid fa-chevron-right"></i>
                                        <p1>Luis Alfonso Diaz Vergel</p1>
                                    </Link>
                                    <Link to="mailto:mjarah@unal.edu.co" target="_blank" rel="noopener noreferrer">
                                        <i class="fa-solid fa-chevron-right"></i>
                                        <p1>Maria Jose Jara Herrera</p1>
                                    </Link>
                                    <Link to="mailto:jsochoac@unal.edu.co" target="_blank" rel="noopener noreferrer">
                                        <i class="fa-solid fa-chevron-right"></i>
                                        <p1>Jonathan Steven Ochoa Celis</p1>
                                    </Link>
                                    <Link to="mailto:saparadaa@unal.edu.co" target="_blank" rel="noopener noreferrer">
                                        <i class="fa-solid fa-chevron-right"></i>
                                        <p1>Sergio Parada</p1>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Footer;