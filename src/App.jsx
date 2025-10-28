import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import './App.css';function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* The new HomePage component is now the main route */}
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<div className="placeholder">Features Page</div>} />
            <Route path="/about" element={<div className="placeholder">About Page</div>} />
            <Route path="/contact" element={<div className="placeholder">Contact Page</div>} />
            <Route path="/services" element={<div className="placeholder">Services Page</div>} />
            <Route path="/use-cases" element={
              <div className="placeholder">Use Cases Page</div>} />
            <Route path="/pricing" element={<div className="placeholder">Pricing Page</div>} />
            <Route path="/blog" element={<div className="placeholder">Blog Page</div>} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/privacy" element={<div className="placeholder">Privacy Policy Page</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
