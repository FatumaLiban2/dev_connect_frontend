import React, { useState } from 'react';
import '../styles/Authentication.css';

const ForgotPasswordPage = ({ isOpen, onClose, onSwitchToSignin }) => {
  // State management
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form data
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Clear error when user types
  const clearError = () => {
    setErrorMessage('');
  };

  // Step 1: Request password reset
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Simulate sending email (frontend only)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep(2);
      console.log('Reset code sent to:', email);
    } catch (error) {
      setErrorMessage('Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Simple code validation
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      setErrorMessage('Please enter a valid 6-digit code');
      setIsLoading(false);
      return;
    }

    // Simulate code verification (frontend only)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(3);
      console.log('Code verified for:', email);
    } catch (error) {
      setErrorMessage('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Simple password validation
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Simulate password reset (frontend only)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Password reset successful! Please sign in with your new password.');
      console.log('Password reset successful for:', email);
      onSwitchToSignin();
    } catch (error) {
      setErrorMessage('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setIsLoading(true);
    clearError();

    // Simulate resending code (frontend only)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Verification code resent to your email!');
      console.log('Code resent to:', email);
    } catch (error) {
      setErrorMessage('Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when closing
  const handleClose = () => {
    setCurrentStep(1);
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  // Step 1: Email Entry
  const renderEmailStep = () => (
    <div className="auth-form-wrapper">
      <h2>Reset Your Password</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Enter your email address and reset your password.
      </p>
      
      <form className="auth-form" onSubmit={handleSendResetCode}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
            }}
            required
            disabled={isLoading}
          />
        </div>
        
        {errorMessage && (
          <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
            {errorMessage}
          </p>
        )}
        
        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? 'SENDING...' : 'SEND VERIFICATION CODE'}
        </button>
      </form>
      
      <p className="auth-redirect">
        Remember your password? <button onClick={onSwitchToSignin} className="auth-link-btn">SIGN IN</button>
      </p>
    </div>
  );

  // Step 2: Code Verification
  const renderCodeStep = () => (
    <div className="auth-form-wrapper">
      <h2>Enter Verification Code</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        We've sent a 6-digit code to <strong>{email}</strong>. Please check your email.
      </p>
      
      <form className="auth-form" onSubmit={handleVerifyCode}>
        <div className="input-group">
          <input
            type="text"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              clearError();
            }}
            maxLength="6"
            required
            disabled={isLoading}
            style={{ 
              textAlign: 'center', 
              fontSize: '20px', 
              letterSpacing: '8px',
              fontWeight: 'bold'
            }}
          />
        </div>
        
        {errorMessage && (
          <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
            {errorMessage}
          </p>
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
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </form>
      
      <p className="auth-redirect">
        Want to try a different email? <button onClick={() => setCurrentStep(1)} className="auth-link-btn">GO BACK</button>
      </p>
    </div>
  );

  // Step 3: New Password
  const renderPasswordStep = () => (
    <div className="auth-form-wrapper">
      <h2>Create New Password</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Your email has been verified. Please create a new secure password.
      </p>
      
      <form className="auth-form" onSubmit={handleResetPassword}>
        <div className="input-group">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              clearError();
            }}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearError();
            }}
            required
            disabled={isLoading}
          />
        </div>
        
        {errorMessage && (
          <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
            {errorMessage}
          </p>
        )}
        
        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
          Password must be at least 8 characters long
        </p>
        
        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? 'RESETTING PASSWORD...' : 'RESET PASSWORD'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-page-container" onClick={(e) => e.stopPropagation()}>
        <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
          <button className="auth-modal-close" onClick={handleClose}>
            ×
          </button>
          
          <div className="auth-right-panel" style={{ flex: 'none', width: '100%' }}>
            {currentStep === 1 && renderEmailStep()}
            {currentStep === 2 && renderCodeStep()}
            {currentStep === 3 && renderPasswordStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;