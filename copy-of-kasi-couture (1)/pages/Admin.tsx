
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, 
  Settings as SettingsIcon, Layout, Info, Upload, X, ChevronDown,
  Monitor, Smartphone, User, ShieldCheck,
  LayoutGrid, Globe, Mail, Phone, Palette, Hash, MessageCircle, MapPin, 
  BookOpen, FileText, Share2, Tag, ArrowRight, Video, ImageIcon, ShoppingBag,
  LayoutPanelTop, Inbox, Calendar, MoreHorizontal, CheckCircle, Percent, LogOut,
  Rocket, Terminal, Copy, Check, Database, Server, AlertTriangle, ExternalLink, RefreshCcw, Flame, Trash,
  Megaphone, Sparkles, Wand2, CopyCheck, Loader2, Users, Key, Lock, Briefcase, Download, UploadCloud, FileJson, Link as LinkIcon, Reply, Paperclip, Send, AlertOctagon,
  ArrowLeft, Eye, MessageSquare, CreditCard, Shield, Award, PenTool, Image, Globe2, HelpCircle, PenLine, Images, Instagram, Twitter, ChevronRight, Layers, FileCode, Search, Grid,
  Maximize2, Minimize2, CheckSquare, Square, Target, Clock, Filter, FileSpreadsheet, BarChart3, TrendingUp, MousePointer2, Star, Activity, Zap, Timer, ServerCrash,
  BarChart, ZapOff, Activity as ActivityIcon, Code, Map, Wifi, WifiOff, Facebook, Linkedin
} from 'lucide-react';
import { PERMISSION_TREE, GUIDE_STEPS, EMAIL_TEMPLATE_HTML } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, getSupabaseUrl } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from '../components/CustomIcons';

// --- Reusable UI Components for Admin ---

