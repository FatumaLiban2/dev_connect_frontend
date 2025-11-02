import React, { useState } from 'react';
import '../styles/Authentication.css';

// Import the new image
import authIllustration from '../assets/authlogo.png';

const SignUpPage = ({ isOpen, onClose, onSwitchToSignin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.terms) {
      alert('You must accept the Terms & Condition.');
      return;
    }
    console.log('Signing Up with:', formData);
    // Data to be sent in the backend api call
    alert(`Welcome, ${formData.username}! Check the console for the submitted data.`);
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
              <h2>Join & Connect the Fastest Growing Online Community</h2>
              
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input type="text" id="username" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
                    Accept the Terms & Condition
                  </label>
                </div>
                <button type="submit" className="auth-submit-btn">SIGN UP</button>
              </form>

              <p className="auth-redirect">
                I have an Account? <button onClick={onSwitchToSignin} className="auth-link-btn">SIGN IN</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;