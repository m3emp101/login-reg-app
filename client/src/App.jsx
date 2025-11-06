import { Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AddCampaign from './pages/AddCampaign.jsx';
import CampaignPreview from './pages/CampaignPreview.jsx';
import Campaigns from './pages/Campaigns.jsx';
import Contact from './pages/Contact.jsx';
import Help from './pages/Help.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import './App.css';

function App() {
  const { loading } = useAuth();

  return (
    <div className="app-shell">
      <Header />
      <main className="container main-content">
        {loading ? <p className="loading">Checking your session…</p> : null}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/new" element={<AddCampaign />} />
          <Route path="/campaigns/preview/:slug" element={<CampaignPreview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Campaign Central. Built with the MERN stack.</p>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <section className="page">
      <h1>Page not found</h1>
      <p>We couldn&apos;t find the page you&apos;re looking for. Use the navigation above to continue.</p>
    </section>
  );
}

export default App;
