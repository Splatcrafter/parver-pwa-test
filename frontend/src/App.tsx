import { InstallPrompt } from './components/InstallPrompt';
import { PushNotification } from './components/PushNotification';
import { OfflineStatus } from './components/OfflineStatus';
import { CameraAccess } from './components/CameraAccess';
import { Geolocation } from './components/Geolocation';
import { DeviceVibration } from './components/DeviceVibration';
import { ShareApi } from './components/ShareApi';
import { ClipboardApi } from './components/ClipboardApi';
import { NetworkStatus } from './components/NetworkStatus';
import { BatteryStatus } from './components/BatteryStatus';
import { useNetworkStatus } from './hooks/useNetworkStatus';

function App() {
  const { online } = useNetworkStatus();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>PWA Showcase</h1>
          <p className="subtitle">Was Progressive Web Apps alles können</p>
          <div className={`connection-badge ${online ? 'online' : 'offline'}`}>
            <div className={`status-dot ${online ? 'dot-online' : 'dot-offline'}`} />
            {online ? 'Online' : 'Offline'}
          </div>
        </div>
      </header>

      <main className="card-grid">
        <InstallPrompt />
        <PushNotification />
        <OfflineStatus />
        <CameraAccess />
        <Geolocation />
        <DeviceVibration />
        <ShareApi />
        <ClipboardApi />
        <NetworkStatus />
        <BatteryStatus />
      </main>

      <footer className="app-footer">
        <p>PWA Showcase Demo &mdash; splatgames.software</p>
        <p className="build-info">Build: {__BUILD_TIME__}</p>
      </footer>
    </div>
  );
}

export default App;
