import React from 'react';
import '../styles/Chat.css';
import '../styles/FindDevelopers.css';

export default function DeveloperCard({ developer }) {
  return (
    <div className="dev-card">
      <div className="dev-left">
        <div className="avatar" />
        <div className="dev-info">
          <div className="dev-name">{developer.name}</div>
          <div className="dev-role">{developer.role}</div>
          <div className="dev-rating">★ {developer.rating}</div>
        </div>
      </div>

      <div className="dev-actions">
        <button className="btn-view">VIEW</button>
        <button className="btn-hire">HIRE</button>
        <button className="btn-more">⋯</button>
      </div>
    </div>
  );
}
