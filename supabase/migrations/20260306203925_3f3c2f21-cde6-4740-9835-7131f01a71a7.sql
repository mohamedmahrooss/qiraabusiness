
-- Add qiraa_mind_tokens column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS qiraa_mind_tokens integer NOT NULL DEFAULT 0;

-- Create qiraa_mind_history table for admin to view chat history
CREATE TABLE public.qiraa_mind_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  session_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.qiraa_mind_history ENABLE ROW LEVEL SECURITY;

-- Only admins can view all history
CREATE POLICY "Admins can view all chat history"
  ON public.qiraa_mind_history
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Users can insert their own messages
CREATE POLICY "Users can insert own messages"
  ON public.qiraa_mind_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage all history
CREATE POLICY "Admins can manage history"
  ON public.qiraa_mind_history
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
