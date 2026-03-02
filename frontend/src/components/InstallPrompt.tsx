import { useState, useEffect } from 'react';
import { FeatureCard } from './FeatureCard';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => setInstalled(true);

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <FeatureCard
      title="App Installieren"
      description="PWAs können wie native Apps auf dem Homescreen installiert werden."
      supported={true}
    >
      {installed ? (
        <div className="status-success">App ist installiert!</div>
      ) : deferredPrompt ? (
        <button className="btn btn-primary" onClick={handleInstall}>
          App installieren
        </button>
      ) : (
        <div className="status-info">
          Öffne die App im Browser und nutze "Zum Startbildschirm hinzufügen"
        </div>
      )}
    </FeatureCard>
  );
}
