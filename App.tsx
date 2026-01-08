
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry, ProductStats } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL } from './constants';
import { supabase, isSupabaseConfigured, db } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Cloud, Check, Loader2, AlertTriangle } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  heroSlides: CarouselSlide[];
  enquiries: Enquiry[];
  stats: ProductStats[];
  refreshData: () => Promise<void>;
  user: User | null;
  loadingAuth: boolean;
  isLocalMode: boolean;
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  logEvent: (type: 'view' | 'click' | 'system', label: string) => void;
}

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
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-primary transition-colors group">
                  {link.iconUrl ? <img src={link.iconUrl} alt={link.name} className="w-4 h-4 md:w-5 md:h-5 object-contain invert group-hover:invert-0 transition-all" /> : <span className="text-white text-[9px] md:text-[10px] font-bold">{link.name.slice(0, 2).toUpperCase()}</span>}
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
          <Link to={user ? "/admin" : "/login"} className="text-[8px] opacity-30 hover:opacity-100 hover:text-white transition-all">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const SaveStatusIndicator = ({ status }: { status: SaveStatus }) => {
  if (status === 'idle') return null;
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 ${status === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white border border-slate-800'} animate-in slide-in-from-bottom-4`}>
      {status === 'saving' && <Loader2 size={16} className="animate-spin text-primary" />}
      {status === 'saved' && <Check size={16} className="text-green-500" />}
      {status === 'error' && <AlertTriangle size={16} className="text-white" />}
      <span className="text-[10px] font-black uppercase tracking-widest">{status === 'saving' ? 'Syncing...' : status === 'saved' ? 'Saved' : 'Save Failed'}</span>
    </div>
  );
};

const TrafficTracker = ({ logEvent }: { logEvent: (t: any, l: string) => void }) => {
  const location = useLocation();
  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      logEvent('view', location.pathname === '/' ? 'Home Page' : location.pathname);
    }
    const trackGeo = async () => {
      if (location.pathname.startsWith('/admin')) return;
      if (sessionStorage.getItem('geo_tracked')) return;
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) return;
        const data = await res.json();
        if (data.error) return;
        const geoEntry = { city: data.city, region: data.region, country: data.country_name, code: data.country_code, timestamp: Date.now() };
        const history = JSON.parse(localStorage.getItem('site_visitor_locations') || '[]');
        localStorage.setItem('site_visitor_locations', JSON.stringify([geoEntry, ...history].slice(0, 500)));
        sessionStorage.setItem('geo_tracked', 'true');
      } catch (e) { console.warn('Geo tracking skipped (Adblocker likely active)'); }
    };
    trackGeo();
  }, [location.pathname, logEvent]);
  return null;
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(INITIAL_SUBCATEGORIES);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(INITIAL_CAROUSEL);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<ProductStats[]>([]);
  
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const refreshData = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const [s, p, c, sc, h, e, st] = await Promise.all([
        db.settings.get(),
        db.products.all(),
        db.categories.all(),
        db.subcategories.all(),
        db.hero.all(),
        db.enquiries.all(),
        db.stats.all()
      ]);
      if (s) setSettings(s);
      if (p.length) setProducts(p);
      if (c.length) setCategories(c);
      if (sc.length) setSubCategories(sc);
      if (h.length) setHeroSlides(h);
      if (e.length) setEnquiries(e);
      if (st.length) setStats(st);
    } catch (err) {
      console.error("Data refresh failed", err);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoadingAuth(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    refreshData();
    return () => subscription.unsubscribe();
  }, [refreshData]);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await db.settings.set(updated);
      setSaveStatus('saved');
    } catch (e) { setSaveStatus('error'); }
  };

  const logEvent = (type: 'view' | 'click' | 'system', label: string) => {
    const newEvent = { id: Date.now().toString(), type, text: type === 'view' ? `Page View: ${label}` : label, time: new Date().toLocaleTimeString(), timestamp: Date.now() };
    const existing = JSON.parse(localStorage.getItem('site_traffic_logs') || '[]');
    localStorage.setItem('site_traffic_logs', JSON.stringify([newEvent, ...existing].slice(0, 50)));
  };

  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '212, 175, 55';
    };
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(settings.primaryColor));
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor || '#1E293B');
    document.documentElement.style.setProperty('--accent-color', settings.accentColor || '#F59E0B');
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ 
      settings, updateSettings, products, categories, subCategories, heroSlides, enquiries, stats, 
      refreshData, user, loadingAuth, isLocalMode: !isSupabaseConfigured, saveStatus, setSaveStatus, logEvent 
    }}>
      <Router>
        <ScrollToTop />
        <TrafficTracker logEvent={logEvent} />
        <SaveStatusIndicator status={saveStatus} />
        <style>{`
          .text-primary { color: var(--primary-color); }
          .bg-primary { background-color: var(--primary-color); }
          .border-primary { border-color: var(--primary-color); }
          .hover\\:text-primary:hover { color: var(--primary-color); }
          .hover\\:bg-primary:hover { background-color: var(--primary-color); }
          .text-secondary { color: var(--secondary-color); }
          .bg-secondary { background-color: var(--secondary-color); }
          .text-accent { color: var(--accent-color); }
          .bg-accent { background-color: var(--accent-color); }
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
