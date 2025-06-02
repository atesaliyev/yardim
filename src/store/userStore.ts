import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserState {
  users: any[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: any) => Promise<void>;
  updateUser: (id: string, userData: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  banUser: (id: string) => Promise<void>;
  unbanUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ users: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  createUser: async (userData) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name
        }
      });

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          role: userData.role,
          full_name: userData.full_name
        })
        .eq('id', data.user.id);

      if (updateError) throw updateError;

      set(state => ({
        users: [data.user, ...state.users],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  updateUser: async (id, userData) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('users')
        .update({
          role: userData.role,
          full_name: userData.full_name
        })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        users: state.users.map(user =>
          user.id === id ? { ...user, ...userData } : user
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.admin.deleteUser(id);

      if (error) throw error;

      set(state => ({
        users: state.users.filter(user => user.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  banUser: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('users')
        .update({ banned: true })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        users: state.users.map(user =>
          user.id === id ? { ...user, banned: true } : user
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  unbanUser: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('users')
        .update({ banned: false })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        users: state.users.map(user =>
          user.id === id ? { ...user, banned: false } : user
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));