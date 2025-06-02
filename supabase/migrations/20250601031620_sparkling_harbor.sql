DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Enable read access for published guides" ON guides;
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON guides;
  DROP POLICY IF EXISTS "Enable update for guide authors only" ON guides;
  DROP POLICY IF EXISTS "Enable delete for guide authors only" ON guides;

  -- Create new policies
  -- Anyone can read guides
  CREATE POLICY "Anyone can read guides" ON guides
    FOR SELECT USING (true);

  -- Authenticated users can create guides
  CREATE POLICY "Authenticated users can create guides" ON guides
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

  -- Authors and admins can update guides
  CREATE POLICY "Authors and admins can update guides" ON guides
    FOR UPDATE USING (
      auth.role() = 'authenticated' AND (
        auth.uid() = author_id OR 
        auth.role() = 'service_role'
      )
    );

  -- Authors and admins can delete guides
  CREATE POLICY "Authors and admins can delete guides" ON guides
    FOR DELETE USING (
      auth.role() = 'authenticated' AND (
        auth.uid() = author_id OR 
        auth.role() = 'service_role'
      )
    );
END $$;