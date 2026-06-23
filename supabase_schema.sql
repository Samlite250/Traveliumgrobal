-- SQL Schema for Travelium Supabase Project

-- 1. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    destination TEXT,
    program_type TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 4. Set up Policies for Applications
-- Allow users to insert their own applications
CREATE POLICY "Users can insert their own applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to view their own applications
CREATE POLICY "Users can view their own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = user_id);

-- 5. Set up Policies for Contacts
-- Allow anyone to submit a contact form
CREATE POLICY "Anyone can insert contact messages" 
ON public.contacts FOR INSERT 
WITH CHECK (true);

-- Allow admins to view contact messages (Optional, requires admin role setup)
-- CREATE POLICY "Admins can view contact messages" ON public.contacts FOR SELECT USING (true);
