import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleAuth = ({ onSuccess }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #dbeafe 100%)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
      <div
        className="fade-in"
        style={{
          backgroundColor: '#fff',
          padding: '48px 40px',
          borderRadius: '20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          transition: 'transform 0.3s ease',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '16px',
          }}
        >
          Welcome to CRM Pro
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#475569',
            marginBottom: '32px',
          }}
        >
          Sign up or log in to continue
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => console.log('Login Failed')}
            shape="pill"
            theme="filled_blue"
            size="large"
            text="signin_with"
            width="300"
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleAuth;