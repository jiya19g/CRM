import React, { useState } from 'react';
import axios from 'axios';

const ruleOptions = [
  { value: 'visitsLessThan', label: 'Visits Less Than' },
  { value: 'spendLessThan', label: 'Spend Less Than' },
  { value: 'ageGreaterThan', label: 'Age Greater Than' },
  { value: 'lastVisitBefore', label: 'Last Visit Before' },
  { value: 'customerType', label: 'Customer Type' },
];

const RuleForm = ({ onSubmit }) => {
  const [rules, setRules] = useState([]);
  const [ruleType, setRuleType] = useState('visitsLessThan');
  const [value, setValue] = useState('');
  const [operator, setOperator] = useState('and');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [audienceSize, setAudienceSize] = useState(0); // For preview audience size

  const handleAddRule = () => {
    if (!value) return;

    const newRule = {
      ruleType,
      value: ruleType.includes('age') || ruleType.includes('spend') || ruleType.includes('visits')
        ? parseInt(value)
        : ruleType === 'lastVisitBefore'
        ? new Date(value).toISOString()
        : value
    };

    setRules([...rules, newRule]);
    setValue('');
  };

  const handleRemoveRule = (index) => {
    const updatedRules = [...rules];
    updatedRules.splice(index, 1);
    setRules(updatedRules);
  };

  const handleApplyRules = async () => {
  if (rules.length === 0) return;

  setIsLoading(true);
  try {
    // First filter customers
    const filterRes = await axios.post('http://localhost:5000/api/segments/filter', {
      rules,
      operator
    });
    
    setFilteredCustomers(filterRes.data);
    setAudienceSize(filterRes.data.length);

    // Then save the segment
    const saveRes = await axios.post('http://localhost:5000/api/segments', {
      name: `Segment ${new Date().toLocaleString()}`,
      rules,
      operator,
      customers: filterRes.data.map(c => c._id)
    });

    onSubmit({ rules, operator });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    setIsLoading(false);
  }
};




  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-indigo-700">Create Customer Segment</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Filter By</label>
          <select
            className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
            value={ruleType}
            onChange={(e) => {
              setRuleType(e.target.value);
              setValue('');
            }}
          >
            {ruleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Value</label>
          {ruleType === 'lastVisitBefore' ? (
            <input
              type="date"
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : ruleType === 'customerType' ? (
            <select
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="vip">VIP</option>
              <option value="regular">Regular</option>
              <option value="new">New</option>
            </select>
          ) : (
            <input
              type="number"
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAddRule}
            disabled={!value}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
          >
            + Add Rule
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-2">
        <span className="text-sm font-medium text-gray-700">Combine Rules Using:</span>
        <label className="inline-flex items-center">
          <input type="radio" name="operator" value="and" checked={operator === 'and'} onChange={(e) => setOperator(e.target.value)} className="mr-2" />
          AND
        </label>
        <label className="inline-flex items-center">
          <input type="radio" name="operator" value="or" checked={operator === 'or'} onChange={(e) => setOperator(e.target.value)} className="mr-2" />
          OR
        </label>
        <button
          onClick={handleApplyRules}
          disabled={rules.length === 0 || isLoading}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700"
        >
          {isLoading ? 'Filtering...' : 'Apply Filters'}
        </button>
      </div>

      {rules.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Active Rules</h3>
          <div className="flex flex-wrap gap-2">
            {rules.map((r, i) => (
              <div key={i} className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
                <span className="mr-2">{r.ruleType}: {r.value}</span>
                <button
                  className="text-red-500 hover:text-red-700 font-bold"
                  onClick={() => handleRemoveRule(i)}
                  title="Remove rule"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredCustomers.length > 0 && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Filtered Customers ({filteredCustomers.length})</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Audience Size: {audienceSize} customers match the current rules.</p>
          </div>
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Total Spend</th>
                <th className="px-4 py-2 text-left">Age</th>
                <th className="px-4 py-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">₹{c.totalSpend.toLocaleString()}</td>
                  <td className="px-4 py-2">{c.age}</td>
                  <td className="px-4 py-2 capitalize">{c.customerType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RuleForm;
