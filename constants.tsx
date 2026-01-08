
import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode } from './types';

export const PERMISSION_TREE: PermissionNode[] = [
  { id: 'sales', label: 'Sales & Enquiries', description: 'Manage incoming leads and communications.', children: [ { id: 'sales.view', label: 'View Enquiries' }, { id: 'sales.manage', label: 'Manage Status (Read/Unread)' }, { id: 'sales.delete', label: 'Delete Enquiries' }, { id: 'sales.export', label: 'Export Data' } ] },
  { id: 'catalog', label: 'Catalog Management', description: 'Control products and categories.', children: [ { id: 'catalog.products.view', label: 'View Products' }, { id: 'catalog.products.manage', label: 'Add/Edit Products' }, { id: 'catalog.products.delete', label: 'Delete Products' }, { id: 'catalog.categories.manage', label: 'Manage Departments' }, { id: 'catalog.ads', label: 'Generate Ads' } ] },
  { id: 'content', label: 'Site Content', description: 'Edit pages and visual elements.', children: [ { id: 'content.hero', label: 'Hero Carousel' }, { id: 'content.identity', label: 'Brand Identity' }, { id: 'content.home', label: 'Home Page Sections' }, { id: 'content.about', label: 'About Page' }, { id: 'content.contact', label: 'Contact Page' }, { id: 'content.legal', label: 'Legal Pages' } ] },
  { id: 'analytics', label: 'Business Intelligence', description: 'View traffic and performance reports.', children: [ { id: 'analytics.view', label: 'View Dashboard' }, { id: 'analytics.products', label: 'Product Performance' }, { id: 'analytics.export', label: 'Export Reports' } ] },
  { id: 'system', label: 'System Administration', description: 'Advanced settings and team management.', children: [ { id: 'system.team.manage', label: 'Manage Team' }, { id: 'system.settings.core', label: 'Core Site Settings' }, { id: 'system.reset', label: 'Factory Reset' } ] }
];

