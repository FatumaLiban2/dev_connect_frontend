import React, { useState, useEffect } from 'react';
import '../styles/FindDevelopers.css';
import DeveloperCard from '../components/DeveloperCard';
import ApiService from '../services/ApiService';

export default function FindDevelopers() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDevelopers();
  }, []);

  const loadDevelopers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllDevelopers();
      console.log('Loaded developers:', data);
      setDevelopers(data);
    } catch (err) {
      console.error('Failed to load developers:', err);
      setError(err.message || 'Failed to load developers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      loadDevelopers();
      return;
    }

    try {
      const data = await ApiService.searchDevelopers(query);
      setDevelopers(data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="find-dev-page">
      <section className="find-dev-header">
        <h1>Find Developers</h1>
        <p className="subtitle">Discover skilled developers. Browse trusted professionals to match your project needs.</p>

        <div className="search-row">
          <input 
            className="search-input" 
            placeholder="search developer by name, skill or rating"
            value={searchQuery}
            onChange={handleSearch}
          />
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
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading developers...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadDevelopers}>Retry</button>
          </div>
        )}

        {!loading && !error && developers.length === 0 && (
          <div className="empty-state">
            <p>No developers found</p>
          </div>
        )}

        {!loading && !error && developers.length > 0 && developers.map(dev => (
          <DeveloperCard key={dev.id} developer={dev} />
        ))}
      </section>
    </div>
  );
}
