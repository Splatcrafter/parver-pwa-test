import { useState } from 'react';
import { FeatureCard } from './FeatureCard';

export function ShareApi() {
  const [shared, setShared] = useState(false);
  const supported = !!navigator.share;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'PWA Showcase',
        text: 'Schau dir an, was Progressive Web Apps alles können!',
        url: window.location.href
      });
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // User cancelled share
    }
  };

  return (
    <FeatureCard
      title="Web Share"
      description="PWAs können den nativen Share-Dialog des Betriebssystems nutzen."
      supported={supported}
    >
      {!supported ? (
        <div className="status-error">Web Share API nicht verfügbar (nur Mobile/HTTPS)</div>
      ) : (
        <>
          <button className="btn btn-primary" onClick={handleShare}>
            Teilen
          </button>
          {shared && <div className="status-success">Erfolgreich geteilt!</div>}
        </>
      )}
    </FeatureCard>
  );
}
