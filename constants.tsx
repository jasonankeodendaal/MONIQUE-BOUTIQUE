
import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode } from './types';

export const PERMISSION_TREE: PermissionNode[] = [
  {
    id: 'sales',
    label: 'Sales & Enquiries',
    description: 'Manage incoming leads and communications.',
    children: [
      { id: 'sales.view', label: 'View Enquiries' },
      { id: 'sales.manage', label: 'Manage Status (Read/Unread)' },
      { id: 'sales.delete', label: 'Delete Enquiries' },
      { id: 'sales.export', label: 'Export Data' }
    ]
  },
  {
    id: 'catalog',
    label: 'Catalog Management',
    description: 'Control products and categories.',
    children: [
      { id: 'catalog.products.view', label: 'View Products' },
      { id: 'catalog.products.manage', label: 'Add/Edit Products' },
      { id: 'catalog.products.delete', label: 'Delete Products' },
      { id: 'catalog.categories.manage', label: 'Manage Departments' },
      { id: 'catalog.ads', label: 'Generate Ads' }
    ]
  },
  {
    id: 'content',
    label: 'Site Content',
    description: 'Edit pages and visual elements.',
    children: [
      { id: 'content.hero', label: 'Hero Carousel' },
      { id: 'content.identity', label: 'Brand Identity' },
      { id: 'content.home', label: 'Home Page Sections' },
      { id: 'content.about', label: 'About Page' },
      { id: 'content.contact', label: 'Contact Page' },
      { id: 'content.legal', label: 'Legal Pages' }
    ]
  },
  {
    id: 'analytics',
    label: 'Business Intelligence',
    description: 'View traffic and performance reports.',
    children: [
      { id: 'analytics.view', label: 'View Dashboard' },
      { id: 'analytics.products', label: 'Product Performance' },
      { id: 'analytics.export', label: 'Export Reports' }
    ]
  },
  {
    id: 'system',
    label: 'System Administration',
    description: 'Advanced settings and team management.',
    children: [
      { id: 'system.team.manage', label: 'Manage Team' },
      { id: 'system.settings.core', label: 'Core Site Settings' },
      { id: 'system.reset', label: 'Factory Reset' }
    ]
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'owner',
    name: 'Main Administrator',
    email: 'admin@kasicouture.com',
    role: 'owner',
    permissions: ['*'], // * implies all
    password: 'password123',
    createdAt: Date.now(),
    phone: '+27 11 900 2000',
    address: 'Johannesburg HQ',
    profileImage: ''
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'e1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    whatsapp: '+27 82 555 0123',
    subject: 'Styling Consultation',
    message: 'Hi there, I am looking for a personal stylist for an upcoming gala in Cape Town. Do you offer virtual consultations?',
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    status: 'unread'
  },
  {
    id: 'e2',
    name: 'Michael Nkosi',
    email: 'michael.n@example.com',
    subject: 'Product Curation Inquiry',
    message: 'I saw the Autumn Silk Series and I am interested in the bulk purchasing options for my boutique in Durban.',
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    status: 'read'
  },
  {
    id: 'e3',
    name: 'Elena Rossi',
    email: 'elena@fashionweek.it',
    whatsapp: '+39 333 123 4567',
    subject: 'Brand Partnership',
    message: 'We would love to feature Kasi Couture in our upcoming digital editorial. Please let me know who to contact regarding PR.',
    createdAt: Date.now() - 3600000, // 1 hour ago
    status: 'unread'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'Kasi Couture',
  slogan: 'Personal Luxury Wardrobe',
  companyLogo: 'KC',
  companyLogoUrl: '',
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
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/kasicouture', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'Twitter', url: 'https://twitter.com/kasicouture', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3256/3256013.png' }
  ],

  footerDescription: "The digital bridge to South African luxury. Curating elite fashion and lifestyle affiliate picks for the discerning modern closet.",
  footerCopyrightText: "All rights reserved. Made with love in South Africa.",

  // Home
  homeHeroBadge: 'Kasi Couture Exclusive',
  homeAboutTitle: 'Modern Heritage. Timeless Elegance.',
  homeAboutDescription: 'I founded Kasi Couture to bridge the gap between street-inspired authenticity and high-end luxury. Every piece featured here is a testament to the vibrant spirit of Johannesburg refined for the global stage.',
  homeAboutImage: 'https://images.unsplash.com/photo-1539109136881-3be06109477e?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Story',
  homeCategorySectionTitle: 'Shop by Department',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'The Standard',
  homeTrustItem1Title: 'Verified Luxury',
  homeTrustItem1Desc: 'Every product link is personally tested and leads to a secure, verified retailer.',
  homeTrustItem1Icon: 'ShieldCheck',
  homeTrustItem2Title: 'Curated Taste',
  homeTrustItem2Desc: 'No algorithms. Only human-selected pieces that embody the Kasi Couture aesthetic.',
  homeTrustItem2Icon: 'Sparkles',
  homeTrustItem3Title: 'Global Reach',
  homeTrustItem3Desc: 'Sourcing the best of South African design and international luxury couture.',
  homeTrustItem3Icon: 'Globe',

  // Products
  productsHeroTitle: 'Boutique Explorer',
  productsHeroSubtitle: 'Refine your selection by department, category, or trend.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000'
  ],
  productsSearchPlaceholder: 'Search collections...',

  // About
  aboutHeroTitle: 'The Story of the Silhouette.',
  aboutHeroSubtitle: 'Kasi Couture is my personal curation platform, dedicated to finding the most exquisite garments and accessories across the continent.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'Kasi Couture',
  aboutLocation: 'South Africa',

  aboutHistoryTitle: 'A Passion for Craft',
  aboutHistoryBody: 'What began as a style blog in the heart of Soweto has evolved into a premier luxury bridge page. Our mission is to highlight the intricate craftsmanship of local and international designers.',
  
  aboutMissionTitle: 'Elite Curation',
  aboutMissionBody: 'To provide a seamless, aesthetically pleasing interface for fashion enthusiasts to discover premium affiliate products.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'The Inner Circle',
  aboutCommunityBody: 'Join a global community of style icons who value quality over quantity.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Transparency First',
  aboutIntegrityBody: 'As an affiliate bridge page, we receive a small commission on purchases made through our links, allowing us to keep curating the best for you without bias.',
  aboutIntegrityIcon: 'Award',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551488852-0801d863dc34?auto=format&fit=crop&q=80&w=800'
  ],

  // Contact
  contactHeroTitle: 'Tailored Assistance.',
  contactHeroSubtitle: 'Have a question about a specific curation or want to collaborate? My concierge team is ready to assist.',
  contactFormNameLabel: 'Full Identity',
  contactFormEmailLabel: 'Digital Mailbox',
  contactFormSubjectLabel: 'Inquiry Subject',
  contactFormMessageLabel: 'Your Message',
  contactFormButtonText: 'Transmit Inquiry',
  
  // New Contact Editable Fields
  contactInfoTitle: 'Global HQ',
  contactAddressLabel: 'Address',
  contactHoursLabel: 'Operating Hours',
  contactHoursWeekdays: 'Mon - Fri: 09:00 - 18:00 (SAST)',
  contactHoursWeekends: 'Sat: 09:00 - 13:00',

  // Legal
  disclosureTitle: 'Affiliate Disclosure',
  disclosureContent: `### Affiliate Disclosure\n\nTransparency is our foundation. Kasi Couture is a professional curation site. Most product links are affiliate links. If you click and buy, we may receive a commission at no extra cost to you.`,
  privacyTitle: 'Privacy Policy',
  privacyContent: `### Privacy Policy\n\nWe value your data privacy. We only collect information necessary for newsletter signups and direct inquiries.`,
  termsTitle: 'Terms of Service',
  termsContent: `### Terms of Service\n\nKasi Couture is a bridge page. We do not process payments or ship goods directly. All sales are handled by third-party retailers.`,

  // Integrations
  emailJsServiceId: '',
  emailJsTemplateId: '',
  emailJsPublicKey: '',
  googleAnalyticsId: '',
  facebookPixelId: '',
  tiktokPixelId: '',
  amazonAssociateId: '',
  webhookUrl: ''
};

