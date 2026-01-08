
import { createClient } from '@supabase/supabase-js';

/**
 * --- SUPABASE SQL SCHEMA ---
 * Copy and paste this into your Supabase SQL Editor:
 * 
 * -- 1. STORAGE BUCKET
 * insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
 * create policy "Public Access" on storage.objects for select using ( bucket_id = 'media' );
 * create policy "Admin Control" on storage.objects for all using ( auth.role() = 'authenticated' );
 * 
 * -- 2. TABLES
 * create table if not exists site_settings (
 *   id text primary key default 'singleton',
 *   settings jsonb not null,
 *   updated_at timestamptz default now()
 * );
 * 
 * create table if not exists categories (
 *   id text primary key,
 *   name text not null,
 *   icon text not null,
 *   image text not null,
 *   description text,
 *   created_at timestamptz default now()
 * );
 * 
 * create table if not exists subcategories (
 *   id text primary key,
 *   category_id text references categories(id) on delete cascade,
 *   name text not null,
 *   created_at timestamptz default now()
 * );
 * 
 * create table if not exists products (
 *   id text primary key,
 *   name text not null,
 *   sku text not null,
 *   price numeric not null,
 *   affiliate_link text not null,
 *   category_id text references categories(id) on delete set null,
 *   sub_category_id text,
 *   description text not null,
 *   features text[] default '{}',
 *   specifications jsonb default '{}',
 *   media jsonb[] default '{}',
 *   discount_rules jsonb[] default '{}',
 *   reviews jsonb[] default '{}',
 *   created_at timestamptz default now()
 * );
 * 
 * create table if not exists hero_slides (
 *   id text primary key,
 *   image text not null,
 *   type text not null,
 *   title text not null,
 *   subtitle text not null,
 *   cta text not null,
 *   created_at timestamptz default now()
 * );
 * 
 * create table if not exists enquiries (
 *   id text primary key,
 *   name text not null,
 *   email text not null,
 *   whatsapp text,
 *   subject text not null,
 *   message text not null,
 *   status text default 'unread',
 *   created_at timestamptz default now()
 * );
 * 
 * create table if not exists product_stats (
 *   product_id text primary key references products(id) on delete cascade,
 *   views integer default 0,
 *   clicks integer default 0,
 *   total_view_time integer default 0,
 *   last_updated timestamptz default now()
 * );
 * 
 * -- 3. SECURITY (RLS)
 * alter table site_settings enable row level security;
 * alter table categories enable row level security;
 * alter table subcategories enable row level security;
 * alter table products enable row level security;
 * alter table hero_slides enable row level security;
 * alter table enquiries enable row level security;
 * alter table product_stats enable row level security;
 * 
 * -- 4. POLICIES
 * create policy "Public Read Settings" on site_settings for select using (true);
 * create policy "Public Read Categories" on categories for select using (true);
 * create policy "Public Read Subcategories" on subcategories for select using (true);
 * create policy "Public Read Products" on products for select using (true);
 * create policy "Public Read Hero" on hero_slides for select using (true);
 * create policy "Public Read Stats" on product_stats for select using (true);
 * create policy "Public Insert Enquiries" on enquiries for insert with check (true);
 * create policy "Public Manage Stats" on product_stats for all using (true) with check (true);
 * 
 * create policy "Admin All Settings" on site_settings for all using (auth.role() = 'authenticated');
 * create policy "Admin All Categories" on categories for all using (auth.role() = 'authenticated');
 * create policy "Admin All Subcategories" on subcategories for all using (auth.role() = 'authenticated');
 * create policy "Admin All Products" on products for all using (auth.role() = 'authenticated');
 * create policy "Admin All Hero" on hero_slides for all using (auth.role() = 'authenticated');
 * create policy "Admin All Enquiries" on enquiries for all using (auth.role() = 'authenticated');
 */

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
  settings: {
    get: async () => {
      if (!isSupabaseConfigured) return null;
      const { data } = await supabase.from('site_settings').select('settings').eq('id', 'singleton').single();
      return data?.settings;
    },
    set: async (settings: any) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('site_settings').upsert({ id: 'singleton', settings, updated_at: new Date().toISOString() });
    }
  },
  products: {
    all: async () => {
      if (!isSupabaseConfigured) return [];
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      return data || [];
    },
    upsert: async (product: any) => {
      if (!isSupabaseConfigured) return;
      const { created_at, ...cleanProduct } = product; // Remove timestamps if present
      await supabase.from('products').upsert({ ...cleanProduct });
    },
    delete: async (id: string) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('products').delete().eq('id', id);
    }
  },
  categories: {
    all: async () => {
      if (!isSupabaseConfigured) return [];
      const { data } = await supabase.from('categories').select('*').order('name');
      return data || [];
    },
    upsert: async (category: any) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('categories').upsert(category);
    },
    delete: async (id: string) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('categories').delete().eq('id', id);
    }
  },
  subcategories: {
    all: async () => {
      if (!isSupabaseConfigured) return [];
      const { data } = await supabase.from('subcategories').select('*').order('name');
      return data || [];
    },
    upsert: async (sub: any) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('subcategories').upsert(sub);
    },
    delete: async (id: string) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('subcategories').delete().eq('id', id);
    }
  },
  hero: {
    all: async () => {
      if (!isSupabaseConfigured) return [];
      const { data } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: true });
      return data || [];
    },
    upsert: async (slide: any) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('hero_slides').upsert(slide);
    },
    delete: async (id: string) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('hero_slides').delete().eq('id', id);
    }
  },
  enquiries: {
    all: async () => {
      if (!isSupabaseConfigured) return [];
      const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      return data || [];
    },
    upsert: async (enquiry: any) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('enquiries').upsert(enquiry);
    },
    delete: async (id: string) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('enquiries').delete().eq('id', id);
    }
  },
  stats: {
    all: async () => {
      if (!isSupabaseConfigured) return [];
      const { data } = await supabase.from('product_stats').select('*');
      return data || [];
    },
    upsert: async (stat: any) => {
      if (!isSupabaseConfigured) return;
      await supabase.from('product_stats').upsert(stat);
    }
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
