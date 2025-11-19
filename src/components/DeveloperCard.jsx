import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Chat.css';
import '../styles/FindDevelopers.css';

export default function DeveloperCard({ developer }) {
  const navigate = useNavigate();

  const handleMessage = () => {
    // Navigate to messages page with developer info pre-selected
    const devId = developer.id || developer.userId;
    const devName = developer.username || developer.name || `${developer.firstName || ''} ${developer.lastName || ''}`.trim() || 'Developer';
    
    navigate(`/messages?userId=${devId}&userName=${encodeURIComponent(devName)}&userRole=DEVELOPER`);
  };

  // Handle different possible field names from backend
  const displayName = developer.username || developer.name || 
                     `${developer.firstName || ''} ${developer.lastName || ''}`.trim() || 
                     'Developer';
  const displayRole = developer.role || developer.specialization || 'Developer';
  const displayRating = developer.rating || developer.averageRating || 'N/A';

  return (
    <div className="dev-card">
      <div className="dev-left">
        <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
        <div className="dev-info">
          <div className="dev-name">{displayName}</div>
          <div className="dev-role">{displayRole}</div>
          <div className="dev-rating">★ {displayRating}</div>
          {developer.email && (
            <div className="dev-email" style={{ fontSize: '0.8rem', color: '#666' }}>
              {developer.email}
            </div>
          )}
        </div>
      </div>

      <div className="dev-actions">
        <button className="btn-view">VIEW</button>
        <button className="btn-hire" onClick={handleMessage}>MESSAGE</button>
        <button className="btn-more">⋯</button>
      </div>
    </div>
  );
}
