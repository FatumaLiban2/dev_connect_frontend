import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import Logo from './Logo';

const Navbar = ({ onSigninClick, onSignupClick, currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

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
            <button onClick={() => scrollToSection('services')} className="nav-link">
              Services
            </button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('procedure')} className="nav-link">
              Procedure
            </button>
          </li>
          <li className="nav-item">
            <button onClick={() => scrollToSection('contact')} className="nav-link">
              Contact
            </button>
          </li>
        </ul>

        {/* Auth Buttons or User Menu */}
        <div className="nav-auth">
          {currentUser ? (
            <>
              <Link to="/profile" className="user-profile-link">
                <div className="user-avatar">
                  {currentUser.firstName?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
                </div>
                <span>{currentUser.username}</span>
              </Link>
              <button onClick={onLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={onSigninClick} className="btn-signin">
                SIGN IN
              </button>
              <button onClick={onSignupClick} className="btn-signup">
                SIGN UP
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
