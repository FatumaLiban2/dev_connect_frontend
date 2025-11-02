import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import Logo from './Logo';

const Navbar = ({ onSigninClick, onSignupClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/">
          <Logo />
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
            <Link to="/myProjects" className="nav-link">
              My Projects
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
          <button onClick={onSigninClick} className="btn-signin">
            SIGN IN
          </button>
          <button onClick={onSignupClick} className="btn-signup">
            SIGN UP
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
