import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProjectDetails.css';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // NOTE: Replace this mock with real API fetch when backend is available
  const mockProject = {
    id: projectId,
    title: 'Project ' + projectId,
    clientId: 'c100',
    clientName: 'John Client',
    description: 'This is a placeholder project description. Replace with API data.',
    milestones: [
      { id: 'm1', title: 'Design', status: 'Done' },
      { id: 'm2', title: 'Development', status: 'In Progress' },
      { id: 'm3', title: 'Testing', status: 'Pending' },
    ],
  };

  const openChat = () => {
    // Navigate to messages and attach query params so MessagingPage can open appropriate thread
    // MessagingPage expects `userId` and `projectId` in the URL search params.
    navigate(`/messages?userId=${mockProject.clientId}&projectId=${mockProject.id}`);
  };

  return (
    <div className="project-details-page">
      <div className="project-details-header">
        <h2>{mockProject.title}</h2>
        <div className="project-client">Client: {mockProject.clientName}</div>
      </div>

      <div className="project-details-body">
        <section className="project-section">
          <h3>Description</h3>
          <p>{mockProject.description}</p>
        </section>

        <section className="project-section">
          <h3>Milestones</h3>
          <ul>
            {mockProject.milestones.map((m) => (
              <li key={m.id}>{m.title} — {m.status}</li>
            ))}
          </ul>
        </section>

        <div className="project-actions">
          <button className="btn primary" onClick={openChat}>Open Chat with Client</button>
          <button className="btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
}
