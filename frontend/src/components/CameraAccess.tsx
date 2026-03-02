import { useState, useRef } from 'react';
import { FeatureCard } from './FeatureCard';

export function CameraAccess() {
  const [active, setActive] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const supported = !!navigator.mediaDevices?.getUserMedia;

  const startCamera = async () => {
    setError(null);
    setPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kamera-Zugriff fehlgeschlagen');
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')!.drawImage(videoRef.current, 0, 0);
    setPhoto(canvas.toDataURL('image/jpeg'));
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setActive(false);
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
          <video ref={videoRef} autoPlay playsInline className="camera-preview" />
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
