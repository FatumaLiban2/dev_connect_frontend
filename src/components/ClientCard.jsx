import React from 'react';
import '../styles/FindClients.css';

export default function ClientCard({ client }) {
  return (
    <div className="client-card">
      <div className="client-left">
        <div className="client-avatar" />
        <div className="client-info">
          <div className="client-name">{client.name}</div>
        </div>
        <button className="client-more">⋯</button>
      </div>

      <div className="client-middle">
        <span className="project-label">Project description</span>
      </div>

      <div className="client-actions">
        <button className="btn-show-description">Show Full description</button>
        <button className="btn-checkmark">✓</button>
      </div>
    </div>
  );
}
