
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

  // Email.js defaults (empty)
  emailJsServiceId: '',
  emailJsTemplateId: '',
  emailJsPublicKey: ''
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
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'prep_env',
    title: '1. Machine Calibration',
    description: 'Ensure your development environment is primed for high-performance React deployment.',
    subSteps: [
      'Install Node.js (v18.0+) - The engine for our frontend.',
      'Install Git - Your version control and cloud gateway.',
      'Install VS Code - The architect\'s choice for code editing.'
    ],
    tips: 'This project utilizes Vite for near-instant compilation speeds.'
  },
  {
    id: 'git_init',
    title: '2. Local Repository Initialization',
    description: 'Transform this folder into a tracked digital asset. Git will monitor every stylistic evolution.',
    code: `# Run these commands inside the project root:
git init
git add .
git commit -m "Launch: Kasi Couture Affiliate Infrastructure"
git branch -M main`,
    codeLabel: 'Terminal Commands',
    subSteps: [
      'Initialize: Creates a hidden .git directory.',
      'Stage & Commit: Captures the current state of your code.',
      'Main Branch: Sets the industry-standard primary branch name.'
    ]
  },
  {
    id: 'github_sync',
    title: '3. GitHub Cloud Linkage',
    description: 'Establish a secure cloud repository on GitHub to act as your production source.',
    code: `# Create a PRIVATE repo on GitHub.com, then link it:
git remote add origin https://github.com/[USERNAME]/[REPO_NAME].git
git push -u origin main`,
    codeLabel: 'Cloud Deployment Commands',
    tips: 'Ensure you replace [USERNAME] and [REPO_NAME] with your actual GitHub credentials.'
  },
  {
    id: 'supabase_infra',
    title: '4. Supabase Architecture (Backend)',
    description: 'Supabase provides the enterprise-grade Authentication and Media Storage for your curation.',
    subSteps: [
      'Create a Project at supabase.com.',
      'Note your PROJECT_URL and ANON_KEY (Settings -> API).',
      'This infrastructure handles your high-resolution media and admin access keys.'
    ]
  },
  {
    id: 'supabase_sql',
    title: '5. SQL & Media Security Master',
    description: 'Run this precise SQL script in the Supabase Dashboard -> SQL Editor to enable public image hosting and RLS security.',
    code: `-- 1. INITIALIZE STORAGE BUCKET
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

-- 2. PUBLIC READ ACCESS (Allows visitors to view product images)
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'media' );

-- 3. SECURE ADMIN UPLOAD (Only authenticated admins can add media)
create policy "Admin Upload" 
on storage.objects for insert 
with check ( 
  bucket_id = 'media' 
  and auth.role() = 'authenticated' 
);

-- 4. SECURE ADMIN DELETION
create policy "Admin Delete" 
on storage.objects for delete 
using ( 
  bucket_id = 'media' 
  and auth.role() = 'authenticated' 
);`,
    codeLabel: 'Supabase SQL Implementation',
    tips: 'This ensures your assets are visible to the world while your control panel remains impregnable.'
  },
  {
    id: 'google_auth',
    title: '6. Google OAuth Setup (Auth Provider)',
    description: 'Enable seamless one-tap login for your admin portal using Google Identity.',
    subSteps: [
      'Go to console.cloud.google.com and create a new project.',
      'Configure the "OAuth consent screen" (External).',
      'Create "OAuth 2.0 Client IDs" (Web application).',
      'Add Redirect URI: https://[YOUR_SUPABASE_ID].supabase.co/auth/v1/callback',
      'In Supabase -> Authentication -> Providers -> Google: Paste Client ID and Secret.'
    ],
    tips: 'Redirect URIs are specific to your Supabase project instance.'
  },
  {
    id: 'emailjs_config',
    title: '7. EmailJS Concierge Setup',
    description: 'Connect your contact form to a professional mailing service without a backend server.',
    subSteps: [
      'Sign up at emailjs.com.',
      'Add an Email Service (e.g., Gmail, Outlook).',
      'Create an Email Template for incoming enquiries.',
      'Copy Public Key, Service ID, and Template ID to Portal -> Settings -> Integrations.'
    ]
  },
  {
    id: 'vercel_deployment',
    title: '8. Vercel Production Launch',
    description: 'Deploy your affiliate bridge to a global CDN for maximum speed and uptime.',
    subSteps: [
      'Import your GitHub repository into Vercel.',
      'Environment Variables (CRITICAL): Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      'Click Deploy. Vercel will build and host your site on a .vercel.app domain.'
    ],
    tips: 'Vercel automatically triggers a new deployment every time you push code to GitHub.'
  },
  {
    id: 'final_verification',
    title: '9. Operational Success',
    description: 'Finalize your portal and begin curating luxury affiliate picks.',
    subSteps: [
      'Visit your live URL.',
      'Navigate to /login and use Google or your Supabase email to sign in.',
      'Navigate to Portal -> System and perform a test Backup to verify database integrity.'
    ],
    tips: 'Your bridge page is now fully operational and ready for traffic.'
  }
];
