import { useState, useEffect } from 'react';

interface NetworkStatus {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => ({
    online: navigator.onLine,
    effectiveType: navigator.connection?.effectiveType,
    downlink: navigator.connection?.downlink,
    rtt: navigator.connection?.rtt
  }));

  useEffect(() => {
    const updateOnline = () => setStatus(prev => ({ ...prev, online: true }));
    const updateOffline = () => setStatus(prev => ({ ...prev, online: false }));
    const updateConnection = () => {
      setStatus(prev => ({
        ...prev,
        effectiveType: navigator.connection?.effectiveType,
        downlink: navigator.connection?.downlink,
        rtt: navigator.connection?.rtt
      }));
    };

    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOffline);
    navigator.connection?.addEventListener('change', updateConnection);

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOffline);
      navigator.connection?.removeEventListener('change', updateConnection);
    };
  }, []);

  return status;
}
