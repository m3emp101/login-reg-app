import { NavLink, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const navLinkClassName = ({ isActive }) => (isActive ? 'active' : undefined);

export default function Header() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="logo">
          Campaign Central
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end className={navLinkClassName}>
            Home
          </NavLink>
          <NavLink to="/help" className={navLinkClassName}>
            Help
          </NavLink>
          <NavLink to="/contact" className={navLinkClassName}>
            Contact
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/campaigns" className={navLinkClassName}>
                Campaigns
              </NavLink>
              <NavLink to="/campaigns/new" className={navLinkClassName}>
                Add Campaign
              </NavLink>
              <button
                type="button"
                className="link-button"
                onClick={logout}
                disabled={loading}
              >
                Logout{user?.name ? ` (${user.name})` : ''}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClassName}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClassName}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
