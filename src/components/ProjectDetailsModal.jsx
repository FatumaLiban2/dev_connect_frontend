import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProjectDetails.css';

export default function ProjectDetailsModal({ project, onClose }) {
  const navigate = useNavigate();
  if (!project) return null;

  const openChat = () => {
    navigate(`/messages?userId=${project.clientId || project.client || ''}&projectId=${project.id}`);
    onClose && onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="project-details-header">
          <h2>{project.name || project.title || `Project ${project.id}`}</h2>
          <div className="project-client">Client: {project.client || project.clientName || project.clientId}</div>
        </div>

        <div className="project-details-body">
          <div>
            <section className="project-section">
              <h3>Description</h3>
              <p>{project.description || 'No description available yet.'}</p>
            </section>

            <section className="project-section">
              <h3>Milestones</h3>
              <ul>
                {(project.milestones || []).map((m) => (
                  <li key={m.id}>{m.title} — {m.status}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="project-side-card">
            <div className="project-section">
              <div className="project-meta-row">
                <div className="project-meta-label">Status</div>
                <div className="project-meta-value">{project.status || 'Active'}</div>
              </div>

              <div style={{ height: 8 }} />

              <div className="project-meta-row">
                <div className="project-meta-label">Progress</div>
                <div className="project-meta-value">{project.percent ?? project.progress ?? 0}%</div>
              </div>
            </div>

            <div className="project-section">
              <button className="btn primary" onClick={openChat}>Open Chat with Client</button>
              <button className="btn" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
