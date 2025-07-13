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
// Helper function to upload file to Supabase Storage
export const uploadFile = async (file: File, bucket: string, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { data, publicUrl };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Helper function to save file record to database
export const saveFileRecord = async (fileType: string, fileName: string, fileUrl: string) => {
  try {
    // First, deactivate existing files of the same type
    await supabase
      .from('files')
      .update({ is_active: false })
      .eq('file_type', fileType);

    // Then insert new file record
    const { data, error } = await supabase
      .from('files')
      .insert({
        file_type: fileType,
        file_name: fileName,
        file_url: fileUrl,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving file record:', error);
    throw error;
  }
};