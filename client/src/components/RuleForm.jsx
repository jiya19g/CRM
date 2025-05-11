import React, { useState } from 'react';
import axios from 'axios';

const RuleForm = ({ onSubmit }) => {
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [ruleType, setRuleType] = useState('visitsLessThan');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ruleOptions = [
    { value: 'visitsLessThan', label: 'Visits Less Than' },
    { value: 'spendLessThan', label: 'Spend Less Than' },
    { value: 'ageGreaterThan', label: 'Age Greater Than' },
    { value: 'lastVisitBefore', label: 'Last Visit Before' },
    { value: 'customerType', label: 'Customer Type' },
  ];

  const handleRuleSubmit = async () => {
    if (!value) return;
    
    setIsLoading(true);
    const newRule = {
      ruleType,
      value: ruleType.includes('age') ? parseInt(value) : 
            ruleType.includes('Visit') ? new Date(value).toISOString() :
            value
    };

    try {
      const res = await axios.post('http://localhost:5000/api/customers/filter', {
        rules: [newRule]
      });
      setFilteredCustomers(res.data);
      onSubmit(newRule);
    } catch (err) {
      console.error('Error filtering customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-3">Create Customer Segment</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ruleType" className="block text-sm font-medium text-gray-700">
              Filter By
            </label>
            <select
              id="ruleType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={ruleType}
              onChange={(e) => {
                setRuleType(e.target.value);
                setValue('');
              }}
            >
              {ruleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">
              Value
            </label>
            {ruleType === 'lastVisitBefore' ? (
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            ) : ruleType === 'customerType' ? (
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="">Select type</option>
                <option value="vip">VIP</option>
                <option value="regular">Regular</option>
                <option value="new">New</option>
              </select>
            ) : (
              <input
                type={ruleType.includes('age') || ruleType.includes('spend') || ruleType.includes('visits') ? "number" : "text"}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter ${ruleType.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleRuleSubmit}
          disabled={!value || isLoading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${!value || isLoading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Applying...
            </>
          ) : 'Apply Filter'}
        </button>
      </div>

      {filteredCustomers.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Filtered Customers ({filteredCustomers.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spend</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{customer.totalSpend.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.customerType === 'vip' ? 'bg-purple-100 text-purple-800' : customer.customerType === 'regular' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {customer.customerType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleForm;