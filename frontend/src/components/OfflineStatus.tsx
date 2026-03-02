import { FeatureCard } from './FeatureCard';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export function OfflineStatus() {
  const { online } = useNetworkStatus();

  return (
    <FeatureCard
      title="Offline-Support"
      description="PWAs können offline funktionieren dank Service Worker Caching."
      supported={'serviceWorker' in navigator}
    >
      <div className={`offline-indicator ${online ? 'online' : 'offline'}`}>
        <div className={`status-dot ${online ? 'dot-online' : 'dot-offline'}`} />
        <span>{online ? 'Du bist online' : 'Du bist offline — die App funktioniert trotzdem!'}</span>
      </div>
      <div className="status-info">
        Schalte den Flugmodus ein, um Offline-Support zu testen. Die App wird weiterhin geladen, da alle Assets im Service Worker Cache liegen.
      </div>
    </FeatureCard>
  );
}
