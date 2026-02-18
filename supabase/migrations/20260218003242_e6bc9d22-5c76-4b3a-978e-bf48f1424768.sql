
-- Create storage bucket for QIRAA knowledge base
INSERT INTO storage.buckets (id, name, public) 
VALUES ('qiraa-knowledge-base', 'qiraa-knowledge-base', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: admins can manage files
CREATE POLICY "Admins can upload knowledge base files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'qiraa-knowledge-base' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view knowledge base files"
ON storage.objects FOR SELECT
USING (bucket_id = 'qiraa-knowledge-base' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete knowledge base files"
ON storage.objects FOR DELETE
USING (bucket_id = 'qiraa-knowledge-base' AND public.has_role(auth.uid(), 'admin'));

-- Ensure file_url column exists (it already does from schema)
-- Add file_path column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'qiraa_mind_documents' AND column_name = 'file_path') THEN
    ALTER TABLE public.qiraa_mind_documents ADD COLUMN file_path text;
  END IF;
END $$;
