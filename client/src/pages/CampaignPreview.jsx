import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useCampaigns } from '../context/CampaignsContext.jsx';

function Popup({ title, url, headerColor, onClose, children }) {
  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup">
        <header className="popup__header" style={{ backgroundColor: headerColor }}>
          <h2>{title}</h2>
          <button type="button" className="popup__close" onClick={onClose} aria-label="Close popup">
            ×
          </button>
        </header>
        <div className="popup__body">
          <iframe src={url} title={title} className="popup__frame" loading="lazy" />
          {children}
        </div>
      </div>
    </div>
  );
}

export default function CampaignPreview() {
  const { slug } = useParams();
  const { isAuthenticated, loading } = useAuth();
  const { getCampaignBySlug } = useCampaigns();

  const campaign = getCampaignBySlug(slug || '');
  const isBrowser = typeof window !== 'undefined';
  const [showDelayPopup, setShowDelayPopup] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [delayComplete, setDelayComplete] = useState(false);
  const [exitComplete, setExitComplete] = useState(false);

  const inactivityTimerRef = useRef();
  const previousTitleRef = useRef(isBrowser ? document.title : '');

  const popupHeaderColor = campaign?.popupHeaderColor || '#1f2937';
  const delaySeconds = Number(campaign?.delayPopupWaitSeconds) || 15;

  useEffect(() => {
    if (!campaign || !isBrowser) {
      return undefined;
    }

    const previousTitle = previousTitleRef.current;
    document.title = `${campaign.pageTitle} | Campaign Preview`;

    return () => {
      document.title = previousTitle;
    };
  }, [campaign, isBrowser]);

  useEffect(() => {
    if (!campaign || !isBrowser) {
      return undefined;
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

    const scheduleDelayPopup = () => {
      window.clearTimeout(inactivityTimerRef.current);

      if (delayComplete || showDelayPopup) {
        return;
      }

      inactivityTimerRef.current = window.setTimeout(() => {
        setShowDelayPopup(true);
      }, delaySeconds * 1000);
    };

    scheduleDelayPopup();

    const handleInteraction = () => {
      scheduleDelayPopup();
    };

    events.forEach((eventName) => window.addEventListener(eventName, handleInteraction, { passive: true }));

    return () => {
      window.clearTimeout(inactivityTimerRef.current);
      events.forEach((eventName) => window.removeEventListener(eventName, handleInteraction));
    };
  }, [campaign, delaySeconds, delayComplete, showDelayPopup, isBrowser]);

  useEffect(() => {
    if (!campaign || !isBrowser) {
      return undefined;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !exitComplete) {
        setShowExitPopup(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [campaign, exitComplete, isBrowser]);

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!campaign) {
    return (
      <section className="page campaign-preview">
        <h1>Campaign not found</h1>
        <p>The campaign you are trying to preview could not be located.</p>
        <Link to="/campaigns" className="button secondary">
          Back to campaigns
        </Link>
      </section>
    );
  }

  const handleCloseDelayPopup = () => {
    setShowDelayPopup(false);
    setDelayComplete(true);
    if (campaign.urlAfterDelayPopupCloses && isBrowser) {
      window.open(campaign.urlAfterDelayPopupCloses, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCloseExitPopup = () => {
    setShowExitPopup(false);
    setExitComplete(true);
    if (campaign.urlAfterExitPopupCloses && isBrowser) {
      window.open(campaign.urlAfterExitPopupCloses, '_blank', 'noopener,noreferrer');
    }
  };

  const previewBaseUrl = isBrowser ? window.location.origin : '';

  return (
    <section className="page campaign-preview">
      <header className="campaign-preview__header">
        <div>
          <Link to="/campaigns" className="back-link">
            ← Back to campaigns
          </Link>
          <h1>{campaign.pageTitle}</h1>
          <p className="campaign-preview__subtitle">
            Previewing <strong>{campaign.name}</strong> – Delay popup after {delaySeconds} seconds of inactivity,
            exit popup when the tab loses focus.
          </p>
        </div>
        <div className="campaign-preview__meta">
          <span className="badge">Slug: {campaign.slug}</span>
          <span className="badge">Popup colour: {campaign.popupHeaderColor}</span>
          <span className="badge">Preview: {previewBaseUrl}/campaigns/preview/{campaign.slug}</span>
        </div>
      </header>

      <div className="campaign-preview__layout">
        <div className="preview-frame">
          <iframe
            src={campaign.squeezePageUrl}
            title={`${campaign.name} squeeze page`}
            loading="lazy"
            className="preview-frame__content"
          />
        </div>

        <aside className="campaign-preview__sidebar">
          <h2>Flow summary</h2>
          <ol>
            <li>
              <strong>Squeeze page</strong> loads first: {campaign.squeezePageUrl}
            </li>
            <li>
              <strong>Delay popup</strong> after {delaySeconds} seconds of inactivity: {campaign.delayPopupUrl}
            </li>
            <li>
              <strong>Delay popup close</strong> opens in new tab: {campaign.urlAfterDelayPopupCloses}
            </li>
            <li>
              <strong>Exit popup</strong> when tab loses focus: {campaign.exitPopupUrl}
            </li>
            <li>
              <strong>Exit popup close</strong> opens in new tab: {campaign.urlAfterExitPopupCloses}
            </li>
          </ol>
          <p className="campaign-preview__hint">
            Tip: switch to a different browser tab or window to trigger the exit popup.
          </p>
        </aside>
      </div>

      {showDelayPopup ? (
        <Popup
          title="Delay Popup"
          url={campaign.delayPopupUrl}
          headerColor={popupHeaderColor}
          onClose={handleCloseDelayPopup}
        >
          <p className="popup__hint">
            Closing this popup opens{' '}
            <a href={campaign.urlAfterDelayPopupCloses} target="_blank" rel="noopener noreferrer">
              {campaign.urlAfterDelayPopupCloses}
            </a>{' '}
            in a new tab.
          </p>
        </Popup>
      ) : null}

      {showExitPopup ? (
        <Popup
          title="Exit Popup"
          url={campaign.exitPopupUrl}
          headerColor={popupHeaderColor}
          onClose={handleCloseExitPopup}
        >
          <p className="popup__hint">
            Closing this popup opens{' '}
            <a href={campaign.urlAfterExitPopupCloses} target="_blank" rel="noopener noreferrer">
              {campaign.urlAfterExitPopupCloses}
            </a>{' '}
            in a new tab.
          </p>
        </Popup>
      ) : null}
    </section>
  );
}

