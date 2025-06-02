-- First drop the constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'guides_topic_id_fkey'
        AND table_name = 'guides'
    ) THEN
        ALTER TABLE guides DROP CONSTRAINT guides_topic_id_fkey;
    END IF;
END $$;

-- Then add the constraint
ALTER TABLE guides
ADD CONSTRAINT guides_topic_id_fkey 
FOREIGN KEY (topic_id) 
REFERENCES topics(id);