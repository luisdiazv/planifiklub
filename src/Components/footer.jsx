import React from "react";
import "./footerStyles-PK.css";
import { Link } from "react-router-dom";
import logo from "./imgs/LogoGolden.gif";

const Footer = () => {
    const email = process.env.REACT_APP_EMAIL_ACTIVO;
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="bottom">
                    <div className="resp-footer1">
                        <div className="top">
                            <div className="top-logo">
                            <div
                            className="footer-link-logo"
                            onClick={() => {
                                window.location.href = "/";
                            }}
                            style={{ cursor: "pointer" }}
                            >
                            <div className="logoContainer">
                                <img src={logo} alt="Logo" />
                            </div>
                            </div>

                            </div>
                            <div className="User-Manual" >
                                <p1>
                                    <Link to="https://docs.google.com/document/d/1n4JS3Ke9gTIIR-10sE-4V9YJec0WZIC2al5KvctchUI/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                                        Manual de usuario
                                    </Link>
                                </p1>
                                <p1 hidden>
                                    <Link to="https://docs.google.com/document/d/1MvUpBaPm59VxERRFsAt8oHMgo0Podxdf8UvQZuP3s0k/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                                        Manual Técnico
                                    </Link>
                                </p1>
                            </div>

                        </div>
                    </div>

                    <div className="our-socials">
                        <div className="footer-columns">
                            <div>
                                <h2>Nuestras Redes: </h2>
                                <div className="social-links">
                                    <Link to="https://github.com/luisdiazv/planifiklub/tree/deploy" target="_blank" rel="noopener noreferrer">
                                        <i className="fa-brands fa-square-github"></i>
                                    </Link>
                                    <Link to="https://www.instagram.com/planifiklub/" target="_blank" rel="noopener noreferrer">
                                        <i class="fa-brands fa-square-instagram"></i>
                                    </Link>
                                    <Link to="https://x.com/PlanifiKlub" target="_blank" rel="noopener noreferrer">
                                        <i class="fa-brands fa-square-x-twitter"></i>
                                    </Link>
                                    <Link to="https://www.facebook.com/profile.php?id=61573060075793" target="_blank" rel="noopener noreferrer">
                                        <i class="fa-brands fa-square-facebook"></i>
                                    </Link>
                                </div>
                            </div>
                            <div style={{ textAlign: 'end' }}>
                                <h2>Contáctanos: </h2>
                                <div className="mails">
                                    <p1>
                                        <Link to={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
                                            PlanifiKlub
                                        </Link>
                                    </p1>
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