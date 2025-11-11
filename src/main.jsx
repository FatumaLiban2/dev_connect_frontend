import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

console.log('main.jsx loaded');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    );
    console.log('React app rendered');
  } catch (error) {
    console.error('Error rendering app:', error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">
      <h1>Error loading app</h1>
      <pre>${error.message}\n${error.stack}</pre>
    </div>`;
  }
}
