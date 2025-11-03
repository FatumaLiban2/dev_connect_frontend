import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelectionPage.css';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleClientSelection = () => {
    navigate('/profile-setup?role=client');
  };

  const handleDeveloperSelection = () => {
    navigate('/profile-setup?role=developer');
  };

  return (
    <div className="role-selection-page">
      <div className="role-selection-container">
        <div className="welcome-header">
          <h1>Welcome to Devconnect</h1>
          <p>Connect clients with developers for custom web applications</p>
        </div>

        <div className="role-cards-container">
          <div className="role-card client-card" onClick={handleClientSelection}>
            <div className="role-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="25" r="10" stroke="currentColor" strokeWidth="3" fill="none"/>
                <circle cx="25" cy="35" r="8" stroke="currentColor" strokeWidth="3" fill="none"/>
                <circle cx="55" cy="35" r="8" stroke="currentColor" strokeWidth="3" fill="none"/>
                <path d="M15 55 C15 45, 25 40, 40 40 C55 40, 65 45, 65 55" stroke="currentColor" strokeWidth="3" fill="none"/>
              </svg>
            </div>
            <h2>I'm a Client</h2>
            <p className="role-description">
              I have a project idea and need a developer to bring it to life
            </p>
            <ul className="role-features">
              <li>
                <span className="bullet-icon">○</span>
                Post project description
              </li>
              <li>
                <span className="bullet-icon">○</span>
                Upload designs and mockup
              </li>
              <li>
                <span className="bullet-icon">○</span>
                Track Development progress
              </li>
              <li>
                <span className="bullet-icon">○</span>
                Receive final deliverables
              </li>
            </ul>
          </div>

          <div className="role-card developer-card" onClick={handleDeveloperSelection}>
            <div className="role-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 30 L35 40 L25 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M45 30 L55 40 L45 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>I'm a Developer</h2>
            <p className="role-description">
              i Build web applications and want to take clients projects
            </p>
            <ul className="role-features">
              <li>
                <span className="bullet-icon">○</span>
                Browse available projects
              </li>
              <li>
                <span className="bullet-icon">○</span>
                Apply for interesting work
              </li>
              <li>
                <span className="bullet-icon">○</span>
                Provide progress updates
              </li>
              <li>
                <span className="bullet-icon">○</span>
                Submit completed project
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;