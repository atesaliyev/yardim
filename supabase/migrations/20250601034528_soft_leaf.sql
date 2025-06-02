-- Add role and banned columns to auth.users
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Create policy to allow admins to manage users
CREATE POLICY "Allow admins to manage users"
ON auth.users
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create function to ensure at least one admin exists
CREATE OR REPLACE FUNCTION check_admin_exists()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role = 'admin' AND NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE role = 'admin' 
    AND id != OLD.id
  ) THEN
    RAISE EXCEPTION 'Cannot remove last admin user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent removing last admin
CREATE TRIGGER ensure_admin_exists
BEFORE UPDATE OR DELETE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION check_admin_exists();