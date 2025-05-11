import React, { useState } from 'react';
import RuleForm from './components/RuleForm';

const App = () => {
  const [activeRules, setActiveRules] = useState([]);
  const [activeOperator, setActiveOperator] = useState('');

  const handleFilterSubmit = ({ rules, operator }) => {
    setActiveRules(rules);
    setActiveOperator(operator);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h1 className="text-2xl font-bold text-indigo-800 mb-6">🎯 CRM Campaign Dashboard</h1>

      <RuleForm onSubmit={handleFilterSubmit} />

      {activeRules.length > 0 && (
        <div className="mt-10 bg-white shadow-md rounded-lg p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🔎 Active Filters</h3>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Combined Using:</span>{' '}
            <span className="uppercase text-indigo-600 font-semibold">{activeOperator}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {activeRules.map((rule, index) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
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
