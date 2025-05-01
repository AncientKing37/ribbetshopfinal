-- First drop the existing trigger so we can modify it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Modify the profiles table to add new columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Update the handle_new_user function to include the new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    username,
    credits,
    avatar_url,
    full_name
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'username',
    0,  -- default credits
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update types for the profiles table
COMMENT ON TABLE public.profiles IS 'Holds user profile data including credits and personal information';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users.id';
COMMENT ON COLUMN public.profiles.email IS 'User email from auth.users';
COMMENT ON COLUMN public.profiles.username IS 'Unique username for the user';
COMMENT ON COLUMN public.profiles.credits IS 'User credit balance';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to the user avatar image';
COMMENT ON COLUMN public.profiles.full_name IS 'User full name';

-- Add an index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email); 