const AdminHelpBox: React.FC<{ title: string; steps: string[] }> = ({ title, steps }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8 flex gap-5 items-start text-left">
    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
      <span className="text-xl">💡</span>
    </div>
    <div className="space-y-2">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
      <ul className="list-disc list-inside text-slate-500 text-xs font-medium space-y-1">
        {steps.map((step, i) => <li key={i}>{step}</li>)}
      </ul>
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

const FileUploader: React.FC<{ files: MediaFile[]; onFilesChange: (files: MediaFile[]) => void; multiple?: boolean; label?: string; accept?: string; }> = ({ files, onFilesChange, multiple = true, label = "media", accept = "image/*,video/*" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const processFiles = async (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setUploading(true);
    
    try {
      const newFiles: MediaFile[] = [];
      for (let i = 0; i < incomingFiles.length; i++) {
        const file = incomingFiles[i];
        const url = await uploadMedia(file, 'media'); 
        
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          url: url,
          name: file.name,
          type: file.type,
          size: file.size
        });
      }
      onFilesChange(multiple ? [...files, ...newFiles] : newFiles);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 text-left w-full">
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()} 
        className={`border-2 border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-slate-900/30 group min-h-[160px] ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {uploading ? (
          <Loader2 className="animate-spin text-primary" size={24} />
        ) : (
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Upload className="text-slate-400 group-hover:text-white" size={20} />
          </div>
        )}
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{uploading ? 'Uploading to Cloud...' : `Click or Drag to Upload ${label}`}</p>
        <span className="text-[9px] text-slate-600 mt-2">{multiple ? 'Multiple files allowed' : 'Single file only'}</span>
        <input type="file" ref={fileInputRef} className="hidden" multiple={multiple} accept={accept} onChange={e => processFiles(e.target.files)} />
      </div>
      
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 animate-in fade-in slide-in-from-bottom-2">
          {files.map(f => (
            <div key={f.id} className="aspect-square rounded-xl overflow-hidden relative group border border-slate-800 bg-slate-900">
              {f.type.startsWith('video') ? (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                   <Video size={20}/>
                   <span className="text-[8px] mt-1 uppercase font-bold">Video</span>
                 </div>
              ) : (
                 <img src={f.url} className="w-full h-full object-cover" alt="preview" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button onClick={() => onFilesChange(files.filter(x => x.id !== f.id))} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SingleImageUploader: React.FC<{ value: string; onChange: (v: string) => void; label: string; accept?: string; className?: string }> = ({ value, onChange, label, accept = "image/*", className = "aspect-video w-full" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
       const url = await uploadMedia(file, 'media');
       onChange(url);
    } catch (err: any) {
       alert("Upload failed: " + err.message);
    } finally {
       setUploading(false);
       if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 text-left w-full">
       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
       <div 
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative ${className} overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 hover:border-primary/50 transition-all cursor-pointer group rounded-2xl ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
       >
          {uploading ? (
             <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={24} />
             </div>
          ) : value ? (
            <>
              <img src={value} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" alt="preview" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white text-xs font-bold flex items-center gap-2">
                   <Upload size={14}/> Change Image
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
               <ImageIcon size={32} className="mb-3 opacity-50" />
               <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload File</span>
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            ref={inputRef} 
            accept={accept}
            onChange={handleUpload}
          />
       </div>
    </div>
  );
};

const TrafficAreaChart: React.FC<{ stats?: ProductStats[] }> = ({ stats }) => {
  const aggregatedProductViews = useMemo(() => stats?.reduce((acc, s) => acc + s.views, 0) || 0, [stats]);

  return (
    <div className="relative w-full min-h-[400px] bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group p-10">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12">
          <div className="text-left">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Area <span className="text-primary">Traffic</span></h3>
          </div>
          <div className="text-right bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Live Ingress</span>
             <span className="text-xl font-bold text-white flex items-center gap-2">
                <Globe size={16} className="text-primary"/> 100% Real-Time
             </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
           <Globe size={48} className="text-slate-600 mb-4" />
           <h4 className="text-white font-bold uppercase tracking-widest">Global Analytics Active</h4>
           <p className="text-slate-500 text-xs mt-2 max-w-xs">Data is aggregating in Supabase traffic_logs.</p>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex gap-10">
              <div className="text-left">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Impressions</span>
                 <span className="text-2xl font-bold text-primary">{aggregatedProductViews.toLocaleString()}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  const { 
    settings, updateSettings, user, setSaveStatus,
    products, updateProduct, deleteProduct,
    categories, updateCategory, deleteCategory,
    subCategories, updateSubCategory, deleteSubCategory,
    heroSlides, updateHeroSlide, deleteHeroSlide,
    enquiries, updateEnquiry, deleteEnquiry,
    admins, updateAdmin, deleteAdmin,
    stats
  } = useSettings();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide'>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<'brand' | 'nav' | 'home' | 'collections' | 'about' | 'contact' | 'legal' | 'integrations' | null>(null);
  
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);

  // Connection State
  const [connectionHealth, setConnectionHealth] = useState<{status: 'online' | 'offline', latency: number, message: string} | null>(null);

  // Form States
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState<Partial<AdminUser>>({});
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});

  // Filters & Search
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // Local State helpers
  const [tempSubCatName, setTempSubCatName] = useState('');
  
  // Measure Connection
  useEffect(() => {
    if (activeTab === 'system') {
       const check = async () => {
          const health = await measureConnection();
          setConnectionHealth(health);
       };
       check();
       const interval = setInterval(check, 10000);
       return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };
  
  const updateTempSettings = (newSettings: Partial<SiteSettings>) => {
    setTempSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleOpenEditor = (section: any) => {
      setTempSettings({...settings}); 
      setActiveEditorSection(section);
      setEditorDrawerOpen(true);
  }

  // Enquiry Logic
  const toggleEnquiryStatus = async (id: string) => {
     const e = enquiries.find(x => x.id === id);
     if(e) await updateEnquiry({...e, status: e.status === 'read' ? 'unread' : 'read'});
  }
  
  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(enquirySearch.toLowerCase()) || e.email.toLowerCase().includes(enquirySearch.toLowerCase()) || e.subject.toLowerCase().includes(enquirySearch.toLowerCase());
    const matchesStatus = enquiryFilter === 'all' || e.status === enquiryFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Handlers
  const handleSaveProduct = async () => { 
     const p = editingId ? { ...products.find(x => x.id === editingId), ...productData } as Product : { ...productData, id: Date.now().toString(), createdAt: Date.now() } as Product;
     await updateProduct(p);
     setShowProductForm(false); setEditingId(null); 
  };
  
  const handleSaveCategory = async () => { 
     const c = editingId ? { ...categories.find(x => x.id === editingId), ...catData } as Category : { ...catData, id: Date.now().toString() } as Category;
     await updateCategory(c);
     setShowCategoryForm(false); setEditingId(null); 
  };
  
  const handleSaveHero = async () => { 
     const h = editingId ? { ...heroSlides.find(x => x.id === editingId), ...heroData } as CarouselSlide : { ...heroData, id: Date.now().toString() } as CarouselSlide;
     await updateHeroSlide(h);
     setShowHeroForm(false); setEditingId(null); 
  };

  const handleAddSubCategory = async (categoryId: string) => {
    if (!tempSubCatName.trim()) return;
    const newSub: SubCategory = { id: Date.now().toString(), categoryId, name: tempSubCatName };
    await updateSubCategory(newSub);
    setTempSubCatName('');
  };

  // --- Render Functions ---

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
         <div className="space-y-2">
            <h2 className="text-3xl font-serif text-white">Inbox</h2>
            <p className="text-slate-400 text-sm">Manage incoming client communications.</p>
         </div>
      </div>
      {filteredEnquiries.length === 0 ? <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800 text-slate-500">No enquiries found.</div> : 
        filteredEnquiries.map(e => (
          <div key={e.id} className={`bg-slate-900 border transition-all rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 text-left ${e.status === 'unread' ? 'border-primary/30 shadow-[0_10px_30px_-10px_rgba(var(--primary-rgb),0.1)]' : 'border-slate-800'}`}>
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-3"><h4 className="text-white font-bold">{e.name}</h4><span className="text-[9px] font-black text-slate-500 uppercase">{new Date(e.createdAt).toLocaleDateString()}</span></div>
              <p className="text-primary text-sm font-bold">{e.email}</p>
              <div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 text-sm italic leading-relaxed">"{e.message}"</div>
            </div>
            <div className="flex gap-2 items-start">
              <button onClick={() => toggleEnquiryStatus(e.id)} className={`p-4 rounded-2xl transition-colors ${e.status === 'read' ? 'bg-slate-800 text-slate-500' : 'bg-green-500/20 text-green-500'}`} title={e.status === 'read' ? 'Mark Unread' : 'Mark Read'}><CheckCircle size={20}/></button>
              <button onClick={() => deleteEnquiry(e.id)} className="p-4 bg-slate-800 text-slate-500 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={20}/></button>
            </div>
          </div>
        ))
      }
    </div>
  );

  const renderAnalytics = () => {
    const totalViews = stats.reduce((acc, s) => acc + s.views, 0);
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
        <div className="flex justify-between items-end">
           <div className="space-y-2">
              <h2 className="text-3xl font-serif text-white">Analytics</h2>
              <p className="text-slate-400 text-sm">Real-time engagement tracking.</p>
           </div>
           <div className="flex gap-8">
              <div className="text-right">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Impressions</span>
                 <span className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</span>
              </div>
           </div>
        </div>
        <TrafficAreaChart stats={stats} />
      </div>
    );
  };
  
  const renderCatalog = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {showProductForm ? (
        <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-800 space-y-8">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-6">
             <h3 className="text-2xl font-serif text-white">{editingId ? 'Edit Masterpiece' : 'New Collection Item'}</h3>
             <button onClick={() => setShowProductForm(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <SettingField label="Product Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
                <SettingField label="Price (ZAR)" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" />
                <SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} />
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Department</label>
                   <select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value, subCategoryId: ''})}>
                      <option value="">Select Department</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
                <SettingField label="Description" value={productData.description || ''} onChange={v => setProductData({...productData, description: v})} type="textarea" />
             </div>
          </div>
          <div className="pt-8 border-t border-slate-800">
             <h4 className="text-white font-bold mb-4 flex items-center gap-2"><ImageIcon size={18} className="text-primary"/> Media Gallery</h4>
             <FileUploader files={productData.media || []} onFilesChange={f => setProductData({...productData, media: f})} />
          </div>
          <div className="flex gap-4 pt-8">
             <button onClick={handleSaveProduct} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20">Save Product</button>
             <button onClick={() => setShowProductForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
             <div className="space-y-2">
                <h2 className="text-3xl font-serif text-white">Catalog</h2>
                <p className="text-slate-400 text-sm">Curate your collection of affiliate products.</p>
             </div>
             <button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3"><Plus size={18} /> Add Product</button>
          </div>
          <div className="grid gap-4">
            {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) && (productCatFilter === 'all' || p.categoryId === productCatFilter)).map(p => (
              <div key={p.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative"><img src={p.media?.[0]?.url} className="w-full h-full object-cover" /></div>
                  <div>
                     <h4 className="text-white font-bold">{p.name}</h4>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="text-primary text-xs font-bold">R {p.price}</span>
                        <span className="text-slate-600 text-slate-500 text-[10px] uppercase font-black tracking-widest">• {categories.find(c => c.id === p.categoryId)?.name}</span>
                     </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors"><Edit2 size={18}/></button>
                  <button onClick={() => deleteProduct(p.id)} className="p-3 bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderHero = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {showHeroForm ? (
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
           <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-6">
             <h3 className="text-2xl font-serif text-white">Edit Visual</h3>
             <button onClick={() => setShowHeroForm(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
           </div>
           <SettingField label="Title" value={heroData.title || ''} onChange={v => setHeroData({...heroData, title: v})} />
           <SettingField label="Subtitle" value={heroData.subtitle || ''} onChange={v => setHeroData({...heroData, subtitle: v})} />
           <SettingField label="CTA Text" value={heroData.cta || ''} onChange={v => setHeroData({...heroData, cta: v})} />
           <div className="pt-4">
              <SingleImageUploader label="Slide Image" value={heroData.image || ''} onChange={v => setHeroData({...heroData, image: v})} />
           </div>
           <div className="flex gap-4 pt-6">
             <button onClick={handleSaveHero} className="flex-1 py-4 bg-primary text-slate-900 font-bold uppercase text-xs rounded-xl">Save Slide</button>
           </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-end mb-8">
             <h2 className="text-3xl font-serif text-white">Visuals</h2>
             <button onClick={() => { setHeroData({}); setShowHeroForm(true); setEditingId(null); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase">Add Slide</button>
          </div>
          <div className="grid gap-4">
            {heroSlides.map(s => (
              <div key={s.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <img src={s.image} className="w-20 h-12 object-cover rounded-lg" />
                    <div><h4 className="text-white font-bold text-sm">{s.title}</h4></div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => { setHeroData(s); setEditingId(s.id); setShowHeroForm(true); }} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white"><Edit2 size={16}/></button>
                    <button onClick={() => deleteHeroSlide(s.id)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-red-500"><Trash2 size={16}/></button>
                 </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {showCategoryForm ? (
         <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-6">
               <h3 className="text-2xl font-serif text-white">Edit Department</h3>
               <button onClick={() => setShowCategoryForm(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
            </div>
            <SettingField label="Name" value={catData.name || ''} onChange={v => setCatData({...catData, name: v})} />
            <SettingField label="Description" value={catData.description || ''} onChange={v => setCatData({...catData, description: v})} />
            <div className="pt-4">
               <SingleImageUploader label="Cover Image" value={catData.image || ''} onChange={v => setCatData({...catData, image: v})} />
            </div>
            <button onClick={handleSaveCategory} className="w-full py-4 bg-primary text-slate-900 font-bold uppercase text-xs rounded-xl mt-6">Save Department</button>
         </div>
      ) : (
         <>
          <div className="flex justify-between items-end mb-8">
             <h2 className="text-3xl font-serif text-white">Departments</h2>
             <button onClick={() => { setCatData({}); setShowCategoryForm(true); setEditingId(null); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase">Add Dept</button>
          </div>
          <div className="grid gap-4">
             {categories.map(c => (
                <div key={c.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                         <img src={c.image} className="w-16 h-16 rounded-xl object-cover" />
                         <div><h4 className="text-white font-bold">{c.name}</h4><p className="text-slate-500 text-xs">{c.description}</p></div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => { setCatData(c); setEditingId(c.id); setShowCategoryForm(true); }} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white"><Edit2 size={16}/></button>
                         <button onClick={() => deleteCategory(c.id)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                   </div>
                   <div className="pt-4 border-t border-slate-800">
                      <div className="flex gap-2 mb-2">
                         <input value={tempSubCatName} onChange={e => setTempSubCatName(e.target.value)} placeholder="New Subcategory" className="bg-slate-800 px-4 py-2 rounded-lg text-white text-xs w-full outline-none" />
                         <button onClick={() => handleAddSubCategory(c.id)} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs hover:bg-slate-700"><Plus size={14}/></button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {subCategories.filter(s => s.categoryId === c.id).map(s => (
                            <span key={s.id} className="px-3 py-1 bg-slate-800 rounded-full text-[10px] text-slate-400 flex items-center gap-2">
                               {s.name} <button onClick={() => deleteSubCategory(s.id)} className="hover:text-red-500"><X size={10}/></button>
                            </span>
                         ))}
                      </div>
                   </div>
                </div>
             ))}
          </div>
         </>
      )}
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-end mb-8">
          <div className="space-y-2"><h2 className="text-3xl font-serif text-white">Maison Team</h2><p className="text-slate-400 text-sm">Manage access.</p></div>
       </div>
       <div className="grid gap-4">
          {admins.map(a => (
             <div key={a.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div><h4 className="text-white font-bold">{a.name}</h4><p className="text-slate-500 text-xs">{a.email}</p></div>
                <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded-full">{a.role}</div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="space-y-2 mb-8"><h2 className="text-3xl font-serif text-white">System Status</h2></div>
       <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
             <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Server size={18} className="text-primary"/> Cloud Connection</h4>
             <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${connectionHealth?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-slate-400 text-sm">{connectionHealth?.message || 'Checking...'}</span>
             </div>
             {connectionHealth?.latency && <p className="text-slate-500 text-xs mt-2">Latency: {connectionHealth.latency}ms</p>}
          </div>
       </div>
    </div>
  );

  const renderGuide = () => (
     <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-serif text-white mb-8">Pilot Guide</h2>
        <div className="space-y-4">
           {GUIDE_STEPS.map(step => (
              <div key={step.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                 <h4 className="text-white font-bold mb-2">{step.title}</h4>
                 <p className="text-slate-400 text-sm">{step.description}</p>
                 {step.code && <pre className="mt-4 p-4 bg-black rounded-xl text-xs text-green-400 overflow-x-auto font-mono">{step.code}</pre>}
              </div>
           ))}
        </div>
     </div>
  );
  
  const renderSiteEditor = () => (
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {[
          {id: 'brand', label: 'Identity', icon: Globe, desc: 'Logo, Colors, Slogan'}, 
          {id: 'home', label: 'Home Page', icon: LayoutGrid, desc: 'Hero, Trust, Features'},
          {id: 'about', label: 'My Story', icon: BookOpen, desc: 'History, Mission, Values'},
          {id: 'contact', label: 'Concierge', icon: Phone, desc: 'Contact Info, Socials'},
          {id: 'legal', label: 'Legal', icon: ShieldCheck, desc: 'Policies, Terms'},
          {id: 'integrations', label: 'Integrations', icon: Zap, desc: 'Analytics, EmailJS'}
        ].map(s => ( 
          <button key={s.id} onClick={() => handleOpenEditor(s.id)} className="bg-slate-900 p-8 rounded-[2.5rem] text-left border border-slate-800 hover:border-primary/50 hover:bg-slate-800 transition-all group h-full flex flex-col justify-between">
             <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-primary group-hover:text-slate-900 transition-colors shadow-lg"><s.icon size={24}/></div>
             <div><h3 className="text-white font-bold text-xl mb-1">{s.label}</h3><p className="text-slate-500 text-xs">{s.desc}</p></div>
          </button> 
        ))}
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 pb-20">
      <header className="max-w-[1400px] mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1>
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em]">{user?.email?.split('@')[0] || 'ADMIN'}</div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
            {[ 
              { id: 'enquiries', label: 'Inbox', icon: Inbox }, 
              { id: 'analytics', label: 'Insights', icon: BarChart3 },
              { id: 'catalog', label: 'Items', icon: ShoppingBag }, 
              { id: 'hero', label: 'Visuals', icon: LayoutPanelTop }, 
              { id: 'categories', label: 'Depts', icon: Layout }, 
              { id: 'site_editor', label: 'Canvas', icon: Palette }, 
              { id: 'team', label: 'Maison', icon: Users }, 
              { id: 'system', label: 'System', icon: Activity }, 
              { id: 'guide', label: 'Pilot', icon: Rocket } 
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-slate-900' : 'text-slate-500 hover:text-slate-300'}`}><div className="flex items-center gap-2"><tab.icon size={12} />{tab.label}</div></button>
            ))}
          </div>
          <button onClick={handleLogout} className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all w-fit"><LogOut size={14} /> Exit</button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 pb-20">
        {activeTab === 'enquiries' && renderEnquiries()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'catalog' && renderCatalog()}
        {activeTab === 'hero' && renderHero()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'site_editor' && renderSiteEditor()}
        {activeTab === 'team' && renderTeam()}
        {activeTab === 'system' && renderSystem()}
        {activeTab === 'guide' && renderGuide()}
      </main>

      {editorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-slate-950 h-full overflow-y-auto border-l border-slate-800 p-8 md:p-12 text-left shadow-2xl slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
               <div><h3 className="text-3xl font-serif text-white uppercase">{activeEditorSection}</h3><p className="text-slate-500 text-xs mt-1">Global Site Configuration</p></div>
               <button onClick={() => setEditorDrawerOpen(false)} className="p-3 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X size={24}/></button>
            </div>
            
            <div className="space-y-10 pb-20">
               {activeEditorSection === 'brand' && (
                  <div className="space-y-6">
                     <h4 className="text-white font-bold flex items-center gap-2"><Globe size={18} className="text-primary"/> Basic Info</h4>
                     <SettingField label="Company Name" value={tempSettings.companyName} onChange={v => updateTempSettings({companyName: v})} />
                     <SingleImageUploader label="Logo Image (PNG)" value={tempSettings.companyLogoUrl || ''} onChange={v => updateTempSettings({companyLogoUrl: v})} className="h-32 w-full object-contain bg-slate-800/50" />
                  </div>
               )}
               {activeEditorSection === 'home' && (
                  <div className="space-y-6">
                     <h4 className="text-white font-bold flex items-center gap-2"><LayoutGrid size={18} className="text-primary"/> Home Page</h4>
                     <SettingField label="About Title" value={tempSettings.homeAboutTitle} onChange={v => updateTempSettings({homeAboutTitle: v})} />
                     <SettingField label="About Description" value={tempSettings.homeAboutDescription} onChange={v => updateTempSettings({homeAboutDescription: v})} type="textarea" />
                     <SingleImageUploader label="About Section Image" value={tempSettings.homeAboutImage} onChange={v => updateTempSettings({homeAboutImage: v})} />
                  </div>
               )}
            </div>

            <div className="fixed bottom-0 right-0 w-full max-w-2xl p-6 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex justify-end gap-4">
              <button onClick={async () => { await updateSettings(tempSettings); setEditorDrawerOpen(false); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20">Save Configuration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
