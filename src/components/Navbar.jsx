import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/devconnectlogo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="DevConnect Logo" className="logo-icon" />
          <span className="logo-text">DevConnect</span>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/features" className="nav-link">
              Features
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About us
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="nav-auth">
          <Link to="/signin" className="btn-signin">
            SIGN IN
          </Link>
          <Link to="/signup" className="btn-signup">
            SIGN UP
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
