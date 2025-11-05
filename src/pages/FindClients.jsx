import React from 'react';
import '../styles/FindClients.css';
import ClientCard from '../components/ClientCard';

const mockClients = [
  { id: 1, name: 'Name1', description: 'Project description' },
  { id: 2, name: 'Name2', description: 'Project description' },
  { id: 3, name: 'Name3', description: 'Project description' },
  { id: 4, name: 'Name4', description: 'Project description' },
  { id: 5, name: 'Name5', description: 'Project description' },
];

export default function FindClients() {
  return (
    <div className="find-clients-page">
      <section className="find-clients-header">
        <h1>Find Clients</h1>
        <p className="subtitle">Discover skilled clients. Here are the profiles.</p>
      </section>

      <section className="clients-list-card">
        {mockClients.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}
      </section>
    </div>
  );
}
