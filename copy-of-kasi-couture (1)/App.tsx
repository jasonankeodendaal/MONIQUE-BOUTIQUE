
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
import { INITIAL_SETTINGS } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, seedInitialData, syncToCloud, deleteFromCloud } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Check, Loader2, AlertTriangle, CloudOff } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  
  products: Product[];
  updateProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  categories: Category[];
  updateCategory: (c: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  subCategories: SubCategory[];
  updateSubCategory: (s: SubCategory) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>;

  heroSlides: CarouselSlide[];
  updateHeroSlide: (s: CarouselSlide) => Promise<void>;
  deleteHeroSlide: (id: string) => Promise<void>;

  enquiries: Enquiry[];
  updateEnquiry: (e: Enquiry) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;

  admins: AdminUser[];
  updateAdmin: (a: AdminUser) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;

  stats: ProductStats[];
  updateStats: (s: ProductStats) => void; // Usually background updates

  user: User | null;
  loadingAuth: boolean;
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  logEvent: (type: 'view' | 'click' | 'system', label: string) => void;
  refreshAllData: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loadingAuth } = useSettings();
  if (loadingAuth) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
  if (!user && isSupabaseConfigured) return <Navigate to="/login" replace />;
  // If supabase is not configured, we allow access but functionality is limited (Admin will show errors)
  return <>{children}</>;
};

