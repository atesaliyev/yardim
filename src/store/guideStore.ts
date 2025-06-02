import { create } from 'zustand';
import { Guide } from '../types';
import * as api from '../lib/supabase';

interface GuideState {
  guides: Guide[];
  loading: boolean;
  error: string | null;
  fetchGuides: () => Promise<void>;
  createGuide: (guide: Partial<Guide>) => Promise<void>;
  updateGuide: (id: string, guide: Partial<Guide>) => Promise<void>;
  deleteGuide: (id: string) => Promise<void>;
}

export const useGuideStore = create<GuideState>((set) => ({
  guides: [],
  loading: false,
  error: null,
  fetchGuides: async () => {
    set({ loading: true, error: null });
    try {
      const guides = await api.getGuides();
      set({ guides, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  createGuide: async (guide) => {
    set({ loading: true, error: null });
    try {
      await api.createGuide(guide);
      const guides = await api.getGuides();
      set({ guides, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  updateGuide: async (id, guide) => {
    set({ loading: true, error: null });
    try {
      await api.updateGuide(id, guide);
      const guides = await api.getGuides();
      set({ guides, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  deleteGuide: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.deleteGuide(id);
      const guides = await api.getGuides();
      set({ guides, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));