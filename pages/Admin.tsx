
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
  Maximize2, Minimize2, CheckSquare, Square, Target, Clock, Filter, FileSpreadsheet, BarChart3, TrendingUp, MousePointer2, Star, Activity, Cpu, Wifi
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_SETTINGS, PERMISSION_TREE, INITIAL_ADMINS, INITIAL_ENQUIRIES, GUIDE_STEPS } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from '../components/CustomIcons';

// --- Reusable UI Components for Admin ---

const AdminHelpBox: React.FC<{ title: string; steps: string[] }> = ({ title, steps }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8 flex gap-5 items-start text-left">
    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
      <Info size={20} />
    </div>
    <div className="space-y-2">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
      <ol className="list-decimal list-inside text-slate-500 text-xs font-medium space-y-1">
        {steps.map((step, i) => <li key={i}>{step}</li>)}
      </ol>
    </div>
  </div>
);

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password' }> = ({ label, value, onChange, type = 'text' }) => (
  <div className="space-y-2 text-left w-full">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
    {type === 'textarea' ? (
      <textarea rows={4} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} />
    ) : (
      <input type={type} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} />
    )}
  </div>
);

const PermissionSelector: React.FC<{
  permissions: string[];
  onChange: (perms: string[]) => void;
  role: 'owner' | 'admin';
}> = ({ permissions, onChange, role }) => {
  if (role === 'owner') return <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold text-center">Owners have full system access by default.</div>;

  const togglePermission = (id: string) => {
    if (permissions.includes(id)) {
      onChange(permissions.filter(p => p !== id));
    } else {
      onChange([...permissions, id]);
    }
  };

  const toggleGroup = (node: PermissionNode) => {
    const childIds = node.children?.map(c => c.id) || [];
    const allSelected = childIds.every(id => permissions.includes(id));
    
    if (allSelected) {
      onChange(permissions.filter(p => !childIds.includes(p)));
    } else {
      const newPerms = [...permissions];
      childIds.forEach(id => {
        if (!newPerms.includes(id)) newPerms.push(id);
      });
      onChange(newPerms);
    }
  };

  return (
    <div className="space-y-6">
      {PERMISSION_TREE.map(group => {
        const childIds = group.children?.map(c => c.id) || [];
        const isAllSelected = childIds.every(id => permissions.includes(id));
        
        return (
          <div key={group.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">{group.label}</span>
                <span className="text-slate-500 text-[10px]">{group.description}</span>
              </div>
              <button 
                onClick={() => toggleGroup(group)}
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.children?.map(perm => {
                const isSelected = permissions.includes(perm.id);
                return (
                  <button
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {isSelected ? <CheckSquare size={16} className="text-primary flex-shrink-0" /> : <Square size={16} className="flex-shrink-0" />}
                    <span className="text-xs font-medium">{perm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const IconPicker: React.FC<{ selected: string; onSelect: (icon: string) => void }> = ({ selected, onSelect }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [limit, setLimit] = useState(100);
  
  const CUSTOM_KEYS = Object.keys(CustomIcons);
  const LUCIDE_KEYS = Object.keys(LucideIcons).filter(key => {
    const val = (LucideIcons as any)[key];
    return /^[A-Z]/.test(key) && typeof val === 'function' && !key.includes('Icon') && !key.includes('Context');
  });

  const ALL_ICONS = [...CUSTOM_KEYS, ...LUCIDE_KEYS];
  const filtered = search 
    ? ALL_ICONS.filter(name => name.toLowerCase().includes(search.toLowerCase()))
    : ALL_ICONS; 

  const displayed = filtered.slice(0, limit);
  const SelectedIconComponent = CustomIcons[selected] || (LucideIcons as any)[selected] || LucideIcons.Package;

  return (
    <div className="relative text-left w-full">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors">
        <div className="flex items-center gap-3">
          <SelectedIconComponent size={18} />
          <span className="text-xs font-bold">{selected}</span>
        </div>
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
             <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
               <div>
                 <h3 className="text-white font-bold text-lg flex items-center gap-2"><Grid size={18} className="text-primary"/> Icon Library</h3>
                 <p className="text-slate-400 text-xs mt-1">Select from {filtered.length} curated icons</p>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-colors"><X size={20}/></button>
             </div>
             <div className="p-4 bg-slate-900 border-b border-slate-800">
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none text-white focus:border-primary transition-all" 
                    placeholder="Search icons..." 
                    value={search} 
                    onChange={e => { setSearch(e.target.value); setLimit(100); }} 
                    autoFocus
                  />
                </div>
             </div>
             <div className="flex-grow overflow-y-auto p-6 custom-scrollbar bg-slate-950">
               <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {displayed.map(name => {
                    const IconComp = CustomIcons[name] || (LucideIcons as any)[name];
                    if (!IconComp) return null;
                    return (
                      <button 
                        key={name} 
                        onClick={() => { onSelect(name); setIsOpen(false); }} 
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all border ${selected === name ? 'bg-primary text-slate-900 border-primary shadow-lg scale-105' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600'}`}
                      >
                        <IconComp size={24} />
                        <span className="text-[9px] font-medium truncate w-full px-2 text-center opacity-70">{name}</span>
                      </button>
                    )
                  })}
               </div>
               {displayed.length < filtered.length && (
                 <button onClick={() => setLimit(prev => prev + 100)} className="w-full mt-6 py-4 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-colors">Load More</button>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmailReplyModal: React.FC<{ enquiry: Enquiry; onClose: () => void }> = ({ enquiry, onClose }) => {
  const { settings } = useSettings();
  const [subject, setSubject] = useState(`Re: ${enquiry.subject}`);
  const [message, setMessage] = useState(`Hi ${enquiry.name},\n\nThank you for contacting Kasi Couture.\n\n`);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!settings.emailJsServiceId || !settings.emailJsTemplateId || !settings.emailJsPublicKey) {
      setError("Email.js is not configured in Settings.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const fileLinks: string[] = [];
      if (attachments.length > 0) {
        if (!isSupabaseConfigured) throw new Error("Supabase is required for attachments.");
        for (const file of attachments) {
           const url = await uploadMedia(file, 'media');
           if (url) fileLinks.push(`${file.name}: ${url}`);
        }
      }
      let finalMessage = message;
      if (fileLinks.length > 0) finalMessage += `\n\n[Attachments]\n${fileLinks.join('\n')}`;
      await emailjs.send(settings.emailJsServiceId, settings.emailJsTemplateId, {
          to_name: enquiry.name, to_email: enquiry.email, subject: subject, message: finalMessage, reply_to: enquiry.email
      }, settings.emailJsPublicKey);
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(err.text || err.message || "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  if (success) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"><div className="bg-white rounded-3xl p-10 text-center animate-in zoom-in"><div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4"><CheckCircle size={40} /></div><h3 className="text-2xl font-bold text-slate-900">Email Sent!</h3></div></div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center"><h3 className="text-white font-bold flex items-center gap-3"><Reply size={20} className="text-primary"/> Reply to {enquiry.name}</h3><button onClick={onClose} className="text-slate-500 hover:text-white"><X size={24}/></button></div>
        <div className="p-6 overflow-y-auto space-y-4">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
          <div className="space-y-4">
            <SettingField label="To" value={enquiry.email} onChange={() => {}} type="text" />
            <SettingField label="Subject" value={subject} onChange={setSubject} />
            <SettingField label="Message" value={message} onChange={setMessage} type="textarea" />
            <div className="space-y-2 text-left"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Paperclip size={12}/> Attachments</label><input type="file" multiple onChange={e => e.target.files && setAttachments(Array.from(e.target.files))} className="block w-full text-xs text-slate-400 file:bg-slate-800 file:text-primary file:rounded-full file:border-0 file:py-2 file:px-4" /></div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3"><button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-400 font-bold text-xs uppercase tracking-widest">Cancel</button><button onClick={handleSend} disabled={sending} className="px-8 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">{sending ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>} Send Email</button></div>
      </div>
    </div>
  );
};

const AdGeneratorModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const templates = [
    { name: 'Minimalist', caption: `✨ Discover: ${product.name}\n\nElegance refined. Shop at Kasi Couture.\n\n🏷️ R ${product.price}\n🔗 Link: ${product.affiliateLink}\n#Luxury #Style` },
    { name: 'Hype', caption: `🔥 MUST HAVE: ${product.name} 🔥\n\nVerified luxury at your fingertips.\n💰 Only R ${product.price}\n🚀 Buy here: ${product.affiliateLink}\n#Hype #Fashion` },
    { name: 'Curator', caption: `🖤 From The Silhouette Story: ${product.name}\n\nCurated by ${settings.companyName}\n💎 R ${product.price}\n🌐 Explore: ${product.affiliateLink}\n#Curation #Modern` }
  ];

  const handleCopy = () => { navigator.clipboard.writeText(templates[selectedTemplate].caption); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleShare = async () => { setSharing(true); try { await navigator.share({ title: product.name, text: templates[selectedTemplate].caption, url: product.affiliateLink }); } catch (err) {} finally { setSharing(false); } };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-slate-950 animate-in fade-in duration-300">
       <div className="w-full md:w-1/2 bg-black/40 border-r border-slate-800 flex flex-col h-full"><div className="p-8 flex justify-between items-center border-b border-slate-800"><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Ad Preview</span><button onClick={onClose} className="md:hidden p-2 text-slate-500"><X size={24} /></button></div><div className="flex-grow flex items-center justify-center p-8"><div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-w-sm w-full"><div className="aspect-square bg-slate-100"><img src={product.media[0]?.url} className="w-full h-full object-cover" /></div><div className="p-5 text-left"><span className="font-bold text-slate-900">kasicouture_official</span><p className="text-[11px] mt-2 whitespace-pre-wrap">{templates[selectedTemplate].caption}</p></div></div></div></div>
       <div className="w-full md:w-1/2 bg-slate-950 flex flex-col h-full relative p-8 md:p-20 overflow-y-auto">
          <button onClick={onClose} className="hidden md:block absolute top-10 right-10 p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white"><X size={24} /></button>
          <div className="max-w-xl mx-auto space-y-12 text-left">
            <h3 className="text-4xl md:text-5xl font-serif text-white">Maison <span className="text-primary italic">Architect</span></h3>
            <div className="grid gap-3">{templates.map((t, i) => (<button key={i} onClick={() => setSelectedTemplate(i)} className={`px-8 py-6 rounded-2xl text-left border transition-all ${selectedTemplate === i ? 'border-primary bg-primary/5 text-primary' : 'border-slate-800 text-slate-500'}`}>{t.name}</button>))}</div>
            <div className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-8 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{templates[selectedTemplate].caption}</div>
            <div className="flex gap-4"><button onClick={handleCopy} className="flex-grow py-5 bg-white text-slate-900 font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-3">{copied ? <CopyCheck size={18} /> : <Copy size={18} />} Copy</button><button onClick={handleShare} className="px-10 py-5 bg-primary text-slate-900 font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"><Share2 size={18} /></button></div>
          </div>
       </div>
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; language?: string; label?: string }> = ({ code, language = 'bash', label }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="relative group mb-6 text-left">
      {label && <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2"><Terminal size={12}/>{label}</div>}
      <div className="absolute top-8 right-4 z-10"><button onClick={copyToClipboard} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/5">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div>
      <pre className="p-6 bg-black rounded-2xl text-[10px] md:text-xs font-mono text-slate-400 overflow-x-auto border border-slate-800 leading-relaxed custom-scrollbar shadow-inner"><code>{code}</code></pre>
    </div>
  );
};

const FileUploader: React.FC<{ files: MediaFile[]; onFilesChange: (files: MediaFile[]) => void; multiple?: boolean; label?: string; accept?: string; }> = ({ files, onFilesChange, multiple = true, label = "media", accept = "image/*,video/*" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const processFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    Array.from(incomingFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newMedia: MediaFile = { 
          id: Math.random().toString(36).substr(2, 9), 
          url: result, 
          name: file.name, 
          type: file.type, 
          size: file.size 
        };
        onFilesChange(multiple ? [...files, newMedia] : [newMedia]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-4 text-left w-full">
      <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-slate-900/30 group min-h-[160px]">
        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
           <Upload className="text-slate-400 group-hover:text-white" size={20} />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Click or Drag to Upload {label}</p>
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
  
  return (
    <div className="space-y-2 text-left w-full">
       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
       <div 
        onClick={() => inputRef.current?.click()}
        className={`relative ${className} overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 hover:border-primary/50 transition-all cursor-pointer group rounded-2xl`}
       >
          {value ? (
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
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => onChange(ev.target?.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
       </div>
    </div>
  );
};

// --- Main Admin Component ---

const Admin: React.FC = () => {
  const { settings, updateSettings, user, isLocalMode } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'analytics' | 'team' | 'system' | 'guide'>('enquiries');
  
  const [products, setProducts] = useState<Product[]>(() => JSON.parse(localStorage.getItem('admin_products') || JSON.stringify(INITIAL_PRODUCTS)));
  const [categories, setCategories] = useState<Category[]>(() => JSON.parse(localStorage.getItem('admin_categories') || JSON.stringify(INITIAL_CATEGORIES)));
  const [subCategories, setSubCategories] = useState<SubCategory[]>(() => JSON.parse(localStorage.getItem('admin_subcategories') || JSON.stringify(INITIAL_SUBCATEGORIES)));
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(() => JSON.parse(localStorage.getItem('admin_hero') || JSON.stringify(INITIAL_CAROUSEL)));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => JSON.parse(localStorage.getItem('admin_enquiries') || JSON.stringify(INITIAL_ENQUIRIES)));
  const [admins, setAdmins] = useState<AdminUser[]>(() => JSON.parse(localStorage.getItem('admin_users') || JSON.stringify(INITIAL_ADMINS)));
  const [stats, setStats] = useState<ProductStats[]>(() => JSON.parse(localStorage.getItem('admin_product_stats') || '[]'));
  
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState<Partial<AdminUser>>({});
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAdProduct, setSelectedAdProduct] = useState<Product | null>(null);
  const [replyEnquiry, setReplyEnquiry] = useState<Enquiry | null>(null);
  
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});

  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  const [tempSubCatName, setTempSubCatName] = useState('');
  const [tempDiscountRule, setTempDiscountRule] = useState<Partial<DiscountRule>>({ type: 'percentage', value: 0, description: '' });

  useEffect(() => {
    localStorage.setItem('admin_products', JSON.stringify(products));
    localStorage.setItem('admin_categories', JSON.stringify(categories));
    localStorage.setItem('admin_subcategories', JSON.stringify(subCategories));
    localStorage.setItem('admin_hero', JSON.stringify(heroSlides));
    localStorage.setItem('admin_enquiries', JSON.stringify(enquiries));
    localStorage.setItem('admin_users', JSON.stringify(admins));
    localStorage.setItem('admin_product_stats', JSON.stringify(stats));
  }, [products, categories, subCategories, heroSlides, enquiries, admins, stats]);

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };
  const handleFactoryReset = () => { if (window.confirm("⚠️ DANGER: Factory Reset?")) { localStorage.clear(); window.location.reload(); } };
  const handleBackup = () => { const data = { products, categories, subCategories, heroSlides, enquiries, admins, settings, stats }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup.json`; a.click(); };
  
  const toggleEnquiryStatus = (id: string) => setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'read' ? 'unread' : 'read' } : e));
  const deleteEnquiry = (id: string) => setEnquiries(prev => prev.filter(e => e.id !== id));
  const exportEnquiries = () => {
    const csvContent = "data:text/csv;charset=utf-8," + "Name,Email,Subject,Message,Date\n" + enquiries.map(e => `${e.name},${e.email},${e.subject},"${e.message}",${new Date(e.createdAt).toLocaleDateString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enquiries_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(enquirySearch.toLowerCase()) || e.email.toLowerCase().includes(enquirySearch.toLowerCase()) || e.subject.toLowerCase().includes(enquirySearch.toLowerCase());
    const matchesStatus = enquiryFilter === 'all' || e.status === enquiryFilter;
    return matchesSearch && matchesStatus;
  });
  
  const handleSaveProduct = () => { if (editingId) setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...productData } as Product : p)); else setProducts(prev => [{ ...productData, id: Date.now().toString(), createdAt: Date.now() } as Product, ...prev]); setShowProductForm(false); setEditingId(null); };
  const handleSaveCategory = () => { if (editingId) setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...catData } as Category : c)); else setCategories(prev => [...prev, { ...catData, id: Date.now().toString() } as Category]); setShowCategoryForm(false); setEditingId(null); };
  const handleSaveHero = () => { if (editingId) setHeroSlides(prev => prev.map(h => h.id === editingId ? { ...h, ...heroData } as CarouselSlide : h)); else setHeroSlides(prev => [...prev, { ...heroData, id: Date.now().toString() } as CarouselSlide]); setShowHeroForm(false); setEditingId(null); };
  
  const handleSaveAdmin = async () => {
    if (!adminData.email || !adminData.password) return;
    setCreatingAdmin(true);
    try {
      if (!editingId && isSupabaseConfigured) {
        const { error } = await supabase.auth.signUp({
          email: adminData.email,
          password: adminData.password,
          options: { data: { name: adminData.name, role: adminData.role } }
        });
        if (error) throw error;
      }
      if (editingId) setAdmins(prev => prev.map(a => a.id === editingId ? { ...a, ...adminData } as AdminUser : a));
      else setAdmins(prev => [...prev, { ...adminData, id: Date.now().toString(), createdAt: Date.now() } as AdminUser]);
      setShowAdminForm(false); setEditingId(null);
    } catch (err: any) { alert(`Error saving member: ${err.message}`); } finally { setCreatingAdmin(false); }
  };

  const handleAddSubCategory = (categoryId: string) => {
    if (!tempSubCatName.trim()) return;
    setSubCategories(prev => [...prev, { id: Date.now().toString(), categoryId, name: tempSubCatName }]);
    setTempSubCatName('');
  };
  const handleDeleteSubCategory = (id: string) => setSubCategories(prev => prev.filter(s => s.id !== id));

  const handleAddDiscountRule = () => {
    if (!tempDiscountRule.value || !tempDiscountRule.description) return;
    const newRule: DiscountRule = { id: Date.now().toString(), type: tempDiscountRule.type || 'percentage', value: Number(tempDiscountRule.value), description: tempDiscountRule.description };
    setProductData({ ...productData, discountRules: [...(productData.discountRules || []), newRule] });
    setTempDiscountRule({ type: 'percentage', value: 0, description: '' });
  };
  const handleRemoveDiscountRule = (id: string) => setProductData({ ...productData, discountRules: (productData.discountRules || []).filter(r => r.id !== id) });

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
         <div className="space-y-2">
            <h2 className="text-3xl font-serif text-white">Inbox</h2>
            <p className="text-slate-400 text-sm">Manage incoming client communications.</p>
         </div>
         <div className="flex gap-3">
            <button onClick={() => setEnquiries(prev => prev.map(e => ({...e, status: 'read'})))} className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">Mark All Read</button>
            <button onClick={exportEnquiries} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><FileSpreadsheet size={16}/> Export CSV</button>
         </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
         <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" placeholder="Search sender, email, or subject..." value={enquirySearch} onChange={e => setEnquirySearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" />
         </div>
         <div className="flex gap-2">
            {['all', 'unread', 'read'].map(filter => (
               <button key={filter} onClick={() => setEnquiryFilter(filter as any)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${enquiryFilter === filter ? 'bg-primary text-slate-900' : 'bg-slate-900 text-slate-500 hover:text-white border border-slate-800'}`}>
                  {filter}
               </button>
            ))}
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
              <button onClick={() => setReplyEnquiry(e)} className="p-4 bg-primary/20 text-primary rounded-2xl hover:bg-primary hover:text-slate-900 transition-colors" title="Reply"><Reply size={20}/></button>
              <button onClick={() => toggleEnquiryStatus(e.id)} className={`p-4 rounded-2xl transition-colors ${e.status === 'read' ? 'bg-slate-800 text-slate-500' : 'bg-green-500/20 text-green-500'}`} title={e.status === 'read' ? 'Mark Unread' : 'Mark Read'}><CheckCircle size={20}/></button>
              <button onClick={() => deleteEnquiry(e.id)} className="p-4 bg-slate-800 text-slate-500 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={20}/></button>
            </div>
          </div>
        ))
      }
    </div>
  );

  const renderAnalytics = () => {
    const sortedProducts = [...products].map(p => {
      const pStats = stats.find(s => s.productId === p.id) || { views: 0, clicks: 0 };
      return { ...p, ...pStats, ctr: pStats.views > 0 ? ((pStats.clicks / pStats.views) * 100).toFixed(1) : 0 };
    }).sort((a, b) => (Number(b.views) + Number(b.clicks)) - (Number(a.views) + Number(a.clicks)));

    const totalViews = stats.reduce((acc, s) => acc + s.views, 0);
    const totalClicks = stats.reduce((acc, s) => acc + s.clicks, 0);
    
    const catStats = categories.map(cat => {
      const pInCat = products.filter(p => p.categoryId === cat.id).map(p => p.id);
      const views = stats.filter(s => pInCat.includes(s.productId)).reduce((acc, s) => acc + s.views, 0);
      return { name: cat.name, views };
    }).sort((a, b) => b.views - a.views);

    const maxCatViews = Math.max(...catStats.map(c => c.views), 1);

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
              <div className="text-right border-l border-slate-800 pl-8">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Affiliate Conversions</span>
                 <span className="text-3xl font-bold text-primary">{totalClicks.toLocaleString()}</span>
              </div>
           </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
           <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800">
              <h3 className="text-white font-bold mb-10 flex items-center gap-3"><TrendingUp size={18} className="text-primary"/> Category Engagement</h3>
              <div className="space-y-6">
                 {catStats.map((c, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                         <span>{c.name}</span>
                         <span>{c.views} views</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(c.views / maxCatViews) * 100}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Avg. CTR', value: totalViews > 0 ? `${((totalClicks / totalViews) * 100).toFixed(1)}%` : '0%', icon: MousePointer2, color: 'text-primary' },
                { label: 'Peak Interest', value: sortedProducts[0]?.name || 'N/A', icon: Star, color: 'text-yellow-500' },
                { label: 'Active Curations', value: products.length, icon: ShoppingBag, color: 'text-blue-500' },
                { label: 'Hot Dept.', value: catStats[0]?.name || 'N/A', icon: LayoutGrid, color: 'text-purple-500' }
              ].map((m, i) => (
                <div key={i} className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-between">
                   <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${m.color}`}><m.icon size={20}/></div>
                   <div className="mt-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{m.label}</span>
                      <span className="text-lg font-bold text-white truncate block">{m.value}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
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
                <SettingField label="SKU / Reference ID" value={productData.sku || ''} onChange={v => setProductData({...productData, sku: v})} />
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
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sub-Category</label>
                   <select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none disabled:opacity-50" value={productData.subCategoryId} onChange={e => setProductData({...productData, subCategoryId: e.target.value})} disabled={!productData.categoryId}>
                      <option value="">Select Sub-Category</option>
                      {subCategories.filter(s => s.categoryId === productData.categoryId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
             <button onClick={handleSaveProduct} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl shadow-xl shadow-primary/20">Save Product</button>
             <button onClick={() => setShowProductForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
             <div className="space-y-2">
                <h2 className="text-3xl font-serif text-white">Catalog</h2>
                <p className="text-slate-400 text-sm">Curate your collection of affiliate products.</p>
             </div>
             <button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3"><Plus size={18} /> Add Product</button>
          </div>
          <div className="grid gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative"><img src={p.media?.[0]?.url} className="w-full h-full object-cover" /></div>
                  <div>
                     <h4 className="text-white font-bold">{p.name}</h4>
                     <span className="text-primary text-xs font-bold">R {p.price}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedAdProduct(p)} className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-slate-900 transition-colors"><Megaphone size={18}/></button>
                  <button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white"><Edit2 size={18}/></button>
                  <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-3 bg-slate-800 text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
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
        <AdminHelpBox title="Hero Carousel" steps={["Use high-res 16:9 images", "Videos auto-play muted", "Text overlays automatically adjust"]} />
        {showHeroForm ? ( 
           <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <SettingField label="Title" value={heroData.title || ''} onChange={v => setHeroData({...heroData, title: v})} />
                 <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</label><select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={heroData.type} onChange={e => setHeroData({...heroData, type: e.target.value as any})}><option value="image">Image</option><option value="video">Video</option></select></div>
              </div>
              <SettingField label="Subtitle" value={heroData.subtitle || ''} onChange={v => setHeroData({...heroData, subtitle: v})} type="textarea" />
              <SettingField label="Button Label" value={heroData.cta || ''} onChange={v => setHeroData({...heroData, cta: v})} />
              <SingleImageUploader label="Media File" value={heroData.image || ''} onChange={v => setHeroData({...heroData, image: v})} />
              <div className="flex gap-4"><button onClick={handleSaveHero} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Slide</button><button onClick={() => setShowHeroForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div>
           </div> 
        ) : ( 
           <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => { setHeroData({ title: '', subtitle: '', cta: 'Explore', image: '', type: 'image' }); setShowHeroForm(true); setEditingId(null); }} className="w-full p-8 border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-primary"><Plus size={48} /><span className="font-black uppercase tracking-widest text-xs">New Slide</span></button>
              {heroSlides.map(s => (
                 <div key={s.id} className="relative aspect-video rounded-[3rem] overflow-hidden group border border-slate-800">
                    {s.type === 'video' ? <video src={s.image} className="w-full h-full object-cover" muted /> : <img src={s.image} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/60 p-10 flex flex-col justify-end text-left">
                       <h4 className="text-white text-xl font-serif">{s.title}</h4>
                       <div className="flex gap-2 mt-4"><button onClick={() => { setHeroData(s); setEditingId(s.id); setShowHeroForm(true); }} className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20"><Edit2 size={16}/></button><button onClick={() => setHeroSlides(heroSlides.filter(x => x.id !== s.id))} className="p-3 bg-white/10 text-white rounded-xl hover:bg-red-500"><Trash2 size={16}/></button></div>
                    </div>
                 </div>
              ))}
           </div> 
        )}
     </div>
  );

  const renderCategories = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
       {showCategoryForm ? (
          <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 space-y-8">
             <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <SettingField label="Department Name" value={catData.name || ''} onChange={v => setCatData({...catData, name: v})} />
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label><IconPicker selected={catData.icon || 'Package'} onSelect={icon => setCatData({...catData, icon})} /></div>
                   <SettingField label="Description" value={catData.description || ''} onChange={v => setCatData({...catData, description: v})} type="textarea" />
                </div>
                <div className="space-y-6">
                   <SingleImageUploader label="Cover Image" value={catData.image || ''} onChange={v => setCatData({...catData, image: v})} className="aspect-[4/3] w-full rounded-2xl" />
                </div>
             </div>
             <div className="flex gap-4 pt-4 border-t border-slate-800"><button onClick={handleSaveCategory} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Dept</button><button onClick={() => setShowCategoryForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div>
          </div>
       ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             <button onClick={() => { setCatData({ name: '', icon: 'Package', description: '', image: '' }); setShowCategoryForm(true); setEditingId(null); }} className="w-full h-40 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-primary"><Plus size={32} /><span className="font-black text-[10px] uppercase tracking-widest">New Dept</span></button>
             {categories.map(c => (
                <div key={c.id} className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 flex flex-col relative group">
                   <div className="h-32 overflow-hidden relative"><img src={c.image} className="w-full h-full object-cover opacity-50" /><div className="absolute inset-0 flex items-center px-8 gap-4"><div className="w-12 h-12 bg-slate-800 text-primary rounded-xl flex items-center justify-center shadow-xl">{React.createElement((LucideIcons as any)[c.icon] || LucideIcons.Package, { size: 20 })}</div><h4 className="font-bold text-white text-lg">{c.name}</h4></div></div>
                   <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setCatData(c); setEditingId(c.id); setShowCategoryForm(true); }} className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md"><Edit2 size={14}/></button><button onClick={() => setCategories(categories.filter(x => x.id !== c.id))} className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md hover:bg-red-500"><Trash2 size={14}/></button></div>
                </div>
             ))}
          </div>
       )}
    </div>
  );

  const renderTeam = () => (
     <div className="space-y-8 max-w-5xl mx-auto text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end mb-8"><div className="text-left"><h2 className="text-3xl font-serif text-white">Team Management</h2><p className="text-slate-400 text-sm mt-2">Sync with Supabase for secure multi-admin access.</p></div><button onClick={() => { setAdminData({ role: 'admin', permissions: [] }); setShowAdminForm(true); setEditingId(null); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest"><Plus size={16}/> New Member</button></div>
        {showAdminForm ? (
           <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-800 space-y-12">
              <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <SettingField label="Full Name" value={adminData.name || ''} onChange={v => setAdminData({...adminData, name: v})} />
                    <SettingField label="Email Identity" value={adminData.email || ''} onChange={v => setAdminData({...adminData, email: v})} />
                    <SettingField label="Password" value={adminData.password || ''} onChange={v => setAdminData({...adminData, password: v})} type="password" />
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Role</label>
                       <select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={adminData.role} onChange={e => setAdminData({...adminData, role: e.target.value as any, permissions: e.target.value === 'owner' ? ['*'] : []})}>
                          <option value="admin">Standard Administrator</option>
                          <option value="owner">System Owner (Root)</option>
                       </select>
                    </div>
                    <PermissionSelector permissions={adminData.permissions || []} onChange={p => setAdminData({...adminData, permissions: p})} role={adminData.role || 'admin'} />
                 </div>
              </div>
              <div className="flex justify-end gap-4 pt-8 border-t border-slate-800">
                <button onClick={() => setShowAdminForm(false)} className="px-8 py-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Cancel</button>
                <button onClick={handleSaveAdmin} disabled={creatingAdmin} className="px-12 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2">
                  {creatingAdmin ? <Loader2 size={16} className="animate-spin"/> : <ShieldCheck size={18}/>}
                  {editingId ? 'Update Privileges' : 'Deploy Member'}
                </button>
              </div>
           </div>
        ) : (
           <div className="grid gap-6">
             {admins.map(a => (
               <div key={a.id} className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-primary/40 group">
                 <div className="flex items-center gap-8 w-full">
                    <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 text-3xl font-bold uppercase border border-slate-700 shadow-inner group-hover:text-primary transition-colors">
                      {a.name?.charAt(0)}
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                          <h4 className="text-white text-xl font-bold">{a.name}</h4>
                          <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${a.role === 'owner' ? 'bg-primary text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                            {a.role}
                          </span>
                       </div>
                       <p className="text-slate-500 text-sm">{a.email}</p>
                    </div>
                 </div>
                 <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => { setAdminData(a); setEditingId(a.id); setShowAdminForm(true); }} className="p-4 bg-slate-800 text-slate-400 rounded-2xl hover:text-white"><Edit2 size={20}/></button>
                    <button onClick={() => setAdmins(prev => prev.filter(x => x.id !== a.id))} className="p-4 bg-slate-800 text-slate-400 hover:text-red-500 rounded-2xl"><Trash2 size={20}/></button>
                 </div>
               </div>
             ))}
           </div>
        )}
     </div>
  );

  const renderSystem = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left pb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Database Status', value: isSupabaseConfigured ? 'Operational' : 'Simulated', icon: Database },
          { label: 'API Latency', value: '42ms', icon: Activity },
          { label: 'Media CDN', value: 'Edge Cached', icon: Globe2 },
          { label: 'Memory Load', value: '12%', icon: Cpu }
        ].map((inf, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between">
             <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-primary"><inf.icon size={20}/></div>
             <div className="mt-6">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{inf.label}</span>
               <span className="text-xl font-bold text-white">{inf.value}</span>
             </div>
          </div>
        ))}
      </div>
      <div className="pt-12 border-t border-slate-800">
         <h3 className="text-white font-serif text-2xl mb-8">System Engineering</h3>
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button onClick={handleBackup} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:bg-slate-800 transition-all group">
               <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-slate-900 transition-colors"><Download size={24}/></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Full Snapshot</span>
            </button>
            <button onClick={() => window.location.reload()} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:bg-slate-800 transition-all group">
               <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors"><RefreshCcw size={24}/></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Reload Core</span>
            </button>
            <div className="lg:col-span-2">
               <button onClick={handleFactoryReset} className="w-full bg-red-950/20 border border-red-500/20 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:bg-red-600 transition-all group">
                  <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-white group-hover:text-red-600 transition-colors"><Flame size={24}/></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">Factory Reset System</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden lg:flex">
        <div className="p-8 border-b border-slate-800">
           <Link to="/" className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-900 font-bold">KC</div>
             <span className="font-serif font-bold text-lg">Portal</span>
           </Link>
        </div>
        <nav className="flex-grow p-6 space-y-2">
           {[
             { id: 'enquiries', icon: Inbox, label: 'Enquiries' },
             { id: 'catalog', icon: ShoppingBag, label: 'Catalog' },
             { id: 'hero', icon: LayoutPanelTop, label: 'Hero Slides' },
             { id: 'categories', icon: Grid, label: 'Departments' },
             { id: 'analytics', icon: BarChart3, label: 'Analytics' },
             { id: 'team', icon: Users, label: 'Team Members' },
             { id: 'system', icon: SettingsIcon, label: 'System' },
             { id: 'guide', icon: BookOpen, label: 'Deployment' }
           ].map(item => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id as any)}
               className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-800'}`}
             >
               <item.icon size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
             </button>
           ))}
        </nav>
        <div className="p-6 border-t border-slate-800 space-y-4">
           <div className="flex items-center gap-3 px-2">
             <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-primary font-bold">{user?.email?.charAt(0).toUpperCase() || 'A'}</div>
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white truncate max-w-[120px]">{user?.email || 'Administrator'}</span>
                <span className="text-[8px] text-slate-500 uppercase font-black">Online</span>
             </div>
           </div>
           <button onClick={handleLogout} className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
             <LogOut size={14}/> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow h-screen overflow-y-auto custom-scrollbar p-6 md:p-12">
         <div className="max-w-7xl mx-auto">
            {activeTab === 'enquiries' && renderEnquiries()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'catalog' && renderCatalog()}
            {activeTab === 'hero' && renderHero()}
            {activeTab === 'categories' && renderCategories()}
            {activeTab === 'team' && renderTeam()}
            {activeTab === 'system' && renderSystem()}
            {activeTab === 'guide' && (
              <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-serif text-white">Digital Infrastructure Blueprint</h2>
                <div className="grid gap-8">
                  {GUIDE_STEPS.map((step) => (
                    <div key={step.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] space-y-6">
                       <h3 className="text-xl font-bold text-primary">{step.title}</h3>
                       <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                       {step.subSteps && (
                         <ul className="space-y-2">
                            {step.subSteps.map((s, i) => <li key={i} className="flex items-start gap-3 text-xs text-slate-500"><div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" /> {s}</li>)}
                         </ul>
                       )}
                       {step.code && <CodeBlock code={step.code} label={step.codeLabel} />}
                       {step.tips && <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-primary text-[10px] italic">💡 Pro Tip: {step.tips}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
         </div>
      </main>

      {/* Modals */}
      {selectedAdProduct && <AdGeneratorModal product={selectedAdProduct} onClose={() => setSelectedAdProduct(null)} />}
      {replyEnquiry && <EmailReplyModal enquiry={replyEnquiry} onClose={() => setReplyEnquiry(null)} />}
    </div>
  );
};

export default Admin;
