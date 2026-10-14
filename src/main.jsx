import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/waves.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/app.css';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
