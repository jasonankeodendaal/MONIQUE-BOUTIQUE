
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, 
  Settings as SettingsIcon, Layout, Info, Upload, X, ChevronDown,
  Monitor, Smartphone, User, ShieldCheck,
  LayoutGrid, Globe, Mail, Phone, Palette, Hash, MessageCircle, MapPin, 
  BookOpen, FileText, Share2, Tag, ArrowRight, Video, ImageIcon, ShoppingBag,
  LayoutPanelTop, Inbox, Calendar, MoreHorizontal, CheckCircle, Percent, LogOut,
  Rocket, Terminal, Copy, Check, Database, Github, Server, AlertTriangle, ExternalLink, RefreshCcw, Flame, Trash,
  Megaphone, Sparkles, Wand2, CopyCheck, Loader2, Users, Key, Lock, Briefcase, Download, UploadCloud, FileJson, Link as LinkIcon, Reply, Paperclip, Send, AlertOctagon,
  ArrowLeft, Eye, MessageSquare, CreditCard, Shield, Award, PenTool, Image, Globe2, HelpCircle, PenLine, Images, Instagram, Twitter, ChevronRight, Layers, FileCode, Search, Grid,
  Maximize2, Minimize2, CheckSquare, Square, Target, Clock, Filter, FileSpreadsheet, BarChart3, TrendingUp, MousePointer2, Star, Activity, Zap, Timer, ServerCrash,
  BarChart, ZapOff, Activity as ActivityIcon, Code, Map, Wifi, WifiOff, Facebook, Linkedin
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_SETTINGS, PERMISSION_TREE, INITIAL_ADMINS, INITIAL_ENQUIRIES, GUIDE_STEPS, EMAIL_TEMPLATE_HTML } from './constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats } from './types';
import { useSettings } from './App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, getSupabaseUrl } from './lib/supabase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from './components/CustomIcons';

// --- Reusable UI Components for Admin ---

const AdminHelpBox: React.FC<{ title: string; steps: string[] }> = ({ title, steps }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8 flex gap-5 items-start text-left">
    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0"><span className="text-xl">💡</span></div>
    <div className="space-y-2"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4><ul className="list-disc list-inside text-slate-500 text-xs font-medium space-y-1">{steps.map((step, i) => <li key={i}>{step}</li>)}</ul></div>
  </div>
);

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password'; placeholder?: string; rows?: number }> = ({ label, value, onChange, type = 'text', placeholder, rows = 4 }) => (
  <div className="space-y-2 text-left w-full"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
    {type === 'textarea' ? <textarea rows={rows} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /> : <input type={type} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
  </div>
);

