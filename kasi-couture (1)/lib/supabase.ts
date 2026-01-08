
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
 * Syncs a specific collection to Supabase. 
 * If Supabase is configured, it pushes data there.
 */
export async function syncToCloud(table: string, data: any) {
  if (!isSupabaseConfigured) return;
  
  try {
    const { error } = await supabase
      .from(table)
      .upsert(data, { onConflict: 'id' });
    
    if (error) console.error(`Sync error for ${table}:`, error);
  } catch (err) {
    console.error(`Failed to sync ${table} to cloud`, err);
  }
}

/**
 * Fetches a collection from Supabase or falls back to localStorage
 */
export async function fetchCollection(table: string, fallbackData: any[]) {
  if (!isSupabaseConfigured) return fallbackData;

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data && data.length > 0 ? data : fallbackData;
  } catch (err) {
    console.warn(`Cloud fetch failed for ${table}, using local fallback`, err);
    return fallbackData;
  }
}

export async function uploadMedia(file: File, bucket = 'media') {
  if (!isSupabaseConfigured) return URL.createObjectURL(file);

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

export async function measureConnection(): Promise<{ status: 'online' | 'offline', latency: number, message: string }> {
  if (!isSupabaseConfigured) {
    return { status: 'offline', latency: 0, message: 'Missing Environment Variables' };
  }
  
  const start = performance.now();
  try {
    // Check settings table as a heartbeat
    const { error } = await supabase.from('site_settings').select('id').limit(1);
    const end = performance.now();
    return { status: 'online', latency: Math.round(end - start), message: 'Connected' };
  } catch (err) {
    return { status: 'offline', latency: 0, message: 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
