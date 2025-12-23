-- Create storage bucket for file uploads
-- This migration creates a bucket and sets up RLS policies

-- Create the bucket (if it doesn't exist)
-- Note: Bucket creation via SQL is not directly supported in Supabase
-- Users need to create the bucket manually in the Supabase dashboard
-- This file documents the required bucket configuration

-- Bucket name: 'uploads' (or as specified in NEXT_PUBLIC_STORAGE_BUCKET)
-- Bucket should be created as 'public' or 'private' based on your needs
-- For authenticated uploads, 'private' is recommended

-- RLS Policies for storage.objects table
-- These policies control who can upload, read, and delete files

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads' AND
  auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to read their own files
CREATE POLICY "Allow authenticated reads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'uploads' AND
  auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'uploads' AND
  auth.role() = 'authenticated'
);

-- Note: If you want users to only access their own files, you can add:
-- AND (storage.foldername(name))[1] = auth.uid()::text
-- This requires files to be stored in folders named with the user's UUID

