import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ClientPayment from './components/ClientPayment';
import DeveloperPayment from './components/DeveloperPayment';
import MessagingPage from './pages/MessagingPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MyProjects from './pages/MyProjectClient';
import './App.css';

// Layout wrapper to conditionally show Navbar/Footer
function Layout({ children, onSigninClick, onSignupClick }) {
  const location = useLocation();
  const hideNavAndFooter = ['/messages'].some(path => 
    location.pathname.startsWith(path)
  );

  // Show global sidebar on dashboard-like routes
  const sidebarRoutes = [
    '/dashboard',
    '/profile',
    '/myProjects',
    '/findDevelopers',
    '/findClients',
    '/settings',
    '/payments',
    '/client-payments',
  ];
  const showSidebar = sidebarRoutes.some(path => location.pathname.startsWith(path));

  if (hideNavAndFooter) {
    return <>{children}</>;
  }

  return (
    <div className="app">
      <Navbar onSigninClick={onSigninClick} onSignupClick={onSignupClick} />
      <div className="app-body">
        {showSidebar && <Sidebar />}
        <main className="main-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleSigninClick = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const switchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const switchToSignin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <Router>
      <Layout onSigninClick={handleSigninClick} onSignupClick={handleSignupClick}>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<div className="placeholder">Features Page</div>} />
          <Route path="/about" element={<div className="placeholder">About Page</div>} />
          <Route path="/contact" element={<div className="placeholder">Contact Page</div>} />
          <Route path="/services" element={<div className="placeholder">Services Page</div>} />
          <Route path="/use-cases" element={<div className="placeholder">Use Cases Page</div>} />
          <Route path="/pricing" element={<div className="placeholder">Pricing Page</div>} />
          <Route path="/blog" element={<div className="placeholder">Blog Page</div>} />
          <Route path="/privacy" element={<div className="placeholder">Privacy Policy Page</div>} />

          {/* Dashboard and other related routes */}
          <Route path="/dashboard" element={<div className="placeholder">Dashboard Page</div>} />
          <Route path="/profile" element={<div className="placeholder">Profile Page</div>} />
          <Route path="/myProjects" element={<MyProjects />} />
          <Route path="/findDevelopers" element={<div className="placeholder">Find Developers Page</div>} />
          <Route path="/findClients" element={<div className="placeholder">Find Clients Page</div>} />
          
          {/* Messaging - Client Interface */}
          <Route path="/messages" element={<MessagingPage />} />
          
          {/* Payment Routes */}
          <Route path="/client-payments" element={<ClientPayment />} />
          <Route path="/payments" element={<ClientPayment />} />
          <Route path="/payments/client" element={<ClientPayment />} />
          <Route path="/payments/developer" element={<DeveloperPayment />} /> 
          
          <Route path="/settings" element={<div className="placeholder">Settings Page</div>} />
        </Routes>
      </Layout>
      
      {/* Modal Components */}
      <LoginPage 
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToSignup={switchToSignup}
      />
      <SignUpPage 
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        onSwitchToSignin={switchToSignin}
      />
    </Router>
  );
}

export default App;
