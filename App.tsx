
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Legal from './pages/Legal';
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry, ProductStats, AdminUser, SettingsContextType } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ENQUIRIES, INITIAL_ADMINS } from './constants';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { User } from '@supabase/supabase-js';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loadingAuth, isLocalMode } = useSettings();
  
  if (loadingAuth) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  // In local mode, allow access (simulating admin)
  if (isLocalMode) return <>{children}</>;
  
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Footer: React.FC = () => {
  const { settings, user } = useSettings();
  const location = useLocation();
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') return null;

  return (
    <footer className="bg-slate-900 text-slate-400 py-8 md:py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12 text-left">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
               {settings.companyLogoUrl ? (
                <img src={settings.companyLogoUrl} alt={settings.companyName} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
              ) : (
                <div className="w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center text-white font-bold text-xs md:text-base" style={{ backgroundColor: 'var(--primary-color)' }}>
                  {settings.companyLogo}
                </div>
              )}
              <span className="text-white text-base md:text-xl font-bold tracking-tighter">{settings.companyName}</span>
            </div>
            <p className="max-w-xs leading-relaxed text-xs md:text-sm mb-6 md:mb-8 font-light">
              {settings.footerDescription}
            </p>
            <div className="flex gap-3 md:gap-4">
              {(settings.socialLinks || []).map(link => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-primary transition-colors group"
                >
                  {link.iconUrl ? (
                    <img src={link.iconUrl} alt={link.name} className="w-4 h-4 md:w-5 md:h-5 object-contain invert group-hover:invert-0 transition-all" />
                  ) : (
                    <span className="text-white text-[9px] md:text-[10px] font-bold">{link.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6 text-[10px] md:text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm font-light">
              <li><Link to="/" className="hover:text-primary transition-colors">{settings.navHomeLabel}</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">{settings.navProductsLabel}</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">{settings.navAboutLabel}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{settings.navContactLabel}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6 text-[10px] md:text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm font-light">
              <li><Link to="/disclosure" className="hover:text-primary transition-colors">{settings.disclosureTitle}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">{settings.privacyTitle}</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">{settings.termsTitle}</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 md:pt-8 border-t border-slate-800 text-center text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} {settings.companyName}. {settings.footerCopyrightText}</p>
          <Link to={user ? "/admin" : "/login"} className="text-[8px] opacity-30 hover:opacity-100 hover:text-white transition-all">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Data State
  const [loadingData, setLoadingData] = useState(true);
  const [settings, setSettingsState] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<ProductStats[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  // 1. Initial Auth Check
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoadingAuth(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2. Data Fetching (Supabase vs Local)
  const refreshData = async () => {
    setLoadingData(true);
    if (isSupabaseConfigured) {
      try {
        // Fetch all tables in parallel
        const [
          settingsRes, productsRes, catsRes, subCatsRes, slidesRes, enqRes, statsRes, adminsRes
        ] = await Promise.all([
          supabase.from('site_settings').select('*').single(),
          supabase.from('products').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('subcategories').select('*'),
          supabase.from('hero_slides').select('*'),
          supabase.from('enquiries').select('*'),
          supabase.from('product_stats').select('*'),
          supabase.from('admin_users').select('*'),
        ]);

        // If data exists in Supabase, use it. If table is empty/missing, we might get error or empty array.
        // We gracefully handle missing tables by falling back to empty arrays, NOT local storage.
        if (settingsRes.data) setSettingsState(settingsRes.data);
        else setSettingsState(INITIAL_SETTINGS); // Fallback only for settings to prevent crash

        setProducts(productsRes.data || []);
        setCategories(catsRes.data || []);
        setSubCategories(subCatsRes.data || []);
        setHeroSlides(slidesRes.data || []);
        setEnquiries(enqRes.data || []);
        setStats(statsRes.data || []);
        setAdmins(adminsRes.data || []);

      } catch (err) {
        console.error("Supabase Data Load Error:", err);
        // On error (e.g. tables don't exist yet), we shouldn't overwrite with LocalStorage if we are in 'Connected' mode.
        // However, for first run experience without DB setup, we might leave state empty.
      }
    } else {
      // Local Mode: Load from LocalStorage or Constants
      setSettingsState(JSON.parse(localStorage.getItem('site_settings') || JSON.stringify(INITIAL_SETTINGS)));
      setProducts(JSON.parse(localStorage.getItem('admin_products') || JSON.stringify(INITIAL_PRODUCTS)));
      setCategories(JSON.parse(localStorage.getItem('admin_categories') || JSON.stringify(INITIAL_CATEGORIES)));
      setSubCategories(JSON.parse(localStorage.getItem('admin_subcategories') || JSON.stringify(INITIAL_SUBCATEGORIES)));
      setHeroSlides(JSON.parse(localStorage.getItem('admin_hero') || JSON.stringify(INITIAL_CAROUSEL)));
      setEnquiries(JSON.parse(localStorage.getItem('admin_enquiries') || JSON.stringify(INITIAL_ENQUIRIES)));
      setStats(JSON.parse(localStorage.getItem('admin_product_stats') || '[]'));
      setAdmins(JSON.parse(localStorage.getItem('admin_users') || JSON.stringify(INITIAL_ADMINS)));
    }
    setLoadingData(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // 3. Actions (CRUD)
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettingsState(updated);
    
    if (isSupabaseConfigured) {
      // Upsert to Supabase (assuming single row with ID 1 or similar logic)
      // Since we don't have a specific ID in INITIAL_SETTINGS, we might need a dedicated table strategy.
      // For simplicity in this demo, we assume a 'site_settings' table where we update the first row.
      const { error } = await supabase.from('site_settings').upsert({ id: 1, ...updated });
      if (error) console.error("Failed to save settings to DB", error);
    } else {
      localStorage.setItem('site_settings', JSON.stringify(updated));
    }
  };

  const saveProduct = async (product: Product) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('products').upsert(product);
      if (!error) refreshData();
    } else {
      const newProds = products.some(p => p.id === product.id) 
        ? products.map(p => p.id === product.id ? product : p)
        : [product, ...products];
      setProducts(newProds);
      localStorage.setItem('admin_products', JSON.stringify(newProds));
    }
  };

  const deleteProduct = async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) refreshData();
    } else {
      const newProds = products.filter(p => p.id !== id);
      setProducts(newProds);
      localStorage.setItem('admin_products', JSON.stringify(newProds));
    }
  };

  const saveCategory = async (cat: Category) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('categories').upsert(cat);
      if (!error) refreshData();
    } else {
      const newCats = categories.some(c => c.id === cat.id) ? categories.map(c => c.id === cat.id ? cat : c) : [...categories, cat];
      setCategories(newCats);
      localStorage.setItem('admin_categories', JSON.stringify(newCats));
    }
  };

  const deleteCategory = async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) refreshData();
    } else {
      const newCats = categories.filter(c => c.id !== id);
      setCategories(newCats);
      localStorage.setItem('admin_categories', JSON.stringify(newCats));
    }
  };

  const saveHeroSlide = async (slide: CarouselSlide) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('hero_slides').upsert(slide);
      if (!error) refreshData();
    } else {
      const newSlides = heroSlides.some(s => s.id === slide.id) ? heroSlides.map(s => s.id === slide.id ? slide : s) : [...heroSlides, slide];
      setHeroSlides(newSlides);
      localStorage.setItem('admin_hero', JSON.stringify(newSlides));
    }
  };

  const deleteHeroSlide = async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (!error) refreshData();
    } else {
      const newSlides = heroSlides.filter(s => s.id !== id);
      setHeroSlides(newSlides);
      localStorage.setItem('admin_hero', JSON.stringify(newSlides));
    }
  };

  const saveEnquiry = async (enquiry: Enquiry) => {
    // This is public facing, so we append
    if (isSupabaseConfigured) {
      await supabase.from('enquiries').insert(enquiry);
      // Note: We don't necessarily refreshData() here to avoid lag on public client, 
      // but Admin would see it on next refresh/poll.
    } else {
      const newEnqs = [enquiry, ...enquiries];
      setEnquiries(newEnqs);
      localStorage.setItem('admin_enquiries', JSON.stringify(newEnqs));
    }
  };

  const updateEnquiryStatus = async (id: string, status: 'read' | 'unread' | 'archived') => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
      if (!error) refreshData();
    } else {
      const newEnqs = enquiries.map(e => e.id === id ? { ...e, status } : e);
      setEnquiries(newEnqs);
      localStorage.setItem('admin_enquiries', JSON.stringify(newEnqs));
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (!error) refreshData();
    } else {
      const newEnqs = enquiries.filter(e => e.id !== id);
      setEnquiries(newEnqs);
      localStorage.setItem('admin_enquiries', JSON.stringify(newEnqs));
    }
  };

  const incrementStat = async (productId: string, type: 'view' | 'click') => {
    if (isSupabaseConfigured) {
      // Optimistic update locally
      setStats(prev => {
        const idx = prev.findIndex(s => s.productId === productId);
        if (idx > -1) {
          const newStats = [...prev];
          if (type === 'view') newStats[idx].views++;
          if (type === 'click') newStats[idx].clicks++;
          return newStats;
        }
        return prev; // Wait for refresh if new
      });

      // DB Update
      const existing = stats.find(s => s.productId === productId);
      if (existing) {
        const update = type === 'view' ? { views: existing.views + 1 } : { clicks: existing.clicks + 1 };
        await supabase.from('product_stats').update(update).eq('productId', productId);
      } else {
        await supabase.from('product_stats').insert({ 
          productId, 
          views: type === 'view' ? 1 : 0, 
          clicks: type === 'click' ? 1 : 0, 
          totalViewTime: 0,
          lastUpdated: Date.now() 
        });
      }
    } else {
      const newStats = [...stats];
      const index = newStats.findIndex(s => s.productId === productId);
      if (index > -1) {
        if (type === 'view') newStats[index].views++;
        else newStats[index].clicks++;
        newStats[index].lastUpdated = Date.now();
      } else {
        newStats.push({ productId, views: type === 'view' ? 1 : 0, clicks: type === 'click' ? 1 : 0, totalViewTime: 0, lastUpdated: Date.now() });
      }
      setStats(newStats);
      localStorage.setItem('admin_product_stats', JSON.stringify(newStats));
    }
  };

  // Styles for dynamic colors
  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '79, 70, 229';
    };

    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(settings.primaryColor));
    
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor || '#1E293B');
    document.documentElement.style.setProperty('--secondary-rgb', hexToRgb(settings.secondaryColor || '#1E293B'));
    
    document.documentElement.style.setProperty('--accent-color', settings.accentColor || '#F59E0B');
    document.documentElement.style.setProperty('--accent-rgb', hexToRgb(settings.accentColor || '#F59E0B'));
  }, [settings.primaryColor, settings.secondaryColor, settings.accentColor]);

  return (
    <SettingsContext.Provider value={{ 
      settings, updateSettings, user, loadingAuth, isLocalMode: !isSupabaseConfigured,
      products, categories, subCategories, heroSlides, enquiries, stats, admins,
      saveProduct, deleteProduct, saveCategory, deleteCategory, saveHeroSlide, deleteHeroSlide,
      saveEnquiry, updateEnquiryStatus, deleteEnquiry, incrementStat, refreshData, loadingData
    }}>
      <Router>
        <ScrollToTop />
        <style>{`
          .text-primary { color: var(--primary-color); }
          .bg-primary { background-color: var(--primary-color); }
          .border-primary { border-color: var(--primary-color); }
          .hover\\:text-primary:hover { color: var(--primary-color); }
          .hover\\:bg-primary:hover { background-color: var(--primary-color); }
          .ring-primary { --tw-ring-color: var(--primary-color); }
          .shadow-primary { --tw-shadow-color: rgba(var(--primary-rgb), 0.2); }

          .text-secondary { color: var(--secondary-color); }
          .bg-secondary { background-color: var(--secondary-color); }
          .border-secondary { border-color: var(--secondary-color); }
          .hover\\:text-secondary:hover { color: var(--secondary-color); }

          .text-accent { color: var(--accent-color); }
          .bg-accent { background-color: var(--accent-color); }
          .border-accent { border-color: var(--accent-color); }
          .hover\\:text-accent:hover { color: var(--accent-color); }
        `}</style>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/disclosure" element={<Legal />} />
              <Route path="/privacy" element={<Legal />} />
              <Route path="/terms" element={<Legal />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </SettingsContext.Provider>
  );
};

export default App;
