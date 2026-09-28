'use client';

import { useEffect, useState } from "react";
import Dashboard from "../dashboard";

function SplashScreen() {
  return <main className="app-splash" aria-label="MEDINOW loading">
    <div className="app-splash__glow" aria-hidden="true" />
    <section className="app-splash__content">
      <div className="app-splash__mark" aria-hidden="true"><span className="app-splash__capsule" /><span className="app-splash__cross">+</span><span className="app-splash__tablet" /></div>
      <div className="app-splash__brand"><strong>MEDI</strong><strong>NOW</strong></div>
      <p>Better Health. Faster.</p>
      <small>Find. Order. Receive.</small>
    </section>
    <div className="app-splash__loader" role="progressbar" aria-label="Loading MEDINOW"><span /></div>
  </main>;
}

function OnboardingScreen({ onContinue }: { onContinue: () => void }) {
  return <main className="onboarding-screen" aria-label="MEDINOW introduction">
    <img
      className="onboarding-screen__image"
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-09-28%20at%206.00.50%20AM-cKjQg3wIWVvEMDQE4sAzHXUaoxTdK7.jpeg"
      alt="Find nearby pharmacies onboarding screen"
    />
    <button className="onboarding-screen__skip" type="button" aria-label="Skip introduction" onClick={onContinue}>Skip</button>
    <button className="onboarding-screen__continue" type="button" aria-label="Continue to MEDINOW home" onClick={onContinue}>Continue</button>
  </main>;
}

export default function Medinow1Page() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      setShowSplash(false);
      setShowOnboarding(true);
    }, 2200);
    return () => window.clearTimeout(splashTimer);
  }, []);

  if (showSplash) return <SplashScreen />;
  if (showOnboarding) return <OnboardingScreen onContinue={() => setShowOnboarding(false)} />;
  return <Dashboard />;
}
