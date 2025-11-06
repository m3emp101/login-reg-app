import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { apiClient } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Campaigns() {
  const { token, isAuthenticated, loading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsFetching(false);
      return;
    }

    let isMounted = true;
    setIsFetching(true);
    setError(null);

    apiClient('/campaigns', { token })
      .then((data) => {
        if (isMounted) {
          setCampaigns(data.campaigns || []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to load campaigns');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsFetching(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="page">
      <h1>Your Campaigns</h1>
      <p>Track momentum across every initiative and keep your supporters informed.</p>
      {isFetching ? (
        <p>Loading campaigns…</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : campaigns.length === 0 ? (
        <p>You have no campaigns yet. Launch your first initiative to see it here.</p>
      ) : (
        <div className="grid">
          {campaigns.map((campaign) => (
            <article key={campaign.id} className="card">
              <h2>{campaign.name}</h2>
              <p>{campaign.description}</p>
              <p className="campaign-status">
                <strong>Status:</strong> {campaign.status}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
