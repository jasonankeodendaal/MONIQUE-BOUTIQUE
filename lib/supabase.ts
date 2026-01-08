
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
 * Generic Database Helpers
 */
export const db = {
  async getAll<T>(table: string): Promise<T[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.warn(`Supabase fetch error [${table}]:`, error.message);
      return [];
    }
    return data as T[];
  },
  
  async upsert(table: string, data: any) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from(table).upsert(data);
    if (error) throw error;
  },

  async delete(table: string, id: string) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  }
};

/**
 * Helper to upload a file to Supabase storage
 */
export async function uploadMedia(file: File, bucket = 'media') {
  if (!isSupabaseConfigured) {
    return URL.createObjectURL(file);
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
}

/**
 * Diagnostics helper
 */
export async function measureConnection(): Promise<{ status: 'online' | 'offline', latency: number, message: string }> {
  if (!isSupabaseConfigured) {
    return { status: 'offline', latency: 0, message: 'Missing Environment Variables' };
  }
  
  const start = performance.now();
  try {
    const { error } = await supabase.from('site_settings').select('id').limit(1);
    const end = performance.now();
    return { status: 'online', latency: Math.round(end - start), message: 'Connected' };
  } catch (err) {
    return { status: 'offline', latency: 0, message: 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
