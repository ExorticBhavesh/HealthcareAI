
-- Add new lifestyle parameters for holistic wellness tracking
ALTER TABLE public.lifestyle_logs
ADD COLUMN IF NOT EXISTS family_time_minutes integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS social_quality integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS spiritual_minutes integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS mental_relaxation_minutes integer DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.lifestyle_logs.family_time_minutes IS 'Minutes spent with family and friends';
COMMENT ON COLUMN public.lifestyle_logs.social_quality IS 'Social interaction quality rating 1-10';
COMMENT ON COLUMN public.lifestyle_logs.spiritual_minutes IS 'Minutes spent on spiritual activities';
COMMENT ON COLUMN public.lifestyle_logs.mental_relaxation_minutes IS 'Minutes spent on mental relaxation';
