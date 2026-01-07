
import React, { useState, useEffect, useRef } from 'react';
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
  Maximize2, Minimize2, CheckSquare, Square, Target
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_SETTINGS, PERMISSION_TREE, INITIAL_ADMINS, INITIAL_ENQUIRIES, GUIDE_STEPS } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, emptyStorageBucket } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
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

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; description?: string }> = ({ icon, title, description }) => (
  <div className="flex items-center gap-4 border-b border-slate-700/50 pb-6 mb-8">
     <div className="w-12 h-12 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
        {icon}
     </div>
     <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {description && <p className="text-slate-400 text-xs mt-1">{description}</p>}
     </div>
  </div>
);

const FieldGroup: React.FC<{ label: string; description?: string; children: React.ReactNode }> = ({ label, description, children }) => (
  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800/50 space-y-4 h-full">
    <div className="flex flex-col">
       <label className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{label}</label>
       {description && <span className="text-[10px] text-slate-500 mt-1">{description}</span>}
    </div>
    {children}
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
const Ghost = LucideIcons.Ghost || LucideIcons.SearchX;

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
  const processFiles = (incomingFiles: FileList | null) => { if (!incomingFiles) return; Array.from(incomingFiles).forEach(file => { const reader = new FileReader(); reader.onload = (e) => { const result = e.target?.result as string; const newMedia: MediaFile = { id: Math.random().toString(36).substr(2, 9), url: result, name: file.name, type: file.type, size: file.size }; onFilesChange(multiple ? [...files, newMedia] : [newMedia]); }; reader.readAsDataURL(file); }); };
  return (
    <div className="space-y-4 text-left">
      <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-slate-900/50"><Upload className="text-slate-600 mb-2" size={32} /><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload {label}</p><input type="file" ref={fileInputRef} className="hidden" multiple={multiple} accept={accept} onChange={e => processFiles(e.target.files)} /></div>
      <div className="flex flex-wrap gap-4">{files.map(f => (<div key={f.id} className="w-24 h-24 rounded-xl overflow-hidden relative group border border-slate-800">{f.type.startsWith('video') ? (<div className="w-full h-full bg-slate-900 flex items-center justify-center text-white"><Video size={24}/></div>) : (<img src={f.url} className="w-full h-full object-cover" />)}<button onClick={() => onFilesChange(files.filter(x => x.id !== f.id))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={16}/></button></div>))}</div>
    </div>
  );
};

const SingleImageUploader: React.FC<{ value: string; onChange: (v: string) => void; label: string; accept?: string; className?: string }> = ({ value, onChange, label, accept = "image/*,video/*", className = "aspect-video w-full" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2 text-left w-full">
       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
       <div onClick={() => inputRef.current?.click()} className={`relative ${className} overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 hover:border-primary/50 transition-all cursor-pointer group`}>{value ? (<><img src={value} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload size={32} className="text-white" /></div></>) : (<div className="w-full h-full flex flex-col items-center justify-center text-slate-500"><ImageIcon size={32} className="mb-2" /><span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Click to upload</span></div>)}<input type="file" className="hidden" ref={inputRef} accept={accept} onChange={e => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => onChange(ev.target?.result as string); reader.readAsDataURL(file); } }} /></div>
    </div>
  );
};

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password' }> = ({ label, value, onChange, type = 'text' }) => (
  <div className="space-y-2 text-left w-full">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
    {type === 'textarea' ? (<textarea rows={4} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light" value={value} onChange={e => onChange(e.target.value)} />) : (<input type={type} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all" value={value} onChange={e => onChange(e.target.value)} />)}
  </div>
);

