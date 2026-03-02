import { useState, useRef, useCallback } from 'react';
import { FeatureCard } from './FeatureCard';

export function CameraAccess() {
  const [active, setActive] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const supported = !!navigator.mediaDevices?.getUserMedia;

  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch(() => {});
    }
  }, []);

  const startCamera = async () => {
    setError(null);
    setPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      setActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kamera-Zugriff fehlgeschlagen');
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL('image/jpeg'));
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setActive(false);
    setPhoto(null);
  };

  return (
    <FeatureCard
      title="Kamera"
      description="PWAs können auf die Gerätekamera zugreifen und Fotos aufnehmen."
      supported={supported}
    >
      {!supported ? (
        <div className="status-error">Kamera-API nicht verfügbar</div>
      ) : !active ? (
        <button className="btn btn-primary" onClick={startCamera}>
          Kamera starten
        </button>
      ) : (
        <div className="camera-container">
          <video ref={videoCallbackRef} autoPlay playsInline muted className="camera-preview" />
          <div className="btn-group">
            <button className="btn btn-primary" onClick={takePhoto}>Foto aufnehmen</button>
            <button className="btn btn-secondary" onClick={stopCamera}>Kamera stoppen</button>
          </div>
        </div>
      )}
      {photo && (
        <div className="photo-result">
          <img src={photo} alt="Aufgenommenes Foto" className="captured-photo" />
        </div>
      )}
      {error && <div className="status-error">{error}</div>}
    </FeatureCard>
  );
}
