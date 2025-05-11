import React, { useState } from 'react';
import GoogleAuth from './components/GoogleLogin';
import RuleForm from './components/RuleForm';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeRule, setActiveRule] = useState(null);

  const handleGoogleSuccess = (response) => {
    console.log('Google login success:', response);
    setIsAuthenticated(true);
  };

  const handleRuleSubmit = (rule) => {
    setActiveRule(rule);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-indigo-600">CRM Campaign Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto mt-10 text-center">
            <h2 className="text-xl font-semibold mb-4">Sign in to continue</h2>
            <GoogleAuth onSuccess={handleGoogleSuccess} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <RuleForm onSubmit={handleRuleSubmit} />
              </div>
            </div>

            {activeRule && (
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Active Filter</h3>
                <div className="mt-2 flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {activeRule.ruleType}: {activeRule.value}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;