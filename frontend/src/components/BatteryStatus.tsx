import { FeatureCard } from './FeatureCard';
import { useBattery } from '../hooks/useBattery';

export function BatteryStatus() {
  const { supported, loading, level, charging, chargingTime, dischargingTime } = useBattery();

  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds === Infinity) return 'Unbekannt';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}min`;
  };

  return (
    <FeatureCard
      title="Batterie"
      description="PWAs können den Batteriestatus des Geräts auslesen."
      supported={supported}
    >
      {!supported ? (
        <div className="status-error">Battery API nicht verfügbar (Firefox hat sie entfernt)</div>
      ) : loading ? (
        <div className="status-info">Lade Batterie-Info...</div>
      ) : (
        <div className="result-box">
          <div className="battery-visual">
            <div className="battery-bar">
              <div
                className="battery-fill"
                style={{
                  width: `${(level ?? 0) * 100}%`,
                  backgroundColor: (level ?? 0) > 0.2 ? '#22c55e' : '#ef4444'
                }}
              />
            </div>
            <span className="battery-percent">{Math.round((level ?? 0) * 100)}%</span>
          </div>
          <div><strong>Ladend:</strong> {charging ? 'Ja' : 'Nein'}</div>
          {charging && chargingTime !== null && (
            <div><strong>Voll in:</strong> {formatTime(chargingTime)}</div>
          )}
          {!charging && dischargingTime !== null && (
            <div><strong>Restzeit:</strong> {formatTime(dischargingTime)}</div>
          )}
        </div>
      )}
    </FeatureCard>
  );
}
