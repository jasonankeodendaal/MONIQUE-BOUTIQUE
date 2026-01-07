
export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  description?: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface MediaFile {
  id: string;
  url: string;
  name: string;
  type: string; // mime type
  size: number;
}

export interface DiscountRule {
  id: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  affiliateLink: string;
  categoryId: string;
  subCategoryId: string;
  description: string;
  media: MediaFile[]; 
  discountRules?: DiscountRule[];
  createdAt: number;
}

export interface CarouselSlide {
  id: string;
  image: string; // url (video or image)
  type: 'image' | 'video';
  title: string;
  subtitle: string;
  cta: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  subject: string;
  message: string;
  createdAt: number;
  status: 'unread' | 'read' | 'archived';
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  iconUrl: string;
}

export interface SiteSettings {
  // Brand & Nav
  companyName: string;
  slogan: string; // Added Slogan
  companyLogo: string; // Text fallback
  companyLogoUrl?: string; // PNG Upload
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  navHomeLabel: string;
  navProductsLabel: string;
  navAboutLabel: string;
  navContactLabel: string;
  navDashboardLabel: string;

  // Contact Info
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  socialLinks: SocialLink[];

  // Footer
  footerDescription: string;
  footerCopyrightText: string;

  // Home Page Content
  homeHeroBadge: string;
  homeAboutTitle: string;
  homeAboutDescription: string;
  homeAboutImage: string;
  homeAboutCta: string;
  homeCategorySectionTitle: string;
  homeCategorySectionSubtitle: string;
  homeTrustSectionTitle: string;
  
  homeTrustItem1Title: string;
  homeTrustItem1Desc: string;
  homeTrustItem1Icon: string; 

  homeTrustItem2Title: string;
  homeTrustItem2Desc: string;
  homeTrustItem2Icon: string; 

  homeTrustItem3Title: string;
  homeTrustItem3Desc: string;
  homeTrustItem3Icon: string; 

  // Products Page Content
  productsHeroTitle: string;
  productsHeroSubtitle: string;
  productsHeroImage: string; // Legacy support
  productsHeroImages: string[]; // New: Array of images for carousel
  productsSearchPlaceholder: string;

  // About Page Content
  aboutHeroTitle: string;
  aboutHeroSubtitle: string;
  aboutMainImage: string;
  
  // New Granular About Fields
  aboutEstablishedYear: string;
  aboutFounderName: string;
  aboutLocation: string;

  aboutHistoryTitle: string;
  aboutHistoryBody: string;
  
  aboutMissionTitle: string;
  aboutMissionBody: string;
  aboutMissionIcon: string; 
  
  aboutCommunityTitle: string;
  aboutCommunityBody: string;
  aboutCommunityIcon: string; 
  
  aboutIntegrityTitle: string;
  aboutIntegrityBody: string;
  aboutIntegrityIcon: string; 

  aboutSignatureImage: string; 
  aboutGalleryImages: string[]; 

  // Contact Page Content
  contactHeroTitle: string;
  contactHeroSubtitle: string;
  contactFormNameLabel: string;
  contactFormEmailLabel: string;
  contactFormSubjectLabel: string;
  contactFormMessageLabel: string;
  contactFormButtonText: string;
  
  // New Contact Editable Fields
  contactInfoTitle: string;
  contactAddressLabel: string;
  contactHoursLabel: string;
  contactHoursWeekdays: string;
  contactHoursWeekends: string;

  // Legal Content
  disclosureTitle: string;
  disclosureContent: string;
  privacyTitle: string;
  privacyContent: string;
  termsTitle: string;
  termsContent: string;

  // Integrations
  emailJsServiceId?: string;
  emailJsTemplateId?: string;
  emailJsPublicKey?: string;
}

export interface PermissionNode {
  id: string;
  label: string;
  description?: string;
  children?: PermissionNode[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin';
  permissions: string[]; // Array of Permission IDs (flattened)
  password?: string; // Permanent password (stored locally for demo/local mode)
  createdAt: number;
  lastActive?: number;
  profileImage?: string;
  phone?: string;
  address?: string;
}
