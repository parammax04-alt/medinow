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

function OnboardingScreen({ step, onContinue }: { step: 1 | 2; onContinue: () => void }) {
  const isMedicineSearch = step === 2;
  return <main className="onboarding-screen" aria-label="MEDINOW introduction">
    <img
      className="onboarding-screen__image"
      src={isMedicineSearch ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-09-28%20at%206.28.43%20AM-00fc31ZC36xeO8v6rccRktPlCD5zwG.jpeg" : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-09-28%20at%206.00.50%20AM-cKjQg3wIWVvEMDQE4sAzHXUaoxTdK7.jpeg"}
      alt={isMedicineSearch ? "Find medicine in stock onboarding screen" : "Find nearby pharmacies onboarding screen"}
    />
    <button className="onboarding-screen__skip" type="button" aria-label="Skip introduction" onClick={onContinue}>Skip</button>
    <button className="onboarding-screen__continue" type="button" aria-label={isMedicineSearch ? "Continue to MEDINOW home" : "Continue to next introduction"} onClick={onContinue}>Continue</button>
  </main>;
}

export default function Medinow1Page() {
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => window.clearTimeout(splashTimer);
  }, []);

  if (showSplash) return <SplashScreen />;
  if (onboardingStep === 1) return <OnboardingScreen step={1} onContinue={() => setOnboardingStep(2)} />;
  if (onboardingStep === 2) return <OnboardingScreen step={2} onContinue={() => setOnboardingStep(3)} />;
  return <Dashboard />;
}
