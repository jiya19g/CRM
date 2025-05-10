import React, { useState } from 'react';
import GoogleAuth from './components/GoogleLogin';
import RuleForm from './components/RuleForm';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rules, setRules] = useState([]);

  const handleGoogleSuccess = (response) => {
    console.log('Google login success:', response);
    setIsAuthenticated(true); // In production, validate with backend
  };

  const handleRuleSubmit = async (rule) => {
    console.log('Submitting rule:', rule);
    setRules((prev) => [...prev, rule]);

    try {
      const res = await axios.post('http://localhost:5000/api/customers/filter', {
        rules: [...rules, rule],
      });
      console.log('Filtered customers:', res.data);
    } catch (err) {
      console.error('Error submitting rule:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>CRM Dashboard</h1>
      
      {!isAuthenticated ? (
        <GoogleAuth onSuccess={handleGoogleSuccess} />
      ) : (
        <>
          <RuleForm onSubmit={handleRuleSubmit} />
          <ul>
            {rules.map((r, idx) => (
              <li key={idx}>
                {r.ruleType} - {r.value}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
