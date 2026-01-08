
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
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry, AdminUser, ProductStats } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ENQUIRIES, INITIAL_ADMINS } from './constants';
import { supabase, isSupabaseConfigured, fetchTable, upsertItem } from './lib/supabase';
import { User } from '@supabase/sh/supabase-js';
import { Check, Loader2, AlertTriangle, Globe } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface GlobalState {
  settings: SiteSettings;
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  heroSlides: CarouselSlide[];
  enquiries: Enquiry[];
  admins: AdminUser[];
  stats: ProductStats[];
}

interface SettingsContextType extends GlobalState {
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setSubCategories: React.Dispatch<React.SetStateAction<SubCategory[]>>;
  setHeroSlides: React.Dispatch<React.SetStateAction<CarouselSlide[]>>;
  setEnquiries: React.Dispatch<React.SetStateAction<Enquiry[]>>;
  setAdmins: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  setStats: React.Dispatch<React.SetStateAction<ProductStats[]>>;
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
  if (loadingAuth) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div></div>;
  if (isLocalMode) return <>{children}</>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(INITIAL_SUBCATEGORIES);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(INITIAL_CAROUSEL);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [stats, setStats] = useState<ProductStats[]>([]);
  
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const loadAllData = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    try {
      const [dbSettings, dbProducts, dbCategories, dbSubs, dbHero, dbEnquiries, dbAdmins, dbStats] = await Promise.all([
        fetchTable('settings'), fetchTable('products'), fetchTable('categories'), 
        fetchTable('sub_categories'), fetchTable('hero_slides'), fetchTable('enquiries'),
        fetchTable('admins'), fetchTable('product_stats')
      ]);

      if (dbSettings && dbSettings.length > 0) setSettings(dbSettings[0].data);
      else await upsertItem('settings', { id: 'main', data: INITIAL_SETTINGS });

      if (dbProducts && dbProducts.length > 0) setProducts(dbProducts.map(i => i.data));
      if (dbCategories && dbCategories.length > 0) setCategories(dbCategories.map(i => i.data));
      if (dbSubs && dbSubs.length > 0) setSubCategories(dbSubs.map(i => i.data));
      if (dbHero && dbHero.length > 0) setHeroSlides(dbHero.map(i => i.data));
      if (dbEnquiries && dbEnquiries.length > 0) setEnquiries(dbEnquiries.map(i => i.data));
      if (dbAdmins && dbAdmins.length > 0) setAdmins(dbAdmins.map(i => i.data));
      if (dbStats && dbStats.length > 0) setStats(dbStats.map(i => i.data));
    } catch (e) {
      console.warn("App: Supabase sync partial failure. Using local state fallback for missing entities.");
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

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

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (isSupabaseConfigured) {
      try {
        await upsertItem('settings', { id: 'main', data: updated });
        setSaveStatus('saved');
      } catch (e) {
        setSaveStatus('error');
      }
    } else {
      localStorage.setItem('site_settings', JSON.stringify(updated));
      setTimeout(() => setSaveStatus('saved'), 500);
    }
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
  }, [settings.primaryColor]);

  return (
    <SettingsContext.Provider value={{ 
      settings, updateSettings, products, setProducts, categories, setCategories, 
      subCategories, setSubCategories, heroSlides, setHeroSlides, enquiries, setEnquiries,
      admins, setAdmins, stats, setStats,
      user, loadingAuth, isLocalMode: !isSupabaseConfigured, saveStatus, setSaveStatus, logEvent
    }}>
      <Router>
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
          {/* Footer content removed for brevity */}
        </div>
      </Router>
    </SettingsContext.Provider>
  );
};

export default App;
