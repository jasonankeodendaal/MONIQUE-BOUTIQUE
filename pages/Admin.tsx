
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, Settings as SettingsIcon, Layout, Info, Upload, X, ChevronDown, Monitor, Smartphone, User, ShieldCheck,
  LayoutGrid, Globe, Mail, Phone, Palette, Hash, MessageCircle, MapPin, BookOpen, FileText, Share2, Tag, ArrowRight, Video, ImageIcon, ShoppingBag,
  LayoutPanelTop, Inbox, Calendar, MoreHorizontal, CheckCircle, Percent, LogOut, Rocket, Terminal, Copy, Check, Database, Github, Server, AlertTriangle, ExternalLink, RefreshCcw, Flame, Trash,
  Megaphone, Sparkles, Wand2, CopyCheck, Loader2, Users, Key, Lock, Briefcase, Download, UploadCloud, FileJson, Link as LinkIcon, Reply, Paperclip, Send, AlertOctagon,
  ArrowLeft, Eye, MessageSquare, CreditCard, Shield, Award, PenTool, Image, Globe2, HelpCircle, PenLine, Images, Instagram, Twitter, ChevronRight, Layers, FileCode, Search, Grid,
  Maximize2, Minimize2, CheckSquare, Square, Target, Clock, Filter, FileSpreadsheet, BarChart3, TrendingUp, MousePointer2, Star, Activity, Zap, Timer, ServerCrash,
  BarChart, ZapOff, Activity as ActivityIcon, Code, Map, Wifi, WifiOff, Facebook, Linkedin
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_SETTINGS, PERMISSION_TREE, INITIAL_ADMINS, INITIAL_ENQUIRIES, GUIDE_STEPS, EMAIL_TEMPLATE_HTML } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, getSupabaseUrl, db } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from '../components/CustomIcons';

const AdminHelpBox: React.FC<{ title: string; steps: string[] }> = ({ title, steps }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8 flex gap-5 items-start text-left">
    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0"><span className="text-xl">💡</span></div>
    <div className="space-y-2"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4><ul className="list-disc list-inside text-slate-500 text-xs font-medium space-y-1">{steps.map((step, i) => <li key={i}>{step}</li>)}</ul></div>
  </div>
);

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password'; placeholder?: string; rows?: number }> = ({ label, value, onChange, type = 'text', placeholder, rows = 4 }) => (
  <div className="space-y-2 text-left w-full"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>{type === 'textarea' ? <textarea rows={rows} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /> : <input type={type} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}</div>
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
      rawData.forEach((entry: any) => { const label = (entry.region && entry.code) ? `${entry.region}, ${entry.code}` : (entry.country || 'Unknown Location'); counts[label] = (counts[label] || 0) + 1; });
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
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--primary-color) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12">
          <div className="text-left"><div className="flex items-center gap-3 mb-1"><div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(var(--primary-rgb),0.8)]"></div><span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Geographic Distribution</span></div><h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Area <span className="text-primary">Traffic</span></h3></div>
          <div className="text-right bg-white/5 border border-white/10 px-6 py-3 rounded-2xl"><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Live Ingress</span><span className="text-xl font-bold text-white flex items-center gap-2"><Globe size={16} className="text-primary"/> 100% Real-Time</span></div>
        </div>
        <div className="space-y-8 flex-grow">
          {regions.length > 0 ? regions.map((region, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-end"><div className="flex items-center gap-4"><span className="text-slate-600 font-serif font-bold text-lg italic">0{idx + 1}</span><div><h4 className="text-white font-bold text-sm tracking-wide uppercase">{region.name}</h4><span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">{region.status}</span></div></div><div className="text-right"><span className="text-white font-black text-lg">{region.traffic}%</span></div></div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5"><div className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" style={{ width: `${region.traffic}%`, transitionDelay: `${idx * 200}ms` }} /></div>
            </div>
          )) : <div className="flex flex-col items-center justify-center py-12 text-center opacity-50"><Globe size={48} className="text-slate-600 mb-4" /><h4 className="text-white font-bold uppercase tracking-widest">Awaiting Signal</h4><p className="text-slate-500 text-xs mt-2 max-w-xs">Data will appear as visitors interact globally.</p></div>}
        </div>
      </div>
    </div>
  );
};

