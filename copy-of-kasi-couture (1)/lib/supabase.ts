
import { createClient } from '@supabase/supabase-js';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ENQUIRIES, INITIAL_ADMINS } from '../constants';

const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseUrl.includes('supabase.co'));

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

/**
 * Upload Media to Supabase Storage
 * Enforces use of 'media' bucket and handles auto-provisioning if bucket is missing.
 */
export async function uploadMedia(file: File, bucket = 'media') {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured. Cannot upload.");

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  // Try upload
  let { error } = await supabase.storage.from(bucket).upload(fileName, file);

  // Auto-provision bucket if it doesn't exist
  if (error && (error.message.includes('bucket not found') || error.message.includes('does not exist'))) {
    // Attempt to create bucket (Note: This might fail if RLS/Permissions are strict, but we try)
    const { error: createError } = await supabase.storage.createBucket(bucket, { public: true });
    if (!createError) {
       // Retry upload
       const { error: retryError } = await supabase.storage.from(bucket).upload(fileName, file);
       error = retryError;
    }
  }

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Generic Fetcher
 * Strictly fetches from Supabase. No local storage fallback.
 */
export async function fetchTableData(table: string) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    console.error(`Fetch error for ${table}:`, error);
    return [];
  }
  return data;
}

/**
 * Sync / Upsert Data
 */
export async function syncToCloud(table: string, data: any) {
  if (!isSupabaseConfigured) return;
  const payload = Array.isArray(data) ? data : [data];
  if (payload.length === 0) return;
  
  const { error } = await supabase.from(table).upsert(payload);
  if (error) console.error(`Sync error for ${table}:`, error);
}

/**
 * Delete Data
 */
export async function deleteFromCloud(table: string, id: string) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) console.error(`Delete error for ${table}:`, error);
}

/**
 * Auto-Provisioning & Seeding
 * Checks if tables are empty. If so, populates with INITIAL_* constants.
 */
export async function seedInitialData() {
  if (!isSupabaseConfigured) return;

  const tablesToSeed = [
    { name: 'settings', data: INITIAL_SETTINGS, check: true }, // settings is single row usually, but we check presence
    { name: 'products', data: INITIAL_PRODUCTS },
    { name: 'categories', data: INITIAL_CATEGORIES },
    { name: 'subcategories', data: INITIAL_SUBCATEGORIES },
    { name: 'hero_slides', data: INITIAL_CAROUSEL },
    { name: 'enquiries', data: INITIAL_ENQUIRIES },
    { name: 'admins', data: INITIAL_ADMINS }
  ];

  for (const t of tablesToSeed) {
    const { count, error } = await supabase.from(t.name).select('*', { count: 'exact', head: true });
    
    // If table exists but is empty, seed it.
    if (!error && count === 0) {
      console.log(`Auto-provisioning data for table: ${t.name}`);
      const payload = Array.isArray(t.data) ? t.data : [t.data];
      await supabase.from(t.name).insert(payload);
    }
  }
}

export async function measureConnection(): Promise<{ status: 'online' | 'offline', latency: number, message: string }> {
  if (!isSupabaseConfigured) {
    return { status: 'offline', latency: 0, message: 'Missing Cloud Config' };
  }
  
  const start = performance.now();
  try {
    const { error } = await supabase.from('settings').select('companyName').limit(1);
    const end = performance.now();
    if (error) throw error;
    return { status: 'online', latency: Math.round(end - start), message: 'Supabase Connected' };
  } catch (err) {
    return { status: 'offline', latency: 0, message: 'Connection Error' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
