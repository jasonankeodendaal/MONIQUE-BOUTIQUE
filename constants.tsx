
import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode } from './types';

export const PERMISSION_TREE: PermissionNode[] = [
  { id: 'sales', label: 'Sales & Enquiries', children: [{ id: 'sales.view', label: 'View Enquiries' }, { id: 'sales.delete', label: 'Delete Enquiries' }] },
  { id: 'catalog', label: 'Catalog Management', children: [{ id: 'catalog.products.manage', label: 'Add/Edit Products' }, { id: 'catalog.categories.manage', label: 'Manage Depts' }] },
  { id: 'content', label: 'Site Content', children: [{ id: 'content.hero', label: 'Hero' }, { id: 'content.home', label: 'Home Page' }] },
  { id: 'system', label: 'System Administration', children: [{ id: 'system.settings.core', label: 'Settings' }] }
];

export const INITIAL_ADMINS: AdminUser[] = [{ id: 'owner', name: 'Main Admin', email: 'admin@kasicouture.com', role: 'owner', permissions: ['*'], createdAt: Date.now() }];
export const INITIAL_ENQUIRIES: Enquiry[] = [];
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
  address: 'Johannesburg, South Africa',
  socialLinks: [],
  footerDescription: "The digital bridge to South African luxury.",
  footerCopyrightText: "All rights reserved. Made with love in South Africa.",
  homeHeroBadge: 'Kasi Couture Exclusive',
  homeAboutTitle: 'Modern Heritage.',
  homeAboutDescription: 'Founded to bridge the gap between street authenticity and high-end luxury.',
  homeAboutImage: 'https://images.unsplash.com/photo-1539109136881-3be06109477e?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Story',
  homeCategorySectionTitle: 'Shop by Department',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'The Standard',
  homeTrustItem1Title: 'Verified Luxury', homeTrustItem1Desc: 'Personally tested links.', homeTrustItem1Icon: 'ShieldCheck',
  homeTrustItem2Title: 'Curated Taste', homeTrustItem2Desc: 'Human-selected pieces.', homeTrustItem2Icon: 'Sparkles',
  homeTrustItem3Title: 'Global Reach', homeTrustItem3Desc: 'Sourcing the best.', homeTrustItem3Icon: 'Globe',
  productsHeroTitle: 'Boutique Explorer',
  productsHeroSubtitle: 'Refine your selection.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [],
  productsSearchPlaceholder: 'Search...',
  aboutHeroTitle: 'The Story.',
  aboutHeroSubtitle: 'Our platform is dedicated to exquisite garments.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  aboutEstablishedYear: '2024', aboutFounderName: 'Kasi Couture', aboutLocation: 'South Africa',
  aboutHistoryTitle: 'A Passion for Craft', aboutHistoryBody: 'What began as a style blog is now a premier bridge page.',
  aboutMissionTitle: 'Elite Curation', aboutMissionBody: 'Discovery made seamless.', aboutMissionIcon: 'Target',
  aboutCommunityTitle: 'Inner Circle', aboutCommunityBody: 'Value quality.', aboutCommunityIcon: 'Users',
  aboutIntegrityTitle: 'Transparency', aboutIntegrityBody: 'Affiliate supported.', aboutIntegrityIcon: 'Award',
  aboutSignatureImage: '', aboutGalleryImages: [],
  contactHeroTitle: 'Assistance.', contactHeroSubtitle: 'Our team is ready.',
  contactFormNameLabel: 'Identity', contactFormEmailLabel: 'Mailbox', contactFormSubjectLabel: 'Subject', contactFormMessageLabel: 'Message', contactFormButtonText: 'Transmit',
  contactInfoTitle: 'HQ', contactAddressLabel: 'Address', contactHoursLabel: 'Hours', contactHoursWeekdays: 'Mon-Fri', contactHoursWeekends: 'Sat',
  disclosureTitle: 'Affiliate Disclosure', disclosureContent: 'Transparency is our foundation.',
  privacyTitle: 'Privacy', privacyContent: 'We value your data.',
  termsTitle: 'Terms', termsContent: 'We do not process payments directly.',
};

export const INITIAL_CAROUSEL: CarouselSlide[] = [];
export const INITIAL_CATEGORIES: Category[] = [];
export const INITIAL_SUBCATEGORIES: SubCategory[] = [];
export const INITIAL_PRODUCTS: Product[] = [];

export const EMAIL_TEMPLATE_HTML = `<!DOCTYPE html><html><body><h1>{{company_name}}</h1><p>Dear {{to_name}},</p><div>{{{message}}}</div></body></html>`;

export interface GuideStep { id: string; title: string; description: string; code?: string; codeLabel?: string; subSteps?: string[]; illustrationId?: string; }

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'supabase_sql',
    title: 'Cloud Database Provisioning',
    description: 'Execute the following SQL in the Supabase Dashboard to enable the global storage protocol for your bridge page.',
    code: `
-- 1. Unified Site Data Table
create table if not exists site_data (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- 2. Security Protocols (RLS)
alter table site_data enable row level security;
create policy "Public Read Access" on site_data for select using (true);
create policy "Admin Write Access" on site_data for all using (auth.role() = 'authenticated');

-- 3. Storage Infrastructure
-- Go to Storage -> Create New Bucket -> Name it 'media' -> Make it PUBLIC
`,
    codeLabel: 'Supabase SQL Editor Deployment',
    illustrationId: 'database'
  },
  {
    id: 'deployment',
    title: 'Live Deployment',
    description: 'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your Vercel Environment Variables to activate the cloud engine.',
    illustrationId: 'beacon'
  }
];
