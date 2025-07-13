import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  category: string;
  name: string;
  level: number;
  created_at: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  score: string;
  completion_date: string;
  created_at: string;
};

export type Certificate = {
  id: string;
  name: string;
  issuer: string;
  date_issued: string;
  file_url?: string;
  created_at: string;
};

export type FileRecord = {
  id: string;
  file_type: string;
  file_name: string;
  file_url: string;
  is_active: boolean;
  created_at: string;
};
export type Experience = {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string[];
  created_at: string;
};