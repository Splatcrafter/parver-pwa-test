import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    if (confirm('Neue Version verfügbar. Jetzt aktualisieren?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('App ist offline-bereit');
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
