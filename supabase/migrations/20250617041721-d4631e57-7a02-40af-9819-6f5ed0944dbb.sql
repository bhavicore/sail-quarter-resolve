
-- Create enum for complaint status
CREATE TYPE complaint_status AS ENUM ('Pending', 'In Progress', 'Resolved');

-- Create enum for complaint categories  
CREATE TYPE complaint_category AS ENUM ('Plumbing', 'Electrical', 'Civil Maintenance', 'Mess', 'Guest House', 'Admin Block', 'Maintenance', 'Cleanliness', 'Security', 'Other');

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'user',
  quarter_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create complaints table
CREATE TABLE public.complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category complaint_category NOT NULL,
  status complaint_status NOT NULL DEFAULT 'Pending',
  location TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on our tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS Policies for complaints
CREATE POLICY "Users can view their own complaints" ON public.complaints
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own complaints" ON public.complaints
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending complaints" ON public.complaints
  FOR UPDATE USING (auth.uid() = user_id AND status = 'Pending');

CREATE POLICY "Admins can view all complaints" ON public.complaints
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all complaints" ON public.complaints
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.email = 'admin@sail.com' THEN 'admin'::user_role
      ELSE 'user'::user_role
    END
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
