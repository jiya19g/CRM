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
    return <div>No segment selected. Please create a segment first.</div>;
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
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Launch Campaign for "{segment.name}"</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Audience Size:</label>
        <span>{customers.length}</span>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Message</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={3}
          value={message}
          onChange={e => {
            setMessage(e.target.value);
            setSelectedIdx(null);
          }}
          placeholder='e.g. "Hi Mohit, here’s 10% off on your next order!"'
        />
        <button
          type="button"
          onClick={handleSuggestMessages}
          className="bg-blue-600 text-white px-3 py-2 rounded ml-2 mt-2"
          disabled={loadingSuggestions}
        >
          {loadingSuggestions ? 'Getting Suggestions...' : 'Suggest Messages'}
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">AI Suggestions (click to select):</h4>
          <ul>
            {suggestions.map((msg, idx) => (
              <li
                key={idx}
                className={`mb-2 p-2 rounded cursor-pointer border ${
                  selectedIdx === idx
                    ? 'bg-indigo-200 border-indigo-600'
                    : 'bg-gray-100 hover:bg-indigo-100 border-transparent'
                }`}
                onClick={() => handleSelectSuggestion(msg, idx)}
                title="Click to use this message"
              >
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
        onClick={handleLaunch}
        disabled={loading || !message}
      >
        {loading ? 'Launching...' : 'Launch Campaign'}
      </button>
      {customers.length > 0 && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold mb-2">Targeted Customers ({customers.length})</h3>
    <div className="overflow-x-auto max-h-64 border rounded shadow-inner bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Total Spend</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id} className="border-t hover:bg-indigo-50">
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2">{c.email}</td>
              <td className="px-4 py-2 capitalize">{c.customerType}</td>
              <td className="px-4 py-2">₹{c.totalSpend?.toLocaleString()}</td>
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

export default CampaignForm;