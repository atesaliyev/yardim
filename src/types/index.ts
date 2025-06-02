export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Guide {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  author_id: string;
  status: 'draft' | 'published';
  views: number;
  rating: number;
  created_at: string;
  updated_at: string;
  meta_description: string | null;
  meta_keywords: string | null;
  overview: string | null;
  steps: any[] | null;
  important_notes: string | null;
  faq: any[] | null;
  topic_id: string | null;
  image: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  guides_count?: number;
  image: string | null;
}