
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
import { SiteSettings } from './types';
import { INITIAL_SETTINGS } from './constants';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Cloud, Check, Loader2, AlertTriangle } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
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

  // If Supabase isn't configured, allow access to Admin for setup purposes
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

// Global Save Status Indicator
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
        {status === 'saving' && 'Syncing...'}
        {status === 'saved' && 'Saved'}
        {status === 'error' && 'Save Failed'}
      </span>
    </div>
  );
};

// Traffic Logger & Geo Tracker Component
const TrafficTracker = ({ logEvent }: { logEvent: (t: any, l: string) => void }) => {
  const location = useLocation();
  
  useEffect(() => {
    // 1. Page View Logging
    if (!location.pathname.startsWith('/admin')) {
      logEvent('view', location.pathname === '/' ? 'Home Page' : location.pathname);
    }
    
    // 2. Geolocation Logging (Real Data Fetch)
    // Only fetch if we haven't tracked this session yet, and if we are not on the admin panel
    const trackGeo = async () => {
      if (location.pathname.startsWith('/admin')) return;
      if (sessionStorage.getItem('geo_tracked')) return;
      
      try {
        // Fetch location from public IP API
        const res = await fetch('https://ipapi.co/json/');
        // If adblockers block this, we just fail silently
        if (!res.ok) return;
        
        const data = await res.json();
        
        if (data.error) return;

        const geoEntry = {
           city: data.city,
           region: data.region,
           country: data.country_name,
           code: data.country_code,
           timestamp: Date.now()
        };
        
        // Save to localStorage for Admin to read
        const history = JSON.parse(localStorage.getItem('site_visitor_locations') || '[]');
        // Keep last 500 entries to prevent storage overflow
        const newHistory = [geoEntry, ...history].slice(0, 500);
        localStorage.setItem('site_visitor_locations', JSON.stringify(newHistory));
        
        // Mark session as tracked
        sessionStorage.setItem('geo_tracked', 'true');
      } catch (e) {
        // Silent fail for adblockers
        console.warn('Geo tracking skipped (Adblocker likely active)');
      }
    };

    trackGeo();

  }, [location.pathname, logEvent]);
  
  return null;
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('site_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    if (saveStatus === 'saved' || saveStatus === 'error') {
      const timer = setTimeout(() => setSaveStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoadingAuth(false);
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    // Simulate network delay for "Saving" effect
    setTimeout(() => {
      setSettings(prev => {
        const updated = { ...prev, ...newSettings };
        localStorage.setItem('site_settings', JSON.stringify(updated));
        return updated;
      });
      setSaveStatus('saved');
    }, 600);
  };

  const logEvent = (type: 'view' | 'click' | 'system', label: string) => {
    const newEvent = {
      id: Date.now().toString(),
      type,
      text: type === 'view' ? `Page View: ${label}` : label,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now()
    };
    
    try {
      const existing = JSON.parse(localStorage.getItem('site_traffic_logs') || '[]');
      const updated = [newEvent, ...existing].slice(0, 50); // Keep last 50 logs
      localStorage.setItem('site_traffic_logs', JSON.stringify(updated));
    } catch (e) {
      console.error("Traffic log error", e);
    }
  };

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
      settings, 
      updateSettings, 
      user, 
      loadingAuth, 
      isLocalMode: !isSupabaseConfigured,
      saveStatus,
      setSaveStatus,
      logEvent
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
