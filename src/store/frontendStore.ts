import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface FrontendState {
  categories: any[];
  guides: any[];
  topics: any[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchGuides: () => Promise<void>;
  fetchTopics: () => Promise<void>;
  fetchCategoryDetail: (slug: string) => Promise<any>;
  fetchGuideDetail: (slug: string) => Promise<any>;
  fetchTopicDetail: (categorySlug: string, topicSlug: string) => Promise<any>;
}

export const useFrontendStore = create<FrontendState>((set, get) => ({
  categories: [],
  guides: [],
  topics: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      
      // Fetch categories with their topics and guides
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          *,
          topics (
            id,
            title,
            slug,
            description,
            guides (
              id,
              title,
              slug,
              content,
              overview,
              views,
              rating
            )
          )
        `)
        .order('name');

      if (categoriesError) throw categoriesError;

      // Process the data to organize it hierarchically and sort everything alphabetically
      const processedCategories = categories?.map((category: any) => ({
        ...category,
        topics: (category.topics || [])
          .map((topic: any) => ({
            ...topic,
            guides: (topic.guides || [])
              .sort((a: any, b: any) => a.title.localeCompare(b.title, 'tr'))
          }))
          .sort((a: any, b: any) => a.title.localeCompare(b.title, 'tr'))
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name, 'tr')) || [];

      set({ categories: processedCategories, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchGuides: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ guides: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTopics: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          category:categories(id, name, slug),
          guides: guides(count)
        `)
        .order('title');

      if (error) throw error;
      set({ topics: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchCategoryDetail: async (slug: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          topics (
            *,
            guides (
              id,
              title,
              slug,
              content,
              overview,
              views,
              rating
            )
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  fetchGuideDetail: async (slug: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('guides')
        .select(`
          *,
          category:categories(id, name, slug),
          topic:topics(id, title, slug),
          author:users(id, full_name)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  fetchTopicDetail: async (categorySlug: string, topicSlug: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          category:categories!inner(id, name, slug),
          guides(
            *,
            author:users(id, full_name)
          )
        `)
        .eq('slug', topicSlug)
        .eq('categories.slug', categorySlug)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    } finally {
      set({ loading: false });
    }
  }
}));