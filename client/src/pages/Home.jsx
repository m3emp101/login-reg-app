import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="page">
      <h1>Welcome to Campaign Central</h1>
      <p>
        Plan, launch, and track your outreach campaigns with ease. From donor updates to community
        projects, Campaign Central keeps your team aligned and your supporters informed.
      </p>
      <div className="cta-buttons">
        {isAuthenticated ? (
          <Link className="button" to="/campaigns">
            View Campaigns
          </Link>
        ) : (
          <>
            <Link className="button" to="/register">
              Get Started
            </Link>
            <Link className="button secondary" to="/login">
              I already have an account
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
