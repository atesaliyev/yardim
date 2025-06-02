-- Add role and banned columns to auth.users if they don't exist
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'writer', 'user')),
ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Create or replace function to handle user management
CREATE OR REPLACE FUNCTION handle_user_management()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure at least one admin exists when updating or deleting
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    IF OLD.role = 'admin' AND NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE role = 'admin' 
      AND id != OLD.id
      AND banned = false
    ) THEN
      RAISE EXCEPTION 'Cannot remove or ban the last admin user';
    END IF;
  END IF;

  -- For updates, ensure role changes are valid
  IF TG_OP = 'UPDATE' THEN
    -- Only admins can change roles
    IF NEW.role != OLD.role AND NOT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user management
DROP TRIGGER IF EXISTS user_management_trigger ON auth.users;
CREATE TRIGGER user_management_trigger
  BEFORE UPDATE OR DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_management();

-- Create policies for user management
DROP POLICY IF EXISTS "Allow admins to manage users" ON auth.users;
CREATE POLICY "Allow admins to manage users"
  ON auth.users
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Create policy for users to view their own data
DROP POLICY IF EXISTS "Users can view their own data" ON auth.users;
CREATE POLICY "Users can view their own data"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create function to ensure new users have default role
CREATE OR REPLACE FUNCTION set_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS NULL THEN
    NEW.role := 'user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for setting default role
DROP TRIGGER IF EXISTS set_user_role_trigger ON auth.users;
CREATE TRIGGER set_user_role_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION set_user_role();