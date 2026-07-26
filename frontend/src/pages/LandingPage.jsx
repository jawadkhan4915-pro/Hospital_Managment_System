import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import TrustStatsBar from '../components/landing/TrustStatsBar.jsx';
import RoleShowcase from '../components/landing/RoleShowcase.jsx';
import FeatureGrid from '../components/landing/FeatureGrid.jsx';
import SecurityStrip from '../components/landing/SecurityStrip.jsx';
import CtaBanner from '../components/landing/CtaBanner.jsx';
import LandingFooter from '../components/landing/LandingFooter.jsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 overflow-x-hidden">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustStatsBar />
        <RoleShowcase />
        <FeatureGrid />
        <SecurityStrip />
        <CtaBanner />
      </main>
      <LandingFooter />
    </div>
  );
}
