import { create } from 'zustand';
import { Topic } from '../types';
import { supabase } from '../lib/supabase';

interface TopicState {
  topics: Topic[];
  loading: boolean;
  error: string | null;
  fetchTopics: () => Promise<void>;
  createTopic: (topic: Partial<Topic>) => Promise<void>;
  updateTopic: (id: string, topic: Partial<Topic>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
}

export const useTopicStore = create<TopicState>((set) => ({
  topics: [],
  loading: false,
  error: null,
  fetchTopics: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          guides:guides(count)
        `);
      
      if (error) throw error;
      
      const topicsWithCount = data.map(topic => ({
        ...topic,
        guides_count: topic.guides[0].count
      }));
      
      set({ topics: topicsWithCount, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  createTopic: async (topic) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('topics')
        .insert([topic])
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({
        topics: [...state.topics, data],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  updateTopic: async (id, topic) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('topics')
        .update(topic)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      set(state => ({
        topics: state.topics.map(t => t.id === id ? data : t),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  deleteTopic: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        topics: state.topics.filter(t => t.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));