const Footer: React.FC = () => {
  const { settings, user } = useSettings();
  const location = useLocation();
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') return null;

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-left">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
               {settings.companyLogoUrl ? (
                <img src={settings.companyLogoUrl} alt={settings.companyName} className="w-8 h-8 object-contain" />
              ) : (
                <div className="w-8 h-8 rounded flex items-center justify-center text-white font-bold bg-primary">
                  {settings.companyLogo}
                </div>
              )}
              <span className="text-white text-xl font-bold tracking-tighter">{settings.companyName}</span>
            </div>
            <p className="max-w-xs leading-relaxed text-sm mb-8 font-light">
              {settings.footerDescription}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/" className="hover:text-primary transition-colors">{settings.navHomeLabel}</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">{settings.navProductsLabel}</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">{settings.navAboutLabel}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Policy</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/disclosure" className="hover:text-primary transition-colors">{settings.disclosureTitle}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">{settings.privacyTitle}</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-[10px] uppercase tracking-[0.2em] font-medium text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} {settings.companyName}. {settings.footerCopyrightText}</p>
          <Link to={user ? "/admin" : "/login"} className="opacity-30 hover:opacity-100 hover:text-white transition-all">
            Bridge Concierge Portal
          </Link>
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
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 ${
      status === 'error' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white border border-slate-800'
    } animate-in slide-in-from-bottom-4`}>
      {status === 'saving' && <Loader2 size={16} className="animate-spin text-primary" />}
      {status === 'saved' && <Check size={16} className="text-green-500" />}
      {status === 'error' && <AlertTriangle size={16} className="text-white" />}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {status === 'saving' && 'Syncing Supabase...'}
        {status === 'saved' && 'Cloud Sync Complete'}
        {status === 'error' && 'Sync Failed'}
      </span>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Global State Entities
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<ProductStats[]>([]);

  // Initial Data Fetch
  const refreshAllData = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setSaveStatus('saving');
    try {
      await seedInitialData(); // Auto-provision on load

      const [
        remoteSettings, remoteProducts, remoteCategories, 
        remoteSubs, remoteSlides, remoteEnquiries, remoteAdmins, remoteStats
      ] = await Promise.all([
        fetchTableData('settings'),
        fetchTableData('products'),
        fetchTableData('categories'),
        fetchTableData('subcategories'),
        fetchTableData('hero_slides'),
        fetchTableData('enquiries'),
        fetchTableData('admins'),
        fetchTableData('product_stats')
      ]);

      if (remoteSettings && remoteSettings.length > 0) setSettings(remoteSettings[0]);
      if (remoteProducts) setProducts(remoteProducts);
      if (remoteCategories) setCategories(remoteCategories);
      if (remoteSubs) setSubCategories(remoteSubs);
      if (remoteSlides) setHeroSlides(remoteSlides);
      if (remoteEnquiries) setEnquiries(remoteEnquiries);
      if (remoteAdmins) setAdmins(remoteAdmins);
      if (remoteStats) setStats(remoteStats);
      
      setSaveStatus('saved');
    } catch (e) {
      console.error("Data sync failed", e);
      setSaveStatus('error');
    }
  }, []);

  useEffect(() => {
    refreshAllData();

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoadingAuth(false);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    } else {
      setLoadingAuth(false);
    }
  }, [refreshAllData]);

  // Generic Update Helpers
  const performUpdate = async (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    table: string, 
    item: any
  ) => {
    setSaveStatus('saving');
    setter(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx > -1) return prev.map(i => i.id === item.id ? item : i);
      return [item, ...prev];
    });
    await syncToCloud(table, item);
    setSaveStatus('saved');
  };

  const performDelete = async (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    table: string,
    id: string
  ) => {
    setSaveStatus('saving');
    setter(prev => prev.filter(i => i.id !== id));
    await deleteFromCloud(table, id);
    setSaveStatus('saved');
  };

  // Specific Actions
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await syncToCloud('settings', updated);
    setSaveStatus('saved');
  };

  const updateProduct = (p: Product) => performUpdate(setProducts, 'products', p);
  const deleteProduct = (id: string) => performDelete(setProducts, 'products', id);

  const updateCategory = (c: Category) => performUpdate(setCategories, 'categories', c);
  const deleteCategory = (id: string) => performDelete(setCategories, 'categories', id);

  const updateSubCategory = (s: SubCategory) => performUpdate(setSubCategories, 'subcategories', s);
  const deleteSubCategory = (id: string) => performDelete(setSubCategories, 'subcategories', id);

  const updateHeroSlide = (s: CarouselSlide) => performUpdate(setHeroSlides, 'hero_slides', s);
  const deleteHeroSlide = (id: string) => performDelete(setHeroSlides, 'hero_slides', id);

  const updateEnquiry = (e: Enquiry) => performUpdate(setEnquiries, 'enquiries', e);
  const deleteEnquiry = (id: string) => performDelete(setEnquiries, 'enquiries', id);

  const updateAdmin = (a: AdminUser) => performUpdate(setAdmins, 'admins', a);
  const deleteAdmin = (id: string) => performDelete(setAdmins, 'admins', id);

  const updateStats = async (s: ProductStats) => {
    // Stats updates are often frequent, we can optimize by not setting 'saving' status for every hit
    setStats(prev => {
       const idx = prev.findIndex(st => st.productId === s.productId);
       if (idx > -1) return prev.map(st => st.productId === s.productId ? s : st);
       return [...prev, s];
    });
    await syncToCloud('product_stats', s);
  };

  const logEvent = (type: 'view' | 'click' | 'system', label: string) => {
    if (!isSupabaseConfigured) return;
    const newEvent = {
      type,
      text: type === 'view' ? `Page View: ${label}` : label,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now()
    };
    supabase.from('traffic_logs').insert([newEvent]).then();
  };

  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '212, 175, 55';
    };
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(settings.primaryColor));
  }, [settings.primaryColor]);

  if (!isSupabaseConfigured) {
     return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white">
           <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/30"><CloudOff size={40}/></div>
           <h1 className="text-4xl font-serif mb-4">Cloud Bridge Disconnected</h1>
           <p className="text-slate-400 max-w-md mb-8">This application strictly requires a Supabase connection for storage and data persistence. Local storage is disabled.</p>
           <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left font-mono text-xs text-slate-500">
              <p className="mb-2">Please configure your environment variables:</p>
              <p>VITE_SUPABASE_URL</p>
              <p>VITE_SUPABASE_ANON_KEY</p>
           </div>
        </div>
     )
  }

  return (
    <SettingsContext.Provider value={{ 
      settings, updateSettings, 
      products, updateProduct, deleteProduct,
      categories, updateCategory, deleteCategory,
      subCategories, updateSubCategory, deleteSubCategory,
      heroSlides, updateHeroSlide, deleteHeroSlide,
      enquiries, updateEnquiry, deleteEnquiry,
      admins, updateAdmin, deleteAdmin,
      stats, updateStats,
      user, loadingAuth, saveStatus, setSaveStatus, logEvent, refreshAllData
    }}>
      <Router>
        <ScrollToTop />
        <SaveStatusIndicator status={saveStatus} />
        <style>{`
          .text-primary { color: var(--primary-color); }
          .bg-primary { background-color: var(--primary-color); }
          .border-primary { border-color: var(--primary-color); }
          .hover\\:bg-primary:hover { background-color: var(--primary-color); }
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
