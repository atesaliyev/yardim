-- Kullanıcı yönetimi için yetkilendirmeler
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Kullanıcıların kendi bilgilerini görüntülemesi için policy
CREATE POLICY "Kullanıcılar kendi bilgilerini görebilir"
ON auth.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admin kullanıcıların tüm kullanıcıları yönetebilmesi için policy
CREATE POLICY "Adminler tüm kullanıcıları yönetebilir"
ON auth.users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- İlk admin kullanıcısını oluştur
INSERT INTO auth.users (email, role, password_hash)
VALUES ('admin@yardimrehberi.com', 'admin', crypt('admin123', gen_salt('bf')))
ON CONFLICT (email) DO UPDATE
SET role = 'admin'
WHERE auth.users.role != 'admin';