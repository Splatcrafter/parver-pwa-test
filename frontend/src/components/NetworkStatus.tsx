import { FeatureCard } from './FeatureCard';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export function NetworkStatus() {
  const { online, effectiveType, downlink, rtt } = useNetworkStatus();
  const supported = !!navigator.connection;

  return (
    <FeatureCard
      title="Netzwerk-Info"
      description="PWAs können Netzwerkstatus und Verbindungsdetails auslesen."
      supported={supported}
    >
      <div className="result-box">
        <div>
          <strong>Status:</strong>{' '}
          <span className={online ? 'text-success' : 'text-error'}>
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
        {supported && (
          <>
            {effectiveType && (
              <div><strong>Verbindungstyp:</strong> {effectiveType.toUpperCase()}</div>
            )}
            {downlink !== undefined && (
              <div><strong>Downlink:</strong> {downlink} Mbit/s</div>
            )}
            {rtt !== undefined && (
              <div><strong>Latenz (RTT):</strong> {rtt} ms</div>
            )}
          </>
        )}
        {!supported && (
          <div className="status-info">
            Detaillierte Netzwerk-Infos nur in Chromium-Browsern verfügbar.
            Online/Offline-Erkennung funktioniert überall.
          </div>
        )}
      </div>
    </FeatureCard>
  );
}
