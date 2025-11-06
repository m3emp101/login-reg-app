import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';

const CampaignsContext = createContext(null);
const STORAGE_KEY = 'campaign_central_campaigns';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  const randomSegment = Math.random().toString(16).slice(2, 8);
  return `cmp-${Date.now().toString(16)}-${randomSegment}`;
};

const readInitialCampaigns = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.warn('Unable to read stored campaigns:', error);
    return [];
  }
};

export function CampaignsProvider({ children }) {
  const [campaigns, setCampaigns] = useState(readInitialCampaigns);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch (error) {
      console.warn('Unable to persist campaigns:', error);
    }
  }, [campaigns]);

  const addCampaign = useCallback((campaignInput) => {
    setCampaigns((prev) => {
      const id = generateId();
      const createdAt = new Date().toISOString();
      return [...prev, { ...campaignInput, id, createdAt }];
    });
  }, []);

  const findBySlug = useCallback(
    (slug) => campaigns.find((campaign) => campaign.slug.toLowerCase() === slug.toLowerCase()) || null,
    [campaigns]
  );

  const value = useMemo(
    () => ({
      campaigns,
      addCampaign,
      getCampaignBySlug: findBySlug,
    }),
    [campaigns, addCampaign, findBySlug]
  );

  return <CampaignsContext.Provider value={value}>{children}</CampaignsContext.Provider>;
}

export function useCampaigns() {
  const context = useContext(CampaignsContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignsProvider');
  }
  return context;
}

