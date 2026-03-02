import { useState } from 'react';
import { FeatureCard } from './FeatureCard';

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function Geolocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supported = 'geolocation' in navigator;

  const getLocation = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <FeatureCard
      title="Geolocation"
      description="PWAs können den Standort des Geräts abfragen."
      supported={supported}
    >
      {!supported ? (
        <div className="status-error">Geolocation nicht verfügbar</div>
      ) : (
        <>
          <button className="btn btn-primary" onClick={getLocation} disabled={loading}>
            {loading ? 'Wird ermittelt...' : 'Standort abfragen'}
          </button>
          {position && (
            <div className="result-box">
              <div><strong>Breitengrad:</strong> {position.latitude.toFixed(6)}</div>
              <div><strong>Längengrad:</strong> {position.longitude.toFixed(6)}</div>
              <div><strong>Genauigkeit:</strong> {position.accuracy.toFixed(0)} m</div>
            </div>
          )}
          {error && <div className="status-error">{error}</div>}
        </>
      )}
    </FeatureCard>
  );
}
