import React from 'react';

export interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
}

// Common props for the elegant fine-line style
const ICON_OPTS = {
  strokeWidth: 1, // Thinner, more elegant lines
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const CustomIcons: Record<string, React.FC<CustomIconProps>> = {
  // --- APPAREL ---
  Dress: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Elegant Evening Gown with sweetheart neckline and flowing skirt */}
      <path d="M12 2C9.5 2 8 3.5 8 5c0 1.2.8 2.5 1.5 3.5C8 10 6 12 5 22h14c-1-10-3-12-4.5-13.5.7-1 1.5-2.3 1.5-3.5 0-1.5-1.5-3-4-3z" />
      <path d="M9.5 5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5" />
      <path d="M12 8.5v13.5" strokeOpacity="0.5" />
      <path d="M8 22c1-4 2-8 2-10" strokeOpacity="0.5" />
      <path d="M16 22c-1-4-2-8-2-10" strokeOpacity="0.5" />
    </svg>
  ),
  Gown: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Mermaid Silhouette */}
      <path d="M12 2c-2.5 0-3.5 1.5-3.5 3 0 1.5 1 3.5 2 5 .5 3-1 6-3 12h13c-2-6-3.5-9-3-12 1-1.5 2-3.5 2-5 0-1.5-1-3-3.5-3z" />
      <path d="M8.5 5h7" strokeOpacity="0.5" />
      <path d="M10 22c1-3 1.5-6 2-10 .5 4 1 7 2 10" strokeOpacity="0.5" />
    </svg>
  ),
  Coat: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Trench Coat Structure */}
      <path d="M12 2L8 4l-1 5 2 15h6l2-15-1-5-4-2z" />
      <path d="M12 2v20" />
      <path d="M8 9h8" />
      <path d="M5 22h14" />
      <path d="M7 9l-2 5" />
      <path d="M17 9l2 5" />
      <path d="M9 4l3 2 3-2" />
    </svg>
  ),
  Blazer: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Sharp Tailored Blazer */}
      <path d="M12 2l-4 2-3 4v12h14V8l-3-4-4-2z" />
      <path d="M12 2v18" />
      <path d="M12 10l-3-4" />
      <path d="M12 10l3-4" />
      <path d="M9 14h6" />
      <path d="M5 8l1 10" />
      <path d="M19 8l-1 10" />
    </svg>
  ),
  Shirt: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Collared Shirt */}
      <path d="M12 2L8 4l-4 3 2 12h12l2-12-4-3-4-2z" />
      <path d="M12 2v19" />
      <path d="M12 5l-2 2" />
      <path d="M12 5l2 2" />
      <path d="M9 12h6" strokeOpacity="0.5" />
      <path d="M4 7l3 10" strokeOpacity="0.3" />
      <path d="M20 7l-3 10" strokeOpacity="0.3" />
    </svg>
  ),
  Trousers: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Tailored Pants */}
      <path d="M12 2H8L6 8l1 14h3l2-14 2 14h3l1-14-2-6h-4z" />
      <path d="M12 2v6" />
      <path d="M12 8l-1 14" strokeOpacity="0.5" />
      <path d="M12 8l1 14" strokeOpacity="0.5" />
    </svg>
  ),
  Bikini: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M8 2l-2 3c-1 2 0 4 2 4h8c2 0 3-2 2-4l-2-3" />
      <path d="M12 2v3" />
      <path d="M6 14l3 3h6l3-3-2 6H8l-2-6z" />
    </svg>
  ),
  Lingerie: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M8 2v4c-2 0-3 2-3 4s1 4 4 4 3-2 3-4" />
      <path d="M16 2v4c2 0 3 2 3 4s-1 4-4 4-3-2-3-4" />
      <path d="M12 14v6" />
      <path d="M9 22h6" />
    </svg>
  ),

  // --- FOOTWEAR ---
  Heel: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Classic Pump */}
      <path d="M14 6c2 0 4 2 5 6v7h-3l-2-3-7 1-3-2c-1-3 2-9 10-9z" />
      <path d="M19 19v-7" />
      <path d="M5 15l2 4h12" />
    </svg>
  ),
  Stiletto: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* High Fashion Stiletto */}
      <path d="M5 12c0-3 2-7 8-7 3 0 5 2 5 4v9" />
      <path d="M5 12l4 4 9-2" />
      <path d="M18 18v4h-2" />
      <path d="M5 12l2 10h2" />
    </svg>
  ),
  Boot: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Knee High Boot */}
      <path d="M8 2h8v12c0 3-2 5-6 5h-4l-2-3 1-3c1-2 3-2 3-11z" />
      <path d="M8 19v3h8" />
      <path d="M10 14h4" strokeOpacity="0.5" />
    </svg>
  ),
  Sneaker: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M4 16c-2-1-2-4 0-5l5-4 9 2v4c0 4-3 5-5 5H6c-2 0-2-2-2-2z" />
      <path d="M4 16h14" />
      <path d="M10 11l2 2" />
      <path d="M13 10l2 2" />
    </svg>
  ),
  Footprints: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 2.25-6 5-6s5 3.28 5 6c.03 2.5-1 3.5-1 5.62V16h-1v-2h-1v2h-1v-2h-1v2H4z" />
      <path d="M14 20v-2.38c0-2.12-1.03-3.12-1-5.62.03-2.72 2.25-6 5-6s5 3.28 5 6c.03 2.5-1 3.5-1 5.62V20h-1v-2h-1v2h-1v-2h-1v2h-4z" />
    </svg>
  ),

  // --- ACCESSORIES ---
  Handbag: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Structured Birkin Style */}
      <path d="M8 8V5a4 4 0 0 1 8 0v3" />
      <path d="M4 8h16l2 13H2L4 8z" />
      <path d="M12 12v2" />
      <path d="M10 8v6" strokeOpacity="0.5" />
      <path d="M14 8v6" strokeOpacity="0.5" />
      <path d="M8 8h8" />
    </svg>
  ),
  ToteBag: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M7 8V4a3 3 0 0 1 6 0v4" />
      <path d="M5 8h14l-1 14H6L5 8z" />
      <path d="M5 12h14" strokeOpacity="0.3" />
    </svg>
  ),
  Clutch: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Envelope Clutch */}
      <rect x="3" y="8" width="18" height="11" rx="1" />
      <path d="M3 8l9 6 9-6" />
      <path d="M12 14v2" />
    </svg>
  ),
  Watch: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 5V2" />
      <path d="M12 19v3" />
      <path d="M12 12l3-2" />
      <path d="M12 12l-2 1" />
      <path d="M9 2h6" />
      <path d="M9 22h6" />
    </svg>
  ),
  Glasses: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      {/* Cat Eye Shapes */}
      <path d="M3 12c0-3 3-4 6-4s5 2 5 4-2 4-5 4-6-1-6-4z" />
      <path d="M15 12c0-3 3-4 6-4s5 2 5 4-2 4-5 4-6-1-6-4z" />
      <path d="M9 12h6" />
    </svg>
  ),
  Hat: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M2 14h20c-1 4-6 6-10 6S3 18 2 14z" />
      <path d="M6 14C6 8 8 4 12 4s6 4 6 10" />
      <path d="M6 14h12" />
    </svg>
  ),
  Diamond: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M2 9l10 13 10-13-6-6H8L2 9z" />
      <path d="M12 22V9" />
      <path d="M2 9h20" />
      <path d="M8 3l4 6 4-6" />
    </svg>
  ),
  Perfume: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <rect x="6" y="10" width="12" height="12" rx="2" />
      <path d="M12 10V6" />
      <path d="M8 6h8" />
      <path d="M10 6c0-2 1-3 2-3s2 1 2 3" />
      <path d="M9 14h6" strokeOpacity="0.5" />
    </svg>
  ),
  Lipstick: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M8 14h8v8H8z" />
      <path d="M9 14V6l3-3 3 3v8" />
      <path d="M8 18h8" />
    </svg>
  ),

  // --- TOOLS & CRAFT ---
  Needle: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M19 3L3 21" />
      <path d="M17 3l4 4" />
      <circle cx="18" cy="6" r="1" />
    </svg>
  ),
  SewingMachine: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M2 20h20" />
      <path d="M6 20V8c0-3 3-4 7-4h6v8h-6" />
      <path d="M13 8v8" />
      <circle cx="16" cy="15" r="2" />
      <path d="M13 16h-2" />
    </svg>
  ),
  Mannequin: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M12 2v2" />
      <path d="M8 5c-2 2-2 6 0 9 1 2 2 3 4 3s3-1 4-3c2-3 2-7 0-9" />
      <path d="M12 17v5" />
      <path d="M9 22h6" />
      <path d="M8 9h8" strokeOpacity="0.3" />
    </svg>
  ),
  Scissors: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M8 8l11 11" />
      <path d="M8 16l11-11" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  MeasuringTape: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M4 12c0-5 5-9 10-8 4 1 6 5 5 9s-5 7-9 5C6 17 4 15 4 12z" />
      <path d="M14 4v2" />
      <path d="M18 6l-1 2" />
      <path d="M20 10h-2" />
      <path d="M9 12l2 2" />
    </svg>
  ),
  Hanger: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M12 2c-1.5 0-2 1.5-1 2.5L3 10h18l-8-5.5" />
      <path d="M3 10v2" />
      <path d="M21 10v2" />
    </svg>
  ),

  // --- MATERIALS ---
  Fabric: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M4 4c0 4 4 6 8 6s8-2 8-6" />
      <path d="M4 4v16c0 2 2 2 4 0s4-2 8 0 4 2 4 0V4" />
      <path d="M12 10v14" strokeOpacity="0.3" />
    </svg>
  ),
  Leather: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 8h16" />
      <path d="M8 4v16" strokeOpacity="0.3" />
      <path d="M16 4v16" strokeOpacity="0.3" />
    </svg>
  ),
  Silk: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M2 12c4 0 6-4 10-4s6 4 10 4" />
      <path d="M2 16c4 0 6-4 10-4s6 4 10 4" />
      <path d="M2 8c4 0 6-4 10-4s6 4 10 4" />
    </svg>
  ),
  Wool: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <circle cx="7" cy="12" r="4" />
      <circle cx="17" cy="12" r="4" />
      <circle cx="12" cy="8" r="4" />
      <circle cx="12" cy="16" r="4" />
    </svg>
  ),

  // --- RETAIL & UI ---
  Tag: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M12 2H2v10l10 10 10-10L12 2z" />
      <circle cx="7" cy="7" r="1" />
    </svg>
  ),
  Sale: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  ),
  Vip: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M2 6l10 14 10-14-6 2-4-6-4 6z" />
    </svg>
  ),
  Shipping: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M2 8h14v11H2z" />
      <path d="M16 8h4l2 3v8h-6" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
    </svg>
  ),
  Store: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M2 10l2-6h16l2 6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
      <path d="M12 14v4" />
      <path d="M16 14v4" />
      <path d="M8 14v4" />
    </svg>
  ),
  Mirror: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M12 4c-4 0-6 4-6 10s2 8 6 8 6-2 6-8-2-10-6-10z" />
      <path d="M10 22v-2" />
      <path d="M14 22v-2" />
      <path d="M14 8c-1-1-3-1-4 0" strokeOpacity="0.5" />
    </svg>
  ),
  Package: ({ size = 24, ...props }) => (
     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
     </svg>
  ),
  Home: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  ShieldCheck: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Sparkles: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M9 5H5" />
      <path d="M19 19v4" />
      <path d="M23 21h-4" />
    </svg>
  ),
  Globe: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  ),
  Target: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Users: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Award: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  Star: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...ICON_OPTS} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
};