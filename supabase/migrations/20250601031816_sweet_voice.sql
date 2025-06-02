DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Anyone can read guides" ON guides;
  DROP POLICY IF EXISTS "Authenticated users can create guides" ON guides;
  DROP POLICY IF EXISTS "Authors and admins can update guides" ON guides;
  DROP POLICY IF EXISTS "Authors and admins can delete guides" ON guides;

  -- Create new policies with proper checks
  CREATE POLICY "Anyone can read guides" ON guides
    FOR SELECT USING (true);

  CREATE POLICY "Authenticated users can create guides" ON guides
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = author_id);

  CREATE POLICY "Authors can update their guides" ON guides
    FOR UPDATE TO authenticated
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

  CREATE POLICY "Authors can delete their guides" ON guides
    FOR DELETE TO authenticated
    USING (auth.uid() = author_id);
END $$;