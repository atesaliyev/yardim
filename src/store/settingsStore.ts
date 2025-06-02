import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  minPasswordLength: number;
  requireTwoFactor: boolean;
  emailNotifications: boolean;
  browserNotifications: boolean;
}

interface SettingsState {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    siteTitle: 'YardımRehberi.com',
    siteDescription: 'Günlük hayatınızı kolaylaştıran pratik rehberler ve çözümler.',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    minPasswordLength: 8,
    requireTwoFactor: false,
    emailNotifications: true,
    browserNotifications: true,
  },
  loading: false,
  error: null,
  fetchSettings: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        set({ settings: data, loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  updateSettings: async (newSettings) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('settings')
        .upsert([{ id: 1, ...newSettings }]);

      if (error) throw error;
      
      set(state => ({
        settings: { ...state.settings, ...newSettings },
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));