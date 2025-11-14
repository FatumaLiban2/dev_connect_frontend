import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ClientSetup from "../components/ClientSetup";
import CreateProjectModal from "../components/CreateProjectModal";
import ProjectCard from "../components/ProjectCard";
import "../styles/MyProjects.css";

const MyProjects = () => {
  const location = useLocation();
  const [showSetup, setShowSetup] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all, in-progress, completed
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Check if we should show the setup overlay
    if (location.state?.showSetup && location.state?.role === 'client') {
      setShowSetup(true);
    }

    // Load projects from localStorage
    const savedProjects = localStorage.getItem('client_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, [location]);

  const handleSetupComplete = (profileData) => {
    // Create client user with profile data
    const clientUser = {
      id: 1,
      email: 'john@example.com',
      role: 'client',
      ...profileData,
    };
    
    // Save to localStorage
    localStorage.setItem('devconnect_user', JSON.stringify(clientUser));
    
    // Close setup overlay
    setShowSetup(false);
  };

  const handleSetupClose = () => {
    setShowSetup(false);
  };

  const handleCreateProject = (newProject) => {
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('client_projects', JSON.stringify(updatedProjects));
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
    <>
      <div className="projects-page">
        <div className="projects-header">
          <h1>My Projects</h1>
          <p className="subtitle">Track and manage all your projects in one place</p>
        </div>

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
        <div className="projects-content">
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No projects yet</h3>
              <p>Click the + button to create your first project</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <button
          className="floating-add-btn"
          onClick={() => setShowCreateModal(true)}
          aria-label="Create new project"
        >
          +
        </button>
      </div>

      {/* Modals */}
      <ClientSetup
        isOpen={showSetup}
        onClose={handleSetupClose}
        onComplete={handleSetupComplete}
      />
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
      />
    </>
  );
};

export default MyProjects;
