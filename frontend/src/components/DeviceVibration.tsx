import { FeatureCard } from './FeatureCard';

export function DeviceVibration() {
  const supported = 'vibrate' in navigator;

  const vibrate = (pattern: number | number[]) => {
    navigator.vibrate(pattern);
  };

  return (
    <FeatureCard
      title="Vibration"
      description="PWAs können das Gerät vibrieren lassen (nur Mobile)."
      supported={supported}
    >
      {!supported ? (
        <div className="status-error">Vibration API nicht verfügbar (Desktop-Browser)</div>
      ) : (
        <div className="btn-group">
          <button className="btn btn-primary" onClick={() => vibrate(200)}>
            Kurz
          </button>
          <button className="btn btn-primary" onClick={() => vibrate([200, 100, 200])}>
            Doppelt
          </button>
          <button className="btn btn-primary" onClick={() => vibrate([100, 50, 100, 50, 100, 200, 200, 50, 200, 50, 200, 200, 100, 50, 100, 50, 100])}>
            SOS
          </button>
        </div>
      )}
    </FeatureCard>
  );
}
