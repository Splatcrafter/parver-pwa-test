import { useState, useRef, useEffect } from 'react';
import { FeatureCard } from './FeatureCard';

export function CameraAccess() {
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const supported = !!navigator.mediaDevices?.getUserMedia;

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    setPhoto(null);
    setReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kamera-Zugriff fehlgeschlagen');
    }
  };

  const handleCanPlay = () => {
    setReady(true);
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL('image/jpeg'));
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActive(false);
    setReady(false);
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
      ) : (
        <>
          <div className="camera-container" style={{ display: active ? 'flex' : 'none' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onCanPlay={handleCanPlay}
              className="camera-preview"
            />
            {ready && (
              <div className="btn-group">
                <button className="btn btn-primary" onClick={takePhoto}>Foto aufnehmen</button>
                <button className="btn btn-secondary" onClick={stopCamera}>Kamera stoppen</button>
              </div>
            )}
          </div>
          {!active && (
            <button className="btn btn-primary" onClick={startCamera}>
              Kamera starten
            </button>
          )}
        </>
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
