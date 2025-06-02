-- Add SEO fields to guides table
ALTER TABLE guides
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(255);

-- Create index for canonical URLs
CREATE INDEX IF NOT EXISTS guides_canonical_url_idx ON guides(canonical_url);