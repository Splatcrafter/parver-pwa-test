import { useState } from 'react';
import { FeatureCard } from './FeatureCard';

export function ClipboardApi() {
  const [copied, setCopied] = useState(false);
  const [pastedText, setPastedText] = useState<string | null>(null);
  const supported = !!navigator.clipboard;

  const handleCopy = async () => {
    await navigator.clipboard.writeText('Hallo von der PWA Showcase! 🚀');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPastedText(text);
    } catch {
      setPastedText('Zugriff verweigert - Clipboard-Berechtigung fehlt');
    }
  };

  return (
    <FeatureCard
      title="Clipboard"
      description="PWAs können Text in die Zwischenablage kopieren und daraus lesen."
      supported={supported}
    >
      {!supported ? (
        <div className="status-error">Clipboard API nicht verfügbar</div>
      ) : (
        <>
          <div className="btn-group">
            <button className="btn btn-primary" onClick={handleCopy}>
              {copied ? 'Kopiert!' : 'Text kopieren'}
            </button>
            <button className="btn btn-secondary" onClick={handlePaste}>
              Einfügen
            </button>
          </div>
          {pastedText && (
            <div className="result-box">
              <strong>Clipboard-Inhalt:</strong> {pastedText}
            </div>
          )}
        </>
      )}
    </FeatureCard>
  );
}
