-- Create storage bucket for explanation videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('explanation-videos', 'explanation-videos', true);

-- Allow public read access to explanation videos
CREATE POLICY "Public read access for explanation videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'explanation-videos');

-- Allow authenticated uploads (for admin/system use)
CREATE POLICY "Authenticated upload for explanation videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'explanation-videos');