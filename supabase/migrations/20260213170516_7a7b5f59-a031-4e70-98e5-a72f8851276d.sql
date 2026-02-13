
-- Create a function to auto-assign admin role and qiraa_mind to contact@qiraabusiness.online
-- Also auto-assign qiraa_mind for pro and enterprise plans
CREATE OR REPLACE FUNCTION public.auto_assign_admin_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Auto-assign admin role for contact@qiraabusiness.online
  IF NEW.email = 'contact@qiraabusiness.online' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Also enable qiraa_mind for this user
    UPDATE public.profiles SET has_qiraa_mind = true WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users for new signups
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin_on_signup();

-- Also assign admin + qiraa_mind to existing user if they exist
-- We need to check if the user already exists
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'contact@qiraabusiness.online' LIMIT 1;
  
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
    UPDATE public.profiles SET has_qiraa_mind = true WHERE user_id = target_user_id;
  END IF;
END $$;

-- Auto-enable qiraa_mind for pro/enterprise users
CREATE OR REPLACE FUNCTION public.auto_assign_qiraa_mind()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.subscription_plan IN ('pro', 'enterprise') THEN
    NEW.has_qiraa_mind = true;
  ELSIF NEW.subscription_plan IN ('free', 'basic') THEN
    -- Check if this is the admin email - keep their access
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id AND role = 'admin') THEN
      NEW.has_qiraa_mind = false;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_qiraa_mind_on_plan_change
  BEFORE UPDATE OF subscription_plan ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_qiraa_mind();
