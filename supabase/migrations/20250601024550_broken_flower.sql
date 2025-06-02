/*
  # Add foreign key relationship between guides and categories

  1. Changes
    - Add foreign key constraint from guides.category_id to categories.id
    - Ensure category_id column exists in guides table
    - Add RLS policies for the relationship

  2. Security
    - Maintain existing RLS policies
    - Add policies for category relationship access
*/

-- First ensure the category_id column exists
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guides' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE guides ADD COLUMN category_id uuid REFERENCES categories(id);
  END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'guides_category_id_fkey'
  ) THEN
    ALTER TABLE guides 
    ADD CONSTRAINT guides_category_id_fkey 
    FOREIGN KEY (category_id) 
    REFERENCES categories(id);
  END IF;
END $$;

-- Ensure RLS policies allow reading the relationship
CREATE POLICY IF NOT EXISTS "Anyone can read guide categories" 
ON categories
FOR SELECT 
TO public 
USING (true);

-- Update existing guides policy to include category access
CREATE POLICY IF NOT EXISTS "Anyone can read guides with categories" 
ON guides
FOR SELECT 
TO public 
USING (true);