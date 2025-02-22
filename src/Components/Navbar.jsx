import React, { Component, createRef } from "react";
import "./NavbarStyles.css";
import { MenuItems, dropdownOptions } from "./NBMenuItems";
import { Link } from "react-router-dom";
import userControl from "../Util/UserControl";
import { getActualLogoClub } from "../API/StorageAPI"; 
import { getActualNombreClubInfo } from "../Ctrl/InformacionClubCtrl";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownVisible: false,
            currentUser: null,
            logo: null,        // URL del logo obtenido desde StorageAPI
            clubName: "", // Valor por defecto, se actualizará al obtener el dato real
        };
        this.menuRef = createRef();
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        window.addEventListener("userChanged", this.updateCurrentUser);

        const user = sessionStorage.getItem("currentUser");
        if (user) {
            this.setState({ currentUser: user });
        }

        // Función asíncrona para cargar logo y nombre del club
        const fetchData = async () => {
            try {
                const logoUrl = await getActualLogoClub();
                this.setState({ logo: logoUrl });
            } catch (err) {
                console.error("Error al obtener el logo desde StorageAPI:", err.message);
            }

            try {
                const clubName = await getActualNombreClubInfo();
                this.setState({ clubName });
            } catch (err) {
                console.error("Error al obtener el nombre del club:", err.message);
            }
        };

        fetchData();
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
        window.removeEventListener("userChanged", this.updateCurrentUser);
    }

    updateCurrentUser = () => {
        const user = userControl.getCurrentUser();
        this.setState({ currentUser: user });
    };

    handleClickOutside = (event) => {
        if (this.menuRef.current && !this.menuRef.current.contains(event.target)) {
            this.setState({ isDropdownVisible: false });
        }
    };

    toggleDropdown = () => {
        this.setState((prevState) => ({ isDropdownVisible: !prevState.isDropdownVisible }));
    };

    closeDropdown = () => {
        this.setState({ isDropdownVisible: false });
    };

    handleLogout = () => {
        userControl.Logout();
        this.setState({ currentUser: null });
        window.location.href = "/app/login";
    };

    renderMenuItems = () => {
        const { currentUser } = this.state;
        const location = window.location.pathname;
        const isAppPage = location.startsWith("/app");

        return MenuItems.map((item, index) => {
            if ((index === 3 && !isAppPage) || (index === 4 && isAppPage && !currentUser)) {
                return (
                    <li key={index}>
                        <Link to={item.url} style={{ textDecoration: "none" }} onClick={this.closeDropdown}>
                            <button className={item.cName}>{item.title}</button>
                        </Link>
                    </li>
                );
            }

            if ((index === 0 || index === 1 || index === 3) && isAppPage) return null;
            if ((index === 2 || index === 4) && !isAppPage) return null;
            if ((index === 2 || index === 4) && currentUser) return null;

            return (
                <li key={index}>
                    <Link className={item.cName} to={item.url} onClick={this.closeDropdown}>
                        {item.title}
                    </Link>
                </li>
            );
        });
    };

    render() {
        const { isDropdownVisible, currentUser, logo, clubName } = this.state;
        const location = window.location.pathname;
        const isAppPage = location.startsWith("/app");

        return (
            <nav className="NavbarItems">
                <Link className="nav-link-logo" to="/" onClick={this.closeDropdown}>
                    <div className="logoContainer">
                        {logo && <img src={logo} alt="Logo" />}
                        {/* Se muestra el nombre del club obtenido desde el backend */}
                        <h1 className="navbar-logo"> {clubName}</h1>
                    </div>
                </Link>
                <div className="burguer-menu-container" ref={this.menuRef}>
                    <button
                        className={`${isAppPage && currentUser ? "burguer-button-menu-isIn" : "burguer-button-menu"
                            } ${isDropdownVisible ? "active" : ""}`}
                        onClick={this.toggleDropdown}
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                    {isDropdownVisible && (
                        <div className="burguer-dropdown-menu">
                            {this.renderMenuItems()}
                        </div>
                    )}
                </div>

                <ul className="nav-menu">
                    {this.renderMenuItems()}
                </ul>

                {currentUser && isAppPage && (
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
                                            if (option.label === "Cerrar sesión") this.handleLogout();
                                            this.closeDropdown();
                                        }}
                                    >
                                        {option.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </nav>
        );
    }
}

export default Navbar;
