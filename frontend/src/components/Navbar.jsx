
import { Link } from "react-router-dom";
import logoBanner from "../assets/buengobierno_logo.svg";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-light sub-navbar fixed-top">
      <div className="container">

        <button
          type="button"
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#subNavBarDropdown"
          aria-controls="subNavBarDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <img
          className="buengobierno-logo"
          src={logoBanner}
          alt="Logo"
          style={{
            height: "40px",
            width: "auto",
            marginRight: "25px",
            transform: "translateY(23px)",
          }}
        />

        <Link
          className="navbar-brand sub-navbar"
          to="/"
          style={{ textTransform: 'none', transform: "translateY(5px)" }}
        >
          Registro de MIPYMES

        </Link>

        <div
          className="collapse navbar-collapse"
          id="subNavBarDropdown"
        >
          <ul className="navbar-nav">

            <li className="nav-item">
              <Link
                className="nav-link subnav-link"
                to="/login"
              >
                Iniciar sesión
              </Link>
            </li>


          </ul>
        </div>

      </div>
    </nav>
  );
}
