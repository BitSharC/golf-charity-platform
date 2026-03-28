-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: charities
CREATE TABLE public.charities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: users
-- Note: users.id references auth.users in Supabase to link with their auth system.
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'subscriber')) DEFAULT 'subscriber',
  subscription_status TEXT DEFAULT 'inactive',
  charity_id UUID REFERENCES public.charities(id) ON DELETE SET NULL,
  charity_percentage NUMERIC CHECK (charity_percentage >= 10) DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: scores
CREATE TABLE public.scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER CHECK (score BETWEEN 1 AND 45) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: draws
CREATE TABLE public.draws (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  month TEXT NOT NULL,
  winning_numbers INTEGER[] NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- CRUCIAL ROLLING LOGIC (Database Trigger)
-- ==========================================
-- Function to keep only the latest 5 scores per user.
CREATE OR REPLACE FUNCTION enforce_score_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete oldest scores, keeping only the 5 most recent
  DELETE FROM public.scores
  WHERE id IN (
    SELECT id
    FROM public.scores
    WHERE user_id = NEW.user_id
    ORDER BY date DESC, id DESC
    OFFSET 5
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the rolling logic after every insert
CREATE TRIGGER enforce_score_limit_after_insert
AFTER INSERT ON public.scores
FOR EACH ROW
EXECUTE FUNCTION enforce_score_limit();

-- Set up Row Level Security (RLS) policies (Optional/Recommended for Supabase)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