export const INITIAL_CAROUSEL: CarouselSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'Autumn Silk Series',
    subtitle: 'Flowing silhouettes designed for the golden hour in the city.',
    cta: 'View Series'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'The Tailored Man',
    subtitle: 'Bespoke-inspired cuts that redefine urban professional attire.',
    cta: 'Explore Suiting'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'Velvet Nights',
    subtitle: 'Evening wear that captures the essence of luxury after dark.',
    cta: 'Shop Evening'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Apparel', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800', description: 'Luxury ready-to-wear.' },
  { id: 'cat2', name: 'Accessories', icon: 'Watch', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800', description: 'The finishing touch.' },
  { id: 'cat3', name: 'Footwear', icon: 'Footprints', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', description: 'Walk in confidence.' },
  { id: 'cat4', name: 'Home Living', icon: 'Home', image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=800', description: 'Couture for your space.' }
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [
  { id: 'sub1', categoryId: 'cat1', name: 'Silk Dresses' },
  { id: 'sub2', categoryId: 'cat1', name: 'Tailored Blazers' },
  { id: 'sub3', categoryId: 'cat2', name: 'Leather Bags' },
  { id: 'sub4', categoryId: 'cat3', name: 'Stilettos' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Midnight Silk Wrap',
    sku: 'KC-APP-001',
    price: 3450,
    affiliateLink: 'https://example.com/midnight-silk',
    categoryId: 'cat1',
    subCategoryId: 'sub1',
    description: 'A luxurious 100% silk wrap dress that transitions perfectly from brunch to ballroom.',
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1539109136881-3be06109477e?auto=format&fit=crop&q=80&w=800', name: 'Silk Dress', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now()
  }
];

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  codeLabel?: string;
  subSteps?: string[];
  tips?: string;
  illustrationId?: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'prep_env',
    title: '1. Machine Calibration & Engine Selection',
    description: 'Your local development environment is the control center for your digital brand. Modern web applications require a high-performance runtime to handle complex state and media rendering.',
    subSteps: [
      'Engine: Install Node.js (LTS Version 18.0+) from nodejs.org to execute the JavaScript engine.',
      'Control: Install Git for distributed version tracking and cloud synchronization.',
      'Editor: Use VS Code with Prettier for consistent luxury code formatting.',
      'Package Manager: Ensure NPM or PNPM is active for dependency resolution.'
    ],
    tips: 'Industry Insight: Using NVM (Node Version Manager) prevents project-wide conflicts by allowing you to switch between Node environments instantly.',
    illustrationId: 'forge'
  },
  {
    id: 'git_init',
    title: '2. Local Repository & Asset Encryption',
    description: 'Version control is your business continuity insurance. It ensures that every aesthetic tweak and catalog update is documented, reversible, and secure.',
    code: `# Execute within your project root folder:
git init
git add .
git commit -m "Infrastructure Build: Initial Curation Protocol Deployed"
git branch -M main`,
    codeLabel: 'Version Control Initialization',
    subSteps: [
      'git init: Bootstraps the local Git database within your directory.',
      'git add .: Stages every project file, from logos to logic, for tracking.',
      'git commit: Permanently stamps the current state of your build.',
      'git branch -M: Aligns your primary output with global industry standards.'
    ],
    illustrationId: 'vault'
  },
  {
    id: 'github_sync',
    title: '3. GitHub Cloud: Global Synchronization',
    description: 'Linking your local build to GitHub creates a "Single Source of Truth." This enables seamless CI/CD (Continuous Integration/Continuous Deployment) for your affiliate portal.',
    code: `# Establish a secure handshake with the remote cloud:
git remote add origin https://github.com/[USERNAME]/[REPO_NAME].git
git push -u origin main`,
    codeLabel: 'Remote Cloud Handshake',
    tips: 'Privacy Alert: Always set your repository to PRIVATE on GitHub to protect your proprietary affiliate link logic and admin credentials.',
    illustrationId: 'satellite'
  },
  {
    id: 'supabase_infra',
    title: '4. Supabase PostgreSQL Core Setup',
    description: 'Luxury brands require reliable data. Supabase provides an enterprise-grade PostgreSQL database to store your curated items and manage administrative access.',
    subSteps: [
      'Auth: Sign up at supabase.com and initialize a new "Organization."',
      'Project: Create a project and select a region closest to your audience (e.g., SA-East-1).',
      'API Keys: Secure your "Project URL" and "anon_public" key for front-end access.',
      'Security: Copy the "service_role" key—NEVER expose this on the public web.'
    ],
    illustrationId: 'database'
  },
  {
    id: 'supabase_sql',
    title: '5. Storage Geometry & RLS Enforcement',
    description: 'Row-Level Security (RLS) acts as your digital vault. It ensures that only authorized curators can upload or modify high-resolution product media.',
    code: `-- SQL Master Script for Supabase SQL Editor:

-- 1. INITIALIZE STORAGE BUCKET
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

-- 2. GLOBAL READ PROTOCOL
create policy "Global Visibility" 
on storage.objects for select 
using ( bucket_id = 'media' );

-- 3. ADMIN WRITE PROTOCOL
create policy "Authorized Curator Upload" 
on storage.objects for insert 
with check ( 
  bucket_id = 'media' 
  and auth.role() = 'authenticated' 
);

-- 4. ADMIN DELETE PROTOCOL
create policy "Authorized Curator Cleanup" 
on storage.objects for delete 
using ( 
  bucket_id = 'media' 
  and auth.role() = 'authenticated' 
);`,
    codeLabel: 'Security Logic Injection',
    tips: 'Logic Check: This script allows the public to view your catalog while restricting modification strictly to authenticated team members.',
    illustrationId: 'shield'
  },
  {
    id: 'google_auth',
    title: '6. Identity Verification & OAuth 2.0',
    description: 'Professional admin portals use federated identity providers. Integrating Google OAuth ensures your team can log in with a single, secure tap.',
    subSteps: [
      'GCP Console: Visit console.cloud.google.com and create an "OAuth Client ID."',
      'Authorized Domain: Whitelist your Supabase project URL as an approved origin.',
      'Handshake: Paste your Client ID and Secret into the Supabase Auth Settings.',
      'Redirect: Add the Supabase callback URL to your Google Credentials list.'
    ],
    illustrationId: 'identity'
  },
  {
    id: 'emailjs_config',
    title: '7. EmailJS: Secure Contact Routing',
    description: 'Effective bridge pages convert inquiries into relationships. EmailJS routes visitor messages directly to your business inbox without requiring a complex backend.',
    subSteps: [
      'Service: Link your G-Suite or Outlook business account at emailjs.com.',
      'Template: Design an elegant auto-responder using {{name}} and {{subject}} variables.',
      'Key Sync: Inject your Public Key and Template ID into the "Canvas -> Integrations" panel.',
      'Testing: Send a test message from your live site to verify delivery.'
    ],
    illustrationId: 'mail'
  },
  {
    id: 'vite_optimize',
    title: '8. Build Engine: Vite Optimization',
    description: 'Your site performance directly impacts conversion. Vite pre-bundles your code to ensure lightning-fast interaction times and smooth image lazy-loading.',
    subSteps: [
      'Asset Mapping: Verify all local images are in the "public/" folder.',
      'Config: Ensure "base" path in vite.config.ts is set correctly for your domain.',
      'Dry Run: Execute "npm run build" locally to verify the production bundle.',
      'Cleanup: Remove any console.logs or dev-only placeholders before deployment.'
    ],
    tips: 'SEO Tip: Use descriptive file names for your images (e.g., silk-dress-black.jpg) to improve Google Image Search ranking.',
    illustrationId: 'forge'
  },
  {
    id: 'vercel_deployment',
    title: '9. Vercel Edge Network Deployment',
    description: 'Deployment to the Edge ensures your luxury content is served from the server closest to your user, minimizing latency and maximizing perceived quality.',
    subSteps: [
      'Git Link: Import your GitHub repository directly through the Vercel dashboard.',
      'Environment Variables: Inject VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      'Production Pipeline: Vercel will auto-detect Vite and initiate the build.',
      'Launch: Your site is now live on a global CDN (Content Delivery Network).'
    ],
    illustrationId: 'beacon'
  },
  {
    id: 'domain_setup',
    title: '10. Brand Authority: Custom Domain & SSL',
    description: 'A custom domain is the final stamp of brand legitimacy. Secure, encrypted connections (SSL) are mandatory for modern web browsers and user trust.',
    subSteps: [
      'Domain: Connect your professional TLD (e.g., .com, .luxury) in Vercel settings.',
      'DNS Propagation: Update your A and CNAME records at your registrar.',
      'SSL Handshake: Vercel automatically generates a Let\'s Encrypt certificate.',
      'Verification: Ensure your site displays the padlock icon in the browser address bar.'
    ],
    illustrationId: 'globe'
  },
  {
    id: 'tracking_pixel',
    title: '11. Affiliate Analytics & Conversions',
    description: 'Data-driven curation is the secret to scaling. Monitor which collections drive the highest engagement and refine your content strategy accordingly.',
    subSteps: [
      'Product Stats: Check the "Insights" tab in your Portal to view real-time clicks.',
      'A/B Testing: Use different hero images to see which driving the highest CTR.',
      'Affiliate Tags: Ensure every "Acquire" link includes your unique tracking ID.',
      'Audit: Weekly cleanup of broken links or out-of-stock items.'
    ],
    illustrationId: 'growth'
  },
  {
    id: 'ops_maintenance',
    title: '12. Mission Control: Continuous Growth',
    description: 'Your bridge page is a living asset. Regular updates and maintenance ensure it remains at the forefront of the luxury digital landscape.',
    subSteps: [
      'Backup: Periodically use "Data Snapshot" to export your catalog to JSON.',
      'Content: Refresh the Hero Carousel monthly with seasonal collections.',
      'Team: If scaling, add "Standard Administrators" to help with data entry.',
      'Innovation: Stay updated on the latest CSS/React features to keep the UX modern.'
    ],
    tips: 'Final Objective: Consistency breeds trust. A well-maintained bridge page becomes an authority in its niche.',
    illustrationId: 'satellite'
  }
];
