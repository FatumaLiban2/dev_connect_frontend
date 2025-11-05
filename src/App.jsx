import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
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
import './App.css';

// Layout wrapper to conditionally show Navbar/Footer
function Layout({ children, onSigninClick, onSignupClick }) {
  const location = useLocation();
  const hideNavAndFooter = location.pathname.startsWith('/messages');

  // Show global sidebar on dashboard-like routes
  const sidebarRoutes = new Set([
    '/dashboard',
    '/profile',
    '/projects',
    '/findDevelopers',
    '/findClients',
    '/settings',
    '/payments',
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

  const userRole = 'client';
  const paymentElement = userRole === 'client' ? <ClientPayment /> : <DeveloperPayment />;

  return (
    <>
      <Layout onSigninClick={handleSigninClick} onSignupClick={handleSignupClick}>
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
          <Route path="/projects" element={<div className="placeholder">Projects Page</div>} />
          <Route path="/findDevelopers" element={<div className="placeholder">Find Developers Page</div>} />
          <Route path="/findClients" element={<div className="placeholder">Find Clients Page</div>} />
          <Route path="/messages" element={<MessagingPage userRole={userRole} />} />
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
