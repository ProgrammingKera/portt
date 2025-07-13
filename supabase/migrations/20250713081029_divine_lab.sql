/*
  # Add Education and File Management

  1. New Tables
    - `education`
      - `id` (uuid, primary key)
      - `degree` (text)
      - `institution` (text)
      - `score` (text)
      - `completion_date` (text)
      - `created_at` (timestamp)
    
    - `certificates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `issuer` (text)
      - `date_issued` (text)
      - `file_url` (text, optional)
      - `created_at` (timestamp)
    
    - `files`
      - `id` (uuid, primary key)
      - `file_type` (text) -- 'cv', 'profile_pic'
      - `file_name` (text)
      - `file_url` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

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

-- Enable RLS
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies for education
CREATE POLICY "Anyone can read education"
  ON education
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage education"
  ON education
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for certificates
CREATE POLICY "Anyone can read certificates"
  ON certificates
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage certificates"
  ON certificates
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for files
CREATE POLICY "Anyone can read active files"
  ON files
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage files"
  ON files
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default education data
INSERT INTO education (degree, institution, score, completion_date) VALUES 
  ('Intermediate (FSC)', 'F.G Inter College Jhelum Cantt', '716/1100', 'July 2020'),
  ('Matriculation (Science)', 'F.G Public School No.1 Boys Jhelum Cantt', '844/1100', 'Nov 2018')
ON CONFLICT DO NOTHING;

-- Insert default certificate data
INSERT INTO certificates (name, issuer, date_issued) VALUES 
  ('MS Office Certification', 'Government of the Punjab - Trade Testing Board Lahore', '2021')
ON CONFLICT DO NOTHING;