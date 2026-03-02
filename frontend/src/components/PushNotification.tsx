import { FeatureCard } from './FeatureCard';
import { usePushSubscription } from '../hooks/usePushSubscription';
import { sendTestNotification } from '../utils/pushManager';
import { useState } from 'react';

export function PushNotification() {
  const { subscription, loading, error, permissionState, subscribe, unsubscribe } = usePushSubscription();
  const [sending, setSending] = useState(false);
  const supported = 'serviceWorker' in navigator && 'PushManager' in window;

  const handleSend = async () => {
    setSending(true);
    try {
      await sendTestNotification();
    } finally {
      setSending(false);
    }
  };

  return (
    <FeatureCard
      title="Push-Benachrichtigungen"
      description="Server kann Push-Nachrichten an das Gerät senden, auch wenn die App geschlossen ist."
      supported={supported}
    >
      {!supported ? (
        <div className="status-error">Push wird in diesem Browser nicht unterstützt</div>
      ) : (
        <div className="push-controls">
          <div className="status-info">
            Permission: <strong>{permissionState}</strong>
          </div>

          {!subscription ? (
            <button className="btn btn-primary" onClick={subscribe} disabled={loading}>
              {loading ? 'Wird registriert...' : 'Push aktivieren'}
            </button>
          ) : (
            <div className="btn-group">
              <button className="btn btn-primary" onClick={handleSend} disabled={sending}>
                {sending ? 'Wird gesendet...' : 'Test-Benachrichtigung senden'}
              </button>
              <button className="btn btn-secondary" onClick={unsubscribe} disabled={loading}>
                Push deaktivieren
              </button>
            </div>
          )}

          {error && <div className="status-error">{error}</div>}
        </div>
      )}
    </FeatureCard>
  );
}
