import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      position: 'sticky',
      top: '0',
      zIndex: '20'
    }}>
      <div style={{
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '16px',
        paddingBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#4338ca',
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '-0.025em'
          }}>
            <svg style={{
              width: '28px',
              height: '28px',
              marginRight: '8px',
              color: '#6366f1'
            }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            CRM Campaign Dashboard
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            style={{
              color: '#6b7280',
              transition: 'color 0.2s',
              padding: '8px',
              borderRadius: '9999px',
              ':hover': {
                color: '#4f46e5',
                backgroundColor: '#eef2ff'
              }
            }}
            title="Notifications"
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div style={{ position: 'relative' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#374151',
              transition: 'color 0.2s',
              outline: 'none',
              ':hover': {
                color: '#4338ca'
              }
            }}>
              <span style={{
                display: 'none',
                '@media (min-width: 768px)': {
                  display: 'inline-block'
                },
                fontWeight: '500'
              }}>Admin User</span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                backgroundColor: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4f46e5',
                fontWeight: '600',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                border: '1px solid #c7d2fe'
              }}>
                AU
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;