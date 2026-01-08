
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, Settings as SettingsIcon, Layout, Info, Upload, X, ChevronDown, Monitor, Smartphone, User, ShieldCheck,
  LayoutGrid, Globe, Mail, Phone, Palette, Hash, MessageCircle, MapPin, BookOpen, FileText, Share2, Tag, ArrowRight, Video, ImageIcon, ShoppingBag,
  LayoutPanelTop, Inbox, Calendar, MoreHorizontal, CheckCircle, Percent, LogOut, Rocket, Terminal, Copy, Check, Database, Github, Server, 
  AlertTriangle, ExternalLink, RefreshCcw, Flame, Trash, Megaphone, Sparkles, Wand2, CopyCheck, Loader2, Users, Key, Lock, Briefcase, 
  Download, UploadCloud, FileJson, Link as LinkIcon, Reply, Paperclip, Send, AlertOctagon, ArrowLeft, Eye, MessageSquare, CreditCard, 
  Shield, Award, PenTool, Image, Globe2, HelpCircle, PenLine, Images, Instagram, Twitter, ChevronRight, Layers, FileCode, Search, Grid,
  Maximize2, Minimize2, CheckSquare, Square, Target, Clock, Filter, FileSpreadsheet, BarChart3, TrendingUp, MousePointer2, Star, Activity, Zap, Timer, 
  ServerCrash, BarChart, ZapOff, Activity as ActivityIcon, Code, Map, Wifi, WifiOff, Facebook, Linkedin
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { PERMISSION_TREE, GUIDE_STEPS, EMAIL_TEMPLATE_HTML } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, getSupabaseUrl, db } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from '../components/CustomIcons';

// --- Reusable UI Components for Admin ---

const AdminHelpBox: React.FC<{ title: string; steps: string[] }> = ({ title, steps }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8 flex gap-5 items-start text-left">
    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0"><span className="text-xl">💡</span></div>
    <div className="space-y-2">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
      <ul className="list-disc list-inside text-slate-500 text-xs font-medium space-y-1">{steps.map((step, i) => <li key={i}>{step}</li>)}</ul>
    </div>
  </div>
);

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

