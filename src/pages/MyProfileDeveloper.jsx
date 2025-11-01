import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MyProfile.css";

const ClientCard = ({ name }) => {
  return (
    <div className="client-card">
      <div className="client-info">
        <i className="fa-regular fa-user"></i>
        <span>{name}</span>
      </div>
      <div className="client-actions">
        <button>View Project description</button>
        <button>Write progress</button>
        <button>Submit GitHub link</button>
      </div>
    </div>
  );
};

const MyProfile = () => {
  const clients = ["name1", "name2", "name3", "name4"];

  return (
    <div className="profile-container">
      <Sidebar />

      <div className="profile-content">
        <h1>My Profile</h1>
        <p className="subtitle">
          Here is your profile. And your pending projects as well
        </p>

        {/* Edit Profile Section */}
        <div className="edit-profile">
          <div className="edit-header">
            <h2>Edit Your Profile</h2>
            <i className="fa-regular fa-user"></i>
          </div>

          <div className="edit-fields">
            <div className="field">
              <label>Name</label>
              <input type="text" placeholder="Enter your name" />
            </div>
            <div className="field">
              <label>Skill</label>
              <input type="text" placeholder="Enter your skill" />
            </div>
            <div className="field">
              <label>Experience</label>
              <input type="text" placeholder="Enter your experience" />
            </div>
            <div className="field">
              <label>Location</label>
              <input type="text" placeholder="Enter your location" />
            </div>
          </div>
        </div>

        {/* My Clients Section */}
        <div className="my-clients">
          <h2>My Clients</h2>
          {clients.map((client, index) => (
            <ClientCard key={index} name={client} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
