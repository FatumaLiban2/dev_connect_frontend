import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ClientPayment from './pages/ClientPayment';
import DeveloperPayment from './pages/DeveloperPayment';
import MessagingPage from './pages/MessagingPage';
import HomePage from './pages/HomePage';
import LoginModal from './components/Login';
import SignupModal from './components/Signup';
import ForgotPasswordModal from './components/ForgotPassword';
import ResetPasswordModal from './components/ResetPassword';
import MyProjects from './pages/MyProjectClient';
import FindDevelopers from './pages/FindDevelopers';
import RoleSelectionPage from './pages/RoleSelectionPage';
import FindClients from './pages/FindClients';
import WebSocketService from './services/WebSocketService'; 
import './App.css';

// Layout wrapper to conditionally show Navbar/Footer
function Layout({ children, onSigninClick, onSignupClick, userRole }) {
  const location = useLocation();
  const hideNavAndFooter = ['/messages', '/role-selection'].some(path => 
    location.pathname.startsWith(path)
  );

  // Show global sidebar on dashboard-like routes
  const sidebarRoutes = new Set([
    '/dashboard',
    '/profile',
    '/projects',
    '/myProjects',
    '/findDevelopers',
    '/findClients',
    '/settings',
    '/payments',
    '/payment',
    '/client-payments',
  ]);
  const showSidebar = sidebarRoutes.has(location.pathname);
  const appClassName = hideNavAndFooter ? 'app no-navbar' : 'app with-navbar';

  return (
    <div className={appClassName}>
      {!hideNavAndFooter && (
        <Navbar onSigninClick={onSigninClick} onSignupClick={onSignupClick} />
      )}
      <div className="app-body">
        {showSidebar && <Sidebar role={userRole} />}
        <main className="main-content">
          {children}
        </main>
      </div>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

function App() {
  const [activeAuthModal, setActiveAuthModal] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // TEST USERS - for easy switching between client and developer
  const TEST_USERS = {
    client: {
      id: 1,
      username: 'john_client',
      email: 'john@example.com',
      role: 'client'
    },
    developer: {
      id: 2,
      username: 'alex_dev',
      email: 'alex@example.com',
      role: 'developer'
    }
  };

  // Initialize WebSocket connection when user logs in
  useEffect(() => {
    // TEMPORARY: For testing, start with client user
    // Remove this when you have real authentication
    const mockUser = TEST_USERS.client;
    setCurrentUser(mockUser);
    WebSocketService.connect(mockUser.id);

    // Cleanup: Disconnect when app unmounts
    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  // Function to switch between test users
  const switchTestUser = () => {
    const newUser = currentUser?.id === 1 ? TEST_USERS.developer : TEST_USERS.client;
    WebSocketService.disconnect();
    setCurrentUser(newUser);
    WebSocketService.connect(newUser.id);
  };

  const handleSigninClick = () => {
    setActiveAuthModal('login');
  };

  const handleSignupClick = () => {
    setActiveAuthModal('signup');
  };

  const closeAllAuthModals = () => {
    setActiveAuthModal(null);
  };

  const switchToSignup = () => {
    setActiveAuthModal('signup');
  };

  const switchToSignin = () => {
    setActiveAuthModal('login');
  };

  const switchToForgotPassword = () => {
    setActiveAuthModal('forgot');
  };

  const switchToResetPassword = () => {
    setActiveAuthModal('reset');
  };

  const userRole = currentUser?.role || 'client';
  const paymentElement = userRole === 'client' ? <ClientPayment /> : <DeveloperPayment />;

  return (
    <>
      {/* TEMPORARY: User Switcher Button for Testing */}
      {currentUser && (
        <div 
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999,
            background: '#007bff',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }} 
          onClick={switchTestUser}
        >
          <span>🔄</span>
          <span>Switch to {currentUser.role === 'client' ? 'Developer' : 'Client'}</span>
        </div>
      )}

      <Layout onSigninClick={handleSigninClick} onSignupClick={handleSignupClick} userRole={userRole}>
        <Routes>
          {/* Main Pages */}
          <Route
            path="/"
            element={(
              <HomePage
                onSigninClick={handleSigninClick}
                onSignupClick={handleSignupClick}
                onForgotPasswordClick={switchToForgotPassword}
              />
            )}
          />
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route path="/features" element={<div className="placeholder">Features Page</div>} />
          <Route path="/about" element={<div className="placeholder">About Page</div>} />
          <Route path="/contact" element={<div className="placeholder">Contact Page</div>} />
          <Route path="/services" element={<div className="placeholder">Services Page</div>} />
          <Route path="/use-cases" element={<div className="placeholder">Use Cases Page</div>} />
          <Route path="/pricing" element={<div className="placeholder">Pricing Page</div>} />
          <Route path="/blog" element={<div className="placeholder">Blog Page</div>} />
          <Route path="/privacy" element={<div className="placeholder">Privacy Policy Page</div>} />

          {/* Routes that render with the sidebar layout */}
          <Route path="/dashboard" element={<div className="placeholder">Dashboard Page</div>} />
          <Route path="/profile" element={<div className="placeholder">Profile Page</div>} />
          <Route path="/projects" element={<MyProjects />} />
          <Route path="/myProjects" element={<MyProjects />} />
          <Route path="/findDevelopers" element={<FindDevelopers />} />
          <Route path="/findClients" element={<FindClients />} />
          
          <Route 
            path="/messages" 
            element={<MessagingPage userRole={userRole} currentUser={currentUser} />} 
          />
          
          <Route path="/client-payments" element={<ClientPayment />} />
          <Route path="/payments" element={paymentElement} />
          <Route path="/payment" element={paymentElement} />
          <Route path="/payments/client" element={<ClientPayment />} />
          <Route path="/payments/developer" element={<DeveloperPayment />} />
          <Route path="/settings" element={<div className="placeholder">Settings Page</div>} />
          <Route
            path="*"
            element={<div className="placeholder">Page not found</div>}
          />
        </Routes>
      </Layout>

      {/* Modal Components */}
      <LoginModal
        isOpen={activeAuthModal === 'login'}
        onClose={closeAllAuthModals}
        onSwitchToSignup={switchToSignup}
        onSwitchToForgotPassword={switchToForgotPassword}
        onSwitchToResetPassword={switchToResetPassword}
      />
      <SignupModal
        isOpen={activeAuthModal === 'signup'}
        onClose={closeAllAuthModals}
        onSwitchToSignin={switchToSignin}
      />
      <ForgotPasswordModal
        isOpen={activeAuthModal === 'forgot'}
        onClose={closeAllAuthModals}
        onSwitchToSignin={switchToSignin}
      />
      <ResetPasswordModal
        isOpen={activeAuthModal === 'reset'}
        onClose={closeAllAuthModals}
        onSwitchToSignin={switchToSignin}
      />
    </>
  );
}

export default App;
