
import React, { useState } from 'react';
import { Mail, MessageCircle, Send, ArrowLeft, CheckCircle2, Globe, MapPin, Clock, HelpCircle, Plus, Minus } from 'lucide-react';
import { useSettings } from '../App';
import { Enquiry } from '../types';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/supabase';

const Contact: React.FC = () => {
  const { settings, refreshData } = useSettings();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: '', email: '', whatsapp: '', subject: 'Product Curation Inquiry', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newEnquiry: any = {
        id: Math.random().toString(36).substr(2, 9),
        ...formState,
        created_at: new Date().toISOString(),
        status: 'unread'
      };
      await db.enquiries.upsert(newEnquiry);
      await refreshData();
      setSubmitted(true);
      setFormState({ name: '', email: '', whatsapp: '', subject: 'Product Curation Inquiry', message: '' });
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-32 md:pt-48 pb-20 px-6 max-w-7xl mx-auto text-left">
       <h1 className="text-5xl md:text-8xl font-serif tracking-tighter mb-12">{settings.contactHeroTitle}</h1>
       <div className="grid lg:grid-cols-2 gap-20">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
             {submitted ? (
                <div className="py-20 text-center"><CheckCircle2 className="mx-auto text-primary mb-6" size={64}/><h3 className="text-2xl font-serif">Message Received</h3></div>
             ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                   <input required placeholder="Name" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none"/>
                   <input required type="email" placeholder="Email" value={formState.email} onChange={e => setFormState({...formState, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none"/>
                   <textarea required rows={5} placeholder="Message" value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none resize-none"/>
                   <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-slate-900 text-white font-black uppercase text-xs rounded-2xl flex items-center justify-center gap-3">
                      {isSubmitting ? "Sending..." : "Send Message"} <Send size={16}/>
                   </button>
                </form>
             )}
          </div>
          <div className="space-y-10">
             <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
                <h3 className="text-2xl font-serif mb-6 flex items-center gap-2"><Globe className="text-primary"/> {settings.contactInfoTitle}</h3>
                <p className="text-slate-400 mb-6">{settings.address}</p>
                <div className="space-y-2 text-sm">
                   <p><span className="text-primary">E:</span> {settings.contactEmail}</p>
                   <p><span className="text-primary">T:</span> {settings.contactPhone}</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Contact;
