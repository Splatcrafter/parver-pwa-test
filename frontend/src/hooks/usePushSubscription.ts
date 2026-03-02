import { useState, useEffect, useCallback } from 'react';
import { getVapidPublicKey, subscribeToPush, unsubscribeFromPush } from '../utils/pushManager';

interface PushSubscriptionState {
  subscription: PushSubscription | null;
  loading: boolean;
  error: string | null;
  permissionState: NotificationPermission;
}

export function usePushSubscription() {
  const [state, setState] = useState<PushSubscriptionState>({
    subscription: null,
    loading: false,
    error: null,
    permissionState: 'default'
  });

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    setState(prev => ({ ...prev, permissionState: Notification.permission }));

    navigator.serviceWorker.ready.then(async (registration) => {
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) {
        setState(prev => ({ ...prev, subscription: existingSub }));
      }
    });
  }, []);

  const subscribe = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permissionState: permission }));

      if (permission !== 'granted') {
        setState(prev => ({ ...prev, loading: false, error: 'Benachrichtigungen wurden abgelehnt' }));
        return;
      }

      const vapidPublicKey = await getVapidPublicKey();
      const registration = await navigator.serviceWorker.ready;
      const subscription = await subscribeToPush(registration, vapidPublicKey);

      setState(prev => ({ ...prev, subscription, loading: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Subscription fehlgeschlagen'
      }));
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!state.subscription) return;
    setState(prev => ({ ...prev, loading: true }));
    try {
      await unsubscribeFromPush(state.subscription);
      setState(prev => ({ ...prev, subscription: null, loading: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unsubscribe fehlgeschlagen'
      }));
    }
  }, [state.subscription]);

  return { ...state, subscribe, unsubscribe };
}
