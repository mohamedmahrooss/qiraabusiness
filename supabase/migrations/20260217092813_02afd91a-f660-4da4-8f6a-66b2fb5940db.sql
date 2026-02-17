
-- Create qiraa_mind_documents table for AI knowledge base
CREATE TABLE public.qiraa_mind_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_month TEXT,
  source_year INTEGER,
  document_type TEXT DEFAULT 'market_signals',
  file_url TEXT,
  uploaded_by UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.qiraa_mind_documents ENABLE ROW LEVEL SECURITY;

-- Active documents readable by authenticated users (edge function uses service role)
CREATE POLICY "Active documents are viewable by authenticated"
ON public.qiraa_mind_documents
FOR SELECT
TO authenticated
USING (is_active = true);

-- Admins can fully manage documents
CREATE POLICY "Admins can manage qiraa mind documents"
ON public.qiraa_mind_documents
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_qiraa_mind_documents_updated_at
BEFORE UPDATE ON public.qiraa_mind_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
