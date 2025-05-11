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
    <div className="max-w-3xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Campaign History</h2>
        <button
          onClick={fetchCampaigns}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Segment</th>
              <th className="px-4 py-2 text-left">Audience</th>
              <th className="px-4 py-2 text-left">Sent</th>
              <th className="px-4 py-2 text-left">Failed</th>
              <th className="px-4 py-2 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {campaigns
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(c => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-2">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{c.segmentName || c.segmentId}</td>
                  <td className="px-4 py-2">{c.audienceSize}</td>
                  <td className="px-4 py-2">{c.sent}</td>
                  <td className="px-4 py-2">{c.failed}</td>
                  <td className="px-4 py-2">{c.message}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CampaignHistory;