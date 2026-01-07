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
  BarChart, ZapOff, Activity as ActivityIcon, Code, Map
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_SETTINGS, PERMISSION_TREE, INITIAL_ADMINS, INITIAL_ENQUIRIES, GUIDE_STEPS } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia } from '../lib/supabase';
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

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password'; placeholder?: string }> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div className="space-y-2 text-left w-full">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
    {type === 'textarea' ? (
      <textarea rows={4} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : (
      <input type={type} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

/**
 * Traffic Area Chart component
 * Replaces the WorldNetworkMap with a more analytical view of traffic origins.
 */
const TrafficAreaChart: React.FC<{ stats?: ProductStats[] }> = ({ stats }) => {
  const regions = [
    { name: 'Gauteng, ZA', traffic: 45, status: 'Peak' },
    { name: 'Western Cape, ZA', traffic: 28, status: 'Optimal' },
    { name: 'London, UK', traffic: 15, status: 'Stable' },
    { name: 'New York, US', traffic: 12, status: 'Rising' },
    { name: 'KwaZulu-Natal, ZA', traffic: 8, status: 'Stable' },
    { name: 'Dubai, UAE', traffic: 5, status: 'Minimal' },
  ];

  const totalViews = useMemo(() => stats?.reduce((acc, s) => acc + s.views, 0) || 0, [stats]);

  return (
    <div className="relative w-full min-h-[400px] bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group p-10">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--primary-color) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(var(--primary-rgb),0.8)]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Geographic Distribution</span>
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Area <span className="text-primary">Traffic</span></h3>
          </div>
          <div className="text-right bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Live Ingress</span>
             <span className="text-xl font-bold text-white flex items-center gap-2">
                <Globe size={16} className="text-primary"/> 100% Verified
             </span>
          </div>
        </div>

        <div className="space-y-8 flex-grow">
          {regions.map((region, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-serif font-bold text-lg italic">0{idx + 1}</span>
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-wide uppercase">{region.name}</h4>
                    <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">{region.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-white font-black text-lg">{region.traffic}%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" 
                  style={{ width: `${region.traffic}%`, transitionDelay: `${idx * 200}ms` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex gap-10">
              <div className="text-left">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Global Weight</span>
                 <span className="text-2xl font-bold text-white">{(totalViews * 0.82).toFixed(0)}</span>
              </div>
              <div className="text-left border-l border-white/5 pl-10">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Local Reach</span>
                 <span className="text-2xl font-bold text-primary">{(totalViews * 0.18).toFixed(0)}</span>
              </div>
           </div>
           <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-3 rounded-full">
              <Activity size={14} className="text-primary animate-pulse"/>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Real-Time Sync Active</span>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Enhanced Guide Illustrations ---
const GuideIllustration: React.FC<{ id?: string }> = ({ id }) => {
  switch (id) {
    case 'forge':
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--primary-color),transparent_70%)]" />
           <div className="relative z-10 flex flex-col items-center">
              <div className="flex gap-4 mb-8">
                 <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-2xl rotate-[-12deg]">
                    <FileCode size={32} />
                 </div>
                 <div className="w-16 h-16 bg-primary text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl rotate-[12deg]">
                    <Terminal size={32} />
                 </div>
              </div>
              <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-primary w-2/3 animate-[shimmer_2s_infinite]" />
              </div>
           </div>
        </div>
      );
    case 'vault':
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden">
           <div className="relative">
              <div className="w-32 h-32 border-4 border-slate-800 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                 <div className="w-2 h-8 bg-primary rounded-full absolute top-2" />
                 <div className="w-8 h-2 bg-primary rounded-full absolute right-2" />
                 <div className="w-2 h-8 bg-primary rounded-full absolute bottom-2" />
                 <div className="w-8 h-2 bg-primary rounded-full absolute left-2" />
              </div>
              <Lock className="w-12 h-12 text-primary absolute inset-0 m-auto" />
           </div>
        </div>
      );
    case 'satellite':
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center">
           <div className="relative">
              <Globe size={64} className="text-slate-800" />
              <div className="absolute top-0 left-0 w-full h-full">
                 <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full animate-bounce" />
                 <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-20 h-20 border-t-2 border-primary/30 rounded-full animate-ping" />
              </div>
           </div>
        </div>
      );
    case 'database':
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center">
           <div className="grid grid-cols-1 gap-3">
              {[0.5, 1, 1.5].map(delay => (
                <div key={delay} className="w-40 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center px-4 gap-4" style={{ animationDelay: `${delay}s` }}>
                   <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                   <div className="flex-grow h-2 bg-slate-800 rounded-full" />
                </div>
              ))}
           </div>
        </div>
      );
    case 'shield':
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center">
           <div className="relative group">
              <Shield className="w-40 h-40 text-primary opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <CheckCircle size={48} className="text-primary animate-[bounce_2s_infinite]" />
              </div>
           </div>
        </div>
      );
    case 'identity':
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center">
           <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-16 h-16 bg-slate-900 border-2 border-slate-800 rounded-full flex items-center justify-center text-primary shadow-2xl">
                   <User size={24} />
                </div>
              ))}
              <div className="w-16 h-16 bg-primary text-slate-900 rounded-full flex items-center justify-center shadow-2xl z-10">
                 <ShieldCheck size={24} />
              </div>
           </div>
        </div>
      );
    case 'mail':
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
           <Send className="text-primary w-24 h-24 animate-[fly_3s_infinite_ease-in-out]" />
        </div>
      );
    case 'beacon':
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
           <div className="w-1 h-32 bg-gradient-to-t from-transparent via-primary to-primary rounded-full relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full blur-xl animate-pulse" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full" />
           </div>
           <div className="flex gap-2 mt-4">
              {[1,2,3,4].map(i => <div key={i} className="w-3 h-1 bg-slate-800 rounded-full" />)}
           </div>
        </div>
      );
    case 'globe':
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center">
           <div className="relative">
              <Globe size={80} className="text-slate-800" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <LinkIcon size={32} className="text-primary" />
              </div>
              <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
           </div>
        </div>
      );
    case 'growth':
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-end p-12">
           <div className="flex items-end gap-3 w-full h-40">
              <div className="flex-1 bg-slate-900 rounded-t-xl h-1/4" />
              <div className="flex-1 bg-slate-900 rounded-t-xl h-2/4" />
              <div className="flex-1 bg-slate-800 rounded-t-xl h-3/4" />
              <div className="flex-1 bg-primary rounded-t-xl h-full animate-[grow_1.5s_ease-out_infinite_alternate]" />
           </div>
           <TrendingUp size={32} className="text-primary mt-6" />
        </div>
      );
    default:
      return (
        <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center">
           <Rocket className="text-slate-800 w-24 h-24" />
        </div>
      );
  }
};

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
            <div className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-8 font-mono text-xs text-slate-300 heart-relaxed whitespace-pre-wrap">{templates[selectedTemplate].caption}</div>
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

