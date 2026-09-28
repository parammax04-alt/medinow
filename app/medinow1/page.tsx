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

export default function Medinow1Page() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setShowSplash(false), 2200);
    return () => window.clearTimeout(splashTimer);
  }, []);

  return showSplash ? <SplashScreen /> : <Dashboard />;
}