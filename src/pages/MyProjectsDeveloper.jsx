import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import ApiService from "../services/ApiService";
import { mapBackendProjectToFrontend } from "../utils/projectMapper";
import "../styles/MyProjects.css";

const MyProjectsDeveloper = () => {
  const [activeTab, setActiveTab] = useState("all"); // all, in-progress, completed
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDeveloperProjects();
  }, []);

  const loadDeveloperProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user from localStorage
      const userStr = localStorage.getItem('devconnect_user');
      if (!userStr) {
        setError('No user logged in. Please login first.');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      console.log('🔍 Developer user:', user);

      // Fetch projects from backend using devId
      if (user.id || user.userId) {
        const devId = user.id || user.userId;
        console.log('📥 Fetching projects for developer ID:', devId);
        const backendProjects = await ApiService.getProjectsByDeveloper(devId);
        console.log('📦 Received projects:', backendProjects);
        
        // Map backend DTOs to frontend shape
        const mappedProjects = backendProjects.map(mapBackendProjectToFrontend);
        setProjects(mappedProjects);
      } else {
        setError('User ID not found. Cannot fetch projects.');
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(err.message || 'Failed to load projects. Please try again.');
      setLoading(false);
    }
  };

  const filterProjects = () => {
    switch (activeTab) {
      case "in-progress":
        return projects.filter(p => p.status === "in-progress");
      case "completed":
        return projects.filter(p => p.status === "completed");
      default:
        return projects;
    }
  };

  const filteredProjects = filterProjects();

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>My Claimed Projects</h1>
        <p className="subtitle">Projects you've claimed and are working on</p>
      </div>

      {/* Info Banner */}
      {!loading && !error && projects.length === 0 && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 16px',
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px',
          color: '#92400e',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>👋</span>
          <span>
            You haven't claimed any projects yet. Go to <strong>"Browse Projects"</strong> to find available projects!
          </span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your projects...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error loading projects</h3>
          <p>{error}</p>
          <button onClick={loadDeveloperProjects} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Tabs */}
          <div className="projects-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Projects
              <span className="tab-count">{projects.length}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "in-progress" ? "active" : ""}`}
              onClick={() => setActiveTab("in-progress")}
            >
              In Progress
              <span className="tab-count">
                {projects.filter(p => p.status === "in-progress").length}
              </span>
            </button>
            <button
              className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
              <span className="tab-count">
                {projects.filter(p => p.status === "completed").length}
              </span>
            </button>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h2>No projects {activeTab !== "all" ? activeTab : "yet"}</h2>
              <p>
                {activeTab === "all" 
                  ? "You haven't claimed any projects yet. Visit the Marketplace to find available projects!"
                  : `You don't have any ${activeTab} projects.`}
              </p>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  showMessageButton={true}
                  onUpdate={loadDeveloperProjects}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyProjectsDeveloper;
