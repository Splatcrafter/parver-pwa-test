import { FeatureCard } from './FeatureCard';
import { usePushSubscription } from '../hooks/usePushSubscription';
import { useState } from 'react';

export function PushNotification() {
  const { subscription, loading, error, permissionState, subscribe, unsubscribe } = usePushSubscription();
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const supported = 'serviceWorker' in navigator && 'PushManager' in window;

  const handleSend = async () => {
    setSending(true);
    setSendResult(null);
    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'PWA Showcase',
          body: 'Push-Benachrichtigung erfolgreich gesendet!',
          icon: '/icons/icon-192.png'
        })
      });
      const data = await response.json();
      if (data.sent > 0) {
        setSendResult(`Gesendet an ${data.sent} Gerät(e). Prüfe deine Benachrichtigungen!`);
      } else {
        setSendResult('Keine aktiven Subscriptions gefunden. Versuche Push erneut zu aktivieren.');
      }
    } catch (err) {
      setSendResult(`Fehler: ${err instanceof Error ? err.message : 'Senden fehlgeschlagen'}`);
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

          {sendResult && (
            <div className={sendResult.startsWith('Fehler') || sendResult.startsWith('Keine') ? 'status-error' : 'status-success'}>
              {sendResult}
            </div>
          )}
          {error && <div className="status-error">{error}</div>}
        </div>
      )}
    </FeatureCard>
  );
}
