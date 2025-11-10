import { Link, useParams } from 'react-router-dom';

import { useCampaigns } from '../context/CampaignsContext.jsx';

export default function CampaignAnalytics() {
  const { slug } = useParams();
  const { getCampaignBySlug } = useCampaigns();
  const campaign = getCampaignBySlug(slug);

  if (!campaign) {
    return (
      <section className="page">
        <h1>Campaign analytics</h1>
        <p>We couldn&apos;t find a campaign with that slug. Please return to your campaign list.</p>
        <Link to="/campaigns" className="button secondary">
          Back to campaigns
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>{campaign.name} analytics</h1>
          <p>
            Analytics reporting is coming soon. In the meantime you can preview the campaign flow or update the campaign
            settings.
          </p>
        </div>
        <Link to="/campaigns" className="button secondary">
          Back to campaigns
        </Link>
      </header>

      <div className="empty-state">
        <p>We&apos;re still building detailed analytics dashboards for your campaigns.</p>
        <div className="campaign-row__quick-actions" role="group" aria-label="Campaign quick links">
          <Link to={`/campaigns/preview/${campaign.slug}`}>View campaign</Link>
          <Link to="/campaigns">Campaign list</Link>
        </div>
      </div>
    </section>
  );
}
