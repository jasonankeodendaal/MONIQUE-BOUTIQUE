
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

// --- Advanced UI Components ---

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
      // Deselect all
      onChange(permissions.filter(p => !childIds.includes(p)));
    } else {
      // Select all
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
  
  // Combine Custom Icons with Lucide Icons
  const CUSTOM_KEYS = Object.keys(CustomIcons);
  const LUCIDE_KEYS = Object.keys(LucideIcons).filter(key => {
    const val = (LucideIcons as any)[key];
    return /^[A-Z]/.test(key) && typeof val === 'function' && !key.includes('Icon') && !key.includes('Context');
  });

  const ALL_ICONS = [...CUSTOM_KEYS, ...LUCIDE_KEYS];

  // Prioritize Custom Icons in search and default view
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
             
             {/* Header */}
             <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
               <div>
                 <h3 className="text-white font-bold text-lg flex items-center gap-2"><Grid size={18} className="text-primary"/> Icon Library</h3>
                 <p className="text-slate-400 text-xs mt-1">Select from {filtered.length} curated icons</p>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-colors"><X size={20}/></button>
             </div>

             {/* Search */}
             <div className="p-4 bg-slate-900 border-b border-slate-800">
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none text-white focus:border-primary transition-all" 
                    placeholder="Search icons (e.g. 'dress', 'shop', 'user')..." 
                    value={search} 
                    onChange={e => { setSearch(e.target.value); setLimit(100); }} 
                    autoFocus
                  />
                </div>
             </div>

             {/* Grid */}
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
                 <button 
                  onClick={() => setLimit(prev => prev + 100)} 
                  className="w-full mt-6 py-4 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-colors"
                 >
                   Load More Icons
                 </button>
               )}
               {displayed.length === 0 && (
                 <div className="text-center py-20 text-slate-500">
                   <Ghost size={48} className="mx-auto mb-4 opacity-50"/>
                   <p>No icons found for "{search}"</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
// Use a placeholder icon if ghost is missing
const Ghost = LucideIcons.Ghost || LucideIcons.SearchX;


// --- End Advanced UI Components ---

// --- Modals & Complex Logic ---

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
      if (fileLinks.length > 0) {
        finalMessage += `\n\n[Attachments]\n${fileLinks.join('\n')}`;
      }

      await emailjs.send(
        settings.emailJsServiceId,
        settings.emailJsTemplateId,
        {
          to_name: enquiry.name,
          to_email: enquiry.email,
          subject: subject,
          message: finalMessage,
          reply_to: enquiry.email
        },
        settings.emailJsPublicKey
      );

      setSuccess(true);
      setTimeout(onClose, 2000);

    } catch (err: any) {
      console.error(err);
      setError(err.text || err.message || "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
         <div className="bg-white rounded-3xl p-10 text-center animate-in zoom-in">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Email Sent!</h3>
         </div>
       </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-white font-bold flex items-center gap-3">
            <Reply size={20} className="text-primary"/> Reply to {enquiry.name}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={24}/></button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">To</label>
              <input type="text" readOnly value={enquiry.email} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-slate-400 rounded-xl outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Message</label>
              <textarea rows={8} value={message} onChange={e => setMessage(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary resize-none font-light leading-relaxed"></textarea>
            </div>
            
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                 <Paperclip size={12}/> Attachments (Links will be added to body)
               </label>
               <input 
                 type="file" 
                 multiple 
                 onChange={e => e.target.files && setAttachments(Array.from(e.target.files))}
                 className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-primary hover:file:bg-slate-700"
               />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest">Cancel</button>
          <button 
            onClick={handleSend} 
            disabled={sending}
            className="px-8 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
          >
            {sending ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
            Send Email
          </button>
        </div>
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
    {
      name: 'The Minimalist',
      caption: `✨ Exquisite Discovery: ${product.name}\n\nPure elegance refined for your collection. Now available via Kasi Couture.\n\n🏷️ R ${product.price}\n🔗 Shop the look: ${product.affiliateLink}\n\n#KasiCouture #LuxuryLiving #CuratedStyle`
    },
    {
      name: 'The Hype',
      caption: `🔥 MUST HAVE ALERT: ${product.name} 🔥\n\nLevel up your wardrobe with this essential piece. Verified luxury at your fingertips.\n\n💰 Only R ${product.price}\n🚀 Secure yours now: ${product.affiliateLink}\n\nDon't wait. Shop the curation today! #NewArrivals #StreetLuxury #KasiCouture`
    },
    {
      name: 'The Curator',
      caption: `🖤 From The Silhouette Story: ${product.name}\n\nEvery piece has a journey. This curation embodies the heart of Soweto refined for the global stage.\n\n✨ Curated by ${settings.companyName}\n💎 R ${product.price}\n🌐 Explore: ${product.affiliateLink}\n\n#Heritage #BoutiqueCuration #SouthAfricanStyle`
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(templates[selectedTemplate].caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    setSharing(true);
    const text = templates[selectedTemplate].caption;
    
    try {
      const imageUrl = product.media[0]?.url;
      if (imageUrl && navigator.share) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'ad-image.jpg', { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: product.name,
            text: text,
            url: product.affiliateLink,
          });
        } else {
          await navigator.share({
            title: product.name,
            text: text,
            url: product.affiliateLink,
          });
        }
      } else if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: text,
          url: product.affiliateLink,
        });
      } else {
        handleCopy();
      }
    } catch (err) {
      console.log("Share failed", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-slate-950 animate-in fade-in duration-300">
       <div className="w-full md:w-1/2 bg-black/40 border-r border-slate-800 flex flex-col h-full relative">
        <div className="p-8 md:p-10 flex justify-between items-center border-b border-slate-800/50 backdrop-blur-sm z-10">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
            <Sparkles size={14} className="text-primary" /> Live Ad Preview
          </span>
          <button onClick={onClose} className="md:hidden p-2 text-slate-500 hover:text-white transition-colors">
             <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto flex items-center justify-center p-8 bg-slate-900/50">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-w-sm w-full mx-auto transform transition-all duration-700 hover:scale-[1.02]">
            <div className="p-4 flex items-center gap-3 border-b border-slate-50">
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-[10px]">KC</div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-900">kasicouture_official</span>
                <span className="text-[9px] text-slate-400">Sponsored</span>
              </div>
            </div>
            <div className="aspect-square bg-slate-100 overflow-hidden">
               <img src={product.media[0]?.url} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 bg-slate-900 flex justify-between items-center text-white">
               <span className="text-[10px] font-black uppercase tracking-widest">Shop Now</span>
               <ArrowRight size={14} />
            </div>
            <div className="p-5 space-y-3 text-left">
               <div className="flex gap-4">
                  <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
                  <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
                  <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
               </div>
               <p className="text-[11px] text-slate-900 whitespace-pre-wrap leading-relaxed">
                  <span className="font-bold">kasicouture_official</span> {templates[selectedTemplate].caption}
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-slate-950 flex flex-col h-full relative">
        <button 
          onClick={onClose} 
          className="hidden md:block absolute top-10 right-10 p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-20"
        >
          <X size={24} />
        </button>

        <div className="flex-grow overflow-y-auto p-8 md:p-20 custom-scrollbar">
          <div className="max-w-xl mx-auto space-y-12">
            <div className="space-y-4 text-left">
              <h3 className="text-4xl md:text-5xl font-serif text-white">Maison Ad <span className="text-primary italic">Architect</span></h3>
              <p className="text-slate-500 text-sm font-light">Transform your product into social media fire. Select a persona below to generate tailored copy.</p>
            </div>

            <div className="space-y-6 text-left">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                 <User size={12} /> Select Persona
              </label>
              <div className="grid grid-cols-1 gap-3">
                {templates.map((t, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedTemplate(i)}
                    className={`px-8 py-6 rounded-2xl text-left transition-all border group ${
                      selectedTemplate === i 
                        ? 'bg-primary/5 border-primary text-primary' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-black uppercase tracking-widest">{t.name}</span>
                       <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedTemplate === i ? 'border-primary bg-primary text-slate-900' : 'border-slate-700'}`}>
                          {selectedTemplate === i && <Check size={10} strokeWidth={4} />}
                       </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-left">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                 <FileText size={12} /> Generated Copy
              </label>
              <div className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-8 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all shadow-inner">
                {templates[selectedTemplate].caption}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md z-10">
          <div className="max-w-xl mx-auto flex gap-4">
            <button 
              onClick={handleCopy}
              className="flex-grow py-5 bg-white text-slate-900 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              {copied ? <CopyCheck size={18} /> : <Copy size={18} />}
              {copied ? 'Copied to Clipboard' : 'Copy Text'}
            </button>
            <button 
              onClick={handleShare}
              disabled={sharing}
              className="px-10 py-5 bg-primary text-slate-900 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center justify-center disabled:opacity-50"
            >
              {sharing ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; language?: string; label?: string }> = ({ code, language = 'bash', label }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group mb-6">
      {label && <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2"><Terminal size={12}/>{label}</div>}
      <div className="absolute top-8 right-4 z-10">
        <button 
          onClick={copyToClipboard}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/5"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-6 bg-black rounded-2xl text-[10px] md:text-xs font-mono text-slate-400 overflow-x-auto border border-slate-800 leading-relaxed text-left custom-scrollbar shadow-inner">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const FileUploader: React.FC<{
  files: MediaFile[];
  onFilesChange: (files: MediaFile[]) => void;
  multiple?: boolean;
  label?: string;
  accept?: string;
}> = ({ files, onFilesChange, multiple = true, label = "media", accept = "image/*,video/*" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    Array.from(incomingFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newMedia: MediaFile = { id: Math.random().toString(36).substr(2, 9), url: result, name: file.name, type: file.type, size: file.size };
        onFilesChange(multiple ? [...files, newMedia] : [newMedia]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-4 text-left">
      <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-slate-900/50">
        <Upload className="text-slate-600 mb-2" size={32} />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drop {label} or click to upload</p>
        <input type="file" ref={fileInputRef} className="hidden" multiple={multiple} accept={accept} onChange={e => processFiles(e.target.files)} />
      </div>
      <div className="flex flex-wrap gap-4">
        {files.map(f => (
          <div key={f.id} className="w-24 h-24 rounded-xl overflow-hidden relative group border border-slate-800">
            {f.type.startsWith('video') ? (
               <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white relative">
                 <Video size={24}/>
                 <div className="absolute inset-0 bg-black/40"></div>
               </div>
            ) : (
               <img src={f.url} className="w-full h-full object-cover" />
            )}
            <button onClick={() => onFilesChange(files.filter(x => x.id !== f.id))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SingleImageUploader: React.FC<{ value: string; onChange: (v: string) => void; label: string; accept?: string; className?: string }> = ({ value, onChange, label, accept = "image/*,video/*", className = "aspect-video w-full" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2 text-left w-full">
       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
       <div 
        onClick={() => inputRef.current?.click()}
        className={`relative ${className} overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 hover:border-primary/50 transition-all cursor-pointer group`}
       >
          {value ? (
            <>
              {value.startsWith('data:video') ? (
                 <video src={value} className="w-full h-full object-cover" muted />
              ) : (
                 <img src={value} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload size={32} className="text-white" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
               <ImageIcon size={32} className="mb-2" />
               <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Click to upload</span>
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

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password' }> = ({ label, value, onChange, type = 'text' }) => (
  <div className="space-y-2 text-left w-full">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
    {type === 'textarea' ? (
      <textarea rows={4} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light" value={value} onChange={e => onChange(e.target.value)} />
    ) : (
      <input type={type} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all" value={value} onChange={e => onChange(e.target.value)} />
    )}
  </div>
);

const Admin: React.FC = () => {
  const { settings, updateSettings, user, isLocalMode } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'system' | 'guide'>('enquiries');
  
  // Site Editor State
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<'brand' | 'nav' | 'home' | 'collections' | 'about' | 'contact' | 'legal' | null>(null);
  const [aboutEditorSection, setAboutEditorSection] = useState<'hero' | 'story' | 'values' | 'visuals'>('hero');

  const [systemSection, setSystemSection] = useState<'data' | 'integrations' | 'reset'>('data');
  
  const [products, setProducts] = useState<Product[]>(() => JSON.parse(localStorage.getItem('admin_products') || JSON.stringify(INITIAL_PRODUCTS)));
  const [categories, setCategories] = useState<Category[]>(() => JSON.parse(localStorage.getItem('admin_categories') || JSON.stringify(INITIAL_CATEGORIES)));
  const [subCategories, setSubCategories] = useState<SubCategory[]>(() => JSON.parse(localStorage.getItem('admin_subcategories') || JSON.stringify(INITIAL_SUBCATEGORIES)));
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(() => JSON.parse(localStorage.getItem('admin_hero') || JSON.stringify(INITIAL_CAROUSEL)));
  
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem('admin_enquiries');
    if (saved) return JSON.parse(saved);
    return INITIAL_ENQUIRIES; 
  });
  
  const [admins, setAdmins] = useState<AdminUser[]>(() => JSON.parse(localStorage.getItem('admin_users') || JSON.stringify(INITIAL_ADMINS)));
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState<Partial<AdminUser>>({ name: '', email: '', role: 'admin', permissions: [], profileImage: '', phone: '', address: '', password: '' });

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAdProduct, setSelectedAdProduct] = useState<Product | null>(null);
  const [replyEnquiry, setReplyEnquiry] = useState<Enquiry | null>(null);
  
  const [productData, setProductData] = useState<Partial<Product>>({ name: '', sku: '', price: 0, affiliateLink: '', categoryId: '', subCategoryId: '', description: '', media: [], discountRules: [] });
  const [catData, setCatData] = useState<Partial<Category>>({ name: '', icon: 'Package', description: '', image: '' });
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({ title: '', subtitle: '', cta: 'Explore', image: '', type: 'image' });
  
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

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    navigate('/login');
  };

  const handleFactoryReset = () => {
    if (window.confirm("⚠️ DANGER: You are about to perform a Factory Reset. This cannot be undone.")) {
       localStorage.clear();
       window.location.reload();
    }
  };

  const handleSupabaseWipe = async () => {
    if (!isSupabaseConfigured) return alert("Supabase not configured.");
    if (window.confirm("DANGER: Delete all files in 'media' bucket?")) {
      setWipingSupabase(true);
      try {
        await emptyStorageBucket('media');
        localStorage.clear();
        await supabase.auth.signOut();
        alert("Purged.");
        window.location.reload();
      } catch (err: any) {
        alert(err.message);
      } finally {
        setWipingSupabase(false);
      }
    }
  };

  const handleBackup = () => {
    const data = {
      products, categories, subCategories, heroSlides, enquiries, admins, settings,
      timestamp: Date.now()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kasi-couture-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (window.confirm(`Restore data?`)) {
          if(data.products) localStorage.setItem('admin_products', JSON.stringify(data.products));
          if(data.categories) localStorage.setItem('admin_categories', JSON.stringify(data.categories));
          if(data.subCategories) localStorage.setItem('admin_subcategories', JSON.stringify(data.subCategories));
          if(data.heroSlides) localStorage.setItem('admin_hero', JSON.stringify(data.heroSlides));
          if(data.enquiries) localStorage.setItem('admin_enquiries', JSON.stringify(data.enquiries));
          if(data.admins) localStorage.setItem('admin_users', JSON.stringify(data.admins));
          if(data.settings) localStorage.setItem('site_settings', JSON.stringify(data.settings));
          window.location.reload();
        }
      } catch (err) { alert('Failed to restore'); }
    };
    reader.readAsText(file);
  };

  const toggleEnquiryStatus = (id: string) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'read' ? 'unread' : 'read' } : e));
  };
  const deleteEnquiry = (id: string) => setEnquiries(prev => prev.filter(e => e.id !== id));

  const addSocialLink = () => {
    const newLink: SocialLink = { id: Date.now().toString(), name: 'Platform Name', url: 'https://', iconUrl: '' };
    updateSettings({ socialLinks: [...(settings.socialLinks || []), newLink] });
  };
  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    const updated = (settings.socialLinks || []).map(link => link.id === id ? { ...link, [field]: value } : link);
    updateSettings({ socialLinks: updated });
  };
  const removeSocialLink = (id: string) => {
    updateSettings({ socialLinks: (settings.socialLinks || []).filter(link => link.id !== id) });
  };

  const handleSaveProduct = () => {
    if (editingId) setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...productData } as Product : p));
    else setProducts(prev => [{ ...productData, id: Date.now().toString(), createdAt: Date.now() } as Product, ...prev]);
    setShowProductForm(false); setEditingId(null);
  };
  const handleSaveCategory = () => {
    if (editingId) setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...catData } as Category : c));
    else setCategories(prev => [...prev, { ...catData, id: Date.now().toString() } as Category]);
    setShowCategoryForm(false); setEditingId(null);
  };
  const handleAddSubCategory = () => {
    if (!newSubCategoryName.trim()) return;
    const categoryId = catData.id || editingId || Date.now().toString(); 
    if (!catData.id) setCatData({ ...catData, id: categoryId });
    setSubCategories(prev => [...prev, { id: Date.now().toString(), categoryId, name: newSubCategoryName }]);
    setNewSubCategoryName('');
  };
  const handleSaveHero = () => {
    if (editingId) setHeroSlides(prev => prev.map(h => h.id === editingId ? { ...h, ...heroData } as CarouselSlide : h));
    else setHeroSlides(prev => [...prev, { ...heroData, id: Date.now().toString() } as CarouselSlide]);
    setShowHeroForm(false); setEditingId(null);
  };

  const handleSaveAdmin = () => {
    if (!adminData.name || !adminData.email) return alert("Name and Email are required");
    
    if (editingId) {
      setAdmins(prev => prev.map(a => a.id === editingId ? { ...a, ...adminData } as AdminUser : a));
    } else {
      const newAdmin: AdminUser = {
        id: Date.now().toString(),
        name: adminData.name,
        email: adminData.email,
        role: adminData.role || 'admin',
        permissions: adminData.permissions || [],
        createdAt: Date.now(),
        phone: adminData.phone,
        address: adminData.address,
        profileImage: adminData.profileImage,
        password: adminData.password || 'password123'
      };
      setAdmins(prev => [...prev, newAdmin]);
    }
    setShowAdminForm(false);
    setEditingId(null);
  };

  const openEditor = (section: 'brand' | 'nav' | 'home' | 'collections' | 'about' | 'contact' | 'legal') => {
    setActiveEditorSection(section);
    setEditorDrawerOpen(true);
  };

  const renderTeam = () => {
    // ... (rest of the component remains same)
    const handleSendWhatsAppInvite = () => {
        if (!adminData.phone || !adminData.email || !adminData.password) {
            alert("Please enter a Phone number, Email, and Password to generate the invite.");
            return;
        }

        const phone = adminData.phone.replace(/[^0-9]/g, '');
        const siteUrl = window.location.origin + window.location.pathname + '#/login';
        
        const getReadablePermission = (id: string) => {
            for (const group of PERMISSION_TREE) {
                if (group.id === id) return group.label;
                const child = group.children?.find(c => c.id === id);
                if (child) return `${child.label}`;
            }
            return id;
        };

        const permsList = adminData.role === 'owner' 
            ? "👑 Owner (Full System Access)"
            : adminData.permissions?.map(p => `• ${getReadablePermission(p)}`).join('\n') || "• Restricted Access";

        const message = `*Welcome to ${settings.companyName}* 🌟\n\nYou have been granted administrator access.\n\n*Your Credentials:*\n👤 Email: ${adminData.email}\n🔑 Password: ${adminData.password}\n\n*Access Rules:*\n${permsList}\n\n*Login Portal:*\n${siteUrl}\n\nPlease log in and update your profile immediately.`;

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
         <div className="flex justify-between items-end mb-8">
            <div className="text-left">
              <h2 className="text-3xl font-serif text-white">Team Management</h2>
              <p className="text-slate-400 text-sm mt-2">Manage personnel access and security privileges.</p>
            </div>
            {!showAdminForm && (
              <button onClick={() => { setAdminData({ name: '', email: '', role: 'admin', permissions: [], profileImage: '', phone: '', address: '', password: '' }); setShowAdminForm(true); setEditingId(null); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 flex items-center gap-2">
                 <Plus size={16}/> New Member
              </button>
            )}
         </div>

         {showAdminForm ? (
            <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-800 text-left space-y-8 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <h4 className="text-white font-bold border-b border-slate-800 pb-2">Profile & Security</h4>
                      
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="w-24 flex-shrink-0">
                              <SingleImageUploader 
                                  label="Photo" 
                                  value={adminData.profileImage || ''} 
                                  onChange={v => setAdminData({...adminData, profileImage: v})} 
                                  className="aspect-square w-24 rounded-full border-2 border-dashed border-slate-700 bg-slate-800"
                              />
                          </div>
                          <div className="flex-grow w-full space-y-4">
                              <SettingField label="Full Name" value={adminData.name || ''} onChange={v => setAdminData({...adminData, name: v})} />
                              <SettingField label="Email Address" value={adminData.email || ''} onChange={v => setAdminData({...adminData, email: v})} />
                          </div>
                      </div>

                      <SettingField label="Permanent Password" value={adminData.password || ''} onChange={v => setAdminData({...adminData, password: v})} type="password" />
                      
                      <div className="grid grid-cols-2 gap-4">
                          <SettingField label="Phone" value={adminData.phone || ''} onChange={v => setAdminData({...adminData, phone: v})} />
                          <SettingField label="Role Tag" value={adminData.address || ''} onChange={v => setAdminData({...adminData, address: v})} />
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <h4 className="text-white font-bold border-b border-slate-800 pb-2">Permission Matrix</h4>
                      <PermissionSelector 
                        permissions={adminData.permissions || []}
                        onChange={(perms) => setAdminData({...adminData, permissions: perms})}
                        role={adminData.role || 'admin'}
                      />
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex flex-wrap justify-end gap-4">
                   <button onClick={handleSendWhatsAppInvite} className="px-6 py-4 bg-[#25D366] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-green-900/20 transition-all flex items-center gap-2 mr-auto md:mr-0 order-first md:order-none">
                       <MessageCircle size={16} /> WhatsApp Invite
                   </button>
                   <button onClick={() => setShowAdminForm(false)} className="px-8 py-4 rounded-xl text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">Cancel</button>
                   <button onClick={handleSaveAdmin} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                     <CheckCircle size={16} /> Save Access
                   </button>
                </div>
            </div>
         ) : (
            <div className="grid gap-4">
               {admins.map(admin => (
                  <div key={admin.id} className="bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-slate-700 transition-all">
                     <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 font-bold text-xl border border-slate-700 uppercase">
                           {admin.profileImage ? (
                               <img src={admin.profileImage} alt={admin.name} className="w-full h-full object-cover" />
                           ) : (
                               admin.name.charAt(0)
                           )}
                        </div>
                        <div className="text-left">
                           <div className="flex items-center gap-3">
                             <h4 className="text-white font-bold text-lg">{admin.name}</h4>
                             {admin.role === 'owner' && <ShieldCheck size={14} className="text-primary"/>}
                           </div>
                           <span className="text-slate-500 text-sm block">{admin.email}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right hidden md:block mr-4">
                           <span className="block text-[10px] font-black uppercase text-slate-500 tracking-widest">Access Level</span>
                           <span className="text-slate-300 text-xs font-bold">{admin.role === 'owner' ? 'Full Control' : `${admin.permissions?.length || 0} Permissions`}</span>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => { setAdminData(admin); setEditingId(admin.id); setShowAdminForm(true); }} className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"><Edit2 size={16}/></button>
                           {admin.role !== 'owner' && (
                             <button onClick={() => setAdmins(prev => prev.filter(a => a.id !== admin.id))} className="p-3 bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16}/></button>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
       </div>
    );
  };

  const renderSiteEditor = () => (
    <div className="animate-in fade-in duration-500">
       <div className="text-left mb-8">
          <h2 className="text-3xl font-serif text-white">Site Architecture</h2>
          <p className="text-slate-400 text-sm mt-2">Modify the visual structure and content of your bridge page.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 'brand', label: 'Identity & Brand', icon: Globe, desc: 'Logo, Colors, Slogans' },
            { id: 'nav', label: 'Navigation', icon: MapPin, desc: 'Menu Links, Footer' },
            { id: 'home', label: 'Home Page', icon: Layout, desc: 'Hero, Intro, Trust' },
            { id: 'collections', label: 'Collections', icon: ShoppingBag, desc: 'Shop Hero, Images' },
            { id: 'about', label: 'About Page', icon: User, desc: 'History, Mission, Team' },
            { id: 'contact', label: 'Contact Page', icon: Mail, desc: 'Forms, Socials, Info' },
            { id: 'legal', label: 'Legal Text', icon: ShieldCheck, desc: 'Privacy, Terms, Disclosure' },
          ].map(section => (
            <button
              key={section.id}
              onClick={() => openEditor(section.id as any)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-primary/50 p-8 rounded-[2.5rem] text-left transition-all group flex flex-col justify-between h-64"
            >
               <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-slate-900 transition-colors">
                 <section.icon size={28} />
               </div>
               <div>
                 <h3 className="text-white font-bold text-xl mb-2">{section.label}</h3>
                 <p className="text-slate-500 text-sm">{section.desc}</p>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-primary transition-colors">
                  Open Editor <ArrowRight size={12} />
               </div>
            </button>
          ))}
       </div>

       {/* Editor Drawer / Modal */}
       {editorDrawerOpen && (
         <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
           <div className="w-full max-w-2xl bg-slate-950 h-full overflow-y-auto border-l border-slate-800 animate-in slide-in-from-right duration-300 shadow-2xl">
             <div className="sticky top-0 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 p-6 flex justify-between items-center z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Edit2 size={18} className="text-primary"/> 
                  Edit {activeEditorSection?.charAt(0).toUpperCase() + activeEditorSection?.slice(1)}
                </h3>
                <button onClick={() => setEditorDrawerOpen(false)} className="p-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl"><X size={20}/></button>
             </div>
             
             <div className="p-8 pb-32 space-y-10">
               {activeEditorSection === 'brand' && (
                 <>
                   <div className="grid md:grid-cols-2 gap-6">
                     <FieldGroup label="Core Identity">
                        <SettingField label="Brand Name" value={settings.companyName} onChange={v => updateSettings({companyName: v})} />
                        <SettingField label="Slogan / Tagline" value={settings.slogan || ''} onChange={v => updateSettings({slogan: v})} />
                        <SettingField label="Wordmark (Text Logo)" value={settings.companyLogo} onChange={v => updateSettings({companyLogo: v})} />
                     </FieldGroup>
                     <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <SingleImageUploader 
                          label="Primary Logo Mark (PNG)" 
                          value={settings.companyLogoUrl || ''} 
                          onChange={v => updateSettings({companyLogoUrl: v})} 
                          className="aspect-square w-full bg-black/50"
                        />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FieldGroup label="Primary Color"><SettingField label="Hex" value={settings.primaryColor} onChange={v => updateSettings({primaryColor: v})} type="color" /></FieldGroup>
                      <FieldGroup label="Secondary Color"><SettingField label="Hex" value={settings.secondaryColor || '#1E293B'} onChange={v => updateSettings({secondaryColor: v})} type="color" /></FieldGroup>
                      <FieldGroup label="Accent Color"><SettingField label="Hex" value={settings.accentColor || '#F59E0B'} onChange={v => updateSettings({accentColor: v})} type="color" /></FieldGroup>
                   </div>
                 </>
               )}

               {activeEditorSection === 'nav' && (
                  <div className="space-y-6">
                     <FieldGroup label="Menu Labels">
                        <SettingField label="Home" value={settings.navHomeLabel} onChange={v => updateSettings({navHomeLabel: v})} />
                        <SettingField label="Products" value={settings.navProductsLabel} onChange={v => updateSettings({navProductsLabel: v})} />
                        <SettingField label="About" value={settings.navAboutLabel} onChange={v => updateSettings({navAboutLabel: v})} />
                        <SettingField label="Contact" value={settings.navContactLabel} onChange={v => updateSettings({navContactLabel: v})} />
                        <SettingField label="Dashboard" value={settings.navDashboardLabel} onChange={v => updateSettings({navDashboardLabel: v})} />
                     </FieldGroup>
                     <FieldGroup label="Footer">
                        <SettingField label="Description" value={settings.footerDescription} onChange={v => updateSettings({footerDescription: v})} type="textarea" />
                        <SettingField label="Copyright" value={settings.footerCopyrightText} onChange={v => updateSettings({footerCopyrightText: v})} />
                     </FieldGroup>
                  </div>
               )}

               {activeEditorSection === 'home' && (
                  <>
                     <div className="grid md:grid-cols-2 gap-6">
                        <FieldGroup label="Intro Section">
                           <SettingField label="Title" value={settings.homeAboutTitle} onChange={v => updateSettings({homeAboutTitle: v})} />
                           <SettingField label="Button" value={settings.homeAboutCta} onChange={v => updateSettings({homeAboutCta: v})} />
                           <SettingField label="Description" value={settings.homeAboutDescription} onChange={v => updateSettings({homeAboutDescription: v})} type="textarea" />
                        </FieldGroup>
                        <SingleImageUploader label="Intro Image" value={settings.homeAboutImage} onChange={v => updateSettings({homeAboutImage: v})} />
                     </div>
                     <FieldGroup label="Section Titles">
                        <SettingField label="Categories Title" value={settings.homeCategorySectionTitle} onChange={v => updateSettings({homeCategorySectionTitle: v})} />
                        <SettingField label="Trust Title" value={settings.homeTrustSectionTitle} onChange={v => updateSettings({homeTrustSectionTitle: v})} />
                     </FieldGroup>
                     <div className="space-y-4">
                       {[1,2,3].map(i => {
                         const idx = i as 1|2|3;
                         return (
                           <div key={i} className="p-4 border border-slate-800 rounded-xl bg-slate-900">
                             <div className="flex gap-4 mb-4">
                               <div className="w-16">
                                  <IconPicker 
                                    selected={settings[`homeTrustItem${idx}Icon`] || 'ShieldCheck'} 
                                    onSelect={v => updateSettings({ [`homeTrustItem${idx}Icon`]: v })}
                                  />
                               </div>
                               <div className="flex-grow">
                                  <SettingField label={`Trust Item ${i} Title`} value={settings[`homeTrustItem${idx}Title`]} onChange={v => updateSettings({ [`homeTrustItem${idx}Title`]: v })} />
                               </div>
                             </div>
                             <SettingField label="Description" value={settings[`homeTrustItem${idx}Desc`]} onChange={v => updateSettings({ [`homeTrustItem${idx}Desc`]: v })} type="textarea" />
                           </div>
                         )
                       })}
                     </div>
                  </>
               )}
               
               {activeEditorSection === 'collections' && (
                 <>
                   <FieldGroup label="Hero Banner">
                      <SettingField label="Title" value={settings.productsHeroTitle} onChange={v => updateSettings({productsHeroTitle: v})} />
                      <SettingField label="Subtitle" value={settings.productsHeroSubtitle} onChange={v => updateSettings({productsHeroSubtitle: v})} />
                      <SettingField label="Search Placeholder" value={settings.productsSearchPlaceholder} onChange={v => updateSettings({productsSearchPlaceholder: v})} />
                   </FieldGroup>
                   <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                      <label className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-4 block">Carousel Images</label>
                      <FileUploader 
                          files={(settings.productsHeroImages || [settings.productsHeroImage].filter(Boolean)).map(url => ({ id: url, url, name: 'Hero Image', type: 'image/jpeg', size: 0 }))}
                          onFilesChange={(files) => updateSettings({ productsHeroImages: files.map(f => f.url) })}
                          accept="image/*"
                      />
                   </div>
                 </>
               )}

               {activeEditorSection === 'contact' && (
                 <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FieldGroup label="Contact Info">
                         <SettingField label="Email" value={settings.contactEmail} onChange={v => updateSettings({contactEmail: v})} />
                         <SettingField label="Phone" value={settings.contactPhone} onChange={v => updateSettings({contactPhone: v})} />
                         <SettingField label="WhatsApp" value={settings.whatsappNumber} onChange={v => updateSettings({whatsappNumber: v})} />
                         <SettingField label="Address" value={settings.address} onChange={v => updateSettings({address: v})} />
                      </FieldGroup>
                      <FieldGroup label="Hero Text">
                         <SettingField label="Title" value={settings.contactHeroTitle} onChange={v => updateSettings({contactHeroTitle: v})} />
                         <SettingField label="Subtitle" value={settings.contactHeroSubtitle} onChange={v => updateSettings({contactHeroSubtitle: v})} />
                      </FieldGroup>
                    </div>
                    
                    <FieldGroup label="Info Block Labels">
                         <SettingField label="Info Block Title" value={settings.contactInfoTitle || 'Global HQ'} onChange={v => updateSettings({contactInfoTitle: v})} />
                         <SettingField label="Address Label" value={settings.contactAddressLabel || 'Address'} onChange={v => updateSettings({contactAddressLabel: v})} />
                         <SettingField label="Hours Label" value={settings.contactHoursLabel || 'Operating Hours'} onChange={v => updateSettings({contactHoursLabel: v})} />
                    </FieldGroup>

                    <FieldGroup label="Social Links">
                        <div className="space-y-3">
                          {(settings.socialLinks || []).map((link, idx) => (
                             <div key={link.id} className="flex gap-4 p-3 border border-slate-800 rounded-xl bg-slate-900 items-center">
                                <div className="w-10">
                                   <SingleImageUploader value={link.iconUrl} onChange={v => updateSocialLink(link.id, 'iconUrl', v)} label="" className="w-10 h-10"/>
                                </div>
                                <div className="flex-grow space-y-2">
                                   <input className="w-full bg-transparent border-b border-slate-700 text-xs text-white p-1" value={link.name} onChange={e => updateSocialLink(link.id, 'name', e.target.value)} placeholder="Platform Name" />
                                   <input className="w-full bg-transparent border-b border-slate-700 text-xs text-slate-400 p-1" value={link.url} onChange={e => updateSocialLink(link.id, 'url', e.target.value)} placeholder="URL" />
                                </div>
                                <button onClick={() => removeSocialLink(link.id)} className="text-red-500"><Trash2 size={16}/></button>
                             </div>
                          ))}
                          <button onClick={addSocialLink} className="w-full py-3 bg-slate-800 text-slate-400 text-xs font-bold rounded-xl uppercase tracking-widest hover:bg-slate-700">Add Social Profile</button>
                        </div>
                    </FieldGroup>
                 </>
               )}
               
               {activeEditorSection === 'about' && (
                  <>
                     <div className="flex gap-2 mb-4">
                       {['hero', 'story', 'values', 'visuals'].map(t => (
                         <button key={t} onClick={() => setAboutEditorSection(t as any)} className={`px-4 py-2 rounded-lg text-xs font-bold capitalize ${aboutEditorSection === t ? 'bg-primary text-slate-900' : 'bg-slate-800 text-slate-400'}`}>{t}</button>
                       ))}
                     </div>
                     {aboutEditorSection === 'hero' && (
                        <div className="space-y-6">
                           <SettingField label="Title" value={settings.aboutHeroTitle} onChange={v => updateSettings({aboutHeroTitle: v})} />
                           <SettingField label="Subtitle" value={settings.aboutHeroSubtitle} onChange={v => updateSettings({aboutHeroSubtitle: v})} type="textarea" />
                           <SingleImageUploader label="Hero Image" value={settings.aboutMainImage} onChange={v => updateSettings({aboutMainImage: v})} />
                        </div>
                     )}
                     {aboutEditorSection === 'story' && (
                        <div className="space-y-6">
                           <SettingField label="Title" value={settings.aboutHistoryTitle} onChange={v => updateSettings({aboutHistoryTitle: v})} />
                           <SettingField label="Content" value={settings.aboutHistoryBody} onChange={v => updateSettings({aboutHistoryBody: v})} type="textarea" />
                           <div className="w-1/2">
                              <SingleImageUploader label="Signature" value={settings.aboutSignatureImage} onChange={v => updateSettings({aboutSignatureImage: v})} />
                           </div>
                        </div>
                     )}
                     {aboutEditorSection === 'values' && (
                        <div className="space-y-6">
                           {/* Mission Value */}
                           <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Value 1 (Mission)</label>
                              <div className="flex gap-4">
                                <div className="w-20"><IconPicker selected={settings.aboutMissionIcon || 'Target'} onSelect={v => updateSettings({ aboutMissionIcon: v })} /></div>
                                <div className="flex-grow"><SettingField label="Title" value={settings.aboutMissionTitle} onChange={v => updateSettings({aboutMissionTitle: v})} /></div>
                              </div>
                              <SettingField label="Body" value={settings.aboutMissionBody} onChange={v => updateSettings({aboutMissionBody: v})} type="textarea" />
                           </div>

                           {/* Community Value */}
                           <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Value 2 (Community)</label>
                              <div className="flex gap-4">
                                <div className="w-20"><IconPicker selected={settings.aboutCommunityIcon || 'Users'} onSelect={v => updateSettings({ aboutCommunityIcon: v })} /></div>
                                <div className="flex-grow"><SettingField label="Title" value={settings.aboutCommunityTitle} onChange={v => updateSettings({aboutCommunityTitle: v})} /></div>
                              </div>
                              <SettingField label="Body" value={settings.aboutCommunityBody} onChange={v => updateSettings({aboutCommunityBody: v})} type="textarea" />
                           </div>

                           {/* Integrity Value */}
                           <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Value 3 (Integrity)</label>
                              <div className="flex gap-4">
                                <div className="w-20"><IconPicker selected={settings.aboutIntegrityIcon || 'Award'} onSelect={v => updateSettings({ aboutIntegrityIcon: v })} /></div>
                                <div className="flex-grow"><SettingField label="Title" value={settings.aboutIntegrityTitle} onChange={v => updateSettings({aboutIntegrityTitle: v})} /></div>
                              </div>
                              <SettingField label="Body" value={settings.aboutIntegrityBody} onChange={v => updateSettings({aboutIntegrityBody: v})} type="textarea" />
                           </div>
                        </div>
                     )}
                     {aboutEditorSection === 'visuals' && (
                        <FileUploader 
                             label="Gallery Images"
                             files={(settings.aboutGalleryImages || []).map(url => ({ id: url, url, name: 'Gallery Image', type: 'image/jpeg', size: 0 }))}
                             onFilesChange={(files) => updateSettings({ aboutGalleryImages: files.map(f => f.url) })}
                        />
                     )}
                  </>
               )}

               {activeEditorSection === 'legal' && (
                  <div className="space-y-8">
                     <FieldGroup label="Disclosure"><SettingField label="Title" value={settings.disclosureTitle} onChange={v => updateSettings({disclosureTitle: v})} /><SettingField label="Markdown Content" value={settings.disclosureContent} onChange={v => updateSettings({disclosureContent: v})} type="textarea" /></FieldGroup>
                     <FieldGroup label="Privacy"><SettingField label="Title" value={settings.privacyTitle} onChange={v => updateSettings({privacyTitle: v})} /><SettingField label="Markdown Content" value={settings.privacyContent} onChange={v => updateSettings({privacyContent: v})} type="textarea" /></FieldGroup>
                     <FieldGroup label="Terms"><SettingField label="Title" value={settings.termsTitle} onChange={v => updateSettings({termsTitle: v})} /><SettingField label="Markdown Content" value={settings.termsContent} onChange={v => updateSettings({termsContent: v})} type="textarea" /></FieldGroup>
                  </div>
               )}
             </div>
             
             <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-6">
               <button onClick={() => setEditorDrawerOpen(false)} className="w-full py-4 bg-primary text-slate-900 font-black uppercase text-xs tracking-widest rounded-xl hover:brightness-110 shadow-lg">Save & Close</button>
             </div>
           </div>
         </div>
       )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 pb-20">
      {/* ... (Keeping existing Modals) ... */}
      {selectedAdProduct && <AdGeneratorModal product={selectedAdProduct} onClose={() => setSelectedAdProduct(null)} />}
      {replyEnquiry && <EmailReplyModal enquiry={replyEnquiry} onClose={() => setReplyEnquiry(null)} />}

      <header className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
             <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1>
             <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em]">
               {isLocalMode ? 'LOCAL MODE' : (user?.email?.split('@')[0] || 'ADMIN')}
             </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            {[
              { id: 'enquiries', label: 'Enquiries', icon: Inbox },
              { id: 'catalog', label: 'Catalog', icon: ShoppingBag },
              { id: 'hero', label: 'Hero', icon: LayoutPanelTop },
              { id: 'categories', label: 'Depts', icon: Layout },
              { id: 'site_editor', label: 'Site Editor', icon: Palette },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'system', label: 'System', icon: Database },
              { id: 'guide', label: 'Launch Guide', icon: Rocket }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-slate-900' : 'text-slate-500 hover:text-slate-300'}`}>
                <div className="flex items-center gap-2">
                   <tab.icon size={12} />
                   {tab.label}
                </div>
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all w-fit">
            <LogOut size={14} /> {isLocalMode ? 'Exit' : 'Logout'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        {activeTab === 'enquiries' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] text-left">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Enquiries</span>
                    <div className="text-4xl font-serif text-white">{enquiries.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] text-left">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Pending Unread</span>
                    <div className="text-4xl font-serif text-primary">{enquiries.filter(e => e.status === 'unread').length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] text-left relative overflow-hidden group">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Response Rate</span>
                    <div className="text-4xl font-serif text-slate-300">
                      {enquiries.length > 0 ? Math.round(((enquiries.length - enquiries.filter(e => e.status === 'unread').length) / enquiries.length) * 100) : 0}%
                    </div>
                </div>
             </div>
             <div className="grid gap-6">
               {enquiries.map(enquiry => (
                  <div key={enquiry.id} className={`bg-slate-900 border transition-all duration-300 rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 text-left ${enquiry.status === 'unread' ? 'border-primary/30 shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.1)]' : 'border-slate-800'}`}>
                     <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-4 md:w-48">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${enquiry.status === 'unread' ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-500'}`}><User size={24} /></div>
                        <div><h4 className="font-bold text-white text-lg">{enquiry.name}</h4><div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1"><Calendar size={12} />{new Date(enquiry.createdAt).toLocaleDateString()}</div></div>
                     </div>
                     <div className="flex-grow space-y-4">
                        <div className="flex flex-wrap gap-2"><span className="px-4 py-1.5 bg-slate-800 rounded-full text-[10px] font-black text-slate-300 uppercase tracking-widest">{enquiry.subject}</span>{enquiry.status === 'unread' && (<span className="px-4 py-1.5 bg-primary text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">New Transmit</span>)}</div>
                        <div className="flex flex-col gap-3"><div className="flex items-center gap-2 text-primary font-bold"><Mail size={16} /><span className="text-sm break-all">{enquiry.email}</span></div>{enquiry.whatsapp && (<a href={`https://wa.me/${enquiry.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-500 font-bold hover:underline group/wa"><MessageCircle size={16} /><span className="text-sm">{enquiry.whatsapp}</span><ExternalLink size={12} className="opacity-0 group-hover/wa:opacity-100 transition-opacity" /></a>)}</div>
                        <p className="text-slate-400 text-sm font-light leading-relaxed italic border-l-2 border-slate-800 pl-6">"{enquiry.message}"</p>
                     </div>
                     <div className="flex flex-row md:flex-col gap-2 justify-end">
                        <button onClick={() => setReplyEnquiry(enquiry)} className="p-4 bg-primary/20 text-primary hover:bg-primary hover:text-slate-900 rounded-2xl transition-all" title="Reply"><Reply size={20} /></button>
                        <button onClick={() => toggleEnquiryStatus(enquiry.id)} className={`p-4 rounded-2xl transition-all ${enquiry.status === 'read' ? 'bg-slate-800 text-slate-500' : 'bg-slate-700 text-slate-300'}`}><CheckCircle size={20} /></button>
                        <button onClick={() => deleteEnquiry(enquiry.id)} className="p-4 bg-slate-800 text-slate-500 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all"><Trash2 size={20} /></button>
                     </div>
                  </div>
               ))}
             </div>
          </div>
        )}

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AdminHelpBox title="Catalog System" steps={["Add pieces to your curated collections", "Generate social media ads in one click", "Support for multiple images and videos"]} />
              {showProductForm ? (
                <div className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-800 space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <SettingField label="Product Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
                      <SettingField label="SKU / Reference" value={productData.sku || ''} onChange={v => setProductData({...productData, sku: v})} />
                      <SettingField label="Price (ZAR)" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" />
                      <SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} />
                   </div>
                   <div className="grid md:grid-cols-2 gap-8 text-left">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Department</label>
                        <select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value})}>
                          <option value="">Select Dept</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sub-Category</label>
                        <select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none disabled:opacity-50 disabled:cursor-not-allowed" value={productData.subCategoryId} onChange={e => setProductData({...productData, subCategoryId: e.target.value})} disabled={!productData.categoryId}>
                          <option value="">{productData.categoryId ? 'Select Sub-Category' : 'Select Department First'}</option>
                          {subCategories.filter(s => s.categoryId === productData.categoryId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                   </div>
                   <SettingField label="Description" value={productData.description || ''} onChange={v => setProductData({...productData, description: v})} type="textarea" />
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Media Gallery (Images & Videos)</label>
                      <FileUploader files={productData.media || []} multiple={true} onFilesChange={files => setProductData({...productData, media: files})} />
                   </div>
                   <button onClick={handleSaveProduct} className="w-full py-5 bg-primary text-slate-900 font-black uppercase text-xs tracking-widest rounded-xl shadow-xl shadow-primary/20">Save Piece to Collection</button>
                   <button onClick={() => setShowProductForm(false)} className="w-full py-3 text-slate-500 text-xs uppercase font-black">Cancel</button>
                </div>
              ) : (
                <div className="grid gap-4">
                   <button onClick={() => { setProductData({ name: '', price: 0, media: [], categoryId: '', description: '', sku: '', affiliateLink: '', discountRules: [] }); setShowProductForm(true); setEditingId(null); }} className="w-full p-8 border-2 border-dashed border-slate-800 rounded-[2.5rem] text-slate-500 hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-4 uppercase font-black text-xs tracking-widest"><Plus size={24} /> Add New Catalog Entry</button>
                   {products.map(p => (
                      <div key={p.id} className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-center justify-between text-left group hover:border-primary/30 transition-all gap-6">
                        <div className="flex items-center gap-8 w-full">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0"><img src={p.media?.[0]?.url} className="w-full h-full object-cover" /></div>
                          <div className="min-w-0"><h4 className="font-bold text-slate-200 text-lg truncate">{p.name}</h4><div className="flex items-center gap-3"><span className="text-[10px] font-black text-primary uppercase tracking-widest">R {p.price}</span></div></div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto justify-end">
                          <button onClick={() => setSelectedAdProduct(p)} className="p-4 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all" title="Generate Ad"><Megaphone size={18}/></button>
                          <button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-4 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"><Edit2 size={18}/></button>
                          <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-4 bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18}/></button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
           </div>
        )}
        
        {/* Hero Tab */}
        {activeTab === 'hero' && (
           <div className="space-y-10">
              <AdminHelpBox title="Hero Carousel Manager" steps={["Add cinematic slides for the home page", "Support for both images and videos"]} />
              {showHeroForm ? (
                <div className="bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-800 space-y-8">
                   <div className="grid md:grid-cols-2 gap-8 items-end">
                      <SettingField label="Slide Title" value={heroData.title || ''} onChange={v => setHeroData({...heroData, title: v})} />
                      <div className="space-y-2 text-left">
                         <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Media Type</label>
                         <select value={heroData.type} onChange={e => setHeroData({...heroData, type: e.target.value as any})} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none">
                            <option value="image">Still Image</option>
                            <option value="video">Cinematic Video</option>
                         </select>
                      </div>
                   </div>
                   <SettingField label="Subtitle" value={heroData.subtitle || ''} onChange={v => setHeroData({...heroData, subtitle: v})} type="textarea" />
                   <SettingField label="CTA Button Label" value={heroData.cta || ''} onChange={v => setHeroData({...heroData, cta: v})} />
                   <SingleImageUploader label={heroData.type === 'video' ? "Hero Video (MP4)" : "Hero Image (High-Res)"} value={heroData.image || ''} accept={heroData.type === 'video' ? "video/*" : "image/*"} onChange={v => setHeroData({...heroData, image: v})} />
                   <button onClick={handleSaveHero} className="w-full py-5 bg-primary text-slate-900 font-black uppercase text-xs tracking-widest rounded-xl">Save Slide</button>
                   <button onClick={() => setShowHeroForm(false)} className="w-full py-3 text-slate-500 text-xs uppercase font-black">Cancel</button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                   <button onClick={() => { setHeroData({ title: '', subtitle: '', cta: 'Explore', image: '', type: 'image' }); setShowHeroForm(true); setEditingId(null); }} className="w-full p-8 border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-primary transition-all"><Plus size={48} /><span className="font-black text-[10px] uppercase tracking-widest">New Cinematic Slide</span></button>
                   {heroSlides.map(slide => (
                      <div key={slide.id} className="relative aspect-video rounded-[3rem] overflow-hidden group border border-slate-800">
                        {slide.type === 'video' ? (<video src={slide.image} className="w-full h-full object-cover" muted />) : (<img src={slide.image} className="w-full h-full object-cover" />)}
                        <div className="absolute inset-0 bg-black/60 p-10 flex flex-col justify-end text-left">
                           <h4 className="text-white font-serif text-2xl mb-2">{slide.title}</h4>
                           <div className="flex gap-3 mt-4"><button onClick={() => { setHeroData(slide); setEditingId(slide.id); setShowHeroForm(true); }} className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors"><Edit2 size={18}/></button><button onClick={() => setHeroSlides(heroSlides.filter(x => x.id !== slide.id))} className="p-4 bg-white/10 hover:bg-red-500 text-white rounded-2xl transition-colors"><Trash2 size={18}/></button></div>
                        </div>
                      </div>
                   ))}
                </div>
              )}
           </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
           <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-slate-800 pb-8">
                 <div className="text-left">
                   <h2 className="text-3xl font-serif text-white">Collections</h2>
                   <p className="text-slate-400 text-sm mt-2">Manage the main departments and their sub-categories.</p>
                 </div>
                 <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl">
                       <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Categories</span>
                       <span className="text-xl font-bold text-white">{categories.length}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl">
                       <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Sub-Depts</span>
                       <span className="text-xl font-bold text-primary">{subCategories.length}</span>
                    </div>
                 </div>
              </div>

              {showCategoryForm ? (
                <div className="bg-slate-900 p-8 md:p-12 rounded-[3rem] border border-slate-800 space-y-8 shadow-2xl">
                   <div className="flex justify-between items-center pb-4 border-b border-slate-800"><h3 className="text-2xl font-serif text-white">Edit Department</h3><button onClick={() => setShowCategoryForm(false)} className="p-2 text-slate-500 hover:text-white"><X/></button></div>
                   <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <SettingField label="Department Name" value={catData.name || ''} onChange={v => setCatData({...catData, name: v})} />
                        <SettingField label="Description" value={catData.description || ''} onChange={v => setCatData({...catData, description: v})} type="textarea" />
                        <div className="space-y-2 text-left"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label><IconPicker selected={catData.icon || 'Package'} onSelect={icon => setCatData({...catData, icon})} /></div>
                     </div>
                     <div className="space-y-6"><SingleImageUploader label="Department Card Image" value={catData.image || ''} onChange={v => setCatData({...catData, image: v})} className="aspect-[3/4] w-full" /></div>
                   </div>
                   <div className="space-y-4 pt-6 border-t border-slate-800 text-left bg-slate-800/30 p-6 rounded-2xl">
                     <h4 className="font-bold text-white text-sm flex items-center gap-2"><LayoutGrid size={16} className="text-primary"/> Manage Sub-Departments</h4>
                     <div className="flex gap-3"><input type="text" value={newSubCategoryName} onChange={(e) => setNewSubCategoryName(e.target.value)} placeholder="New sub-category name..." className="flex-grow px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs outline-none focus:border-primary placeholder:text-slate-500" onKeyDown={(e) => e.key === 'Enter' && handleAddSubCategory()} /><button onClick={handleAddSubCategory} className="px-6 py-3 bg-primary text-slate-900 rounded-xl hover:brightness-110 transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Plus size={14} /> Add</button></div>
                     <div className="flex flex-wrap gap-2 mt-4">{subCategories.filter(s => s.categoryId === (catData.id || editingId)).map(s => (<div key={s.id} className="pl-3 pr-2 py-1.5 bg-white text-slate-900 rounded-lg flex items-center gap-2 font-bold text-xs shadow-sm">{s.name}<button onClick={() => setSubCategories(prev => prev.filter(x => x.id !== s.id))} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500 transition-colors"><X size={12} /></button></div>))}</div>
                   </div>
                   <div className="grid grid-cols-2 gap-4"><button onClick={() => setShowCategoryForm(false)} className="w-full py-4 bg-slate-800 text-slate-400 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-slate-700 hover:text-white">Cancel</button><button onClick={handleSaveCategory} className="w-full py-4 bg-primary text-slate-900 font-black uppercase text-xs tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-primary/20">Save Department</button></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <button onClick={() => { setCatData({ name: '', icon: 'Package', description: '', image: '' }); setShowCategoryForm(true); setEditingId(null); setNewSubCategoryName(''); }} className="w-full h-80 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-primary hover:border-primary/50 transition-all bg-slate-900/20"><div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center"><Plus size={32} /></div><span className="font-black text-[10px] uppercase tracking-widest">Create New Dept</span></button>
                   {categories.map(c => {
                      const subs = subCategories.filter(s => s.categoryId === c.id);
                      const IconComp = CustomIcons[c.icon] || (LucideIcons as any)[c.icon] || LucideIcons.Package;
                      return (
                        <div key={c.id} className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 flex flex-col group hover:border-primary/40 transition-all shadow-xl relative h-80">
                           <div className="absolute inset-0">
                              <img src={c.image} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                           </div>
                           
                           <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                 <div className="w-12 h-12 bg-white/10 backdrop-blur-md text-primary rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                                    <IconComp size={24} />
                                 </div>
                                 <div className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-slate-800">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{subs.length} Sub-cats</span>
                                 </div>
                              </div>

                              <div>
                                 <h4 className="font-bold text-white text-2xl mb-2">{c.name}</h4>
                                 <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                                    <button onClick={() => { setCatData(c); setEditingId(c.id); setShowCategoryForm(true); setNewSubCategoryName(''); }} className="flex-1 py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200">Edit</button>
                                    <button onClick={() => setCategories(categories.filter(x => x.id !== c.id))} className="px-4 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                      );
                   })}
                </div>
              )}
           </div>
        )}

        {/* --- SITE EDITOR TAB --- */}
        {activeTab === 'site_editor' && renderSiteEditor()}
        
        {/* --- TEAM TAB --- */}
        {activeTab === 'team' && renderTeam()}

        {activeTab === 'guide' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-5xl mx-auto text-left">
                <div className="bg-gradient-to-br from-primary/20 to-transparent p-12 rounded-[3rem] border border-primary/20 relative overflow-hidden">
                  <Rocket className="absolute -bottom-10 -right-10 text-primary/10 w-64 h-64" />
                  <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Zero to <span className="text-primary italic font-light">Hero</span></h2>
                  <p className="text-slate-400 text-lg font-light max-w-2xl leading-relaxed">
                    The comprehensive technical manual for deploying the system to a production environment.
                  </p>
                </div>
                <div className="grid gap-16">
                  {GUIDE_STEPS.map((step, idx) => (
                    <div key={step.id} className="relative pl-10 md:pl-16 border-l-2 border-slate-800">
                      <div className="absolute -left-[21px] md:-left-[25px] top-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center text-primary font-bold shadow-lg text-lg">
                          {idx + 1}
                      </div>
                      <div className="mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-3xl">{step.description}</p>
                      </div>
                      {step.subSteps && (
                          <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {step.subSteps.map((sub, i) => (
                              <div key={i} className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-800">
                                <CheckCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-slate-300 text-sm">{sub}</span>
                              </div>
                            ))}
                          </div>
                      )}
                      {step.code && (
                        <CodeBlock code={step.code} label={step.codeLabel} />
                      )}
                      {step.tips && (
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-start gap-4 text-primary/80 text-sm">
                          <Info size={20} className="mt-0.5 flex-shrink-0" />
                          {step.tips}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
        )}

        {/* --- SYSTEM TAB --- */}
        {activeTab === 'system' && (
           <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex gap-4 mb-6">
                 {[
                   { id: 'data', label: 'Data Management', icon: Database },
                   { id: 'integrations', label: 'Integrations', icon: Terminal },
                   { id: 'reset', label: 'Danger Zone', icon: AlertOctagon }
                 ].map(s => (
                   <button 
                     key={s.id}
                     onClick={() => setSystemSection(s.id as any)}
                     className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border transition-all ${
                       systemSection === s.id ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'
                     }`}
                   >
                     <s.icon size={14} /> {s.label}
                   </button>
                 ))}
              </div>

              {systemSection === 'data' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col justify-between space-y-6">
                     <div className="space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                          <Download size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Export Backup</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          Download a JSON file containing all your products, categories, leads, settings, and team configurations.
                        </p>
                     </div>
                     <button onClick={handleBackup} className="w-full py-4 bg-primary text-slate-900 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                       <FileJson size={16} /> Download Snapshot
                     </button>
                  </div>
          
                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col justify-between space-y-6">
                     <div className="space-y-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                          <UploadCloud size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Restore Data</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          Upload a previously exported backup file to restore your site. <span className="text-red-400">Warning: This will overwrite current data.</span>
                        </p>
                     </div>
                     <div className="relative">
                       <input type="file" accept=".json" onChange={handleRestore} className="absolute inset-0 opacity-0 cursor-pointer" />
                       <button className="w-full py-4 bg-slate-800 text-slate-300 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-3 border border-slate-700 hover:border-slate-500">
                         <Upload size={16} /> Select Backup File
                       </button>
                     </div>
                  </div>
          
                  <div className="p-8 bg-slate-900 border border-red-500/20 rounded-[2.5rem] flex flex-col justify-between space-y-6">
                     <div className="space-y-4">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                          <AlertOctagon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Wipe Supabase</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          Delete all files in the Supabase 'media' bucket and clear local state. Use this to fully reset cloud storage.
                        </p>
                     </div>
                     <button 
                       onClick={handleSupabaseWipe} 
                       disabled={wipingSupabase}
                       className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase text-xs tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                       {wipingSupabase ? <Loader2 size={16} className="animate-spin"/> : <Trash size={16} />}
                       Delete Cloud Data
                     </button>
                  </div>
                </div>
              )}

              {systemSection === 'integrations' && (
                 <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] space-y-6 text-left">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center">
                         <Mail size={20} />
                       </div>
                       <h4 className="text-white font-bold text-xl">Email.js Configuration</h4>
                    </div>
                    <p className="text-slate-400 text-sm max-w-2xl mb-6">
                       Enable direct replies from your Enquiry dashboard. Connect your Email.js account to send transactional emails without a backend server.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                       <SettingField label="Service ID" value={settings.emailJsServiceId || ''} onChange={v => updateSettings({emailJsServiceId: v})} />
                       <SettingField label="Template ID" value={settings.emailJsTemplateId || ''} onChange={v => updateSettings({emailJsTemplateId: v})} />
                       <SettingField label="Public Key" value={settings.emailJsPublicKey || ''} onChange={v => updateSettings({emailJsPublicKey: v})} />
                    </div>
                 </div>
              )}

              {systemSection === 'reset' && (
                 <div className="bg-red-950/20 border border-red-500/20 p-10 rounded-[2.5rem] space-y-8 text-left">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                          <Flame size={24} />
                       </div>
                       <div>
                          <h3 className="text-2xl font-bold text-white">Factory Reset</h3>
                          <p className="text-red-400 text-xs font-black uppercase tracking-widest">Irreversible Action</p>
                       </div>
                    </div>
                    <p className="text-slate-400 text-sm max-w-2xl">
                       This will clear your local database (LocalStorage), reset branding to the default template, and remove all uploaded product pointers. 
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                       <button onClick={handleFactoryReset} className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-red-500 transition-all flex items-center justify-center gap-3">
                          <RefreshCcw size={16} /> Execute Global Purge
                       </button>
                    </div>
                 </div>
              )}
           </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