// --- Updated File Uploaders ---

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
        // If multiple, append. If single, replace.
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
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide'>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<'brand' | 'nav' | 'home' | 'collections' | 'about' | 'contact' | 'legal' | 'integrations' | null>(null);
  
  // Data States
  const [products, setProducts] = useState<Product[]>(() => JSON.parse(localStorage.getItem('admin_products') || JSON.stringify(INITIAL_PRODUCTS)));
  const [categories, setCategories] = useState<Category[]>(() => JSON.parse(localStorage.getItem('admin_categories') || JSON.stringify(INITIAL_CATEGORIES)));
  const [subCategories, setSubCategories] = useState<SubCategory[]>(() => JSON.parse(localStorage.getItem('admin_subcategories') || JSON.stringify(INITIAL_SUBCATEGORIES)));
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(() => JSON.parse(localStorage.getItem('admin_hero') || JSON.stringify(INITIAL_CAROUSEL)));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => JSON.parse(localStorage.getItem('admin_enquiries') || JSON.stringify(INITIAL_ENQUIRIES)));
  const [admins, setAdmins] = useState<AdminUser[]>(() => JSON.parse(localStorage.getItem('admin_users') || JSON.stringify(INITIAL_ADMINS)));
  const [stats, setStats] = useState<ProductStats[]>(() => JSON.parse(localStorage.getItem('admin_product_stats') || '[]'));
  
  // Form States
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

  // Filters & Search
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // Subcategory Management Local State
  const [tempSubCatName, setTempSubCatName] = useState('');

  // Discount Rule Management Local State
  const [tempDiscountRule, setTempDiscountRule] = useState<Partial<DiscountRule>>({ type: 'percentage', value: 0, description: '' });

  // Simulated Live Traffic State
  const [trafficEvents, setTrafficEvents] = useState<{id: string, text: string, time: string, type: 'view' | 'click' | 'system'}[]>([]);

  useEffect(() => {
    localStorage.setItem('admin_products', JSON.stringify(products));
    localStorage.setItem('admin_categories', JSON.stringify(categories));
    localStorage.setItem('admin_subcategories', JSON.stringify(subCategories));
    localStorage.setItem('admin_hero', JSON.stringify(heroSlides));
    localStorage.setItem('admin_enquiries', JSON.stringify(enquiries));
    localStorage.setItem('admin_users', JSON.stringify(admins));
    localStorage.setItem('admin_product_stats', JSON.stringify(stats));
  }, [products, categories, subCategories, heroSlides, enquiries, admins, stats]);

  // Simulate traffic events
  useEffect(() => {
    if (activeTab === 'system') {
      const interval = setInterval(() => {
        const types: ('view' | 'click' | 'system')[] = ['view', 'click', 'system'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomProduct = products[Math.floor(Math.random() * products.length)]?.name || 'Maison Hub';
        
        const eventText = randomType === 'view' ? `Page View: ${randomProduct}` :
                          randomType === 'click' ? `Affiliate Click: ${randomProduct}` :
                          `System Heartbeat: Database Connected`;

        setTrafficEvents(prev => [{
          id: Date.now().toString(),
          text: eventText,
          time: new Date().toLocaleTimeString(),
          type: randomType
        }, ...prev].slice(0, 10));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab, products]);

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };
  const handleFactoryReset = () => { if (window.confirm("⚠️ DANGER: Factory Reset?")) { localStorage.clear(); window.location.reload(); } };
  const handleBackup = () => { const data = { products, categories, subCategories, heroSlides, enquiries, admins, settings, stats }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup.json`; a.click(); };
  
  // Enquiry Logic
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

  // Social Links Logic
  const addSocialLink = () => updateSettings({ socialLinks: [...(settings.socialLinks || []), { id: Date.now().toString(), name: 'New Link', url: 'https://', iconUrl: '' }] });
  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => updateSettings({ socialLinks: (settings.socialLinks || []).map(link => link.id === id ? { ...link, [field]: value } : link) });
  const removeSocialLink = (id: string) => updateSettings({ socialLinks: (settings.socialLinks || []).filter(link => link.id !== id) });
  
  // Handlers
  const handleSaveProduct = () => { if (editingId) setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...productData } as Product : p)); else setProducts(prev => [{ ...productData, id: Date.now().toString(), createdAt: Date.now() } as Product, ...prev]); setShowProductForm(false); setEditingId(null); };
  const handleSaveCategory = () => { if (editingId) setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...catData } as Category : c)); else setCategories(prev => [...prev, { ...catData, id: Date.now().toString() } as Category]); setShowCategoryForm(false); setEditingId(null); };
  const handleSaveHero = () => { if (editingId) setHeroSlides(prev => prev.map(h => h.id === editingId ? { ...h, ...heroData } as CarouselSlide : h)); else setHeroSlides(prev => [...prev, { ...heroData, id: Date.now().toString() } as CarouselSlide]); setShowHeroForm(false); setEditingId(null); };
  
  const handleSaveAdmin = async () => {
    if (!adminData.email || !adminData.password) return;
    setCreatingAdmin(true);
    try {
      if (!editingId && isSupabaseConfigured) {
        // Create in Supabase Auth if not just a simulation
        const { data, error } = await supabase.auth.signUp({
          email: adminData.email,
          password: adminData.password,
          options: { data: { name: adminData.name, role: adminData.role } }
        });
        if (error) throw error;
      }
      
      if (editingId) {
        setAdmins(prev => prev.map(a => a.id === editingId ? { ...a, ...adminData } as AdminUser : a));
      } else {
        setAdmins(prev => [...prev, { ...adminData, id: Date.now().toString(), createdAt: Date.now() } as AdminUser]);
      }
      setShowAdminForm(false);
      setEditingId(null);
    } catch (err: any) {
      alert(`Error saving member: ${err.message}`);
    } finally {
      setCreatingAdmin(false);
    }
  };

  // Helper for Subcategories
  const handleAddSubCategory = (categoryId: string) => {
    if (!tempSubCatName.trim()) return;
    const newSub: SubCategory = { id: Date.now().toString(), categoryId, name: tempSubCatName };
    setSubCategories(prev => [...prev, newSub]);
    setTempSubCatName('');
  };
  const handleDeleteSubCategory = (id: string) => setSubCategories(prev => prev.filter(s => s.id !== id));

  // Helper for Discount Rules
  const handleAddDiscountRule = () => {
    if (!tempDiscountRule.value || !tempDiscountRule.description) return;
    const newRule: DiscountRule = { id: Date.now().toString(), type: tempDiscountRule.type || 'percentage', value: Number(tempDiscountRule.value), description: tempDiscountRule.description };
    setProductData({ ...productData, discountRules: [...(productData.discountRules || []), newRule] });
    setTempDiscountRule({ type: 'percentage', value: 0, description: '' });
  };
  const handleRemoveDiscountRule = (id: string) => {
    setProductData({ ...productData, discountRules: (productData.discountRules || []).filter(r => r.id !== id) });
  };

  // --- Render Functions for Tabs ---

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
      const pStats = stats.find(s => s.productId === p.id) || { views: 0, clicks: 0, totalViewTime: 0 };
      return { ...p, ...pStats, ctr: pStats.views > 0 ? ((pStats.clicks / pStats.views) * 100).toFixed(1) : 0 };
    }).sort((a, b) => (b.views + b.clicks) - (a.views + a.clicks));

    const totalViews = stats.reduce((acc, s) => acc + s.views, 0);
    const totalClicks = stats.reduce((acc, s) => acc + s.clicks, 0);
    
    // Group by category for chart
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

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
           {/* Top Categories Chart */}
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
                         <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${(c.views / maxCatViews) * 100}%` }}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Summary Info */}
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

        {/* Detailed List */}
        <div className="space-y-6">
           <h3 className="text-white font-bold text-xl px-2">Top Performing Products</h3>
           <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-800/50">
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection Piece</th>
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Impressions</th>
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clicks</th>
                       <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">CTR</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    {sortedProducts.slice(0, 10).map((p, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                         <td className="p-6">
                            <div className="flex items-center gap-4">
                               <img src={p.media?.[0]?.url} className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                               <span className="text-white font-bold text-sm">{p.name}</span>
                            </div>
                         </td>
                         <td className="p-6">
                            <span className="text-slate-500 text-xs">{categories.find(c => c.id === p.categoryId)?.name}</span>
                         </td>
                         <td className="p-6 text-slate-300 font-medium">{p.views.toLocaleString()}</td>
                         <td className="p-6 text-primary font-bold">{p.clicks.toLocaleString()}</td>
                         <td className="p-6">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black">{p.ctr}%</span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
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
                   <select 
                      className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none disabled:opacity-50" 
                      value={productData.subCategoryId} 
                      onChange={e => setProductData({...productData, subCategoryId: e.target.value})}
                      disabled={!productData.categoryId}
                   >
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

          <div className="pt-8 border-t border-slate-800">
             <h4 className="text-white font-bold mb-6 flex items-center gap-2"><Percent size={18} className="text-primary"/> Discount Rules</h4>
             <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex gap-4 items-end">
                   <div className="flex-1"><SettingField label="Description" value={tempDiscountRule.description || ''} onChange={v => setTempDiscountRule({...tempDiscountRule, description: v})} /></div>
                   <div className="w-32"><SettingField label="Value" value={tempDiscountRule.value?.toString() || ''} onChange={v => setTempDiscountRule({...tempDiscountRule, value: Number(v)})} type="number" /></div>
                   <div className="w-32 space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</label>
                      <select className="w-full px-4 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none text-sm" value={tempDiscountRule.type} onChange={e => setTempDiscountRule({...tempDiscountRule, type: e.target.value as any})}><option value="percentage">Percent (%)</option><option value="fixed">Fixed (R)</option></select>
                   </div>
                   <button onClick={handleAddDiscountRule} className="p-4 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button>
                </div>
                <div className="space-y-2">
                   {(productData.discountRules || []).map(rule => (
                      <div key={rule.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                         <span className="text-sm text-slate-300 font-medium">{rule.description}</span>
                         <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-primary">{rule.type === 'percentage' ? `-${rule.value}%` : `-R${rule.value}`}</span>
                            <button onClick={() => handleRemoveDiscountRule(rule.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16}/></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
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

          <div className="flex flex-col md:flex-row gap-4 mb-6">
             <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="text" placeholder="Search by name..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" />
             </div>
             <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select value={productCatFilter} onChange={e => setProductCatFilter(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer">
                   <option value="all">All Departments</option>
                   {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
             </div>
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
                        <span className="text-slate-600 text-[10px] uppercase font-black tracking-widest">• {categories.find(c => c.id === p.categoryId)?.name}</span>
                     </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedAdProduct(p)} className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-slate-900 transition-colors" title="Generate Ad"><Megaphone size={18}/></button>
                  <button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors"><Edit2 size={18}/></button>
                  <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-3 bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
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
                   <h3 className="text-white font-bold text-xl mb-4">Department Details</h3>
                   <SettingField label="Department Name" value={catData.name || ''} onChange={v => setCatData({...catData, name: v})} />
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label><IconPicker selected={catData.icon || 'Package'} onSelect={icon => setCatData({...catData, icon})} /></div>
                   <SettingField label="Description" value={catData.description || ''} onChange={v => setCatData({...catData, description: v})} type="textarea" />
                </div>
                <div className="space-y-6">
                   <SingleImageUploader label="Cover Image" value={catData.image || ''} onChange={v => setCatData({...catData, image: v})} className="aspect-[4/3] w-full rounded-2xl" />
                   
                   {/* Subcategory Manager inside Category Edit */}
                   <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800">
                      <h4 className="text-white font-bold text-sm mb-4">Subcategories</h4>
                      <div className="flex gap-2 mb-4">
                         <input type="text" placeholder="New Subcategory Name" value={tempSubCatName} onChange={e => setTempSubCatName(e.target.value)} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" />
                         <button onClick={() => editingId && handleAddSubCategory(editingId)} className="px-4 bg-slate-700 text-white rounded-xl hover:bg-primary hover:text-slate-900 transition-colors"><Plus size={18}/></button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {editingId && subCategories.filter(s => s.categoryId === editingId).map(s => (
                            <div key={s.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
                               <span className="text-xs text-slate-300">{s.name}</span>
                               <button onClick={() => handleDeleteSubCategory(s.id)} className="text-slate-500 hover:text-red-500"><X size={12}/></button>
                            </div>
                         ))}
                         {editingId && subCategories.filter(s => s.categoryId === editingId).length === 0 && <span className="text-slate-500 text-xs italic">No subcategories defined.</span>}
                      </div>
                   </div>
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
                    <h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4">Personal Details</h3>
                    <SettingField label="Full Name" value={adminData.name || ''} onChange={v => setAdminData({...adminData, name: v})} />
                    <SettingField label="Contact Number" value={adminData.phone || ''} onChange={v => setAdminData({...adminData, phone: v})} />
                    <SettingField label="Primary Address" value={adminData.address || ''} onChange={v => setAdminData({...adminData, address: v})} type="textarea" />
                    
                    <h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4 pt-6">Security Credentials</h3>
                    <SettingField label="Email Identity" value={adminData.email || ''} onChange={v => setAdminData({...adminData, email: v})} />
                    <SettingField label="Password" value={adminData.password || ''} onChange={v => setAdminData({...adminData, password: v})} type="password" />
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4">Access Control</h3>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Role</label>
                       <select 
                        className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" 
                        value={adminData.role} 
                        onChange={e => setAdminData({...adminData, role: e.target.value as any, permissions: e.target.value === 'owner' ? ['*'] : []})}
                       >
                          <option value="admin">Standard Administrator</option>
                          <option value="owner">System Owner (Root)</option>
                       </select>
                    </div>
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-6 block">Detailed Permissions</label>
                    <PermissionSelector permissions={adminData.permissions || []} onChange={p => setAdminData({...adminData, permissions: p})} role={adminData.role || 'admin'} />
                 </div>
              </div>
              <div className="flex justify-end gap-4 pt-8 border-t border-slate-800">
                <button onClick={() => setShowAdminForm(false)} className="px-8 py-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Cancel</button>
                <button 
                  onClick={handleSaveAdmin} 
                  disabled={creatingAdmin}
                  className="px-12 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  {creatingAdmin ? <Loader2 size={16} className="animate-spin"/> : <ShieldCheck size={18}/>}
                  {editingId ? 'Update Privileges' : 'Deploy Member'}
                </button>
              </div>
           </div>
        ) : (
           <div className="grid gap-6">
             {admins.map(a => (
               <div key={a.id} className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-primary/40 transition-all group">
                 <div className="flex items-center gap-8 w-full">
                    <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 text-3xl font-bold uppercase border border-slate-700 shadow-inner group-hover:text-primary transition-colors">
                      {a.profileImage ? <img src={a.profileImage} className="w-full h-full object-cover rounded-3xl"/> : a.name?.charAt(0)}
                    </div>
                    <div className="space-y-2 flex-grow">
                       <div className="flex items-center gap-3">
                          <h4 className="text-white text-xl font-bold">{a.name}</h4>
                          <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${a.role === 'owner' ? 'bg-primary text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                            {a.role}
                          </span>
                       </div>
                       <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-500 text-sm">
                          <span className="flex items-center gap-2"><Mail size={14} className="text-primary"/> {a.email}</span>
                          {a.phone && <span className="flex items-center gap-2"><Phone size={14} className="text-primary"/> {a.phone}</span>}
                       </div>
                       <div className="pt-2 flex flex-wrap gap-2">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Status:</span>
                          <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> Verified</span>
                          <span className="mx-2 text-slate-800">|</span>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Access:</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.role === 'owner' ? 'Full System' : `${a.permissions.length} modules`}</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => { setAdminData(a); setEditingId(a.id); setShowAdminForm(true); }} className="flex-1 md:flex-none p-4 bg-slate-800 text-slate-400 rounded-2xl hover:bg-slate-700 hover:text-white transition-all"><Edit2 size={20}/></button>
                    <button onClick={() => setAdmins(prev => prev.filter(x => x.id !== a.id))} className="flex-1 md:flex-none p-4 bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-500 rounded-2xl transition-all"><Trash2 size={20}/></button>
                 </div>
               </div>
             ))}
           </div>
        )}
     </div>
  );

  const renderSystem = () => {
    // Derived stats for the "Full Showcase"
    const productStats = products.map(p => {
      const s = stats.find(stat => stat.productId === p.id) || { views: 0, clicks: 0, totalViewTime: 0 };
      return { ...p, ...s };
    });

    const mostClicked = [...productStats].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
    const mostViewTime = [...productStats].sort((a, b) => b.totalViewTime - a.totalViewTime).slice(0, 5);
    const totalSessionTime = stats.reduce((acc, s) => acc + (s.totalViewTime || 0), 0);

    return (
     <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
        {/* Traffic Area Chart Section (Replaced Map) */}
        <div className="space-y-6">
           <div className="flex justify-between items-end px-2">
             <div className="space-y-2">
                <h3 className="text-white font-bold text-xl flex items-center gap-3"><Map size={22} className="text-primary"/> Global Interaction Protocol</h3>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-black opacity-60">High-Precision Geographic Analytics</p>
             </div>
           </div>
           
           {/* REPLACED MAP WITH TRAFFIC AREA CHART */}
           <TrafficAreaChart stats={stats} />
        </div>

        {/* System Health Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-green-500' },
             { label: 'Supabase Sync', value: isSupabaseConfigured ? 'Active' : 'Offline', icon: Database, color: isSupabaseConfigured ? 'text-primary' : 'text-slate-600' },
             { label: 'Storage Usage', value: '1.2 GB', icon: UploadCloud, color: 'text-blue-500' },
             { label: 'Total Session Time', value: `${Math.floor(totalSessionTime / 60)}m ${totalSessionTime % 60}s`, icon: Timer, color: 'text-purple-500' }
           ].map((item, i) => (
             <div key={i} className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${item.color}`}><item.icon size={20}/></div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">{item.label}</span>
                  <span className="text-base font-bold text-white">{item.value}</span>
                </div>
             </div>
           ))}
        </div>

        {/* Product Performance Showcase */}
        <div className="grid lg:grid-cols-2 gap-8">
           {/* Most Clicked Showcase */}
           <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={120} className="text-primary"/></div>
              <h3 className="text-white font-bold text-xl mb-10 flex items-center gap-3"><TrendingUp size={22} className="text-primary"/> Engagement Leaders</h3>
              <div className="space-y-6">
                 {mostClicked.map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <span className="text-slate-700 font-serif text-2xl font-bold">0{i+1}</span>
                          <img src={p.media?.[0]?.url} className="w-12 h-12 rounded-xl object-cover bg-slate-800" />
                          <div className="max-w-[150px]">
                            <h4 className="text-white font-bold text-sm truncate">{p.name}</h4>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{categories.find(c => c.id === p.categoryId)?.name}</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-primary font-black text-lg block">{p.clicks} <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Clicks</span></span>
                          <div className="h-1 w-24 bg-slate-800 rounded-full mt-2 overflow-hidden">
                             <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((p.clicks / (mostClicked[0]?.clicks || 1)) * 100, 100)}%` }} />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* View Duration Showcase */}
           <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Timer size={120} className="text-purple-500"/></div>
              <h3 className="text-white font-bold text-xl mb-10 flex items-center gap-3"><Eye size={22} className="text-purple-500"/> Deep Engagement</h3>
              <div className="space-y-6">
                 {mostViewTime.map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <img src={p.media?.[0]?.url} className="w-12 h-12 rounded-xl object-cover bg-slate-800" />
                          <div className="max-w-[150px]">
                            <h4 className="text-white font-bold text-sm truncate">{p.name}</h4>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Retention Tracker</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-white font-black text-lg block">{p.totalViewTime || 0}s <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Stayed</span></span>
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Avg: {p.views > 0 ? (p.totalViewTime / p.views).toFixed(1) : 0}s / view</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Detailed Traffic Logs */}
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <h3 className="text-white font-bold text-xl px-2">Live Traffic Feed</h3>
              <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden divide-y divide-slate-800">
                 {trafficEvents.map(event => (
                   <div key={event.id} className="p-6 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className={`w-2 h-2 rounded-full animate-pulse ${event.type === 'view' ? 'bg-blue-500' : event.type === 'click' ? 'bg-primary' : 'bg-green-500'}`} />
                         <span className="text-slate-300 text-sm font-medium">{event.text}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{event.time}</span>
                   </div>
                 ))}
                 {trafficEvents.length === 0 && <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">Awaiting Global Interaction...</div>}
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-white font-bold text-xl px-2">Data Operations</h3>
              <div className="space-y-4">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 text-left space-y-4">
                   <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2"><Download size={18} className="text-primary"/> Data Snapshot</h3>
                   <p className="text-slate-500 text-xs leading-relaxed">Securely export all catalog items, analytics, and settings to a portable JSON format.</p>
                   <button onClick={handleBackup} className="px-6 py-4 bg-slate-800 text-white rounded-xl text-xs uppercase font-black hover:bg-slate-700 transition-colors w-full flex items-center justify-center gap-2">Backup Master</button>
                </div>
                <div className="bg-red-950/10 p-8 rounded-[2.5rem] border border-red-500/20 text-left space-y-4">
                   <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2"><Flame size={18} className="text-red-500"/> Core Wipe</h3>
                   <p className="text-slate-500 text-xs leading-relaxed">Irreversibly factory reset all local storage data. This action cannot be undone.</p>
                   <button onClick={handleFactoryReset} className="px-6 py-4 bg-red-600 text-white rounded-xl text-xs uppercase font-black hover:bg-red-500 transition-colors w-full flex items-center justify-center gap-2">Execute Reset</button>
                </div>
              </div>
           </div>
        </div>
     </div>
    );
  };

  const renderGuide = () => (
     <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 max-w-6xl mx-auto text-left">
        <div className="bg-gradient-to-br from-primary/30 to-slate-950 p-16 md:p-24 rounded-[4rem] border border-primary/20 relative overflow-hidden shadow-2xl">
          <Rocket className="absolute -bottom-20 -right-20 text-primary/10 w-96 h-96 rotate-12" />
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-primary/30">
               <Zap size={14}/> Implementation Protocol
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-none">The <span className="text-primary italic font-light lowercase">Architecture</span> of Success</h2>
            <p className="text-slate-400 text-xl font-light leading-relaxed">Your comprehensive blueprint for deploying a high-performance luxury affiliate portal from source to global production.</p>
          </div>
        </div>

        <div className="grid gap-32">
          {GUIDE_STEPS.map((step, idx) => (
            <div key={step.id} className="relative grid md:grid-cols-12 gap-12 md:gap-20">
              <div className="md:col-span-1 flex flex-col items-center">
                 <div className="w-16 h-16 rounded-[2rem] bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-primary font-black text-2xl shadow-2xl sticky top-32">{idx + 1}</div>
                 <div className="flex-grow w-0.5 bg-gradient-to-b from-slate-800 to-transparent my-4" />
              </div>

              <div className="md:col-span-7 space-y-10">
                <div className="space-y-4">
                   <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{step.title}</h3>
                   <p className="text-slate-400 text-lg leading-relaxed">{step.description}</p>
                </div>

                {step.subSteps && (
                  <div className="grid gap-4">
                    {step.subSteps.map((sub, i) => (
                      <div key={i} className="flex items-start gap-4 p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 hover:border-primary/30 transition-all group">
                        <CheckCircle size={20} className="text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-slate-300 text-sm md:text-base leading-relaxed">{sub}</span>
                      </div>
                    ))}
                  </div>
                )}

                {step.code && (<CodeBlock code={step.code} label={step.codeLabel} />)}

                {step.tips && (
                  <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 flex items-start gap-6 text-primary/80 text-sm md:text-base leading-relaxed">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary"><Info size={24}/></div>
                    <p>{step.tips}</p>
                  </div>
                )}
              </div>

              <div className="md:col-span-4 sticky top-32 h-fit">
                 <GuideIllustration id={step.illustrationId} />
                 <div className="mt-8 p-6 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed text-center">
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Setup Phase Completion</span>
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${((idx + 1) / GUIDE_STEPS.length) * 100}%` }} />
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 p-16 rounded-[4rem] text-center border border-slate-800 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
           <Rocket className="mx-auto text-primary mb-8" size={64} />
           <h3 className="text-4xl font-serif text-white mb-6">Mission Critical: Complete</h3>
           <p className="text-slate-500 max-w-xl mx-auto text-lg font-light mb-12">Your infrastructure is now primed for global luxury commerce. Begin curating your first collection to initiate the growth phase.</p>
           <button onClick={() => setActiveTab('catalog')} className="px-12 py-6 bg-primary text-slate-900 font-black uppercase text-xs tracking-[0.3em] rounded-full hover:bg-white transition-all shadow-2xl">Initialize Catalog</button>
        </div>
      </div>
  );

  const renderSiteEditor = () => (
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {[
          {id: 'brand', label: 'Identity', icon: Globe, desc: 'Logo, Colors, Slogan'}, 
          {id: 'nav', label: 'Navigation', icon: MapPin, desc: 'Menu Labels, Footer'}, 
          {id: 'home', label: 'Home Page', icon: Layout, desc: 'Hero, About, Trust Strip'}, 
          {id: 'collections', label: 'Collections', icon: ShoppingBag, desc: 'Shop Hero, Search Text'}, 
          {id: 'about', label: 'About Page', icon: User, desc: 'Story, Values, Gallery'}, 
          {id: 'contact', label: 'Contact Page', icon: Mail, desc: 'Info, Form, Socials'},
          {id: 'legal', label: 'Legal Text', icon: Shield, desc: 'Privacy, Terms, Disclosure'},
          {id: 'integrations', label: 'Integrations', icon: LinkIcon, desc: 'EmailJS, Tracking, Webhooks'}
        ].map(s => ( 
          <button key={s.id} onClick={() => { setActiveEditorSection(s.id as any); setEditorDrawerOpen(true); }} className="bg-slate-900 p-8 rounded-[2.5rem] text-left border border-slate-800 hover:border-primary/50 hover:bg-slate-800 transition-all group h-full flex flex-col justify-between">
             <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-primary group-hover:text-slate-900 transition-colors shadow-lg"><s.icon size={24}/></div>
             <div><h3 className="text-white font-bold text-xl mb-1">{s.label}</h3><p className="text-slate-500 text-xs">{s.desc}</p></div>
             <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">Edit Section <ArrowRight size={12}/></div>
          </button> 
        ))}
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 pb-20">
      <style>{`
         @keyframes grow { from { height: 0; } to { height: 100%; } }
         @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
         @keyframes fly { 
           0% { transform: translate(-100px, 100px) rotate(45deg); opacity: 0; } 
           50% { transform: translate(0, 0) rotate(45deg); opacity: 1; } 
           100% { transform: translate(100px, -100px) rotate(45deg); opacity: 0; } 
         }
      `}</style>
      {selectedAdProduct && <AdGeneratorModal product={selectedAdProduct} onClose={() => setSelectedAdProduct(null)} />}
      {replyEnquiry && <EmailReplyModal enquiry={replyEnquiry} onClose={() => setReplyEnquiry(null)} />}

      <header className="max-w-[1400px] mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1>
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em]">{isLocalMode ? 'LOCAL MODE' : (user?.email?.split('@')[0] || 'ADMIN')}</div>
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

      {/* Full Screen Editor Drawer */}
      {editorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-slate-950 h-full overflow-y-auto border-l border-slate-800 p-8 md:p-12 text-left shadow-2xl slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
               <div><h3 className="text-3xl font-serif text-white uppercase">{activeEditorSection}</h3><p className="text-slate-500 text-xs mt-1">Global Site Configuration</p></div>
               <button onClick={() => setEditorDrawerOpen(false)} className="p-3 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X size={24}/></button>
            </div>
            
            <div className="space-y-10 pb-20">
               {activeEditorSection === 'brand' && (
                  <>
                     <div className="space-y-6"><h4 className="text-white font-bold flex items-center gap-2"><Globe size={18} className="text-primary"/> Basic Info</h4><SettingField label="Company Name" value={settings.companyName} onChange={v => updateSettings({companyName: v})} /><SettingField label="Slogan" value={settings.slogan || ''} onChange={v => updateSettings({slogan: v})} /><SettingField label="Logo Text" value={settings.companyLogo} onChange={v => updateSettings({companyLogo: v})} /><SingleImageUploader label="Logo Image (PNG)" value={settings.companyLogoUrl || ''} onChange={v => updateSettings({companyLogoUrl: v})} className="h-32 w-full object-contain bg-slate-800/50" /></div>
                     <div className="space-y-6 border-t border-slate-800 pt-8"><h4 className="text-white font-bold flex items-center gap-2"><Palette size={18} className="text-primary"/> Brand Colors</h4><div className="grid grid-cols-3 gap-4"><SettingField label="Primary" value={settings.primaryColor} onChange={v => updateSettings({primaryColor: v})} type="color" /><SettingField label="Secondary" value={settings.secondaryColor || '#1E293B'} onChange={v => updateSettings({secondaryColor: v})} type="color" /><SettingField label="Accent" value={settings.accentColor || '#F59E0B'} onChange={v => updateSettings({accentColor: v})} type="color" /></div></div>
                  </>
               )}
               
               {activeEditorSection === 'nav' && (
                  <div className="space-y-8">
                     <div className="space-y-6"><h4 className="text-white font-bold">Menu Labels</h4><div className="grid grid-cols-2 gap-4"><SettingField label="Home" value={settings.navHomeLabel} onChange={v => updateSettings({navHomeLabel: v})} /><SettingField label="Products" value={settings.navProductsLabel} onChange={v => updateSettings({navProductsLabel: v})} /><SettingField label="About" value={settings.navAboutLabel} onChange={v => updateSettings({navAboutLabel: v})} /><SettingField label="Contact" value={settings.navContactLabel} onChange={v => updateSettings({navContactLabel: v})} /></div></div>
                     <div className="space-y-6 border-t border-slate-800 pt-8"><h4 className="text-white font-bold">Footer Content</h4><SettingField label="Description" value={settings.footerDescription} onChange={v => updateSettings({footerDescription: v})} type="textarea" /><SettingField label="Copyright" value={settings.footerCopyrightText} onChange={v => updateSettings({footerCopyrightText: v})} /></div>
                  </div>
               )}

               {activeEditorSection === 'home' && (
                  <>
                     <div className="space-y-6"><h4 className="text-white font-bold">About Section</h4><SettingField label="Title" value={settings.homeAboutTitle} onChange={v => updateSettings({homeAboutTitle: v})} /><SettingField label="Body" value={settings.homeAboutDescription} onChange={v => updateSettings({homeAboutDescription: v})} type="textarea" /><SettingField label="Button Text" value={settings.homeAboutCta} onChange={v => updateSettings({homeAboutCta: v})} /><SingleImageUploader label="Featured Image" value={settings.homeAboutImage} onChange={v => updateSettings({homeAboutImage: v})} /></div>
                     <div className="space-y-6 border-t border-slate-800 pt-8"><h4 className="text-white font-bold">Trust Strip</h4><SettingField label="Section Title" value={settings.homeTrustSectionTitle} onChange={v => updateSettings({homeTrustSectionTitle: v})} /><div className="grid gap-6">{[1,2,3].map(i => (<div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3"><span className="text-[10px] font-black uppercase text-slate-500">Item {i}</span><SettingField label="Title" value={(settings as any)[`homeTrustItem${i}Title`]} onChange={v => updateSettings({[`homeTrustItem${i}Title`]: v})} /><SettingField label="Desc" value={(settings as any)[`homeTrustItem${i}Desc`]} onChange={v => updateSettings({[`homeTrustItem${i}Desc`]: v})} type="textarea" /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label><IconPicker selected={(settings as any)[`homeTrustItem${i}Icon`] || 'ShieldCheck'} onSelect={icon => updateSettings({[`homeTrustItem${i}Icon`]: icon})} /></div></div>))}</div></div>
                  </>
               )}
               
               {activeEditorSection === 'collections' && (
                  <div className="space-y-6">
                     <h4 className="text-white font-bold">Page Hero</h4>
                     <SettingField label="Hero Title" value={settings.productsHeroTitle} onChange={v => updateSettings({productsHeroTitle: v})} />
                     <SettingField label="Subtitle" value={settings.productsHeroSubtitle} onChange={v => updateSettings({productsHeroSubtitle: v})} type="textarea" />
                     <SettingField label="Search Placeholder" value={settings.productsSearchPlaceholder} onChange={v => updateSettings({productsSearchPlaceholder: v})} />
                     <div className="space-y-4 pt-4 border-t border-slate-800">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Hero Carousel Images</label>
                        <FileUploader files={(settings.productsHeroImages || []).map(url => ({id: url, url, name: 'hero', type: 'image/jpeg', size: 0}))} onFilesChange={files => updateSettings({productsHeroImages: files.map(f => f.url)})} />
                     </div>
                  </div>
               )}

               {activeEditorSection === 'about' && (
                  <>
                     <div className="space-y-6"><h4 className="text-white font-bold">Hero</h4><SettingField label="Title" value={settings.aboutHeroTitle} onChange={v => updateSettings({aboutHeroTitle: v})} /><SettingField label="Subtitle" value={settings.aboutHeroSubtitle} onChange={v => updateSettings({aboutHeroSubtitle: v})} type="textarea" /><SingleImageUploader label="Main Image" value={settings.aboutMainImage} onChange={v => updateSettings({aboutMainImage: v})} /></div>
                     
                     <div className="space-y-6 border-t border-slate-800 pt-8"><h4 className="text-white font-bold">Key Facts</h4>
                        <div className="grid grid-cols-2 gap-4">
                           <SettingField label="Established Year" value={settings.aboutEstablishedYear} onChange={v => updateSettings({aboutEstablishedYear: v})} />
                           <SettingField label="Founder Name" value={settings.aboutFounderName} onChange={v => updateSettings({aboutFounderName: v})} />
                           <div className="col-span-2"><SettingField label="Location" value={settings.aboutLocation} onChange={v => updateSettings({aboutLocation: v})} /></div>
                        </div>
                     </div>

                     <div className="space-y-6 border-t border-slate-800 pt-8"><h4 className="text-white font-bold">Content Blocks</h4>
                        <div className="space-y-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl"><h5 className="text-primary font-bold text-xs uppercase">History</h5><SettingField label="Title" value={settings.aboutHistoryTitle} onChange={v => updateSettings({aboutHistoryTitle: v})} /><SettingField label="Body" value={settings.aboutHistoryBody} onChange={v => updateSettings({aboutHistoryBody: v})} type="textarea" /></div>
                        <div className="space-y-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl"><h5 className="text-primary font-bold text-xs uppercase">Mission</h5><SettingField label="Title" value={settings.aboutMissionTitle} onChange={v => updateSettings({aboutMissionTitle: v})} /><SettingField label="Body" value={settings.aboutMissionBody} onChange={v => updateSettings({aboutMissionBody: v})} type="textarea" /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label><IconPicker selected={settings.aboutMissionIcon || 'Target'} onSelect={icon => updateSettings({aboutMissionIcon: icon})} /></div></div>
                        <div className="space-y-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl"><h5 className="text-primary font-bold text-xs uppercase">Community</h5><SettingField label="Title" value={settings.aboutCommunityTitle} onChange={v => updateSettings({aboutCommunityTitle: v})} /><SettingField label="Body" value={settings.aboutCommunityBody} onChange={v => updateSettings({aboutCommunityBody: v})} type="textarea" /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label><IconPicker selected={settings.aboutCommunityIcon || 'Users'} onSelect={icon => updateSettings({aboutCommunityIcon: icon})} /></div></div>
                        <div className="space-y-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl"><h5 className="text-primary font-bold text-xs uppercase">Integrity</h5><SettingField label="Title" value={settings.aboutIntegrityTitle} onChange={v => updateSettings({aboutIntegrityTitle: v})} /><SettingField label="Body" value={settings.aboutIntegrityBody} onChange={v => updateSettings({aboutIntegrityBody: v})} type="textarea" /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label><IconPicker selected={settings.aboutIntegrityIcon || 'Award'} onSelect={icon => updateSettings({aboutIntegrityIcon: icon})} /></div></div>
                     </div>
                     <div className="space-y-6 border-t border-slate-800 pt-8"><h4 className="text-white font-bold">Gallery</h4><FileUploader files={(settings.aboutGalleryImages || []).map(url => ({id: url, url, name: 'gallery', type: 'image/jpeg', size: 0}))} onFilesChange={files => updateSettings({aboutGalleryImages: files.map(f => f.url)})} /></div>
                  </>
               )}

               {activeEditorSection === 'contact' && (
                  <>
                    <div className="space-y-6"><h4 className="text-white font-bold">Hero & Info</h4><SettingField label="Hero Title" value={settings.contactHeroTitle} onChange={v => updateSettings({contactHeroTitle: v})} /><SettingField label="Subtitle" value={settings.contactHeroSubtitle} onChange={v => updateSettings({contactHeroSubtitle: v})} /></div>
                    
                    <div className="space-y-6 border-t border-slate-800 pt-8"><h4 className="text-white font-bold">Company Details</h4>
                       <div className="grid md:grid-cols-2 gap-4">
                          <SettingField label="Email Address" value={settings.contactEmail} onChange={v => updateSettings({contactEmail: v})} />
                          <SettingField label="Phone Number" value={settings.contactPhone} onChange={v => updateSettings({contactPhone: v})} />
                       </div>
                       <SettingField label="Physical Address" value={settings.address} onChange={v => updateSettings({address: v})} />
                       <div className="grid md:grid-cols-2 gap-4">
                          <SettingField label="Hours (Weekdays)" value={settings.contactHoursWeekdays} onChange={v => updateSettings({contactHoursWeekdays: v})} />
                          <SettingField label="Hours (Weekends)" value={settings.contactHoursWeekends} onChange={v => updateSettings({contactHoursWeekends: v})} />
                       </div>
                    </div>

                    <div className="space-y-6 border-t border-slate-800 pt-8"><h4 className="text-white font-bold">Social Links</h4>
                       {settings.socialLinks?.map(link => (
                          <div key={link.id} className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-6 items-start">
                             <div className="w-full md:w-32 flex-shrink-0">
                                <SingleImageUploader label="Icon" value={link.iconUrl} onChange={v => updateSocialLink(link.id, 'iconUrl', v)} className="aspect-square w-full rounded-xl bg-slate-800" />
                             </div>
                             <div className="flex-grow w-full space-y-4">
                                <SettingField label="Platform Name" value={link.name} onChange={v => updateSocialLink(link.id, 'name', v)} />
                                <SettingField label="Profile URL" value={link.url} onChange={v => updateSocialLink(link.id, 'url', v)} />
                             </div>
                             <button onClick={() => removeSocialLink(link.id)} className="self-end md:self-start p-3 text-slate-500 hover:text-red-500"><Trash2 size={18}/></button>
                          </div>
                       ))}
                       <button onClick={addSocialLink} className="w-full py-4 border border-dashed border-slate-700 text-slate-400 rounded-xl hover:text-white hover:border-slate-500 uppercase font-black text-xs flex items-center justify-center gap-2"><Plus size={16}/> Add Social Link</button>
                    </div>
                  </>
               )}

               {activeEditorSection === 'legal' && (
                  <div className="space-y-8">
                     <div className="space-y-4"><h4 className="text-white font-bold">Disclosure</h4><SettingField label="Title" value={settings.disclosureTitle} onChange={v => updateSettings({disclosureTitle: v})} /><SettingField label="Markdown Content" value={settings.disclosureContent} onChange={v => updateSettings({disclosureContent: v})} type="textarea" /></div>
                     <div className="space-y-4 border-t border-slate-800 pt-8"><h4 className="text-white font-bold">Privacy Policy</h4><SettingField label="Title" value={settings.privacyTitle} onChange={v => updateSettings({privacyTitle: v})} /><SettingField label="Markdown Content" value={settings.privacyContent} onChange={v => updateSettings({privacyContent: v})} type="textarea" /></div>
                     <div className="space-y-4 border-t border-slate-800 pt-8"><h4 className="text-white font-bold">Terms of Service</h4><SettingField label="Title" value={settings.termsTitle} onChange={v => updateSettings({termsTitle: v})} /><SettingField label="Markdown Content" value={settings.termsContent} onChange={v => updateSettings({termsContent: v})} type="textarea" /></div>
                  </div>
               )}

               {activeEditorSection === 'integrations' && (
                  <div className="space-y-12">
                     {/* Supabase Core Status */}
                     <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] space-y-6">
                        <div className="flex justify-between items-center">
                           <h4 className="text-white font-bold flex items-center gap-3"><Database size={20} className="text-primary"/> Backend Protocol</h4>
                           <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isSupabaseConfigured ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                              {isSupabaseConfigured ? 'Synchronized' : 'Offline'}
                           </div>
                        </div>
                        <AdminHelpBox title="Supabase Cloud" steps={["Configure VITE_SUPABASE_URL in Vercel", "Configure VITE_SUPABASE_ANON_KEY", "Deployment required for sync"]} />
                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-[10px] font-mono text-slate-400 break-all">
                           {isSupabaseConfigured ? 'Supabase Secure Handshake Established' : 'No connection detected. Operating in local simulation mode.'}
                        </div>
                     </div>

                     {/* EmailJS Configuration */}
                     <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] space-y-6">
                        <h4 className="text-white font-bold flex items-center gap-3"><Mail size={20} className="text-primary"/> Lead Routing (EmailJS)</h4>
                        <AdminHelpBox title="Setup Guide" steps={["Sign up at emailjs.com", "Create Email Service", "Design Email Template", "Paste Keys Below"]} />
                        <div className="space-y-4">
                           <SettingField label="Service ID" value={settings.emailJsServiceId || ''} onChange={v => updateSettings({emailJsServiceId: v})} placeholder="service_xxxxxx" />
                           <SettingField label="Template ID" value={settings.emailJsTemplateId || ''} onChange={v => updateSettings({emailJsTemplateId: v})} placeholder="template_xxxxxx" />
                           <SettingField label="Public Key" value={settings.emailJsPublicKey || ''} onChange={v => updateSettings({emailJsPublicKey: v})} placeholder="user_xxxxxxx" />
                        </div>
                     </div>

                     {/* Marketing & Tracking */}
                     <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] space-y-6">
                        <h4 className="text-white font-bold flex items-center gap-3"><BarChart size={20} className="text-primary"/> Pixel & Analytics</h4>
                        <div className="grid gap-4">
                           <SettingField label="Google Analytics 4 (Measurement ID)" value={settings.googleAnalyticsId || ''} onChange={v => updateSettings({googleAnalyticsId: v})} placeholder="G-XXXXXXXXXX" />
                           <SettingField label="Meta (Facebook) Pixel ID" value={settings.facebookPixelId || ''} onChange={v => updateSettings({facebookPixelId: v})} placeholder="1234567890" />
                           <SettingField label="TikTok Pixel ID" value={settings.tiktokPixelId || ''} onChange={v => updateSettings({tiktokPixelId: v})} placeholder="CXXXXXXXXXXXXXXXXXXX" />
                        </div>
                     </div>

                     {/* Affiliate Profile */}
                     <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] space-y-6">
                        <h4 className="text-white font-bold flex items-center gap-3"><Tag size={20} className="text-primary"/> Affiliate Management</h4>
                        <div className="space-y-4">
                           <SettingField label="Amazon Associate ID" value={settings.amazonAssociateId || ''} onChange={v => updateSettings({amazonAssociateId: v})} placeholder="storename-20" />
                           <AdminHelpBox title="Global Webhooks" steps={["Send contact leads to Zapier or Make", "Use the Webhook URL below"]} />
                           <SettingField label="Lead Webhook URL" value={settings.webhookUrl || ''} onChange={v => updateSettings({webhookUrl: v})} placeholder="https://hooks.zapier.com/..." />
                        </div>
                     </div>

                     {/* Integration Status Footer */}
                     <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-800 border-dashed text-center">
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">
                           <Shield size={12}/> Security Verification
                        </div>
                        <p className="text-[10px] text-slate-600">All integration keys are stored locally unless Supabase sync is active. Never share your Private Role keys.</p>
                     </div>
                  </div>
               )}
            </div>

            <div className="fixed bottom-0 right-0 w-full max-w-2xl p-6 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex justify-end gap-4">
              <button onClick={() => setEditorDrawerOpen(false)} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20">Save Configuration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;