const PermissionSelector: React.FC<{ permissions: string[]; onChange: (perms: string[]) => void; role: 'owner' | 'admin'; }> = ({ permissions, onChange, role }) => {
  if (role === 'owner') return <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold text-center">Owners have full system access by default.</div>;
  const togglePermission = (id: string) => onChange(permissions.includes(id) ? permissions.filter(p => p !== id) : [...permissions, id]);
  return (
    <div className="space-y-6">
      {PERMISSION_TREE.map(group => (
        <div key={group.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3"><span className="text-white font-bold text-sm">{group.label}</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {group.children?.map(perm => (
              <button key={perm.id} onClick={() => togglePermission(perm.id)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${permissions.includes(perm.id) ? 'bg-primary/10 border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                {permissions.includes(perm.id) ? <CheckSquare size={16} className="text-primary flex-shrink-0" /> : <Square size={16} className="flex-shrink-0" />}<span className="text-xs font-medium">{perm.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const IconPicker: React.FC<{ selected: string; onSelect: (icon: string) => void }> = ({ selected, onSelect }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const CUSTOM_KEYS = Object.keys(CustomIcons);
  const LUCIDE_KEYS = Object.keys(LucideIcons).filter(key => /^[A-Z]/.test(key) && typeof (LucideIcons as any)[key] === 'function' && !key.includes('Icon') && !key.includes('Context'));
  const ALL_ICONS = [...CUSTOM_KEYS, ...LUCIDE_KEYS];
  const filtered = ALL_ICONS.filter(name => name.toLowerCase().includes(search.toLowerCase()));
  const SelectedIconComponent = CustomIcons[selected] || (LucideIcons as any)[selected] || LucideIcons.Package;

  return (
    <div className="relative text-left w-full">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors"><div className="flex items-center gap-3"><SelectedIconComponent size={18} /><span className="text-xs font-bold">{selected}</span></div><ChevronDown size={14} /></button>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"><div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[80vh] rounded-[2rem] flex flex-col overflow-hidden"><div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800"><div><h3 className="text-white font-bold text-lg flex items-center gap-2"><Grid size={18} className="text-primary"/> Icon Library</h3></div><button onClick={() => setIsOpen(false)} className="p-2 bg-slate-700 rounded-xl text-white"><X size={20}/></button></div><div className="p-4 bg-slate-900 border-b border-slate-800"><input className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:border-primary" placeholder="Search icons..." value={search} onChange={e => setSearch(e.target.value)} /></div><div className="flex-grow overflow-y-auto p-6 bg-slate-950 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">{filtered.slice(0, 100).map(name => { const Icon = CustomIcons[name] || (LucideIcons as any)[name]; return <button key={name} onClick={() => { onSelect(name); setIsOpen(false); }} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all border ${selected === name ? 'bg-primary text-slate-900 border-primary' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}><Icon size={24} /><span className="text-[9px] truncate w-full px-2">{name}</span></button>; })}</div></div></div>
      )}
    </div>
  );
};

const FileUploader: React.FC<{ files: MediaFile[]; onFilesChange: (files: MediaFile[]) => void; multiple?: boolean; label?: string; }> = ({ files, onFilesChange, multiple = true, label = "media" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const processFiles = async (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setUploading(true);
    const newFiles = [...files];
    for (const file of Array.from(incomingFiles)) {
      try {
        const url = await uploadMedia(file);
        newFiles.push({ id: Math.random().toString(36).substr(2, 9), url, name: file.name, type: file.type, size: file.size });
      } catch (e) { alert("Upload failed: " + file.name); }
    }
    onFilesChange(multiple ? newFiles : [newFiles[newFiles.length - 1]]);
    setUploading(false);
  };
  return (
    <div className="space-y-4 text-left w-full">
      <div onClick={() => !uploading && fileInputRef.current?.click()} className={`border-2 border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-slate-900/30 ${uploading ? 'opacity-50' : ''}`}>
        {uploading ? <Loader2 className="animate-spin text-primary" size={32} /> : <><Upload className="text-slate-400" size={20} /><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">Upload {label}</p></>}
        <input type="file" ref={fileInputRef} className="hidden" multiple={multiple} onChange={e => processFiles(e.target.files)} />
      </div>
      <div className="grid grid-cols-4 gap-3">{files.map(f => <div key={f.id} className="aspect-square rounded-xl overflow-hidden relative border border-slate-800">{f.type.startsWith('video') ? <div className="w-full h-full flex flex-col items-center justify-center text-slate-500"><Video size={20}/></div> : <img src={f.url} className="w-full h-full object-cover" />}<button onClick={() => onFilesChange(files.filter(x => x.id !== f.id))} className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"><X size={10}/></button></div>)}</div>
    </div>
  );
};

const Admin: React.FC = () => {
  const { settings, products, categories, subCategories, heroSlides, enquiries, admins, stats, updateSettings, user, isLocalMode, setSaveStatus, refreshData } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide'>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<string | null>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const performSave = async (key: string, data: any) => {
    setSaveStatus('saving');
    try {
      await db.save(key, data);
      await refreshData();
      setSaveStatus('saved');
    } catch (e) { setSaveStatus('error'); }
  };

  const handleSaveProduct = async () => {
    const updated = editingId ? products.map(p => p.id === editingId ? { ...p, ...productData } as Product : p) : [{ ...productData, id: Date.now().toString(), createdAt: Date.now() } as Product, ...products];
    await performSave('products', updated);
    setShowProductForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20">
      <header className="max-w-[1400px] mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
        <div><h1 className="text-4xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1><div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-widest mt-4 w-fit">{isLocalMode ? 'LOCAL' : (user?.email?.split('@')[0] || 'ADMIN')}</div></div>
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
          {[{ id: 'enquiries', icon: Inbox }, { id: 'analytics', icon: BarChart3 }, { id: 'catalog', icon: ShoppingBag }, { id: 'hero', icon: LayoutPanelTop }, { id: 'categories', icon: Layout }, { id: 'site_editor', icon: Palette }, { id: 'team', icon: Users }, { id: 'system', icon: Activity }, { id: 'guide', icon: Rocket }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-slate-900' : 'text-slate-500 hover:text-white'}`}><div className="flex items-center gap-2"><tab.icon size={12} />{tab.id}</div></button>
          ))}
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto px-6">
        {activeTab === 'enquiries' && (
          <div className="space-y-6">{enquiries.map(e => (
            <div key={e.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-start text-left">
              <div className="flex-grow space-y-2"><div className="flex items-center gap-4"><h4 className="text-white font-bold">{e.name}</h4><span className="text-[10px] font-black text-slate-500">{new Date(e.createdAt).toLocaleDateString()}</span></div><p className="text-primary text-sm font-bold">{e.email}</p><div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 italic">"{e.message}"</div></div>
              <button onClick={async () => performSave('enquiries', enquiries.filter(x => x.id !== e.id))} className="p-4 bg-slate-800 text-slate-500 rounded-2xl hover:text-red-500"><Trash2/></button>
            </div>
          ))}</div>
        )}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            <div className="flex justify-end"><button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2"><Plus size={18}/> Add Item</button></div>
            {showProductForm ? (
              <div className="bg-slate-900 p-12 rounded-[3rem] border border-slate-800 space-y-8 text-left">
                <div className="grid md:grid-cols-2 gap-8"><SettingField label="Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} /><SettingField label="Price" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" /></div>
                <SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} />
                <FileUploader label="Media" files={productData.media || []} onFilesChange={f => setProductData({...productData, media: f})} />
                <div className="flex gap-4"><button onClick={handleSaveProduct} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save</button><button onClick={() => setShowProductForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div>
              </div>
            ) : (
              <div className="grid gap-4">{products.map(p => (
                <div key={p.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-6"><img src={p.media?.[0]?.url} className="w-16 h-16 rounded-xl object-cover bg-slate-800" /><div className="text-left"><h4 className="text-white font-bold">{p.name}</h4><span className="text-primary text-xs font-bold">R {p.price}</span></div></div>
                  <div className="flex gap-2"><button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl"><Edit2/></button><button onClick={() => performSave('products', products.filter(x => x.id !== p.id))} className="p-3 bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl"><Trash2/></button></div>
                </div>
              ))}</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
