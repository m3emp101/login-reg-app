import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useCampaigns } from '../context/CampaignsContext.jsx';

export default function Campaigns() {
  const { isAuthenticated, loading } = useAuth();
  const { campaigns } = useCampaigns();
  const location = useLocation();
  const [copyStatus, setCopyStatus] = useState({ slug: null, state: 'idle' });

  const highlightSlug = location.state?.highlightSlug || null;
  const previewBaseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyPreviewLink = async (slug, url) => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateStatus = (state) => {
      setCopyStatus({ slug, state });
      window.setTimeout(() => {
        setCopyStatus((previous) => (previous.slug === slug ? { slug: null, state: 'idle' } : previous));
      }, 2000);
    };

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else if (typeof document !== 'undefined') {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } else {
        throw new Error('Clipboard API not available');
      }

      updateStatus('success');
    } catch (error) {
      console.error('Unable to copy preview link', error);
      updateStatus('error');
    }
  };

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
            {campaigns.map((campaign) => {
              const previewUrl = `${previewBaseUrl}/campaigns/preview/${campaign.slug}`;

              return (
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
                    <div className="campaign-row__quick-actions" role="group" aria-label="Campaign actions">
                      <button type="button" onClick={() => handleCopyPreviewLink(campaign.slug, previewUrl)}>
                        Copy
                      </button>
                      <Link to={`/campaigns/preview/${campaign.slug}`}>View</Link>
                      <Link to={`/campaigns/${campaign.slug}/analytics`}>Analytics</Link>
                    </div>
                    {copyStatus.slug === campaign.slug && copyStatus.state !== 'idle' ? (
                      <span className={`campaign-row__copy-status${copyStatus.state === 'error' ? ' is-error' : ''}`}>
                        {copyStatus.state === 'error' ? 'Copy failed' : 'Link copied'}
                      </span>
                    ) : null}
                    <span className="campaign-row__title">{campaign.pageTitle}</span>
                    <Link to={`/campaigns/preview/${campaign.slug}`} className="button secondary">
                      Preview flow
                    </Link>
                    <div className="campaign-row__preview-url">
                      <span>Preview URL</span>
                      <code>{previewUrl}</code>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
    </section>
  );
}
