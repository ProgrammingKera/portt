/*
  # Fix Missing Database Tables

  1. New Tables
    - `profiles` - User profile information
    - `skills` - Skills with categories and levels
    - `experiences` - Work experience records
    - `education` - Education background
    - `certificates` - Professional certificates
    - `files` - File management (CV, profile pics)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated user management

  3. Sample Data
    - Insert default profile data
    - Insert education records
    - Insert certificate data
    - Insert sample skills
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  level integer DEFAULT 80,
  created_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  start_date text NOT NULL DEFAULT '',
  end_date text DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL DEFAULT '',
  institution text NOT NULL DEFAULT '',
  score text NOT NULL DEFAULT '',
  completion_date text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  issuer text NOT NULL DEFAULT '',
  date_issued text NOT NULL DEFAULT '',
  file_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_type text NOT NULL DEFAULT '',
  file_name text NOT NULL DEFAULT '',
  file_url text NOT NULL DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage profiles" ON profiles FOR ALL TO authenticated USING (true);

-- Create policies for skills
CREATE POLICY "Anyone can read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage skills" ON skills FOR ALL TO authenticated USING (true);

-- Create policies for experiences
CREATE POLICY "Anyone can read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage experiences" ON experiences FOR ALL TO authenticated USING (true);

-- Create policies for education
CREATE POLICY "Anyone can read education" ON education FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage education" ON education FOR ALL TO authenticated USING (true);

-- Create policies for certificates
CREATE POLICY "Anyone can read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage certificates" ON certificates FOR ALL TO authenticated USING (true);

-- Create policies for files
CREATE POLICY "Anyone can read active files" ON files FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage files" ON files FOR ALL TO authenticated USING (true);

-- Insert default profile data
INSERT INTO profiles (name, title, email, phone, location, bio) VALUES 
  ('Abdullah Hassan', 'Professional Customer Service Representative', 'abdullahhassan@email.com', '+92-XXX-XXXXXXX', 'Jhelum, Pakistan', 'I am a hardworking professional with extensive experience in customer service, multitasking, and time management. My career has been focused on delivering exceptional customer experiences while maintaining high standards of quality and efficiency.')
ON CONFLICT DO NOTHING;

-- Insert education data
INSERT INTO education (degree, institution, score, completion_date) VALUES 
  ('Intermediate (FSC)', 'F.G Inter College Jhelum Cantt', '716/1100', 'July 2020'),
  ('Matriculation (Science)', 'F.G Public School No.1 Boys Jhelum Cantt', '844/1100', 'Nov 2018')
ON CONFLICT DO NOTHING;

-- Insert certificate data
INSERT INTO certificates (name, issuer, date_issued) VALUES 
  ('MS Office Certification', 'Government of the Punjab - Trade Testing Board Lahore', '2021')
ON CONFLICT DO NOTHING;

-- Insert sample skills
INSERT INTO skills (name, category, level) VALUES 
  ('Infrastructure Monitoring', 'Vigilance & Monitoring', 85),
  ('Customer Service', 'Professional Skills', 90),
  ('MS Office', 'Technical & Administrative', 80),
  ('Time Management', 'Professional Skills', 85),
  ('Problem Solving', 'Professional Skills', 80),
  ('Data Entry', 'Technical & Administrative', 75),
  ('Quality Assurance', 'Professional Skills', 80)
ON CONFLICT DO NOTHING;

-- Insert sample experience
INSERT INTO experiences (title, company, location, start_date, end_date, description) VALUES 
  ('Customer Service Representative', 'Various Companies', 'Jhelum, Pakistan', '2020', 'Present', 'Provided exceptional customer service, handled multiple tasks efficiently, and maintained high standards of quality in all interactions. Developed strong communication skills and ability to work under pressure.')
ON CONFLICT DO NOTHING;