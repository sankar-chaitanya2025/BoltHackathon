import { create } from 'zustand';

interface CalmModeState {
  isEnabled: boolean;
  toggle: () => void;
}

export const useCalmMode = create<CalmModeState>((set) => ({
  isEnabled: false,
  toggle: () => set((state) => ({ isEnabled: !state.isEnabled })),
}));