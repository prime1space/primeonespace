"use client";

import { LandingPage } from "@/components/LandingPage";
import { useEffect, useState } from "react";

import { baseURL } from "@/lib/auth-client";

export default function Home() {
  const [dbPricing, setDbPricing] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activeOffers, setActiveOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Use centralized baseURL (likely .../api/router.php in production)
      const API_URL = baseURL;

      try {
        const [pricingRes, announcementsRes, offersRes] = await Promise.all([
          fetch(`${API_URL}/pricing`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => Array.isArray(data) ? data : [])
            .catch(() => []),
          fetch(`${API_URL}/announcements`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => Array.isArray(data) ? data : [])
            .catch(() => []),
          fetch(`${API_URL}/offers`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => Array.isArray(data) ? data : [])
            .catch(() => [])
        ]);

        setDbPricing(pricingRes);
        setAnnouncements(announcementsRes);
        setActiveOffers(offersRes);
      } catch (globalError) {
        console.warn("Failed to fetch initial data from backend", globalError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <LandingPage
      initialPricing={dbPricing}
      announcements={announcements}
      activeOffers={activeOffers}
    />
  );
}