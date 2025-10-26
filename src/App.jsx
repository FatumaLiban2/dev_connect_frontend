import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Placeholder routes - pages to be created later */}
            <Route path="/" element={<div className="placeholder">Home Page</div>} />
            <Route path="/features" element={<div className="placeholder">Features Page</div>} />
            <Route path="/about" element={<div className="placeholder">About Page</div>} />
            <Route path="/contact" element={<div className="placeholder">Contact Page</div>} />
            <Route path="/services" element={<div className="placeholder">Services Page</div>} />
            <Route path="/use-cases" element={<div className="placeholder">Use Cases Page</div>} />
            <Route path="/pricing" element={<div className="placeholder">Pricing Page</div>} />
            <Route path="/blog" element={<div className="placeholder">Blog Page</div>} />
            <Route path="/signin" element={<div className="placeholder">Sign In Page</div>} />
            <Route path="/signup" element={<div className="placeholder">Sign Up Page</div>} />
            <Route path="/privacy" element={<div className="placeholder">Privacy Policy Page</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
