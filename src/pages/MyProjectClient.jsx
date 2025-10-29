import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/MyProjects.css";

const MyProjects = () => {
  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    timeline: "",
    description: "",
    files: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved Project:", formData);
    alert("Project saved successfully!");
  };

  return (
    
        <div className="content">
          <h2>My Projects</h2>
          <p className="subtitle">
            Track progress and manage your projects with ease.
          </p>

          <form onSubmit={handleSubmit} className="form-card">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project name"
            />

            <div className="form-row">
              <div>
                <label>Budget Range</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. $500 - $2000"
                />
              </div>
              <div>
                <label>Timeline</label>
                <input
                  type="text"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="e.g. 2-4 weeks"
                />
              </div>
            </div>

            <label>Project Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project"
            ></textarea>

            <label>Upload Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />

            {formData.files.length > 0 && (
              <ul className="file-list">
                {formData.files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}

            <button type="submit" className="save-btn">
              Save Project
            </button>
          </form>
        </div>
      
  );
};

export default MyProjects;
