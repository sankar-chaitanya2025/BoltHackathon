import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  brightness: number;
  motionIntensity: number;
  soundSensitivity: number;
}

interface SettingsState extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
}

const DEFAULT_SETTINGS: Settings = {
  brightness: 100,
  motionIntensity: 100,
  soundSensitivity: 50,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
    }),
    {
      name: 'meetspace-settings',
    }
  )
);