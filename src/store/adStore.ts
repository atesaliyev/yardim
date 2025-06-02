import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Ad {
  id: string;
  name: string;
  location: string;
  type: string;
  content: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
}

interface AdState {
  ads: Ad[];
  loading: boolean;
  error: string | null;
  fetchAds: () => Promise<void>;
  createAd: (ad: Partial<Ad>) => Promise<void>;
  updateAd: (id: string, ad: Partial<Ad>) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  toggleAdStatus: (id: string) => Promise<void>;
}

export const useAdStore = create<AdState>((set, get) => ({
  ads: [],
  loading: false,
  error: null,
  fetchAds: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ ads: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  createAd: async (ad) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('ads')
        .insert([ad])
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        ads: [data, ...state.ads],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  updateAd: async (id, ad) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('ads')
        .update(ad)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        ads: state.ads.map(a => a.id === id ? data : a),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  deleteAd: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        ads: state.ads.filter(ad => ad.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  toggleAdStatus: async (id) => {
    const ad = get().ads.find(a => a.id === id);
    if (!ad) return;

    try {
      await get().updateAd(id, { is_active: !ad.is_active });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  }
}));