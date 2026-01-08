
import { createClient } from '@supabase/supabase-js';

// These should be configured in Vercel environment variables
const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

// Initialize client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

/**
 * Table names constants for consistency
 */
export const TABLES = {
  SETTINGS: 'site_settings',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  SUBCATEGORIES: 'sub_categories',
  HERO_SLIDES: 'hero_slides',
  ENQUIRIES: 'enquiries',
  PRODUCT_STATS: 'product_stats',
  ADMIN_USERS: 'admin_users',
  TRAFFIC_LOGS: 'traffic_logs',
  VISITOR_LOCATIONS: 'visitor_locations'
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

  const { error } = await supabase.storage
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
    const { error } = await supabase.from(TABLES.SETTINGS).select('id').limit(1);
    const end = performance.now();
    return { status: 'online', latency: Math.round(end - start), message: 'Connected' };
  } catch (err) {
    return { status: 'offline', latency: 0, message: 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
