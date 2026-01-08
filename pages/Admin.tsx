
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, X, ChevronDown, Monitor, Smartphone, User, ShieldCheck, LayoutGrid, Globe, Mail, Phone, Palette, Hash, MessageCircle, MapPin, 
  BookOpen, FileText, Share2, Tag, ArrowRight, Video, ImageIcon, ShoppingBag, LayoutPanelTop, Inbox, Calendar, MoreHorizontal, CheckCircle, Percent, LogOut,
  Rocket, Terminal, Copy, Check, Database, Github, Server, AlertTriangle, ExternalLink, RefreshCcw, Flame, Trash, Megaphone, Sparkles, Wand2, CopyCheck, Loader2, Users, Key, Lock, Briefcase, Download, UploadCloud, FileJson, Link as LinkIcon, Reply, Paperclip, Send, AlertOctagon,
  ArrowLeft, Eye, MessageSquare, CreditCard, Shield, Award, PenTool, Image, Globe2, HelpCircle, PenLine, Images, Instagram, Twitter, ChevronRight, Layers, FileCode, Search, Grid,
  Maximize2, Minimize2, CheckSquare, Square, Target, Clock, Filter, FileSpreadsheet, BarChart3, TrendingUp, MousePointer2, Star, Activity, Zap, Timer, ServerCrash,
  BarChart, ZapOff, Activity as ActivityIcon, Code, Map, Wifi, WifiOff, Facebook, Linkedin
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_SETTINGS, PERMISSION_TREE, INITIAL_ADMINS, INITIAL_ENQUIRIES, GUIDE_STEPS, EMAIL_TEMPLATE_HTML } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, TABLES } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from '../components/CustomIcons';

