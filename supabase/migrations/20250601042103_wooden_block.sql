-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_title VARCHAR(255) NOT NULL DEFAULT 'YardımRehberi.com',
    site_description TEXT,
    smtp_host VARCHAR(255),
    smtp_port INTEGER DEFAULT 587,
    smtp_user VARCHAR(255),
    smtp_pass VARCHAR(255),
    min_password_length INTEGER DEFAULT 8,
    require_two_factor BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    browser_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read settings"
ON settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update settings"
ON settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert default settings if not exists
INSERT INTO settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;