import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/FindClients.css';
import ClientCard from '../components/ClientCard';
import DeveloperSetup from '../components/DeveloperSetup';

const mockClients = [
  { id: 1, name: 'Name1', description: 'Project description' },
  { id: 2, name: 'Name2', description: 'Project description' },
  { id: 3, name: 'Name3', description: 'Project description' },
  { id: 4, name: 'Name4', description: 'Project description' },
  { id: 5, name: 'Name5', description: 'Project description' },
];

export default function FindClients() {
  const location = useLocation();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    // Check if we should show the setup overlay
    if (location.state?.showSetup && location.state?.role === 'developer') {
      setShowSetup(true);
    }
  }, [location]);

  const handleSetupComplete = (profileData) => {
    // Create developer user with profile data
    const developerUser = {
      id: 2,
      email: 'alex@example.com',
      role: 'developer',
      ...profileData,
    };
    
    // Save to localStorage
    localStorage.setItem('devconnect_user', JSON.stringify(developerUser));
    
    // Close setup overlay
    setShowSetup(false);
  };

  const handleSetupClose = () => {
    setShowSetup(false);
  };

  return (
    <>
      <div className="find-clients-page">
        <section className="find-clients-header">
          <h1>Find Clients</h1>
          <p className="subtitle">Discover skilled clients. Here are the profiles.</p>
        </section>

        <section className="clients-list-card">
          {mockClients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))}
        </section>
      </div>

      {/* Developer Setup Overlay */}
      <DeveloperSetup
        isOpen={showSetup}
        onClose={handleSetupClose}
        onComplete={handleSetupComplete}
      />
    </>
  );
}
