// BrowseProjects.jsx - Marketplace for developers to find available projects
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ApiService from "../services/ApiService";
import { mapBackendProjectToFrontend } from "../utils/projectMapper";
import "../styles/MyProjects.css";

const BrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadAvailableProjects();
  }, []);

  const loadAvailableProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📥 Fetching available projects...');
      const backendProjects = await ApiService.getAvailableProjects();
      console.log('📦 Received available projects:', backendProjects);
      
      // Map backend DTOs to frontend shape
      const mappedProjects = backendProjects.map(mapBackendProjectToFrontend);
      setProjects(mappedProjects);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load available projects:', err);
      setError(err.message || 'Failed to load projects. Please try again.');
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const title = (project.title || project.projectName || '').toLowerCase();
    const description = (project.description || '').toLowerCase();
    
    return title.includes(query) || description.includes(query);
  });

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Browse Available Projects</h1>
        <p className="subtitle">Find unclaimed projects posted by clients • Claim projects to start working</p>
      </div>

      {/* Info Banner */}
      <div style={{
        marginBottom: '20px',
        padding: '12px 16px',
        background: '#dbeafe',
        border: '1px solid #93c5fd',
        borderRadius: '8px',
        color: '#1e40af',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>💡</span>
        <span>
          These are projects where <strong>no developer has been assigned yet</strong>. 
          Click "Message Client" to discuss project details before claiming.
        </span>
      </div>

      {/* Search Bar */}
      <div className="projects-search" style={{
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search projects by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button 
          onClick={loadAvailableProjects}
          style={{
            padding: '12px 24px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading available projects...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error loading projects</h3>
          <p>{error}</p>
          <button onClick={loadAvailableProjects} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Projects Count */}
          <div style={{ 
            marginBottom: '16px', 
            color: '#6b7280',
            fontSize: '14px' 
          }}>
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} available
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h2>
                {searchQuery ? 'No projects match your search' : 'No available projects yet'}
              </h2>
              <p>
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Check back later for new project opportunities!'}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{
                    marginTop: '16px',
                    padding: '10px 20px',
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  showMessageButton={true}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseProjects;
