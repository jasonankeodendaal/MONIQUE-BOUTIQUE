
import { createClient } from '@supabase/sh/supabase-js';

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
 * Generic Fetcher
 */
export async function fetchTable(table: string) {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn(`Supabase: Table ${table} fetch failed. Ensure table exists.`);
    return null;
  }
}

/**
 * Generic Upserter
 */
export async function upsertItem(table: string, item: any) {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from(table).upsert(item).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`Supabase: Upsert to ${table} failed`, err);
    throw err;
  }
}

/**
 * Generic Deleter
 */
export async function deleteItem(table: string, id: string) {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error(`Supabase: Delete from ${table} failed`, err);
    throw err;
  }
}

/**
 * Upload Media to Bucket
 */
export async function uploadMedia(file: File | Blob, bucket = 'media') {
  if (!isSupabaseConfigured) return URL.createObjectURL(file as File);

  try {
    const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
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
  } catch (err) {
    console.error('Storage Upload Error:', err);
    return null;
  }
}

export async function measureConnection(): Promise<{ status: 'online' | 'offline', latency: number, message: string }> {
  if (!isSupabaseConfigured) return { status: 'offline', latency: 0, message: 'Missing Keys' };
  
  const start = performance.now();
  try {
    const { error } = await supabase.from('settings').select('id').limit(1);
    const end = performance.now();
    return { status: 'online', latency: Math.round(end - start), message: 'Synchronized' };
  } catch (err) {
    return { status: 'offline', latency: 0, message: 'No Connection' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
