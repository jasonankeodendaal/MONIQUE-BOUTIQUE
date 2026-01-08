
import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

/**
 * Generic Database CRUD for Supabase
 * We use a single 'site_data' table with JSONB for maximum flexibility in this bridge page setup
 */
export const db = {
  async getAll<T>(key: string, defaultValue: T): Promise<T> {
    if (!isSupabaseConfigured) return defaultValue;
    try {
      const { data, error } = await supabase
        .from('site_data')
        .select('data')
        .eq('id', key)
        .single();
      
      if (error || !data) return defaultValue;
      return data.data as T;
    } catch (e) {
      return defaultValue;
    }
  },

  async save(key: string, data: any) {
    if (!isSupabaseConfigured) {
      localStorage.setItem(`admin_${key}`, JSON.stringify(data));
      return;
    }
    const { error } = await supabase
      .from('site_data')
      .upsert({ id: key, data, updated_at: new Date().toISOString() });
    
    if (error) throw error;
  }
};

/**
 * Helper to upload a file to Supabase storage
 */
export async function uploadMedia(file: File | string, bucket = 'media'): Promise<string> {
  if (typeof file === 'string' && !file.startsWith('data:')) return file;
  if (!isSupabaseConfigured) return typeof file === 'string' ? file : URL.createObjectURL(file);

  let blob: Blob;
  let fileName: string;
  let fileExt: string;

  if (typeof file === 'string' && file.startsWith('data:')) {
    const res = await fetch(file);
    blob = await res.blob();
    fileExt = blob.type.split('/')[1] || 'png';
    fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  } else if (file instanceof File) {
    blob = file;
    fileExt = file.name.split('.').pop() || 'png';
    fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  } else {
    return '';
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, blob);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}

export async function measureConnection(): Promise<{ status: 'online' | 'offline', latency: number, message: string }> {
  if (!isSupabaseConfigured) {
    return { status: 'offline', latency: 0, message: 'Missing Environment Variables' };
  }
  
  const start = performance.now();
  try {
    const { error } = await supabase.from('site_data').select('id').limit(1);
    const end = performance.now();
    return { status: 'online', latency: Math.round(end - start), message: 'Connected' };
  } catch (err) {
    return { status: 'offline', latency: 0, message: 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
