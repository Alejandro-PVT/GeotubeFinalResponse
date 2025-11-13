-- Create users table for tracking unique visitors
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_sessions table for tracking video watch time
CREATE TABLE IF NOT EXISTS public.video_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_title TEXT,
  channel_name TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  watch_duration_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8)
);

-- Create video_load_metrics table for tracking load performance
CREATE TABLE IF NOT EXISTS public.video_load_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  load_start_time TIMESTAMPTZ DEFAULT NOW(),
  load_end_time TIMESTAMPTZ,
  load_duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  connection_type TEXT
);

-- Create connection_issues table for tracking internet problems
CREATE TABLE IF NOT EXISTS public.connection_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  video_id TEXT,
  issue_type TEXT NOT NULL,
  error_message TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolution_time TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_video_sessions_user_id ON public.video_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_video_sessions_video_id ON public.video_sessions(video_id);
CREATE INDEX IF NOT EXISTS idx_video_sessions_started_at ON public.video_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_video_load_metrics_user_id ON public.video_load_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_connection_issues_user_id ON public.connection_issues(user_id);
CREATE INDEX IF NOT EXISTS idx_users_session_id ON public.users(session_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_load_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_issues ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're tracking anonymous users)
CREATE POLICY "Allow public insert on users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public update on users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on video_sessions" ON public.video_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on video_sessions" ON public.video_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public update on video_sessions" ON public.video_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on video_load_metrics" ON public.video_load_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on video_load_metrics" ON public.video_load_metrics FOR SELECT USING (true);

CREATE POLICY "Allow public insert on connection_issues" ON public.connection_issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on connection_issues" ON public.connection_issues FOR SELECT USING (true);
CREATE POLICY "Allow public update on connection_issues" ON public.connection_issues FOR UPDATE USING (true);
