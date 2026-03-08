-- Update admin profile: enterprise plan, unlimited tokens, qiraa_mind enabled
UPDATE public.profiles 
SET subscription_plan = 'enterprise', 
    qiraa_mind_tokens = 99999, 
    has_qiraa_mind = true 
WHERE user_id = '464c0856-3be9-4959-b267-29cb67653278';