/*
  # Add Additional Guide Fields

  1. Changes
    - Add new columns to the guides table:
      - meta_description: TEXT (for SEO meta description)
      - meta_keywords: TEXT (for SEO meta keywords)
      - overview: TEXT (for guide overview)
      - steps: JSONB (for structured guide steps)
      - important_notes: TEXT (for important guide notes)
      - faq: JSONB (for guide FAQs)
*/

DO $$ 
BEGIN
  -- Add meta_description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guides' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE guides ADD COLUMN meta_description TEXT;
  END IF;

  -- Add meta_keywords column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guides' AND column_name = 'meta_keywords'
  ) THEN
    ALTER TABLE guides ADD COLUMN meta_keywords TEXT;
  END IF;

  -- Add overview column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guides' AND column_name = 'overview'
  ) THEN
    ALTER TABLE guides ADD COLUMN overview TEXT;
  END IF;

  -- Add steps column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guides' AND column_name = 'steps'
  ) THEN
    ALTER TABLE guides ADD COLUMN steps JSONB;
  END IF;

  -- Add important_notes column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guides' AND column_name = 'important_notes'
  ) THEN
    ALTER TABLE guides ADD COLUMN important_notes TEXT;
  END IF;

  -- Add faq column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guides' AND column_name = 'faq'
  ) THEN
    ALTER TABLE guides ADD COLUMN faq JSONB;
  END IF;
END $$;