// --- Reusable UI Components for Admin ---
const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password'; placeholder?: string; rows?: number }> = ({ label, value, onChange, type = 'text', placeholder, rows = 4 }) => (
  <div className="space-y-2 text-left w-full">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
    {type === 'textarea' ? (
      <textarea rows={rows} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : (
      <input type={type} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

const TrafficAreaChart: React.FC<{ visitorLocations?: any[], productStats?: ProductStats[] }> = ({ visitorLocations = [], productStats = [] }) => {
  const aggregatedProductViews = useMemo(() => productStats.reduce((acc, s) => acc + s.views, 0), [productStats]);
  const regions = useMemo(() => {
    if (visitorLocations.length === 0) return [];
    const counts: Record<string, number> = {};
    visitorLocations.forEach((entry: any) => {
      const label = (entry.region && entry.code) ? `${entry.region}, ${entry.code}` : (entry.country || 'Unknown');
      counts[label] = (counts[label] || 0) + 1;
    });
    const total = visitorLocations.length;
    return Object.entries(counts).map(([name, count]) => ({ name, traffic: Math.round((count / total) * 100), count })).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [visitorLocations]);

  return (
    <div className="relative w-full min-h-[400px] bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group p-10">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12">
          <div className="text-left">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Area <span className="text-primary">Traffic</span></h3>
          </div>
        </div>
        <div className="space-y-8 flex-grow">
          {regions.map((region, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-white font-bold text-sm tracking-wide uppercase">{region.name}</span>
                <span className="text-white font-black text-lg">{region.traffic}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${region.traffic}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PermissionSelector: React.FC<{ permissions: string[]; onChange: (perms: string[]) => void; role: 'owner' | 'admin' }> = ({ permissions, onChange, role }) => {
  if (role === 'owner') return <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold text-center">Owners have full system access.</div>;
  const togglePermission = (id: string) => permissions.includes(id) ? onChange(permissions.filter(p => p !== id)) : onChange([...permissions, id]);
  return (
    <div className="space-y-6">
      {PERMISSION_TREE.map(group => (
        <div key={group.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <span className="text-white font-bold text-sm block mb-4">{group.label}</span>
          <div className="grid grid-cols-2 gap-3">
            {group.children?.map(perm => (
              <button key={perm.id} onClick={() => togglePermission(perm.id)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${permissions.includes(perm.id) ? 'bg-primary/10 border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                {permissions.includes(perm.id) ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                <span className="text-xs font-medium">{perm.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const Admin: React.FC = () => {
  const { settings, updateSettings, user, setSaveStatus } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide'>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<string | null>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);

  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<ProductStats[]>([]);
  const [visitorLocations, setVisitorLocations] = useState<any[]>([]);
  const [trafficLogs, setTrafficLogs] = useState<any[]>([]);
  const [connectionHealth, setConnectionHealth] = useState<any>(null);

  // Form States
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});
  const [adminData, setAdminData] = useState<Partial<AdminUser>>({});
  const [replyEnquiry, setReplyEnquiry] = useState<Enquiry | null>(null);
  const [selectedAdProduct, setSelectedAdProduct] = useState<Product | null>(null);

  // Initialization: Fetch all data from Supabase
  const fetchData = async () => {
    if (!isSupabaseConfigured) {
      setProducts(JSON.parse(localStorage.getItem('admin_products') || JSON.stringify(INITIAL_PRODUCTS)));
      setCategories(JSON.parse(localStorage.getItem('admin_categories') || JSON.stringify(INITIAL_CATEGORIES)));
      setEnquiries(JSON.parse(localStorage.getItem('admin_enquiries') || JSON.stringify(INITIAL_ENQUIRIES)));
      return;
    }
    const { data: p } = await supabase.from(TABLES.PRODUCTS).select('*');
    if (p) setProducts(p);
    const { data: c } = await supabase.from(TABLES.CATEGORIES).select('*');
    if (c) setCategories(c);
    const { data: sc } = await supabase.from(TABLES.SUBCATEGORIES).select('*');
    if (sc) setSubCategories(sc);
    const { data: hs } = await supabase.from(TABLES.HERO_SLIDES).select('*');
    if (hs) setHeroSlides(hs);
    const { data: en } = await supabase.from(TABLES.ENQUIRIES).select('*').order('createdAt', { ascending: false });
    if (en) setEnquiries(en);
    const { data: ad } = await supabase.from(TABLES.ADMIN_USERS).select('*');
    if (ad) setAdmins(ad);
    const { data: st } = await supabase.from(TABLES.PRODUCT_STATS).select('*');
    if (st) setStats(st);
    const { data: vl } = await supabase.from(TABLES.VISITOR_LOCATIONS).select('*').limit(500);
    if (vl) setVisitorLocations(vl);
    const { data: tl } = await supabase.from(TABLES.TRAFFIC_LOGS).select('*').limit(50).order('timestamp', { ascending: false });
    if (tl) setTrafficLogs(tl);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleSaveProduct = async () => {
    setSaveStatus('saving');
    const id = editingId || Date.now().toString();
    const payload = { ...productData, id, createdAt: productData.createdAt || Date.now() };
    if (isSupabaseConfigured) {
      await supabase.from(TABLES.PRODUCTS).upsert(payload);
    } else {
      const updated = editingId ? products.map(p => p.id === id ? payload : p) : [payload, ...products];
      localStorage.setItem('admin_products', JSON.stringify(updated));
    }
    setShowProductForm(false); fetchData(); setSaveStatus('saved');
  };

  const handleSaveCategory = async () => {
    setSaveStatus('saving');
    const id = editingId || Date.now().toString();
    const payload = { ...catData, id };
    if (isSupabaseConfigured) await supabase.from(TABLES.CATEGORIES).upsert(payload);
    setShowCategoryForm(false); fetchData(); setSaveStatus('saved');
  };

  const deleteProduct = async (id: string) => {
    if (isSupabaseConfigured) await supabase.from(TABLES.PRODUCTS).delete().eq('id', id);
    fetchData();
  };

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-3xl font-serif text-white">Inbox</h2>
      {enquiries.length === 0 ? <p className="text-slate-500">No leads captured yet.</p> : enquiries.map(e => (
        <div key={e.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 text-left flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-primary font-bold">{e.name}</span>
            <p className="text-slate-400 text-sm">{e.message}</p>
          </div>
          <button onClick={() => setReplyEnquiry(e)} className="p-3 bg-slate-800 text-primary rounded-xl"><Send size={18}/></button>
        </div>
      ))}
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-white">Catalog</h2>
        <button onClick={() => { setProductData({}); setEditingId(null); setShowProductForm(true); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold uppercase text-xs tracking-widest">+ Add Product</button>
      </div>
      {showProductForm ? (
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 space-y-4">
           <SettingField label="Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
           <SettingField label="Price" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" />
           <button onClick={handleSaveProduct} className="w-full py-4 bg-primary text-slate-900 rounded-xl font-bold">Save Masterpiece</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex justify-between items-center">
              <span className="text-white font-bold">{p.name}</span>
              <div className="flex gap-2">
                <button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl"><Edit2 size={16}/></button>
                <button onClick={() => deleteProduct(p.id)} className="p-3 bg-slate-800 text-red-500 rounded-xl"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSiteEditor = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
       {[
         {id: 'brand', label: 'Identity', icon: Globe}, {id: 'home', label: 'Home Page', icon: LayoutGrid}, 
         {id: 'integrations', label: 'Integrations', icon: LinkIcon}
       ].map(s => (
         <button key={s.id} onClick={() => { setTempSettings(settings); setActiveEditorSection(s.id); setEditorDrawerOpen(true); }} className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-left hover:border-primary transition-all">
            <s.icon className="text-primary mb-4" size={24}/>
            <h4 className="text-white font-bold">{s.label}</h4>
         </button>
       ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20">
      <header className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <h1 className="text-5xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic">Portal</span></h1>
        <div className="flex gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          {['enquiries', 'catalog', 'site_editor', 'analytics', 'system'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'bg-primary text-slate-900' : 'text-slate-500 hover:text-white'}`}>{tab}</button>
          ))}
          <button onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><LogOut size={16}/></button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6">
        {activeTab === 'enquiries' && renderEnquiries()}
        {activeTab === 'catalog' && renderCatalog()}
        {activeTab === 'site_editor' && renderSiteEditor()}
        {activeTab === 'analytics' && <TrafficAreaChart visitorLocations={visitorLocations} productStats={stats} />}
        {activeTab === 'system' && (
          <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 text-left">
            <h3 className="text-white font-bold text-2xl mb-6">System Protocol</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-800 rounded-2xl">
                <span className="text-slate-500 text-[10px] uppercase font-black block mb-2">Supabase Sync</span>
                <span className={isSupabaseConfigured ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{isSupabaseConfigured ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {editorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-950 h-full p-12 border-l border-slate-800 overflow-y-auto text-left">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-serif text-white uppercase">{activeEditorSection}</h3>
              <button onClick={() => setEditorDrawerOpen(false)}><X className="text-slate-500" /></button>
            </div>
            {activeEditorSection === 'brand' && (
              <div className="space-y-6">
                <SettingField label="Company Name" value={tempSettings.companyName} onChange={v => setTempSettings({...tempSettings, companyName: v})} />
                <SettingField label="Slogan" value={tempSettings.slogan} onChange={v => setTempSettings({...tempSettings, slogan: v})} />
              </div>
            )}
            <button onClick={() => { updateSettings(tempSettings); setEditorDrawerOpen(false); }} className="w-full mt-10 py-4 bg-primary text-slate-900 font-black rounded-xl">Save Config</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
