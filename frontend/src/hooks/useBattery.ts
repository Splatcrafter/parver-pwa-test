import { useState, useEffect } from 'react';

interface BatteryState {
  supported: boolean;
  loading: boolean;
  level: number | null;
  charging: boolean | null;
  chargingTime: number | null;
  dischargingTime: number | null;
}

export function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>({
    supported: 'getBattery' in navigator,
    loading: true,
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null
  });

  useEffect(() => {
    if (!navigator.getBattery) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    let battery: BatteryManager | null = null;

    const update = () => {
      if (!battery) return;
      setState({
        supported: true,
        loading: false,
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      });
    };

    navigator.getBattery().then((b) => {
      battery = b;
      update();
      b.addEventListener('chargingchange', update);
      b.addEventListener('levelchange', update);
      b.addEventListener('chargingtimechange', update);
      b.addEventListener('dischargingtimechange', update);
    }).catch(() => {
      setState(prev => ({ ...prev, supported: false, loading: false }));
    });

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', update);
        battery.removeEventListener('levelchange', update);
        battery.removeEventListener('chargingtimechange', update);
        battery.removeEventListener('dischargingtimechange', update);
      }
    };
  }, []);

  return state;
}
