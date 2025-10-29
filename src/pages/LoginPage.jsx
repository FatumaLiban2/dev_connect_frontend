import React, { useState } from 'react';
import '../styles/Authentication.css';

// Import the new image
import authIllustration from '../assets/authlogo.png';  

const LoginPage = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signing In with:', formData);
    // In a real app, you would send this data to your backend for authentication
    alert(`Welcome back! Check the console for the submitted data.`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-page-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          ×
        </button>
        <div className="auth-card">
          <div className="auth-left-panel">
            <div className="auth-logo">
              {`{•}`} DevConnect
            </div>
         
            <img src={authIllustration} alt="Community illustration" className="auth-illustration" />
            
            <h1 className="auth-tagline">A Community Connecting Developers and Clients</h1>
          </div>
          <div className="auth-right-panel">
            <div className="auth-form-wrapper">
              <h2>Welcome Back!</h2>
              
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-options">
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
                <button type="submit" className="auth-submit-btn">SIGN IN</button>
              </form>

              <p className="auth-redirect">
                Don't have an account? <button onClick={onSwitchToSignup} className="auth-link-btn">SIGN UP</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;