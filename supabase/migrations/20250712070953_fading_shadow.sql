/*
  # Portfolio Management Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `name` (text)
      - `title` (text)
      - `email` (text)
      - `phone` (text)
      - `location` (text)
      - `bio` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `skills`
      - `id` (uuid, primary key)
      - `category` (text)
      - `name` (text)
      - `level` (integer)
      - `created_at` (timestamp)
    
    - `experiences`
      - `id` (uuid, primary key)
      - `title` (text)
      - `company` (text)
      - `location` (text)
      - `start_date` (text)
      - `end_date` (text)
      - `description` (text array)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  level integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  start_date text NOT NULL DEFAULT '',
  end_date text NOT NULL DEFAULT '',
  description text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read skills"
  ON skills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills"
  ON skills
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read experiences"
  ON experiences
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert experiences"
  ON experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update experiences"
  ON experiences
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete experiences"
  ON experiences
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default data
INSERT INTO profiles (name, title, email, phone, location, bio) VALUES (
  'Abdullah Hassan',
  'Vigilance Officer',
  'abdullahthere1112@gmail.com',
  '+92 335 0953159',
  'Jhelum, Punjab, Pakistan',
  'Hardworking professional with expertise in customer service, multitasking, and time management. Devoted to giving every customer a positive and memorable experience with strong technical skills.'
) ON CONFLICT DO NOTHING;

-- Insert default skills
INSERT INTO skills (category, name, level) VALUES 
  ('Vigilance & Monitoring', 'Infrastructure Monitoring', 95),
  ('Vigilance & Monitoring', 'ODN Deployment Monitoring', 90),
  ('Vigilance & Monitoring', 'Asset Management', 92),
  ('Vigilance & Monitoring', 'Field Intelligence Gathering', 88),
  ('Vigilance & Monitoring', 'Damage Detection', 90),
  ('Professional Skills', 'Report Writing', 88),
  ('Professional Skills', 'Attention to Detail', 95),
  ('Professional Skills', 'Communication Skills', 90),
  ('Professional Skills', 'Problem Solving & Decision Making', 92),
  ('Professional Skills', 'Time Management', 90),
  ('Technical & Administrative', 'MS Office', 85),
  ('Technical & Administrative', 'Data Entry', 90),
  ('Technical & Administrative', 'Fast Typing', 85),
  ('Technical & Administrative', 'Team Coordination', 88),
  ('Technical & Administrative', 'Documentation', 85)
ON CONFLICT DO NOTHING;

-- Insert default experiences
INSERT INTO experiences (title, company, location, start_date, end_date, description) VALUES 
  (
    'Vigilance Officer',
    'Storm Fiber Powered by Cybernet Pvt. Ltd.',
    'Punjab, Pakistan',
    'Nov 2022',
    'Present',
    ARRAY[
      'Monitored ODN deployment sites, ensuring smooth construction and safeguarding infrastructure',
      'Maintained records of installed assets and reported damages or irregularities promptly',
      'Gathered field intelligence on competitor activities and submitted detailed progress reports',
      'Ensured compliance with safety standards and operational procedures'
    ]
  ),
  (
    'Salesman',
    'Punjab Baker',
    'Pakistan',
    'Feb 2021',
    'Nov 2021',
    ARRAY[
      'Inspected baking equipment in accordance with cleanliness and safety standards',
      'Designed appealing product displays to maintain unique presentation',
      'Met with customers to discuss needed bakery items and take orders',
      'Maintained high customer satisfaction through excellent service delivery'
    ]
  )
ON CONFLICT DO NOTHING;