const TrafficAreaChart: React.FC<{ stats?: ProductStats[] }> = ({ stats }) => {
  const [regions, setRegions] = useState<{ name: string; traffic: number; status: string }[]>([]);
  const [totalTraffic, setTotalTraffic] = useState(0);
  const aggregatedProductViews = useMemo(() => stats?.reduce((acc, s) => acc + s.views, 0) || 0, [stats]);

  useEffect(() => {
    const loadGeoData = () => {
      const rawData = JSON.parse(localStorage.getItem('site_visitor_locations') || '[]');
      if (rawData.length === 0) return;
      setTotalTraffic(rawData.length);
      const counts: Record<string, number> = {};
      rawData.forEach((entry: any) => { const label = (entry.region && entry.code) ? `${entry.region}, ${entry.code}` : (entry.country || 'Unknown Location'); counts[label] = (counts[label] || 0) + 1; });
      const total = rawData.length;
      setRegions(Object.entries(counts).map(([name, count]) => { const percentage = Math.round((count / total) * 100); return { name, traffic: percentage, status: percentage >= 15 ? 'Peak' : 'Active', count }; }).sort((a, b) => b.count - a.count).slice(0, 6));
    };
    loadGeoData();
  }, []);

  return (
    <div className="relative w-full min-h-[400px] bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group p-10">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12"><div className="text-left"><div className="flex items-center gap-3 mb-1"><div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(var(--primary-rgb),0.8)]"></div><span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Geographic Distribution</span></div><h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Area <span className="text-primary">Traffic</span></h3></div></div>
        <div className="space-y-8 flex-grow">{regions.map((region, idx) => (<div key={idx} className="space-y-3"><div className="flex justify-between items-end"><div className="flex items-center gap-4"><span className="text-slate-600 font-serif font-bold text-lg italic">0{idx + 1}</span><h4 className="text-white font-bold text-sm tracking-wide uppercase">{region.name}</h4></div><span className="text-white font-black text-lg">{region.traffic}%</span></div><div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary rounded-full transition-all duration-[2000ms] ease-out" style={{ width: `${region.traffic}%` }} /></div></div>))}</div>
      </div>
    </div>
  );
};

const GuideIllustration: React.FC<{ id?: string }> = ({ id }) => <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden"><Rocket className="text-slate-800 w-24 h-24" /></div>;

const Admin: React.FC = () => {
  const { 
    settings, updateSettings, products, categories, subCategories, heroSlides, enquiries, stats, 
    user, isLocalMode, saveStatus, saveEntity, deleteEntity 
  } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide'>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<string | null>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  const [connectionHealth, setConnectionHealth] = useState<{status: 'online' | 'offline', latency: number, message: string} | null>(null);

  // Form States
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyEnquiry, setReplyEnquiry] = useState<Enquiry | null>(null);
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);

  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});

  useEffect(() => { if (activeTab === 'system') measureConnection().then(setConnectionHealth); }, [activeTab]);

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };
  
  const handleOpenEditor = (section: any) => { setTempSettings({...settings}); setActiveEditorSection(section); setEditorDrawerOpen(true); };

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8 text-left"><div><h2 className="text-3xl font-serif text-white">Inbox</h2><p className="text-slate-400 text-sm">Manage client leads.</p></div></div>
      {enquiries.map(e => (
        <div key={e.id} className={`bg-slate-900 border rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 text-left border-slate-800`}>
          <div className="flex-grow space-y-2"><div className="flex items-center gap-3"><h4 className="text-white font-bold">{e.name}</h4><span className="text-[9px] font-black text-slate-500 uppercase">{new Date(e.createdAt).toLocaleDateString()}</span></div><p className="text-primary text-sm font-bold">{e.email}</p><div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 text-sm italic">"{e.message}"</div></div>
          <div className="flex gap-2"><button onClick={() => setReplyEnquiry(e)} className="p-4 bg-primary/20 text-primary rounded-2xl"><Reply size={20}/></button><button onClick={() => deleteEntity('enquiries', e.id)} className="p-4 bg-slate-800 text-slate-500 rounded-2xl"><Trash2 size={20}/></button></div>
        </div>
      ))}
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6 text-left">
      {showProductForm ? (
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-8">
          <SettingField label="Product Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
          <SettingField label="Price (ZAR)" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" />
          <div className="flex gap-4"><button onClick={() => { saveEntity('products', {...productData, id: editingId || Date.now().toString(), createdAt: Date.now()}); setShowProductForm(false); }} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save</button></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-end mb-8"><h2 className="text-3xl font-serif text-white">Catalog</h2><button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest">+ Add</button></div>
          <div className="grid gap-4">{products.map(p => (
            <div key={p.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-6"><img src={p.media?.[0]?.url} className="w-16 h-16 rounded-xl object-cover" /><div><h4 className="text-white font-bold">{p.name}</h4><span className="text-primary text-xs font-bold">R {p.price}</span></div></div>
              <div className="flex gap-2"><button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl"><Edit2 size={18}/></button><button onClick={() => deleteEntity('products', p.id)} className="p-3 bg-slate-800 text-slate-400"><Trash2 size={18}/></button></div>
            </div>
          ))}</div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 pb-20">
      <header className="max-w-[1400px] mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
        <h1 className="text-4xl md:text-6xl font-serif text-white">Maison <span className="text-primary italic">Portal</span></h1>
        <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
          {['enquiries', 'catalog', 'analytics', 'hero', 'categories', 'site_editor', 'system', 'guide'].map(t => (<button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === t ? 'bg-primary text-slate-900' : 'text-slate-500 hover:text-white'}`}>{t}</button>))}
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto px-6">
        {activeTab === 'enquiries' && renderEnquiries()}
        {activeTab === 'catalog' && renderCatalog()}
        {activeTab === 'guide' && (<div className="max-w-4xl mx-auto space-y-12 text-left">{GUIDE_STEPS.map(s => (<div key={s.id} className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800"> <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3> <p className="text-slate-400 mb-6">{s.description}</p> {s.code && <div className="relative"> <button onClick={() => navigator.clipboard.writeText(s.code!)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg text-white"><Copy size={16}/></button> <pre className="p-6 bg-black rounded-xl text-xs font-mono text-slate-500 overflow-x-auto"><code>{s.code}</code></pre> </div>} </div>))}</div>)}
        {activeTab === 'site_editor' && (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{['brand', 'nav', 'home', 'collections', 'about', 'contact', 'legal', 'integrations'].map(s => (<button key={s} onClick={() => handleOpenEditor(s)} className="bg-slate-900 p-8 rounded-[2.5rem] text-left border border-slate-800 hover:border-primary/50"> <h3 className="text-white font-bold text-xl uppercase">{s}</h3> </button>))}</div>)}
      </main>
      {editorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-950 h-full overflow-y-auto border-l border-slate-800 p-12 text-left slide-in-from-right">
            <div className="flex justify-between items-center mb-10"><h3 className="text-3xl font-serif text-white uppercase">{activeEditorSection}</h3><button onClick={() => setEditorDrawerOpen(false)}><X size={24} className="text-slate-400"/></button></div>
            <div className="space-y-8"><SettingField label="Update" value="" onChange={() => {}} /></div>
            <div className="fixed bottom-0 right-0 w-full max-w-2xl p-6 bg-slate-900/90 border-t border-slate-800 flex justify-end"><button onClick={() => { updateSettings(tempSettings); setEditorDrawerOpen(false); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black uppercase text-xs">Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
