
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

export const db = {
  async get<T>(table: string, defaultValue: T[] = []): Promise<T[]> {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(`admin_${table}`);
      return saved ? JSON.parse(saved) : defaultValue;
    }
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.warn(`Supabase read error on ${table}:`, error);
      return defaultValue;
    }
    return data as T[];
  },

  async upsert<T extends { id: string }>(table: string, item: T) {
    if (!isSupabaseConfigured) {
      const existing = JSON.parse(localStorage.getItem(`admin_${table}`) || '[]');
      const index = existing.findIndex((x: any) => x.id === item.id);
      const updated = index > -1 
        ? existing.map((x: any) => x.id === item.id ? item : x)
        : [item, ...existing];
      localStorage.setItem(`admin_${table}`, JSON.stringify(updated));
      return item;
    }
    const { data, error } = await supabase.from(table).upsert(item).select().single();
    if (error) throw error;
    return data as T;
  },

  async delete(table: string, id: string) {
    if (!isSupabaseConfigured) {
      const existing = JSON.parse(localStorage.getItem(`admin_${table}`) || '[]');
      const updated = existing.filter((x: any) => x.id !== id);
      localStorage.setItem(`admin_${table}`, JSON.stringify(updated));
      return;
    }
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  },

  async getSettings(defaultSettings: any) {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('site_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    }
    const { data, error } = await supabase.from('site_settings').select('config').eq('id', 'global').single();
    if (error) return defaultSettings;
    return data.config;
  },

  async saveSettings(settings: any) {
    if (!isSupabaseConfigured) {
      localStorage.setItem('site_settings', JSON.stringify(settings));
      return;
    }
    const { error } = await supabase.from('site_settings').upsert({ id: 'global', config: settings });
    if (error) throw error;
  }
};

export async function uploadMedia(file: File, bucket = 'media') {
  if (!isSupabaseConfigured) return URL.createObjectURL(file);
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;
  const { error } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error) throw error;
  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return publicUrl.publicUrl;
}

export async function measureConnection(): Promise<{ status: 'online' | 'offline', latency: number, message: string }> {
  if (!isSupabaseConfigured) return { status: 'offline', latency: 0, message: 'Missing Environment Variables' };
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
