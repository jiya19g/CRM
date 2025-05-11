import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SegmentHistory = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/segments');
        setSegments(response.data);
      } catch (error) {
        console.error('Error fetching segments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSegments();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Saved Segments</h2>
      {segments.length === 0 ? (
        <p>No segments created yet.</p>
      ) : (
        <div className="grid gap-4">
          {segments.map(segment => (
            <div key={segment._id} className="border p-4 rounded-lg shadow-sm">
              <h3 className="font-medium">{segment.name}</h3>
              <p className="text-sm text-gray-600">
                {segment.customers?.length || 0} customers
              </p>
              <div className="mt-2">
                {segment.rules.map((rule, i) => (
                  <span key={i} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                    {rule.ruleType}: {rule.value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SegmentHistory;
