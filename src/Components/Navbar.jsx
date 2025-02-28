// src/components/Navbar.js
import React, { Component, createRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuItems, dropdownOptions } from "./NBMenuItems";
import userControl from "../Util/UserControl";
import { ClubInfoContext } from "../context/infoClubContext";

// Componente funcional para emitir un evento personalizado cada vez que cambia la ruta
function RouteChangeListener() {
  const location = useLocation();
  React.useEffect(() => {
    const event = new CustomEvent("routeChanged", {
      detail: { pathname: location.pathname },
    });
    window.dispatchEvent(event);
  }, [location]);
  return null;
}

class Navbar extends Component {
  static contextType = ClubInfoContext;

  constructor(props) {
    super(props);
    this.state = {
      isDropdownVisible: false,
      currentUser: null,
    };
    this.menuRef = createRef();
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.updateStyles = this.updateStyles.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    window.addEventListener("userChanged", this.updateCurrentUser);
    window.addEventListener("routeChanged", this.handleRouteChange);

    const user = sessionStorage.getItem("currentUser");
    if (user) {
      this.setState({ currentUser: user });
    }
    // Aplica los estilos iniciales según la ruta actual
    this.updateStyles();
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    window.removeEventListener("userChanged", this.updateCurrentUser);
    window.removeEventListener("routeChanged", this.handleRouteChange);
  }

  updateCurrentUser = () => {
    const user = userControl.getCurrentUser();
    this.setState({ currentUser: user });
  };

  // Función que actualiza el enlace al CSS según la ruta actual usando require()
  updateStyles() {
    let linkElement = document.getElementById("navbar-style");
    if (!linkElement) {
      linkElement = document.createElement("link");
      linkElement.id = "navbar-style";
      linkElement.rel = "stylesheet";
      document.head.appendChild(linkElement);
    }
    const path = window.location.pathname;
    if (path.startsWith("/app")) {
      linkElement.href = require("./NavbarStyles.css");
    } else {
      linkElement.href = require("./NavbarStyles-PK.css");
    }
  }

  // Se invoca cada vez que se dispara el evento de cambio de ruta
  handleRouteChange(event) {
    this.updateStyles();
  }

  handleClickOutside = (event) => {
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
    userControl.Logout();
    this.setState({ currentUser: null });
    window.location.href = "/app/login";
  };

  renderMenuItems = () => {
    const location = window.location.pathname;
    const isAppPage = location.startsWith("/app");
    const effectiveUser = isAppPage ? this.state.currentUser : null;

    return MenuItems.map((item, index) => {
      if (
        (index === 3 && !isAppPage) ||
        (index === 4 && isAppPage && !effectiveUser)
      ) {
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
      if ((index === 0 || index === 1 || index === 3) && isAppPage)
        return null;
      if ((index === 2 || index === 4) && !isAppPage) return null;
      if ((index === 2 || index === 4) && effectiveUser) return null;

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
    });
  };

  render() {
    const { isDropdownVisible, currentUser } = this.state;
    const location = window.location.pathname;
    const isAppPage = location.startsWith("/app");
    const effectiveUser = isAppPage ? currentUser : null;
    const { logo, clubName } = this.context;

    return (
      <>
        {/* Componente que escucha los cambios de ruta */}
        <RouteChangeListener />
        <nav className="NavbarItems">
          <Link
            className="nav-link-logo"
            to={isAppPage ? "/app/" : "/"}
            onClick={this.closeDropdown}
          >
            <div className="logoContainer">
              {logo && <img src={logo} alt="Logo" />}
              <h1 className="navbar-logo">{clubName}</h1>
            </div>
          </Link>
          <div className="burguer-menu-container" ref={this.menuRef}>
            <button
              className={`${
                isAppPage && effectiveUser
                  ? "burguer-button-menu-isIn"
                  : "burguer-button-menu"
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
          <ul className="nav-menu">{this.renderMenuItems()}</ul>
          {effectiveUser && (
            <div className="user-menu-container" ref={this.menuRef}>
              <button
                className={`user-button-menu ${
                  isDropdownVisible ? "active" : ""
                }`}
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
                        if (option.label === "Cerrar sesión")
                          this.handleLogout();
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
      </>
    );
  }
}

export default Navbar;
