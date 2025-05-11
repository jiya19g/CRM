import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/campaigns');
      setCampaigns(res.data);
    } catch (err) {
      alert('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div style={{
      maxWidth: '896px',
      margin: '32px auto',
      padding: '0 16px'
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
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700'
          }}>Campaign History</h1>
          <button
            onClick={fetchCampaigns}
            style={{
              backgroundColor: loading ? '#a5b4fc' : '#ffffff',
              color: loading ? 'white' : '#4f46e5',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              ':hover': {
                backgroundColor: loading ? '#a5b4fc' : '#e0e7ff'
              }
            }}
            disabled={loading}
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
                Refreshing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" style={{
                  height: '16px',
                  width: '16px'
                }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {campaigns.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{
                height: '48px',
                width: '48px',
                margin: '0 auto 16px',
                color: '#9ca3af'
              }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px'
              }}>No Campaigns Found</h3>
              <p style={{ color: '#6b7280' }}>You haven't launched any campaigns yet</p>
            </div>
          ) : (
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                overflowX: 'auto',
                maxHeight: 'calc(100vh - 200px)'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      {['Date', 'Segment', 'Audience', 'Sent', 'Failed', 'Message'].map((header) => (
                        <th key={header} style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((c, index) => (
                        <tr key={c._id} style={{
                          backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                          transition: 'background-color 0.2s',
                          ':hover': {
                            backgroundColor: '#f3f4f6'
                          }
                        }}>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: '#1f2937',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            {new Date(c.createdAt).toLocaleString()}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: '#1f2937',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            {c.segmentName || c.segmentId}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: '#1f2937',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            {c.audienceSize}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: '#10b981',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            {c.sent}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: '#ef4444',
                            borderBottom: '1px solid #e5e7eb'
                          }}>
                            {c.failed}
                          </td>
                          <td style={{
                            padding: '16px',
                            fontSize: '14px',
                            color: '#1f2937',
                            borderBottom: '1px solid #e5e7eb',
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {c.message}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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

export default CampaignHistory;