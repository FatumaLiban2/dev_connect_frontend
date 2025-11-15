
import React from 'react';
import '../styles/Dashboard.css';

// Simple bar chart for money stats
const MoneyBarChart = ({ clientMoney, developerMoney }) => {
  const max = Math.max(clientMoney, developerMoney, 1);
  return (
    <div className="money-bar-chart">
      <div className="bar-label">Client Money</div>
      <div className="bar-wrapper">
        <div className="bar client" style={{ height: `${(clientMoney / max) * 100}%` }} />
        <span className="bar-value">KSH.{clientMoney.toLocaleString()}</span>
      </div>
      <div className="bar-label">Developer Money</div>
      <div className="bar-wrapper">
        <div className="bar developer" style={{ height: `${(developerMoney / max) * 100}%` }} />
        <span className="bar-value">KSH.{developerMoney.toLocaleString()}</span>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color, note }) => (
  <div className="dash-card">
    <div className="dash-card-icon" style={{ background: color }}>{icon}</div>
    <div className="dash-card-title">{title}</div>
    <div className="dash-card-value">{value}</div>
    {note && <div className="dash-card-note">{note}</div>}
  </div>
);

const QuickAction = ({ label, icon }) => (
  <div className="quick-action">
    <div className="quick-action-icon">{icon}</div>
    <div className="quick-action-label">{label}</div>
  </div>
);

export default function DashboardClient() {
  // Example stats
  const summary = [
    {
      title: 'Agents Deployed',
      value: 24,
      icon: '🤖',
      color: '#e3f2fd',
      note: '↑ 4 from last week',
    },
    {
      title: 'Active Workflows',
      value: 45,
      icon: '⚙️',
      color: '#e8f5e9',
      note: '↑ 12% increase',
    },
    {
      title: 'Pending Alerts',
      value: 8,
      icon: '🔔',
      color: '#fff3e0',
      note: '↓ 3 new alerts',
    },
    {
      title: 'Completed Tasks',
      value: 128,
      icon: '✅',
      color: '#e1f5fe',
      note: '↑ 23 today',
    },
  ];

  // Money stats for bar chart
  const clientMoney = 27879;
  const developerMoney = 15800;

  // Only 4 important quick actions
  const actions = [
    { label: 'New AI Agent', icon: '➕' },
    { label: 'Integrations', icon: '🔗' },
    { label: 'Task Automation', icon: '⏱️' },
    { label: 'Analytics', icon: '�' },
  ];

  // Projects offered by client
  const projectsOffered = [
    { name: 'Restaurant Website', percent: 80 },
    { name: 'E-Commerce Platform', percent: 55 },
    { name: 'Portfolio Site', percent: 30 },
    { name: 'Booking App', percent: 90 },
  ];

  return (
    <div className="dashboard-page redesigned">
      <div className="dash-header">
        <h1>Dashboard</h1>
        <div className="dash-date">{new Date().toLocaleDateString()}</div>
      </div>

      <div className="dash-performance-row">
        <div className="dash-performance-card">
          <div className="dash-performance-title">Performance Overview</div>
          {/* Placeholder for a line chart or area chart */}
          <div className="dash-performance-chart-placeholder">
            <span>Chart coming soon...</span>
          </div>
        </div>
        <div className="dash-money-card">
          <div className="dash-money-title">Money Overview</div>
          <MoneyBarChart clientMoney={clientMoney} developerMoney={developerMoney} />
        </div>
      </div>

      <div className="dash-summary-grid redesigned">
        {summary.map((card, i) => (
          <SummaryCard key={i} {...card} />
        ))}
      </div>

      <div className="quick-actions-section">
        <div className="quick-actions-title">Quick Actions</div>
        <div className="quick-actions-grid">
          {actions.map((action, i) => (
            <QuickAction key={i} {...action} />
          ))}
        </div>
      </div>

      <div className="projects-section">
        <div className="projects-title">Projects Offered</div>
        <div className="projects-list">
          {projectsOffered.map((proj, i) => (
            <div key={i} className="project-item">
              <div className="project-name">{proj.name}</div>
              <div className="project-progress-bar">
                <div className="project-progress" style={{ width: `${proj.percent}%` }} />
                <span className="project-percent">{proj.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
