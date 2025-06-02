-- Add image columns to categories, topics, and guides tables
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS image TEXT;

ALTER TABLE topics
ADD COLUMN IF NOT EXISTS image TEXT;

ALTER TABLE guides
ADD COLUMN IF NOT EXISTS image TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS categories_image_idx ON categories(image);
CREATE INDEX IF NOT EXISTS topics_image_idx ON topics(image);
CREATE INDEX IF NOT EXISTS guides_image_idx ON guides(image);