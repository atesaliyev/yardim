/*
  # Create guides table and establish relationship with categories

  1. New Tables
    - `guides` table with fields:
      - id (uuid, primary key)
      - title (text)
      - content (text)
      - category_id (uuid, foreign key to categories)
      - author_id (uuid, foreign key to users)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Changes
    - Add foreign key constraints for category and author relationships
    - Set up RLS policies for guide access

  3. Security
    - Enable RLS on guides table
    - Add policies for public read access
    - Add policies for authenticated user write access
*/

-- Create guides table with explicit foreign key constraints
CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  category_id uuid,
  author_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT guides_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT guides_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies

-- Anyone can read guides
CREATE POLICY IF NOT EXISTS "Anyone can read guides" 
ON guides
FOR SELECT 
TO public 
USING (true);

-- Authenticated users can create guides
CREATE POLICY IF NOT EXISTS "Authenticated users can create guides" 
ON guides
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = author_id);

-- Authors can update their own guides
CREATE POLICY IF NOT EXISTS "Authors can update their own guides" 
ON guides
FOR UPDATE 
TO authenticated 
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Authors can delete their own guides
CREATE POLICY IF NOT EXISTS "Authors can delete their own guides" 
ON guides
FOR DELETE 
TO authenticated 
USING (auth.uid() = author_id);

-- Ensure RLS policies allow reading the relationships
CREATE POLICY IF NOT EXISTS "Anyone can read categories" 
ON categories
FOR SELECT 
TO public 
USING (true);

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS guides_category_id_idx ON guides(category_id);
CREATE INDEX IF NOT EXISTS guides_author_id_idx ON guides(author_id);