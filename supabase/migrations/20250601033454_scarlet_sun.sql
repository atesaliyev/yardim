-- Add foreign key relationship between guides and topics
ALTER TABLE guides
ADD CONSTRAINT guides_topic_id_fkey 
FOREIGN KEY (topic_id) 
REFERENCES topics(id);

-- Create view for topic statistics
CREATE OR REPLACE VIEW topic_stats AS
SELECT 
    t.id,
    t.title,
    COUNT(g.id) as guides_count
FROM topics t
LEFT JOIN guides g ON t.id = g.topic_id
GROUP BY t.id, t.title;

-- Add RLS policies for topic statistics
CREATE POLICY "Anyone can view topic statistics" 
ON topic_stats
FOR SELECT 
TO public 
USING (true);