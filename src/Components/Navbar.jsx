import React, { Component, createRef } from "react";
import "./NavbarStyles.css";
import { MenuItems } from "./NBMenuItems";
import { Link } from 'react-router-dom';
import logo from './imgs/LogoGolden.gif';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownVisible: false, // Controla la visibilidad del menú desplegable
        };
        this.menuRef = createRef(); // Referencia al menú desplegable
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        // Cierra el menú si el clic ocurre fuera de este
        if (this.menuRef.current && !this.menuRef.current.contains(event.target)) {
            this.setState({ isDropdownVisible: false });
        }
    };

    toggleDropdown = () => {
        this.setState(prevState => ({
            isDropdownVisible: !prevState.isDropdownVisible,
        }));
    };

    closeDropdown = () => {
        this.setState({ isDropdownVisible: false });
    };

    render() {
        const { isDropdownVisible } = this.state;

        return (
            <nav className="NavbarItems">
                <Link className="nav-link-logo" to="/" onClick={this.closeDropdown}>
                    <div className="logoContainer">
                        <img src={logo} alt="Logo" />
                        <h1 className="navbar-logo">PlanifiKlub</h1>
                    </div>
                </Link>
                <div className="menu-icons"></div>
                <ul className="nav-menu">
                    {MenuItems.map((item, index) => {
                        if (index === 3) {
                            return (
                                <li key={index}>
                                    <Link
                                        to={item.url}
                                        style={{ textDecoration: "none" }}
                                        onClick={this.closeDropdown}
                                    >
                                        <button className={item.cName}>
                                            {item.title}
                                        </button>
                                    </Link>
                                </li>
                            );
                        }
                        return (
                            <li key={index}>
                                <Link
                                    className={item.cName}
                                    to={item.url}
                                    onClick={this.closeDropdown}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })}
                    <div className="user-menu-container" ref={this.menuRef}>
                        <button
                            className={`user-button-menu ${isDropdownVisible ? "active" : ""}`}
                            onClick={this.toggleDropdown}
                        >
                            <i className="fa-solid fa-circle-user"></i>
                        </button>
                        {isDropdownVisible && (
                            <div className="dropdown-menu">
                                <Link
                                    to="/editProfile"
                                    className="dropdown-item"
                                    onClick={this.closeDropdown}
                                >
                                    Configuración
                                </Link>
                                <Link
                                    to="/logout"
                                    className="dropdown-item"
                                    onClick={this.closeDropdown}
                                >
                                    Cerrar sesión
                                </Link>
                            </div>
                        )}
                    </div>
                </ul>
            </nav>
        );
    }
}

export default Navbar;