export const INITIAL_ADMINS: AdminUser[] = [ { id: 'owner', name: 'Main Administrator', email: 'admin@kasicouture.com', role: 'owner', permissions: ['*'], password: 'password123', createdAt: Date.now(), phone: '+27 11 900 2000', address: 'Johannesburg HQ' } ];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  { id: 'e1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', whatsapp: '+27 82 555 0123', subject: 'Styling Consultation', message: 'Hi there, I am looking for a personal stylist for an upcoming gala in Cape Town.', createdAt: Date.now() - 86400000 * 2, status: 'unread' }
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'Kasi Couture',
  slogan: 'Personal Luxury Wardrobe',
  companyLogo: 'KC',
  companyLogoUrl: 'https://i.ibb.co/5X5qJXC6/Whats-App-Image-2026-01-08-at-15-34-23-removebg-preview.png',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'Home',
  navProductsLabel: 'Collections',
  navAboutLabel: 'My Story',
  navContactLabel: 'Concierge',
  navDashboardLabel: 'Portal',
  contactEmail: 'curation@kasicouture.com',
  contactPhone: '+27 11 900 2000',
  whatsappNumber: '+27119002000',
  address: 'Melrose Arch, Johannesburg',
  socialLinks: [ { id: '1', name: 'Instagram', url: 'https://instagram.com/kasicouture', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' } ],
  footerDescription: "The digital bridge to South African luxury.",
  footerCopyrightText: "All rights reserved. Made with love in South Africa.",
  homeHeroBadge: 'Kasi Couture Exclusive',
  homeAboutTitle: 'Modern Heritage. Timeless Elegance.',
  homeAboutDescription: 'I founded Kasi Couture to bridge the gap between street-inspired authenticity and high-end luxury.',
  homeAboutImage: 'https://images.unsplash.com/photo-1539109136881-3be06109477e?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Story',
  homeCategorySectionTitle: 'Shop by Department',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'The Standard',
  homeTrustItem1Title: 'Verified Luxury', homeTrustItem1Desc: 'Every product link is personally tested.', homeTrustItem1Icon: 'ShieldCheck',
  homeTrustItem2Title: 'Curated Taste', homeTrustItem2Desc: 'No algorithms. Only human-selected pieces.', homeTrustItem2Icon: 'Sparkles',
  homeTrustItem3Title: 'Global Reach', homeTrustItem3Desc: 'Sourcing the best of South African design.', homeTrustItem3Icon: 'Globe',
  productsHeroTitle: 'Boutique Explorer', productsHeroSubtitle: 'Refine your selection.', productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [ 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000' ],
  productsSearchPlaceholder: 'Search collections...',
  aboutHeroTitle: 'The Story of the Silhouette.', aboutHeroSubtitle: 'Kasi Couture is my personal curation platform.', aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  aboutEstablishedYear: '2024', aboutFounderName: 'Kasi Couture', aboutLocation: 'South Africa',
  aboutHistoryTitle: 'A Passion for Craft', aboutHistoryBody: 'What began as a style blog in the heart of Soweto...',
  aboutMissionTitle: 'Elite Curation', aboutMissionBody: 'To provide a seamless discover interface.', aboutMissionIcon: 'Target',
  aboutCommunityTitle: 'The Inner Circle', aboutCommunityBody: 'Join a global community of style icons.', aboutCommunityIcon: 'Users',
  aboutIntegrityTitle: 'Transparency First', aboutIntegrityBody: 'As an affiliate bridge page, we receive a small commission.', aboutIntegrityIcon: 'Award',
  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [],
  contactHeroTitle: 'Tailored Assistance.', contactHeroSubtitle: 'Our concierge team is ready to assist.',
  contactFormNameLabel: 'Full Identity', contactFormEmailLabel: 'Digital Mailbox', contactFormSubjectLabel: 'Inquiry Subject', contactFormMessageLabel: 'Your Message', contactFormButtonText: 'Transmit Inquiry',
  contactInfoTitle: 'Global HQ', contactAddressLabel: 'Address', contactHoursLabel: 'Operating Hours', contactHoursWeekdays: 'Mon - Fri: 09:00 - 18:00', contactHoursWeekends: 'Sat: 09:00 - 13:00',
  disclosureTitle: 'Affiliate Disclosure', disclosureContent: `### Disclosure\nMost product links are affiliate links.`,
  privacyTitle: 'Privacy Policy', privacyContent: `### Privacy\nWe value your data privacy.`,
  termsTitle: 'Terms of Service', termsContent: `### Terms\nKasi Couture is a bridge page.`,
  emailJsServiceId: '', emailJsTemplateId: '', emailJsPublicKey: '', amazonAssociateId: ''
};

export const INITIAL_CAROUSEL: CarouselSlide[] = [ { id: '1', image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=2000', type: 'image', title: 'Autumn Silk Series', subtitle: 'Flowing silhouettes.', cta: 'View Series' } ];
export const INITIAL_CATEGORIES: Category[] = [ { id: 'cat1', name: 'Apparel', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800', description: 'Luxury ready-to-wear.' } ];
export const INITIAL_SUBCATEGORIES: SubCategory[] = [ { id: 'sub1', categoryId: 'cat1', name: 'Silk Dresses' } ];
export const INITIAL_PRODUCTS: Product[] = [ { id: 'p1', name: 'Midnight Silk Wrap', sku: 'KC-APP-001', price: 3450, affiliateLink: 'https://example.com', categoryId: 'cat1', subCategoryId: 'sub1', description: 'Luxurious 100% silk wrap dress.', features: ['100% Premium Mulberry Silk'], specifications: { 'Material': '100% Mulberry Silk' }, media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1539109136881-3be06109477e?auto=format&fit=crop&q=80&w=800', name: 'Silk Dress', type: 'image/jpeg', size: 0 }], createdAt: Date.now() } ];

export const EMAIL_TEMPLATE_HTML = `<!DOCTYPE html><html>...</html>`;

export interface GuideStep { id: string; title: string; description: string; code?: string; codeLabel?: string; subSteps?: string[]; tips?: string; illustrationId?: string; }
export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'supabase_sql',
    title: 'Supabase: The Full Schema (Idempotent)',
    description: 'Run this SQL in your Supabase SQL Editor. It uses "IF NOT EXISTS" to safely create tables without errors if they already exist.',
    code: `-- 1. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY DEFAULT 'global',
  config jsonb NOT NULL
);

-- 2. Departments (Categories)
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text,
  image text,
  description text
);

-- 3. Subcategories
CREATE TABLE IF NOT EXISTS subcategories (
  id text PRIMARY KEY,
  category_id text REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL
);

-- 4. Products
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  sku text UNIQUE,
  price numeric NOT NULL,
  affiliate_link text,
  category_id text REFERENCES categories(id),
  sub_category_id text REFERENCES subcategories(id),
  description text,
  features text[],
  specifications jsonb,
  media jsonb,
  discount_rules jsonb,
  reviews jsonb,
  created_at bigint DEFAULT extract(epoch FROM now()) * 1000
);

-- 5. Hero Slides
CREATE TABLE IF NOT EXISTS carousel_slides (
  id text PRIMARY KEY,
  image text NOT NULL,
  type text CHECK (type IN ('image', 'video')),
  title text,
  subtitle text,
  cta text
);

-- 6. Enquiries (Leads)
CREATE TABLE IF NOT EXISTS enquiries (
  id text PRIMARY KEY,
  name text,
  email text,
  whatsapp text,
  subject text,
  message text,
  status text DEFAULT 'unread',
  created_at bigint DEFAULT extract(epoch FROM now()) * 1000
);

-- 7. Analytics
CREATE TABLE IF NOT EXISTS product_stats (
  product_id text PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  total_view_time integer DEFAULT 0,
  last_updated bigint DEFAULT extract(epoch FROM now()) * 1000
);

-- RLS (Row Level Security)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY;

-- Note: Policies cannot use IF NOT EXISTS easily. 
-- If you get "policy already exists" errors, you can safely ignore them 
-- as it means the security rules are already active.

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Access' AND tablename = 'products') THEN
        CREATE POLICY "Public Read Access" ON products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Access' AND tablename = 'categories') THEN
        CREATE POLICY "Public Read Access" ON categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Access' AND tablename = 'subcategories') THEN
        CREATE POLICY "Public Read Access" ON subcategories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Access' AND tablename = 'carousel_slides') THEN
        CREATE POLICY "Public Read Access" ON carousel_slides FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Access' AND tablename = 'site_settings') THEN
        CREATE POLICY "Public Read Access" ON site_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert Enquiries' AND tablename = 'enquiries') THEN
        CREATE POLICY "Public Insert Enquiries" ON enquiries FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Storage Read' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING ( bucket_id = 'media' );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Storage Write' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin Storage Write" ON storage.objects FOR ALL USING ( auth.role() = 'authenticated' );
    END IF;
END $$;`,
    codeLabel: 'Fixed SQL Script',
    illustrationId: 'database'
  }
];
