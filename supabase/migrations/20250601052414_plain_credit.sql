-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'writer', 'user')),
    banned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Enable read access for all users"
ON public.users FOR SELECT
TO public
USING (true);

-- Insert test user if not exists
INSERT INTO public.users (id, email, full_name, role)
VALUES 
  ('fa4a2b04-df1a-4edb-8142-f6b89e1ffe50', 'test@example.com', 'Test User', 'admin')
ON CONFLICT (id) DO NOTHING;