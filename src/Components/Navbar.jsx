// src/components/Navbar.js
import React, { Component, createRef } from "react";
import "./NavbarStyles.css"; // Se usa el CSS inicial sin modificaciones
import { MenuItems, dropdownOptions } from "./NBMenuItems";
import { Link } from "react-router-dom";
import userControl from "../Util/UserControl";
import { ClubInfoContext } from "../context/infoClubContext";

class Navbar extends Component {
  static contextType = ClubInfoContext;

  constructor(props) {
    super(props);
    this.state = {
      isDropdownVisible: false,
      currentUser: null,
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
    const { isDropdownVisible, currentUser } = this.state;
    const location = window.location.pathname;
    const isAppPage = location.startsWith("/app");

    // Obtener logo y nombre del club desde el contexto
    const { logo, clubName } = this.context;

    return (
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
            className={`${isAppPage && currentUser ? "burguer-button-menu-isIn" : "burguer-button-menu"} ${
              isDropdownVisible ? "active" : ""
            }`}
            onClick={this.toggleDropdown}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          {isDropdownVisible && (
            <div className="burguer-dropdown-menu">{this.renderMenuItems()}</div>
          )}
        </div>

        <ul className="nav-menu">{this.renderMenuItems()}</ul>

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
