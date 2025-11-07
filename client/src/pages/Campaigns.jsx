import { Link, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useCampaigns } from '../context/CampaignsContext.jsx';

export default function Campaigns() {
  const { isAuthenticated, loading } = useAuth();
  const { campaigns } = useCampaigns();
  const location = useLocation();

  const highlightSlug = location.state?.highlightSlug || null;
  const previewBaseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Your Campaign Landing Pages</h1>
          <p>
            Manage the URLs and popups a visitor experiences when they land on your campaign link. Use the preview link
            to test each flow.
          </p>
        </div>
        <Link to="/campaigns/new" className="button">
          Add campaign
        </Link>
      </header>

      {campaigns.length === 0 ? (
        <div className="empty-state">
          <p>You have no campaigns yet. Create your first landing flow to activate the preview experience.</p>
          <Link to="/campaigns/new" className="button secondary">
            Create campaign
          </Link>
        </div>
      ) : (
        <div className="campaigns-table" role="list">
          {campaigns.map((campaign) => (
            <article
              key={campaign.id}
              role="listitem"
              className={`campaign-row${campaign.slug === highlightSlug ? ' is-highlighted' : ''}`}
            >
              <div className="campaign-row__main">
                <h2>{campaign.name}</h2>
                <p className="campaign-row__meta">
                  <span className="campaign-row__slug">Slug: {campaign.slug}</span>
                  <span>Delay popup: {campaign.delayPopupWaitSeconds ?? 15}s</span>
                </p>
                <dl className="campaign-row__details">
                  <div>
                    <dt>Squeeze Page</dt>
                    <dd>
                      <a href={campaign.squeezePageUrl} target="_blank" rel="noopener noreferrer">
                        {campaign.squeezePageUrl}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Delay Popup</dt>
                    <dd>
                      <a href={campaign.delayPopupUrl} target="_blank" rel="noopener noreferrer">
                        {campaign.delayPopupUrl}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>After Delay Popup</dt>
                    <dd>
                      <a href={campaign.urlAfterDelayPopupCloses} target="_blank" rel="noopener noreferrer">
                        {campaign.urlAfterDelayPopupCloses}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Exit Popup</dt>
                    <dd>
                      <a href={campaign.exitPopupUrl} target="_blank" rel="noopener noreferrer">
                        {campaign.exitPopupUrl}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>After Exit Popup</dt>
                    <dd>
                      <a href={campaign.urlAfterExitPopupCloses} target="_blank" rel="noopener noreferrer">
                        {campaign.urlAfterExitPopupCloses}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="campaign-row__actions">
                <span className="campaign-row__title">{campaign.pageTitle}</span>
                <Link to={`/campaigns/preview/${campaign.slug}`} className="button secondary">
                  Preview flow
                </Link>
                <div className="campaign-row__preview-url">
                  <span>Preview URL</span>
                  <code>{`${previewBaseUrl}/campaigns/preview/${campaign.slug}`}</code>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