const Admin: React.FC = () => {
  const { settings, updateSettings, user, isLocalMode } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'system' | 'guide'>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<'brand' | 'nav' | 'home' | 'collections' | 'about' | 'contact' | 'legal' | null>(null);
  const [aboutEditorSection, setAboutEditorSection] = useState<'hero' | 'story' | 'values' | 'visuals'>('hero');
  const [systemSection, setSystemSection] = useState<'data' | 'integrations' | 'reset'>('data');
  const [products, setProducts] = useState<Product[]>(() => JSON.parse(localStorage.getItem('admin_products') || JSON.stringify(INITIAL_PRODUCTS)));
  const [categories, setCategories] = useState<Category[]>(() => JSON.parse(localStorage.getItem('admin_categories') || JSON.stringify(INITIAL_CATEGORIES)));
  const [subCategories, setSubCategories] = useState<SubCategory[]>(() => JSON.parse(localStorage.getItem('admin_subcategories') || JSON.stringify(INITIAL_SUBCATEGORIES)));
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(() => JSON.parse(localStorage.getItem('admin_hero') || JSON.stringify(INITIAL_CAROUSEL)));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => JSON.parse(localStorage.getItem('admin_enquiries') || JSON.stringify(INITIAL_ENQUIRIES)));
  const [admins, setAdmins] = useState<AdminUser[]>(() => JSON.parse(localStorage.getItem('admin_users') || JSON.stringify(INITIAL_ADMINS)));
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState<Partial<AdminUser>>({});
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAdProduct, setSelectedAdProduct] = useState<Product | null>(null);
  const [replyEnquiry, setReplyEnquiry] = useState<Enquiry | null>(null);
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [wipingSupabase, setWipingSupabase] = useState(false);

  useEffect(() => {
    localStorage.setItem('admin_products', JSON.stringify(products));
    localStorage.setItem('admin_categories', JSON.stringify(categories));
    localStorage.setItem('admin_subcategories', JSON.stringify(subCategories));
    localStorage.setItem('admin_hero', JSON.stringify(heroSlides));
    localStorage.setItem('admin_enquiries', JSON.stringify(enquiries));
    localStorage.setItem('admin_users', JSON.stringify(admins));
  }, [products, categories, subCategories, heroSlides, enquiries, admins]);

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };
  const handleFactoryReset = () => { if (window.confirm("⚠️ DANGER: Factory Reset?")) { localStorage.clear(); window.location.reload(); } };
  const handleSupabaseWipe = async () => { if (window.confirm("DANGER: Wipe cloud storage?")) { setWipingSupabase(true); try { await emptyStorageBucket('media'); localStorage.clear(); await supabase.auth.signOut(); window.location.reload(); } catch (err) {} finally { setWipingSupabase(false); } } };
  const handleBackup = () => { const data = { products, categories, subCategories, heroSlides, enquiries, admins, settings }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup.json`; a.click(); };
  const toggleEnquiryStatus = (id: string) => setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'read' ? 'unread' : 'read' } : e));
  const deleteEnquiry = (id: string) => setEnquiries(prev => prev.filter(e => e.id !== id));
  const addSocialLink = () => updateSettings({ socialLinks: [...(settings.socialLinks || []), { id: Date.now().toString(), name: 'Platform', url: 'https://', iconUrl: '' }] });
  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => updateSettings({ socialLinks: (settings.socialLinks || []).map(link => link.id === id ? { ...link, [field]: value } : link) });
  const removeSocialLink = (id: string) => updateSettings({ socialLinks: (settings.socialLinks || []).filter(link => link.id !== id) });
  const handleSaveProduct = () => { if (editingId) setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...productData } as Product : p)); else setProducts(prev => [{ ...productData, id: Date.now().toString(), createdAt: Date.now() } as Product, ...prev]); setShowProductForm(false); setEditingId(null); };
  const handleSaveCategory = () => { if (editingId) setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...catData } as Category : c)); else setCategories(prev => [...prev, { ...catData, id: Date.now().toString() } as Category]); setShowCategoryForm(false); setEditingId(null); };
  const handleAddSubCategory = () => { if (!newSubCategoryName.trim()) return; setSubCategories(prev => [...prev, { id: Date.now().toString(), categoryId: catData.id || editingId || 'temp', name: newSubCategoryName }]); setNewSubCategoryName(''); };
  const handleSaveHero = () => { if (editingId) setHeroSlides(prev => prev.map(h => h.id === editingId ? { ...h, ...heroData } as CarouselSlide : h)); else setHeroSlides(prev => [...prev, { ...heroData, id: Date.now().toString() } as CarouselSlide]); setShowHeroForm(false); setEditingId(null); };
  const handleSaveAdmin = () => { if (editingId) setAdmins(prev => prev.map(a => a.id === editingId ? { ...a, ...adminData } as AdminUser : a)); else setAdmins(prev => [...prev, { ...adminData, id: Date.now().toString(), createdAt: Date.now() } as AdminUser]); setShowAdminForm(false); setEditingId(null); };

  const renderTeam = () => (
     <div className="space-y-8 max-w-4xl mx-auto text-left">
        <div className="flex justify-between items-end mb-8"><div className="text-left"><h2 className="text-3xl font-serif text-white">Team Management</h2><p className="text-slate-400 text-sm mt-2">Manage access privileges.</p></div><button onClick={() => { setAdminData({}); setShowAdminForm(true); setEditingId(null); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest"><Plus size={16}/> New Member</button></div>
        {showAdminForm ? (
           <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 space-y-8">
              <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-6"><SettingField label="Full Name" value={adminData.name || ''} onChange={v => setAdminData({...adminData, name: v})} /><SettingField label="Email" value={adminData.email || ''} onChange={v => setAdminData({...adminData, email: v})} /><SettingField label="Password" value={adminData.password || ''} onChange={v => setAdminData({...adminData, password: v})} type="password" /></div>
                 <div className="space-y-6"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Permissions</label><PermissionSelector permissions={adminData.permissions || []} onChange={p => setAdminData({...adminData, permissions: p})} role={adminData.role || 'admin'} /></div>
              </div>
              <div className="flex justify-end gap-4"><button onClick={() => setShowAdminForm(false)} className="px-8 py-4 text-slate-400">Cancel</button><button onClick={handleSaveAdmin} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Save Access</button></div>
           </div>
        ) : (
           <div className="grid gap-4">{admins.map(a => (<div key={a.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between"><div className="flex items-center gap-6"><div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 text-xl font-bold uppercase">{a.name?.charAt(0)}</div><div><h4 className="text-white font-bold">{a.name}</h4><span className="text-slate-500 text-sm">{a.email}</span></div></div><div className="flex gap-2"><button onClick={() => { setAdminData(a); setEditingId(a.id); setShowAdminForm(true); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl"><Edit2 size={16}/></button><button onClick={() => setAdmins(prev => prev.filter(x => x.id !== a.id))} className="p-3 bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl"><Trash2 size={16}/></button></div></div>))}</div>
        )}
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 pb-20">
      {selectedAdProduct && <AdGeneratorModal product={selectedAdProduct} onClose={() => setSelectedAdProduct(null)} />}
      {replyEnquiry && <EmailReplyModal enquiry={replyEnquiry} onClose={() => setReplyEnquiry(null)} />}

      <header className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
        <div className="flex flex-col gap-6"><div className="flex items-center gap-4"><h1 className="text-4xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1><div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em]">{isLocalMode ? 'LOCAL MODE' : (user?.email?.split('@')[0] || 'ADMIN')}</div></div></div>
        <div className="flex flex-col md:flex-row gap-4"><div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            {[ { id: 'enquiries', label: 'Enquiries', icon: Inbox }, { id: 'catalog', label: 'Catalog', icon: ShoppingBag }, { id: 'hero', label: 'Hero', icon: LayoutPanelTop }, { id: 'categories', label: 'Depts', icon: Layout }, { id: 'site_editor', label: 'Editor', icon: Palette }, { id: 'team', label: 'Team', icon: Users }, { id: 'system', label: 'System', icon: Database }, { id: 'guide', label: 'Launch', icon: Rocket } ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-slate-900' : 'text-slate-500 hover:text-slate-300'}`}><div className="flex items-center gap-2"><tab.icon size={12} />{tab.label}</div></button>
            ))}
          </div><button onClick={handleLogout} className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all w-fit"><LogOut size={14} /> {isLocalMode ? 'Exit' : 'Logout'}</button></div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        {activeTab === 'guide' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-5xl mx-auto text-left">
                <div className="bg-gradient-to-br from-primary/20 to-transparent p-12 rounded-[3rem] border border-primary/20 relative overflow-hidden">
                  <Rocket className="absolute -bottom-10 -right-10 text-primary/10 w-64 h-64" />
                  <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Zero to <span className="text-primary italic font-light">Hero</span></h2>
                  <p className="text-slate-400 text-lg font-light max-w-2xl leading-relaxed">The comprehensive manual for taking your affiliate portal live.</p>
                </div>
                <div className="grid gap-16">
                  {GUIDE_STEPS.map((step, idx) => (
                    <div key={step.id} className="relative pl-10 md:pl-16 border-l-2 border-slate-800">
                      <div className="absolute -left-[21px] md:-left-[25px] top-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center text-primary font-bold shadow-lg text-lg">{idx + 1}</div>
                      <div className="mb-8"><h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{step.title}</h3><p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-3xl">{step.description}</p></div>
                      {step.subSteps && (<div className="grid md:grid-cols-2 gap-4 mb-8">{step.subSteps.map((sub, i) => (<div key={i} className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-800"><CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" /><span className="text-slate-300 text-sm">{sub}</span></div>))}</div>)}
                      {step.code && (<CodeBlock code={step.code} label={step.codeLabel} />)}
                      {step.tips && (<div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-start gap-4 text-primary/80 text-sm"><Info size={20} className="mt-0.5 flex-shrink-0" />{step.tips}</div>)}
                    </div>
                  ))}
                </div>
              </div>
        )}
        
        {/* ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {enquiries.map(e => (<div key={e.id} className={`bg-slate-900 border transition-all rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 text-left ${e.status === 'unread' ? 'border-primary/30' : 'border-slate-800'}`}><div className="flex-grow space-y-2"><div className="flex items-center gap-3"><h4 className="text-white font-bold">{e.name}</h4><span className="text-[9px] font-black text-slate-500 uppercase">{new Date(e.createdAt).toLocaleDateString()}</span></div><p className="text-primary text-sm font-bold">{e.email}</p><p className="text-slate-400 text-sm italic">"{e.message}"</p></div><div className="flex gap-2"><button onClick={() => setReplyEnquiry(e)} className="p-4 bg-primary/20 text-primary rounded-2xl"><Reply size={20}/></button><button onClick={() => toggleEnquiryStatus(e.id)} className="p-4 bg-slate-800 text-slate-500 rounded-2xl"><CheckCircle size={20}/></button><button onClick={() => deleteEnquiry(e.id)} className="p-4 bg-slate-800 text-slate-500 rounded-2xl"><Trash2 size={20}/></button></div></div>))}
           </div>
        )}

        {/* CATALOG TAB */}
        {activeTab === 'catalog' && (
           <div className="space-y-6 text-left">
              {showProductForm ? (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-6"><div className="grid md:grid-cols-2 gap-6"><SettingField label="Product Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} /><SettingField label="Price" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" /></div><SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} /><SettingField label="Description" value={productData.description || ''} onChange={v => setProductData({...productData, description: v})} type="textarea" /><FileUploader files={productData.media || []} onFilesChange={f => setProductData({...productData, media: f})} /><button onClick={handleSaveProduct} className="w-full py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Piece</button><button onClick={() => setShowProductForm(false)} className="w-full py-3 text-slate-500">Cancel</button></div>
              ) : (
                <div className="grid gap-4"><button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="w-full p-8 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex items-center justify-center gap-4 text-slate-500 hover:text-primary"><Plus size={24} /> Add New Entry</button>{products.map(p => (<div key={p.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between"><div className="flex items-center gap-6"><div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800"><img src={p.media?.[0]?.url} className="w-full h-full object-cover" /></div><div><h4 className="text-white font-bold">{p.name}</h4><span className="text-primary text-xs font-bold">R {p.price}</span></div></div><div className="flex gap-2"><button onClick={() => setSelectedAdProduct(p)} className="p-3 bg-primary/10 text-primary rounded-xl"><Megaphone size={18}/></button><button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl"><Edit2 size={18}/></button><button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-3 bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl"><Trash2 size={18}/></button></div></div>))}</div>
              )}
           </div>
        )}

        {/* Other tabs simplified for space, keeping core logic */}
        {activeTab === 'hero' && ( <div className="space-y-6 text-left">{showHeroForm ? ( <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 space-y-6"><SettingField label="Title" value={heroData.title || ''} onChange={v => setHeroData({...heroData, title: v})} /><SettingField label="Subtitle" value={heroData.subtitle || ''} onChange={v => setHeroData({...heroData, subtitle: v})} type="textarea" /><SingleImageUploader label="Media" value={heroData.image || ''} onChange={v => setHeroData({...heroData, image: v})} /><button onClick={handleSaveHero} className="w-full py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Slide</button></div> ) : ( <div className="grid md:grid-cols-2 gap-6">{heroSlides.map(s => (<div key={s.id} className="relative aspect-video rounded-[3rem] overflow-hidden group"><img src={s.image} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/60 p-10 flex flex-col justify-end"><h4 className="text-white text-xl">{s.title}</h4><div className="flex gap-2 mt-4"><button onClick={() => { setHeroData(s); setEditingId(s.id); setShowHeroForm(true); }} className="p-3 bg-white/10 text-white rounded-xl"><Edit2 size={16}/></button></div></div></div>))}</div> )}</div> )}
        
        {activeTab === 'site_editor' && ( <div className="grid md:grid-cols-3 gap-6">{[ {id: 'brand', label: 'Identity'}, {id: 'nav', label: 'Navigation'}, {id: 'home', label: 'Home'}, {id: 'collections', label: 'Collections'}, {id: 'about', label: 'About'}, {id: 'contact', label: 'Contact'} ].map(s => ( <button key={s.id} onClick={() => { setActiveEditorSection(s.id as any); setEditorDrawerOpen(true); }} className="bg-slate-900 p-10 rounded-[2.5rem] text-left border border-slate-800 hover:border-primary/50 transition-all"><h3 className="text-white font-bold text-xl">{s.label}</h3><span className="text-primary text-[10px] font-black uppercase mt-4 block">Edit Section</span></button> ))}</div> )}
        
        {activeTab === 'team' && renderTeam()}
        {activeTab === 'system' && ( <div className="grid md:grid-cols-2 gap-6"><div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-left space-y-4"><h3 className="text-white font-bold">Data Management</h3><div className="flex gap-4"><button onClick={handleBackup} className="px-6 py-3 bg-slate-800 text-white rounded-xl text-xs uppercase font-black">Export Backup</button></div></div><div className="bg-red-950/20 p-8 rounded-[2rem] border border-red-500/20 text-left space-y-4"><h3 className="text-white font-bold">Danger Zone</h3><button onClick={handleFactoryReset} className="px-6 py-3 bg-red-600 text-white rounded-xl text-xs uppercase font-black">Factory Reset</button></div></div> )}
      </main>

      {/* Simplified Site Editor Drawer */}
      {editorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-950 h-full overflow-y-auto border-l border-slate-800 p-8 text-left space-y-8">
            <div className="flex justify-between items-center"><h3 className="text-2xl font-bold text-white uppercase">Editing {activeEditorSection}</h3><button onClick={() => setEditorDrawerOpen(false)} className="p-2 text-slate-500"><X/></button></div>
            {activeEditorSection === 'brand' && (<div className="space-y-6"><SettingField label="Brand Name" value={settings.companyName} onChange={v => updateSettings({companyName: v})} /><SettingField label="Slogan" value={settings.slogan || ''} onChange={v => updateSettings({slogan: v})} /><SettingField label="Primary Color" value={settings.primaryColor} onChange={v => updateSettings({primaryColor: v})} type="color" /></div>)}
            {activeEditorSection === 'home' && (<div className="space-y-6"><SettingField label="About Title" value={settings.homeAboutTitle} onChange={v => updateSettings({homeAboutTitle: v})} /><SettingField label="About Text" value={settings.homeAboutDescription} onChange={v => updateSettings({homeAboutDescription: v})} type="textarea" /></div>)}
            <button onClick={() => setEditorDrawerOpen(false)} className="w-full py-4 bg-primary text-slate-900 font-black uppercase tracking-widest rounded-xl">Save & Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
