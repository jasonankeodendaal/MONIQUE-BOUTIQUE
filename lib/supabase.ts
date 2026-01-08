
import { createClient } from '@supabase/supabase-js';

// These should be configured in Vercel environment variables
// We trim them to avoid issues with accidental whitespace during copy-paste
const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

// Export a flag to check if Supabase is properly configured
// Also ensures the URL looks like a valid URL (starts with http)
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

// Initialize client (will be null-safe if strings are empty, but calls will fail)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

/**
 * Helper to upload a file to Supabase storage
 */
export async function uploadMedia(file: File, bucket = 'media') {
  if (!isSupabaseConfigured) {
    // Fallback: Return a local object URL for preview if not configured
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
 * Helper to wipe all files in a specific bucket
 * Note: Requires RLS policies that allow listing and deletion
 */
export async function emptyStorageBucket(bucket = 'media') {
  if (!isSupabaseConfigured) return;

  // 1. List all files
  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list();

  if (listError) throw listError;
  if (!files || files.length === 0) return;

  // 2. Delete them
  const filesToRemove = files.map((x) => x.name);
  const { error: deleteError } = await supabase.storage
    .from(bucket)
    .remove(filesToRemove);

  if (deleteError) throw deleteError;
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
    // Simple lightweight fetch to check connectivity
    const { error } = await supabase.from('non_existent_table').select('id').limit(1);
    // We expect an error (404 table not found) or success, but network connectivity is what matters.
    const end = performance.now();
    return { status: 'online', latency: Math.round(end - start), message: 'Connected' };
  } catch (err) {
    return { status: 'offline', latency: 0, message: 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
