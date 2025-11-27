-- Create handwash_sessions table to store completed hand-wash logs
CREATE TABLE public.handwash_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_seconds INTEGER NOT NULL,
  gestures_completed INTEGER NOT NULL DEFAULT 6,
  completion_score INTEGER NOT NULL CHECK (completion_score >= 0 AND completion_score <= 100),
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.handwash_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own sessions" 
ON public.handwash_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
ON public.handwash_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_handwash_sessions_user_completed ON public.handwash_sessions(user_id, completed_at DESC);

-- Create function to get today's stats
CREATE OR REPLACE FUNCTION public.get_today_handwash_stats(target_user_id UUID)
RETURNS TABLE (
  total_washes INTEGER,
  avg_score NUMERIC,
  avg_duration NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_washes,
    ROUND(AVG(completion_score), 1) as avg_score,
    ROUND(AVG(duration_seconds), 1) as avg_duration
  FROM public.handwash_sessions
  WHERE user_id = target_user_id 
    AND DATE(completed_at) = CURRENT_DATE;
END;
$$;