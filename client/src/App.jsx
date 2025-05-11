import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import RuleForm from './components/RuleForm';
import SegmentHistory from './components/SegmentHistory';
import CampaignForm from './components/CampaignForm';
import CampaignHistory from './components/CampaignHistory';

const App = () => {
  const [activeRules, setActiveRules] = useState([]);
  const [activeOperator, setActiveOperator] = useState('');

  const handleFilterSubmit = ({ rules, operator }) => {
    setActiveRules(rules);
    setActiveOperator(operator);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '32px 24px'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#3730a3',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>CRM Campaign Dashboard</h1>

      <Routes>
        <Route path="/" element={<RuleForm onSubmit={handleFilterSubmit} />} />
        <Route path="/segments" element={<SegmentHistory />} />
        <Route path="/campaigns/new" element={<CampaignForm />} />
        <Route path="/campaigns" element={<CampaignHistory />} />
      </Routes>

      {activeRules.length > 0 && (
        <div style={{
          marginTop: '40px',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>🔎 Active Filters</h3>
          <p style={{
            fontSize: '14px',
            color: '#4b5563',
            marginBottom: '8px'
          }}>
            <span style={{ fontWeight: '500' }}>Combined Using:</span>{' '}
            <span style={{
              textTransform: 'uppercase',
              color: '#4f46e5',
              fontWeight: '600'
            }}>{activeOperator}</span>
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {activeRules.map((rule, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  fontSize: '14px',
                  padding: '4px 12px',
                  borderRadius: '9999px'
                }}
              >
                {rule.ruleType}: {rule.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;