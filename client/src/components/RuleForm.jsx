import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const [audienceSize, setAudienceSize] = useState(0);
  const navigate = useNavigate();

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
      const filterRes = await axios.post('http://localhost:5000/api/segments/filter', {
        rules,
        operator
      });

      setFilteredCustomers(filterRes.data);
      setAudienceSize(filterRes.data.length);

      const saveRes = await axios.post('http://localhost:5000/api/segments', {
        name: `Segment ${new Date().toLocaleString()}`,
        rules,
        operator,
        customers: filterRes.data.map(c => c._id)
      });

      onSubmit({ rules, operator });
      navigate('/campaigns/new', {
        state: {
          segment: saveRes.data,
          customers: filterRes.data
        }
      });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic input styles based on rule type
  const getInputStyle = () => ({
    width: '100%',
    marginTop: '4px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '8px 12px',
    backgroundColor: '#fff',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: '#a0aec0'
    },
    ':focus': {
      outline: 'none',
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)'
    }
  });

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '8px'
        }}>Create Customer Segment</h2>
        <p style={{ color: '#718096' }}>Define rules to target specific customer groups</p>
      </div>

      {/* Rule Builder */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#4a5568',
            marginBottom: '4px'
          }}>Filter By</label>
          <select
            style={getInputStyle()}
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
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#4a5568',
            marginBottom: '4px'
          }}>Value</label>
          {ruleType === 'lastVisitBefore' ? (
            <input
              type="date"
              style={getInputStyle()}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          ) : ruleType === 'customerType' ? (
            <select
              style={getInputStyle()}
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
              style={getInputStyle()}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={ruleType.includes('Less') ? 'Max value...' : 'Min value...'}
            />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            onClick={handleAddRule}
            disabled={!value}
            style={{
              width: '100%',
              backgroundColor: !value ? '#cbd5e0' : '#4299e1',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '500',
              border: 'none',
              cursor: !value ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              ':hover': {
                backgroundColor: !value ? '#cbd5e0' : '#3182ce'
              }
            }}
          >
            + Add Rule
          </button>
        </div>
      </div>

      {/* Rules Display */}
      {rules.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#4a5568' }}>
              Combine Rules Using:
            </span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                name="operator"
                value="and"
                checked={operator === 'and'}
                onChange={(e) => setOperator(e.target.value)}
                style={{ accentColor: '#4299e1' }}
              />
              AND
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                name="operator"
                value="or"
                checked={operator === 'or'}
                onChange={(e) => setOperator(e.target.value)}
                style={{ accentColor: '#4299e1' }}
              />
              OR
            </label>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {rules.map((r, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ebf8ff',
                border: '1px solid #bee3f8',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '14px'
              }}>
                <span style={{ marginRight: '8px' }}>
                  {ruleOptions.find(o => o.value === r.ruleType)?.label}: {r.value}
                </span>
                <button
                  onClick={() => handleRemoveRule(i)}
                  style={{
                    color: '#e53e3e',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleApplyRules}
          disabled={rules.length === 0 || isLoading}
          style={{
            backgroundColor: rules.length === 0 || isLoading ? '#cbd5e0' : '#38a169',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: '500',
            border: 'none',
            cursor: rules.length === 0 || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            ':hover': {
              backgroundColor: rules.length === 0 || isLoading ? '#cbd5e0' : '#2f855a'
            }
          }}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTopColor: '#fff',
                animation: 'spin 1s linear infinite'
              }}></span>
              Applying...
            </span>
          ) : (
            'Apply Filters'
          )}
        </button>
      </div>

      {/* Results */}
      {filteredCustomers.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
              Matching Customers ({filteredCustomers.length})
            </h3>
            <span style={{
              backgroundColor: '#ebf8ff',
              color: '#3182ce',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '14px'
            }}>
              {audienceSize} matches
            </span>
          </div>

          <div style={{
            overflowX: 'auto',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead style={{ backgroundColor: '#f7fafc' }}>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Total Spend</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Age</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c._id} style={{
                    borderBottom: '1px solid #e2e8f0',
                    ':hover': {
                      backgroundColor: '#f8fafc'
                    }
                  }}>
                    <td style={{ padding: '12px 16px' }}>{c.name}</td>
                    <td style={{ padding: '12px 16px', color: '#4299e1' }}>{c.email}</td>
                    <td style={{ padding: '12px 16px' }}>₹{c.totalSpend.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px' }}>{c.age}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: 
                          c.customerType === 'vip' ? '#fff5f5' :
                          c.customerType === 'regular' ? '#f0fff4' :
                          '#ebf8ff',
                        color:
                          c.customerType === 'vip' ? '#c53030' :
                          c.customerType === 'regular' ? '#276749' :
                          '#2b6cb0',
                        textTransform: 'capitalize'
                      }}>
                        {c.customerType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Animation for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RuleForm;