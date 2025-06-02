import { create } from 'zustand';
import { Category } from '../types';
import * as api from '../lib/supabase';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (category: Partial<Category>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await api.getCategories();
      set({ categories, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  createCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      await api.createCategory(category);
      const categories = await api.getCategories();
      set({ categories, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  updateCategory: async (id, category) => {
    set({ loading: true, error: null });
    try {
      await api.updateCategory(id, category);
      const categories = await api.getCategories();
      set({ categories, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.deleteCategory(id);
      const categories = await api.getCategories();
      set({ categories, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));