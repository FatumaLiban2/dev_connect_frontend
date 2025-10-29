import React, { useState } from 'react';
import '../styles/Authentication.css';
import authIllustration from '../assets/authlogo.png';

const ForgotPasswordPage = ({ isOpen, onClose, onSwitchToSignin }) => {
  const [step, setStep] = useState('email'); // 'email', 'code', 'reset', 'success'
  const [formData, setFormData] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  // Step 1: Send reset email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call to send reset email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app: await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: formData.email }) })
      
      setStep('code');
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify reset code
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.resetCode.length !== 6) {
      setError('Please enter the 6-digit code from your email');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app: await fetch('/api/auth/verify-reset-code', { method: 'POST', body: JSON.stringify({ email, code }) })
      
      setStep('reset');
    } catch (err) {
      setError('Invalid or expired code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app: await fetch('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, code, newPassword }) })
      
      setStep('success');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Reset code resent to your email!');
    } catch (err) {
      setError('Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderEmailStep = () => (
    <>
      <h2>Forgot Password?</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Enter your email address and we'll send you a code to reset your password.
      </p>
      
      <form className="auth-form" onSubmit={handleEmailSubmit}>
        <div className="input-group">
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        
        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? 'SENDING...' : 'SEND RESET CODE'}
        </button>
      </form>
    </>
  );

  const renderCodeStep = () => (
    <>
      <h2>Check Your Email</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        We've sent a 6-digit code to <strong>{formData.email}</strong>. 
        Please check your email and enter the code below.
      </p>
      
      <form className="auth-form" onSubmit={handleCodeSubmit}>
        <div className="input-group">
          <input 
            type="text" 
            name="resetCode" 
            placeholder="Enter 6-digit code" 
            value={formData.resetCode} 
            onChange={handleChange} 
            maxLength="6"
            pattern="[0-9]{6}"
            required 
            disabled={isLoading}
            style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }}
          />
        </div>
        
        {error && (
          <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        
        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? 'VERIFYING...' : 'VERIFY CODE'}
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button 
            type="button"
            onClick={handleResendCode}
            className="auth-link-btn"
            disabled={isLoading}
            style={{ fontSize: '14px' }}
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </form>
    </>
  );

  const renderResetStep = () => (
    <>
      <h2>Create New Password</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Your identity has been verified. Please create a new password.
      </p>
      
      <form className="auth-form" onSubmit={handlePasswordReset}>
        <div className="input-group">
          <input 
            type="password" 
            name="newPassword" 
            placeholder="New Password" 
            value={formData.newPassword} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            minLength="8"
          />
        </div>
        <div className="input-group">
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm New Password" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            minLength="8"
          />
        </div>
        
        {error && (
          <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
          Password must be at least 8 characters long
        </p>
        
        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
        </button>
      </form>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '48px', 
          color: '#10b981', 
          marginBottom: '16px' 
        }}>
          ✓
        </div>
        <h2>Password Reset Successfully!</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Your password has been updated. You can now sign in with your new password.
        </p>
        
        <button onClick={onSwitchToSignin} className="auth-submit-btn">
          SIGN IN
        </button>
      </div>
    </>
  );

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
            <img src={authIllustration} alt="Reset password illustration" className="auth-illustration" />
            <h1 className="auth-tagline">
              {step === 'email' && 'Secure Password Recovery'}
              {step === 'code' && 'Verify Your Identity'}
              {step === 'reset' && 'Create New Password'}
              {step === 'success' && 'All Set!'}
            </h1>
          </div>
          <div className="auth-right-panel">
            <div className="auth-form-wrapper">
              {step === 'email' && renderEmailStep()}
              {step === 'code' && renderCodeStep()}
              {step === 'reset' && renderResetStep()}
              {step === 'success' && renderSuccessStep()}
              
              {step !== 'success' && (
                <p className="auth-redirect">
                  Remember your password? <button onClick={onSwitchToSignin} className="auth-link-btn">SIGN IN</button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;