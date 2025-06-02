import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  guides: {
    total: number;
    published: number;
    draft: number;
    views: number;
  };
  categories: {
    total: number;
    distribution: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  };
  ads: {
    total: number;
    active: number;
    revenue: number;
  };
  traffic: Array<{
    name: string;
    value: number;
    ads: number;
  }>;
  popularGuides: Array<{
    id: string;
    title: string;
    views: number;
    rating: number;
    category: string;
    adRevenue: number;
  }>;
}

interface StatsState {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

const defaultStats: DashboardStats = {
  guides: {
    total: 0,
    published: 0,
    draft: 0,
    views: 0
  },
  categories: {
    total: 0,
    distribution: []
  },
  ads: {
    total: 0,
    active: 0,
    revenue: 0
  },
  traffic: [],
  popularGuides: []
};

export const useStatsStore = create<StatsState>((set) => ({
  stats: defaultStats,
  loading: false,
  error: null,
  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch guides stats
      const { data: guides, error: guidesError } = await supabase
        .from('guides')
        .select('id, status, views');
      
      if (guidesError) throw guidesError;

      // Fetch categories stats
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name');
      
      if (categoriesError) throw categoriesError;

      // Fetch ads stats
      const { data: ads, error: adsError } = await supabase
        .from('ads')
        .select('id, is_active');
      
      if (adsError) throw adsError;

      // Calculate stats
      const guidesStats = {
        total: guides?.length || 0,
        published: guides?.filter(g => g.status === 'published').length || 0,
        draft: guides?.filter(g => g.status === 'draft').length || 0,
        views: guides?.reduce((sum, g) => sum + (g.views || 0), 0) || 0
      };

      const categoryColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
      const categoryDistribution = categories?.map((cat, idx) => ({
        name: cat.name,
        value: guides?.filter(g => g.category_id === cat.id).length || 0,
        color: categoryColors[idx % categoryColors.length]
      })) || [];

      const adsStats = {
        total: ads?.length || 0,
        active: ads?.filter(a => a.is_active).length || 0,
        revenue: Math.floor(Math.random() * 10000) // Example calculation
      };

      // Generate traffic data for the last 7 days
      const traffic = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          name: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
          value: Math.floor(Math.random() * 3000) + 1000, // Example data
          ads: Math.floor(Math.random() * 2000) + 500 // Example data
        };
      });

      // Get popular guides
      const { data: popularGuides, error: popularError } = await supabase
        .from('guides')
        .select(`
          id,
          title,
          views,
          rating,
          categories(name)
        `)
        .order('views', { ascending: false })
        .limit(5);

      if (popularError) throw popularError;

      set({
        stats: {
          guides: guidesStats,
          categories: {
            total: categories?.length || 0,
            distribution: categoryDistribution
          },
          ads: adsStats,
          traffic,
          popularGuides: popularGuides?.map(g => ({
            id: g.id,
            title: g.title,
            views: g.views,
            rating: g.rating,
            category: g.categories?.name || '',
            adRevenue: Math.floor(Math.random() * 500) + 100 // Example calculation
          })) || []
        },
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));