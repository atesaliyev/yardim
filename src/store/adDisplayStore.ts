import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AdDisplayState {
  ads: Record<string, string>;
  loading: boolean;
  error: string | null;
  fetchAds: (locations: string[]) => Promise<void>;
}

export const useAdDisplayStore = create<AdDisplayState>((set) => ({
  ads: {},
  loading: false,
  error: null,
  fetchAds: async (locations) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .in('location', locations)
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString())
        .gte('end_date', new Date().toISOString());

      if (error) throw error;

      const adsMap = data.reduce((acc, ad) => {
        acc[ad.location] = ad.content;
        return acc;
      }, {} as Record<string, string>);

      set({ ads: adsMap, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));