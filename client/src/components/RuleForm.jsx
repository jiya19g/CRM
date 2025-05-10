import React, { useState } from 'react';
import axios from 'axios';

const RuleForm = ({ onSubmit }) => {  // <-- Accept onSubmit as a prop
  const [rules, setRules] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [ruleType, setRuleType] = useState('visitsLessThan');
  const [value, setValue] = useState('');

  const handleRuleSubmit = async () => {
    const newRule = {
      ruleType,
      value: parseInt(value),
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);

    try {
      const res = await axios.post('http://localhost:5000/api/customers/filter', {
        rules: updatedRules,
      });

      setFilteredCustomers(res.data);

      // Notify App component via onSubmit
      if (typeof onSubmit === 'function') {
        onSubmit(newRule);
      }
    } catch (err) {
      console.error('Error filtering customers:', err);
    }
  };

  return (
    <div>
      {/* Rule Selection */}
      <div>
        <label>Rule Type</label>
        <select onChange={(e) => setRuleType(e.target.value)} value={ruleType}>
          <option value="visitsLessThan">Visits Less Than</option>
          <option value="spendLessThan">Spend Less Than</option>
          <option value="ageGreaterThan">Age Greater Than</option>
        </select>
      </div>

      {/* Value Input */}
      <div>
        <label>Value</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      {/* Apply Rule */}
      <button onClick={handleRuleSubmit}>Apply Rule</button>

      {/* Display Filtered Customers */}
      {filteredCustomers.length > 0 && (
        <div>
          <h3>Filtered Customers</h3>
          <ul>
            {filteredCustomers.map((customer) => (
              <li key={customer._id}>
                {customer.name} - {customer.email} - ₹{customer.totalSpend}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RuleForm;