const TrafficAreaChart: React.FC<{ stats?: ProductStats[] }> = ({ stats }) => {
  const [regions, setRegions] = useState<{ name: string; traffic: number; status: string }[]>([]);
  const [totalTraffic, setTotalTraffic] = useState(0);
  const aggregatedProductViews = useMemo(() => stats?.reduce((acc, s) => acc + s.views, 0) || 0, [stats]);

  useEffect(() => {
    const loadGeoData = () => {
      const rawData = JSON.parse(localStorage.getItem('site_visitor_locations') || '[]');
      if (rawData.length === 0) { setRegions([]); setTotalTraffic(0); return; }
      setTotalTraffic(rawData.length);
      const counts: Record<string, number> = {};
      rawData.forEach((entry: any) => {
        const label = (entry.region && entry.code) ? `${entry.region}, ${entry.code}` : (entry.country || 'Unknown Location');
        counts[label] = (counts[label] || 0) + 1;
      });
      const total = rawData.length;
      const sortedRegions = Object.entries(counts).map(([name, count]) => {
        const percentage = Math.round((count / total) * 100);
        let status = percentage >= 50 ? 'Dominant' : percentage >= 30 ? 'Peak' : percentage >= 15 ? 'Rising' : percentage >= 5 ? 'Active' : 'Minimal';
        return { name, traffic: percentage, status, count };
      }).sort((a, b) => b.count - a.count).slice(0, 6);
      setRegions(sortedRegions);
    };
    loadGeoData();
    const interval = setInterval(loadGeoData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[400px] bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group p-10">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12 text-left">
          <div>
            <div className="flex items-center gap-3 mb-1"><div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div><span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Geographic Distribution</span></div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Area <span className="text-primary">Traffic</span></h3>
          </div>
          <div className="text-right bg-white/5 border border-white/10 px-6 py-3 rounded-2xl"><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Live Ingress</span><span className="text-xl font-bold text-white flex items-center gap-2"><Globe size={16} className="text-primary"/> 100% Real-Time</span></div>
        </div>
        <div className="space-y-8 flex-grow">
          {regions.length > 0 ? regions.map((region, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-4"><span className="text-slate-600 font-serif font-bold text-lg italic">0{idx + 1}</span><div><h4 className="text-white font-bold text-sm tracking-wide uppercase">{region.name}</h4><span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">{region.status}</span></div></div>
                <div className="text-right"><span className="text-white font-black text-lg">{region.traffic}%</span></div>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-primary transition-all duration-[2000ms] ease-out" style={{ width: `${region.traffic}%` }} /></div>
            </div>
          )) : <div className="flex flex-col items-center justify-center py-12 text-center opacity-50"><Globe size={48} className="text-slate-600 mb-4" /><h4 className="text-white font-bold uppercase tracking-widest">Awaiting Signal</h4></div>}
        </div>
      </div>
    </div>
  );
};

const PermissionSelector: React.FC<{ permissions: string[]; onChange: (perms: string[]) => void; role: 'owner' | 'admin'; }> = ({ permissions, onChange, role }) => {
  if (role === 'owner') return <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold text-center">Owners have full system access by default.</div>;
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{PERMISSION_TREE.map(group => group.children?.map(perm => (
    <button key={perm.id} onClick={() => permissions.includes(perm.id) ? onChange(permissions.filter(p => p !== perm.id)) : onChange([...permissions, perm.id])} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${permissions.includes(perm.id) ? 'bg-primary/10 border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
      {permissions.includes(perm.id) ? <CheckSquare size={16} className="text-primary flex-shrink-0" /> : <Square size={16} className="flex-shrink-0" />}
      <span className="text-xs font-medium">{perm.label}</span>
    </button>
  )))}</div>;
};

const IconPicker: React.FC<{ selected: string; onSelect: (icon: string) => void }> = ({ selected, onSelect }) => {
  const ALL_ICONS = [...Object.keys(CustomIcons), ...Object.keys(LucideIcons).filter(k => /^[A-Z]/.test(k))];
  const [isOpen, setIsOpen] = useState(false);
  const SelectedIcon = CustomIcons[selected] || (LucideIcons as any)[selected] || LucideIcons.Package;
  return (
    <div className="relative text-left w-full">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300"><div className="flex items-center gap-3"><SelectedIcon size={18} /><span className="text-xs font-bold">{selected}</span></div><ChevronDown size={14} /></button>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-4xl h-[80vh] rounded-[2rem] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800"><div><h3 className="text-white font-bold text-lg">Icon Library</h3></div><button onClick={() => setIsOpen(false)} className="p-2"><X size={20}/></button></div>
            <div className="flex-grow overflow-y-auto p-6 grid grid-cols-4 sm:grid-cols-8 gap-3">
              {ALL_ICONS.slice(0, 200).map(name => {
                const Icon = CustomIcons[name] || (LucideIcons as any)[name];
                return Icon ? <button key={name} onClick={() => { onSelect(name); setIsOpen(false); }} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 border ${selected === name ? 'bg-primary border-primary' : 'bg-slate-900 border-slate-800 text-slate-500'}`}><Icon size={24}/><span className="text-[9px] truncate w-full text-center">{name}</span></button> : null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Admin Component ---

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { 
    settings, updateSettings, refreshData, 
    products, updateProducts, 
    categories, updateCategories, 
    subCategories, updateSubCategories,
    heroSlides, updateHeroSlides,
    enquiries, updateEnquiries,
    stats, setSaveStatus, user, isLocalMode
  } = useSettings();

  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide'>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<string | null>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);

  // Form States
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});
  const [tempSubCatName, setTempSubCatName] = useState('');
  const [tempFeature, setTempFeature] = useState('');
  const [tempSpec, setTempSpec] = useState({ key: '', value: '' });

  const performDBSave = async (table: string, data: any, callback: () => void) => {
    setSaveStatus('saving');
    try {
      if (isSupabaseConfigured) await db.upsert(table, data);
      await refreshData();
      callback();
      setSaveStatus('saved');
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
    }
  };

  const performDBDelete = async (table: string, id: string) => {
    setSaveStatus('saving');
    try {
      if (isSupabaseConfigured) await db.delete(table, id);
      await refreshData();
      setSaveStatus('saved');
    } catch (e) {
      setSaveStatus('error');
    }
  };

  const handleSaveProduct = () => {
    const final = { ...productData, id: editingId || Date.now().toString(), createdAt: Date.now() };
    performDBSave('products', final, () => setShowProductForm(false));
  };

  const handleSaveCategory = () => {
    const final = { ...catData, id: editingId || Date.now().toString() };
    performDBSave('categories', final, () => setShowCategoryForm(false));
  };

  const handleSaveHero = () => {
    const final = { ...heroData, id: editingId || Date.now().toString() };
    performDBSave('carousel_slides', final, () => setShowHeroForm(false));
  };

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };

  const renderEnquiries = () => (
    <div className="space-y-6 text-left">
      <h2 className="text-3xl font-serif text-white">Inbox</h2>
      {enquiries.length === 0 ? <div className="p-20 border border-dashed border-slate-800 text-slate-500 text-center">No messages.</div> : 
        enquiries.map(e => (
          <div key={e.id} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="text-white font-bold">{e.name}</h4>
              <p className="text-primary text-xs font-bold">{e.email}</p>
              <p className="text-slate-500 text-sm mt-2 italic">"{e.message}"</p>
            </div>
            <button onClick={() => performDBDelete('enquiries', e.id)} className="p-3 text-slate-500 hover:text-red-500"><Trash2 size={20}/></button>
          </div>
        ))
      }
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6 text-left">
      {showProductForm ? (
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 space-y-6">
          <SettingField label="Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
          <SettingField label="Price" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" />
          <SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} />
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Department</label>
             <select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value})}>
                <option value="">Select</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>
          </div>
          <SettingField label="Description" value={productData.description || ''} onChange={v => setProductData({...productData, description: v})} type="textarea" />
          <div className="flex gap-4"><button onClick={handleSaveProduct} className="flex-1 py-4 bg-primary text-slate-900 font-bold rounded-xl">Save</button><button onClick={() => setShowProductForm(false)} className="flex-1 py-4 bg-slate-800 text-slate-400 font-bold rounded-xl">Cancel</button></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-end mb-8"><div><h2 className="text-3xl font-serif text-white">Catalog</h2></div><button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold"><Plus size={18}/> Add Piece</button></div>
          <div className="grid gap-4">{products.map(p => (
            <div key={p.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <img src={p.media?.[0]?.url} className="w-12 h-12 rounded-xl object-cover" />
                 <div><h4 className="text-white font-bold">{p.name}</h4><p className="text-primary font-bold text-xs">R {p.price}</p></div>
              </div>
              <div className="flex gap-2"><button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-3 text-slate-500 hover:text-white"><Edit2 size={18}/></button><button onClick={() => performDBDelete('products', p.id)} className="p-3 text-slate-500 hover:text-red-500"><Trash2 size={18}/></button></div>
            </div>
          ))}</div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20">
      <header className="max-w-[1400px] mx-auto px-6 mb-12 flex justify-between items-end">
        <h1 className="text-5xl font-serif text-white">Maison <span className="text-primary italic">Portal</span></h1>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          {['enquiries', 'catalog', 'analytics', 'site_editor', 'guide'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTab === t ? 'bg-primary text-slate-900' : 'text-slate-500'}`}>{t}</button>
          ))}
          <button onClick={handleLogout} className="px-4 py-2 text-red-500 font-bold"><LogOut size={16}/></button>
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto px-6">
        {activeTab === 'enquiries' && renderEnquiries()}
        {activeTab === 'catalog' && renderCatalog()}
        {activeTab === 'analytics' && <TrafficAreaChart stats={stats} />}
        {activeTab === 'site_editor' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Brand', 'Home', 'Collections', 'About', 'Contact', 'Legal', 'Integrations'].map(s => (
              <button key={s} onClick={() => { setTempSettings(settings); setActiveEditorSection(s.toLowerCase()); setEditorDrawerOpen(true); }} className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 text-left hover:border-primary transition-all">
                <h3 className="text-white font-bold text-xl">{s}</h3>
                <p className="text-slate-500 text-xs mt-1">Configure global {s} settings</p>
              </button>
            ))}
          </div>
        )}
      </main>
      {editorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-950 h-full border-l border-slate-800 p-12 text-left overflow-y-auto">
            <div className="flex justify-between items-center mb-8"><h3 className="text-3xl text-white font-serif uppercase">{activeEditorSection}</h3><button onClick={() => setEditorDrawerOpen(false)}><X size={24}/></button></div>
            <div className="space-y-6">
               {activeEditorSection === 'brand' && (
                 <>
                   <SettingField label="Company Name" value={tempSettings.companyName} onChange={v => setTempSettings({...tempSettings, companyName: v})} />
                   <SettingField label="Slogan" value={tempSettings.slogan} onChange={v => setTempSettings({...tempSettings, slogan: v})} />
                   <SettingField label="Primary Color" value={tempSettings.primaryColor} onChange={v => setTempSettings({...tempSettings, primaryColor: v})} type="color" />
                 </>
               )}
            </div>
            <button onClick={() => { updateSettings(tempSettings); setEditorDrawerOpen(false); }} className="w-full py-4 mt-12 bg-primary text-slate-900 font-bold rounded-xl shadow-xl shadow-primary/20">Save Configuration</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
