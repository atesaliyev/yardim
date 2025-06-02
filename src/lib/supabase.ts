import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Guide operations
export const getGuides = async () => {
  const { data, error } = await supabase
    .from('guides')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getGuideById = async (id: string) => {
  const { data, error } = await supabase
    .from('guides')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createGuide = async (guide: any) => {
  const { data, error } = await supabase
    .from('guides')
    .insert([guide])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateGuide = async (id: string, guide: any) => {
  const { data, error } = await supabase
    .from('guides')
    .update(guide)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteGuide = async (id: string) => {
  const { error } = await supabase
    .from('guides')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Category operations
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

export const createCategory = async (category: any) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, category: any) => {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Stats operations
export const getDashboardStats = async () => {
  const { data: guides, error: guidesError } = await supabase
    .from('guides')
    .select('count');
  
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('count');
  
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('count');

  if (guidesError || categoriesError || usersError) {
    throw new Error('Error fetching stats');
  }

  return {
    guides: guides?.[0]?.count || 0,
    categories: categories?.[0]?.count || 0,
    users: users?.[0]?.count || 0
  };
};