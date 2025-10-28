import React from 'react';  
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>
      <h1>Welcome to DevConnect</h1>
      
      <nav>
        <Link to="/signup" style={{ marginRight: '1rem' }}>
          <button>Go to Sign Up</button>
        </Link>
        <Link to="/signin">
          <button>Go to Login</button>
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;
