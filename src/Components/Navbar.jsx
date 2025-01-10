import { Component } from "react";
import "./NavbarStyles.css";
import { MenuItems } from "./NBMenuItems";
import { Link } from 'react-router-dom';
import logo from './imgs/LogoGolden.gif';

class Navbar extends Component {
    render() {
        return (
            <nav className="NavbarItems">
                <Link className="nav-link-logo" to="/">
                    <div className="logoContainer">
                        <img src={logo} alt="Logo" />
                        <h1 className="navbar-logo">PlanifiKlub</h1>
                    </div>
                </Link>
                <div className="menu-icons">
                </div>
                <ul className="nav-menu">
                    {MenuItems.map((item, index) => {
                        if (index === 3) {
                            return (
                                <li key={index}>
                                    {/* Envolver el botón con el Link */}
                                    <Link to={item.url} style={{ textDecoration: "none" }}>
                                        <button className={item.cName}>
                                            {item.title}
                                        </button>
                                    </Link>
                                </li>
                            );
                        }
                        return (
                            <li key={index}>
                                <Link className={item.cName} to={item.url}>
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }
}

export default Navbar;
