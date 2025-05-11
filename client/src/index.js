import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAuth from './components/GoogleLogin';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (credentialResponse) => {
    // You can verify the credentialResponse here or send it to your backend
    setIsAuthenticated(true);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <BrowserRouter> {/* Wrap your app with BrowserRouter */}
        {!isAuthenticated ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <GoogleAuth onSuccess={handleLoginSuccess} />
          </div>
        ) : (
          <App />
        )}
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
