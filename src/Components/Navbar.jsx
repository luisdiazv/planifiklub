import React, { Component, createRef } from "react";
import "./NavbarStyles.css";
import { MenuItems, dropdownOptions } from "./NBMenuItems";
import { Link } from "react-router-dom";
import logo from "./imgs/LogoGolden.gif";
import userControl from "../Util/UserControl"; // Importa userControl

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownVisible: false, // Controla la visibilidad del menú desplegable
            currentUser: null, // Estado para el usuario actual
        };
        this.menuRef = createRef(); // Referencia al menú desplegable
    }

    async componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);

        // Verifica el usuario al montar
        const user = localStorage.getItem("currentUser");
        if (user) {
            this.setState({ currentUser: user });
        }

        // Escucha cambios en el usuario
        window.addEventListener("userChanged", this.updateCurrentUser);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
        window.removeEventListener("userChanged", this.updateCurrentUser);
    }

    updateCurrentUser = async () => {
        const user = userControl.getCurrentUser();
        this.setState({ currentUser: user });
    };

    handleClickOutside = (event) => {
        // Cierra el menú si el clic ocurre fuera de este
        if (this.menuRef.current && !this.menuRef.current.contains(event.target)) {
            this.setState({ isDropdownVisible: false });
        }
    };

    toggleDropdown = () => {
        this.setState((prevState) => ({
            isDropdownVisible: !prevState.isDropdownVisible,
        }));
    };

    closeDropdown = () => {
        this.setState({ isDropdownVisible: false });
    };

    handleLogout = () => {
        // Limpiar el usuario en userControl
        userControl.Logout();
        // Limpiar el estado local
        this.setState({ currentUser: null });

        // Redirigir a la página de inicio de sesión
        window.location.href = "/login";
    };

    render() {
        const { isDropdownVisible, currentUser } = this.state;

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
                            if (currentUser !== null) {
                                // Mostrar este enlace solo si el usuario está autenticado
                                return null;
                            }
                            return (
                                <li key={index}>
                                    <Link
                                        to={item.url}
                                        style={{ textDecoration: "none" }}
                                        onClick={this.closeDropdown}
                                    >
                                        <button className={item.cName}>{item.title}</button>
                                    </Link>
                                </li>
                            );
                        }

                        if (index === 2 && currentUser !== null) {
                            // No mostrar el enlace en el índice 2 si el usuario está autenticado
                            return null;
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
                    {currentUser !== null && (
                        <div className="user-menu-container" ref={this.menuRef}>
                            <button
                                className={`user-button-menu ${isDropdownVisible ? "active" : ""}`}
                                onClick={this.toggleDropdown}
                            >
                                <i className="fa-solid fa-circle-user"></i>
                            </button>
                            {isDropdownVisible && (
                                <div className="dropdown-menu">
                                    {dropdownOptions.map((option, idx) => (
                                        <Link
                                            key={idx}
                                            to={option.path}
                                            className="dropdown-item"
                                            onClick={() => {
                                                if (option.label === "Cerrar sesión") {
                                                    this.handleLogout(); // Llama a la función local
                                                }
                                                this.closeDropdown(); // Cierra el menú
                                            }}
                                        >
                                            {option.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </ul>
            </nav>
        );
    }
}

export default Navbar;