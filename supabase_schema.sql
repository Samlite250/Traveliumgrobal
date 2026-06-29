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

-- 6. Create Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 8. Insert default admin (change email after first login)
INSERT INTO public.admin_users (email, full_name)
VALUES ('admin@traveliumglobal.com', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- 9. Admin Policies: Allow admins full access to applications
CREATE POLICY "Admins can view all applications"
ON public.applications FOR SELECT
USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);

CREATE POLICY "Admins can update all applications"
ON public.applications FOR UPDATE
USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);

-- 10. Admin Policies: Allow admins to view contacts
CREATE POLICY "Admins can view contact messages"
ON public.contacts FOR SELECT
USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);

CREATE POLICY "Admins can delete contact messages"
ON public.contacts FOR DELETE
USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);

-- 11. Allow admins to view admin_users table
CREATE POLICY "Admins can view admin users"
ON public.admin_users FOR SELECT
USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
);

-- 12. Allow admins to view auth users (via a secure view)
-- Note: This requires a Supabase function to securely list users
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (id UUID, email TEXT, full_name TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users) THEN
        RETURN QUERY SELECT au.id, au.email::TEXT, (au.raw_user_meta_data ->> 'full_name')::TEXT, au.created_at
        FROM auth.users au;
    ELSE
        RETURN;
    END IF;
END;
$$;
