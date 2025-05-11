import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const CampaignForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.state?.segment;
  const customers = location.state?.customers || [];

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  if (!segment) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          padding: '24px',
          maxWidth: '448px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px'
          }}>No Segment Selected</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '16px'
          }}>Please create a segment first to launch your campaign</p>
          <button 
            onClick={() => navigate('/segments')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              ':hover': {
                backgroundColor: '#4338ca'
              }
            }}
          >
            Create Segment
          </button>
        </div>
      </div>
    );
  }

  const handleLaunch = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/campaigns', {
        segmentId: segment._id,
        message,
      });
      navigate('/campaigns');
    } catch (err) {
      alert('Failed to launch campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestMessages = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/suggest-messages', {
        objective: message || "Bring back inactive users with a 10% off offer."
      });
      setSuggestions(res.data.suggestions);
      setSelectedIdx(null);
    } catch (err) {
      alert('Failed to get AI suggestions');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSelectSuggestion = (msg, idx) => {
    setMessage(msg);
    setSelectedIdx(idx);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '32px 16px'
    }}>
      <div style={{
        maxWidth: '896px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(to right, #4f46e5, #2563eb)',
            padding: '24px',
            color: 'white'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '4px'
            }}>Launch New Campaign</h1>
            <p style={{ opacity: 0.9 }}>Targeting: {segment.name}</p>
          </div>

          {/* Main Content */}
          <div style={{ padding: '24px' }}>
            {/* Audience Info */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: '#eff6ff',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  backgroundColor: '#dbeafe',
                  padding: '8px',
                  borderRadius: '9999px',
                  marginRight: '12px'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{
                    height: '24px',
                    width: '24px',
                    color: '#2563eb'
                  }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p style={{
                    fontSize: '14px',
                    color: '#4b5563'
                  }}>Audience Size</p>
                  <p style={{
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>{customers.length} customers</p>
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px'
              }}>Campaign Message</h2>
              <div style={{ marginBottom: '12px' }}>
                <textarea
                  style={{
                    width: '100%',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    minHeight: '120px',
                    ':focus': {
                      outline: 'none',
                      borderColor: '#818cf8',
                      boxShadow: '0 0 0 3px rgba(129, 140, 248, 0.2)'
                    }
                  }}
                  rows={4}
                  value={message}
                  onChange={e => {
                    setMessage(e.target.value);
                    setSelectedIdx(null);
                  }}
                  placeholder='Example: "Hi {name}, enjoy 10% off your next purchase as our valued customer!"'
                />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  type="button"
                  onClick={handleSuggestMessages}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#e0e7ff',
                    color: '#4f46e5',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: '#c7d2fe'
                    },
                    ':disabled': {
                      opacity: 0.7,
                      cursor: 'not-allowed'
                    }
                  }}
                  disabled={loadingSuggestions}
                >
                  {loadingSuggestions ? (
                    <>
                      <div style={{
                        display: 'inline-block',
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(79, 70, 229, 0.3)',
                        borderRadius: '50%',
                        borderTopColor: '#4f46e5',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" style={{
                        height: '20px',
                        width: '20px'
                      }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Get AI Suggestions</span>
                    </>
                  )}
                </button>
                <div style={{
                  fontSize: '14px',
                  color: '#9ca3af'
                }}>
                  {message.length}/500 characters
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '12px'
                }}>AI Message Suggestions</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '12px'
                }}>
                  {suggestions.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: selectedIdx === idx ? '1px solid #6366f1' : '1px solid #e5e7eb',
                        backgroundColor: selectedIdx === idx ? '#eef2ff' : '#f9fafb',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        ':hover': {
                          borderColor: '#a5b4fc',
                          backgroundColor: '#e0e7ff'
                        }
                      }}
                      onClick={() => handleSelectSuggestion(msg, idx)}
                    >
                      <p style={{ color: '#1f2937' }}>{msg}</p>
                      {selectedIdx === idx && (
                        <p style={{
                          fontSize: '12px',
                          color: '#4f46e5',
                          marginTop: '4px'
                        }}>✓ Selected</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customers Table */}
            {customers.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>Targeted Customers</h2>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    overflowX: 'auto',
                    maxHeight: '384px'
                  }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse'
                    }}>
                      <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                          <th style={{
                            padding: '12px 24px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>Name</th>
                          <th style={{
                            padding: '12px 24px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>Email</th>
                          <th style={{
                            padding: '12px 24px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>Type</th>
                          <th style={{
                            padding: '12px 24px',
                            textAlign: 'left',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>Total Spend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((c) => (
                          <tr key={c._id} style={{
                            borderTop: '1px solid #e5e7eb',
                            transition: 'background-color 0.2s',
                            ':hover': {
                              backgroundColor: '#f3f4f6'
                            }
                          }}>
                            <td style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#1f2937'
                            }}>{c.name}</td>
                            <td style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              color: '#3b82f6'
                            }}>{c.email}</td>
                            <td style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              color: '#1f2937'
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: 
                                  c.customerType === 'vip' ? '#f3e8ff' :
                                  c.customerType === 'regular' ? '#dcfce7' :
                                  '#dbeafe',
                                color:
                                  c.customerType === 'vip' ? '#9333ea' :
                                  c.customerType === 'regular' ? '#166534' :
                                  '#1e40af',
                                textTransform: 'capitalize'
                              }}>
                                {c.customerType}
                              </span>
                            </td>
                            <td style={{
                              padding: '16px 24px',
                              fontSize: '14px',
                              color: '#1f2937'
                            }}>₹{c.totalSpend?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#4b5563',
                  fontWeight: '500',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  ':hover': {
                    backgroundColor: '#f9fafb'
                  }
                }}
              >
                Back
              </button>
              <button
                onClick={handleLaunch}
                disabled={loading || !message}
                style={{
                  padding: '8px 24px',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: '500',
                  backgroundColor: loading || !message ? '#a5b4fc' : '#4f46e5',
                  border: 'none',
                  cursor: loading || !message ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  ':hover': {
                    backgroundColor: loading || !message ? '#a5b4fc' : '#4338ca'
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '50%',
                      borderTopColor: 'white',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Launching...
                  </>
                ) : (
                  'Launch Campaign'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CampaignForm;