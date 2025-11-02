import React from 'react';
import '../styles/FindDevelopers.css';
import DeveloperCard from '../components/DeveloperCard';

const mockDevelopers = [
  { id: 1, name: 'Issa Old', role: 'Full Stack Developer', rating: 4.5 },
  { id: 2, name: 'Fatma Omar', role: 'UI/UX Designer', rating: 4.8 },
  { id: 3, name: 'Kiki Jamal', role: 'Software Engineer', rating: 4.6 },
  { id: 4, name: 'Ammar sun', role: 'Frontend Developer', rating: 4.7 },
  { id: 5, name: 'Richard Kababa', role: 'Backend Developer', rating: 4.4 },
];

export default function FindDevelopers() {
  return (
    <div className="find-dev-page">
      <section className="find-dev-header">
        <h1>Find Developers</h1>
        <p className="subtitle">Discover skilled developers. Browse trusted professionals to match your project needs.</p>

        <div className="search-row">
          <input className="search-input" placeholder="search developer by name, skill or rating" />
        </div>
      </section>

      <section className="filters-card">
        <div className="filters">
          <button className="filter">experience ▾</button>
          <button className="filter">skills ▾</button>
          <button className="filter">location ▾</button>
        </div>
        <div className="best-matches">best matches</div>
      </section>

      <section className="results-card">
        {mockDevelopers.map(dev => (
          <DeveloperCard key={dev.id} developer={dev} />
        ))}
      </section>
    </div>
  );
}
