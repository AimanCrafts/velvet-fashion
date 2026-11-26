INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('catalog', 'catalog', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('brand', 'brand', TRUE, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('order-documents', 'order-documents', FALSE, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public Access Catalog Images"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('catalog', 'brand'));

CREATE POLICY "Staff Upload Catalog Images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id IN ('catalog', 'brand') AND
        public.is_staff()
    );

CREATE POLICY "Staff Modify Catalog Images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id IN ('catalog', 'brand') AND
        public.is_staff()
    );

CREATE POLICY "Staff Delete Catalog Images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id IN ('catalog', 'brand') AND
        public.is_staff()
    );

CREATE POLICY "Staff Manage Order Documents"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'order-documents' AND
        public.is_staff()
    );
