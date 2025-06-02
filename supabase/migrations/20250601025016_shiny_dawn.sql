-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Create guides table
CREATE TABLE guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    category_id UUID NOT NULL,
    author_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    views INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_guide_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_guide_author FOREIGN KEY (author_id) REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX guides_category_id_idx ON guides(category_id);
CREATE INDEX guides_author_id_idx ON guides(author_id);
CREATE INDEX guides_status_idx ON guides(status);
CREATE INDEX categories_parent_id_idx ON categories(parent_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Enable read access for all users" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON categories
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON categories
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON categories
    FOR DELETE TO authenticated USING (true);

-- Create policies for guides
CREATE POLICY "Enable read access for published guides" ON guides
    FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Enable insert for authenticated users only" ON guides
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Enable update for guide authors only" ON guides
    FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Enable delete for guide authors only" ON guides
    FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guides_updated_at
    BEFORE UPDATE ON guides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();