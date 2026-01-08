
import React, { useState } from 'react';
import { Mail, MessageCircle, Send, Twitter, Instagram, Linkedin, Phone, Sparkles, MapPin, ArrowRight, CheckCircle2, ArrowLeft, Clock, HelpCircle, Plus, Minus, Globe } from 'lucide-react';
import { useSettings } from '../App';
import { Enquiry } from '../types';
import { useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: '', email: '', whatsapp: '', subject: 'Product Curation Inquiry', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newEnquiry: Enquiry = {
        id: Math.random().toString(36).substr(2, 9),
        ...formState,
        createdAt: Date.now(),
        status: 'unread'
      };

      // Save to localStorage for Admin consumption
      const existing = JSON.parse(localStorage.getItem('admin_enquiries') || '[]');
      localStorage.setItem('admin_enquiries', JSON.stringify([newEnquiry, ...existing]));

      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', whatsapp: '', subject: 'Product Curation Inquiry', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const faqs = [
    {
      q: "Do you ship products directly?",
      a: "As a curation bridge page, we direct you to verified third-party luxury retailers. Shipping and returns are handled directly by the brand you purchase from."
    },
    {
      q: "How do I book a styling consultation?",
      a: "Please select 'Styling Consultation' in the inquiry form. Our team will coordinate a virtual or in-person session based on your location."
    },
    {
      q: "Are the luxury items authenticated?",
      a: "Absolutely. We only affiliate with authorized retailers and brands that guarantee 100% authenticity on every piece listed."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative">
       {/* Background Elements */}
       <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
       
       {/* Back Button */}
       <button 
            onClick={() => navigate('/')}
            className="fixed top-6 left-6 z-50 w-12 h-12 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-lg group"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

      <div className="pt-32 md:pt-48 pb-20 md:pb-32 max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="mb-16 md:mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[9px] font-black uppercase tracking-widest mb-6 border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Concierge Online
              </div>
              {/* Fluid Text */}
              <h1 className="font-serif text-slate-900 leading-[0.9] tracking-tighter mb-6 text-balance" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>
                {settings.contactHeroTitle}
              </h1>
              <p className="text-lg md:text-xl text-slate-500 font-light max-w-xl leading-relaxed text-pretty">
                {settings.contactHeroSubtitle}
              </p>
            </div>
            
            {/* Quick Contact Cards */}
            <div className="flex gap-4">
               <a href={`mailto:${settings.contactEmail}`} className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm hover:bg-slate-900 hover:text-white transition-all duration-300 group">
                 <Mail size={24} className="group-hover:scale-110 transition-transform" />
               </a>
               <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all duration-300 group">
                 <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
               </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-20">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
               
               {submitted ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
                       <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-serif text-slate-900 mb-4">Request Transmitted</h2>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">We have received your message. A dedicated concierge will respond shortly.</p>
                    <button onClick={() => setSubmitted(false)} className="text-xs font-black uppercase tracking-widest text-primary hover:text-slate-900 transition-colors">Send New Message</button>
                 </div>
               ) : (
                 <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{settings.contactFormNameLabel}</label>
                        <input 
                          type="text" 
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({...formState, name: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                          placeholder="Your Name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{settings.contactFormEmailLabel}</label>
                        <input 
                          type="email" 
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({...formState, email: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                          placeholder="email@address.com" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">WhatsApp (Optional)</label>
                        <input 
                          type="tel" 
                          value={formState.whatsapp}
                          onChange={(e) => setFormState({...formState, whatsapp: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                          placeholder="+27..." 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{settings.contactFormSubjectLabel}</label>
                        <div className="relative">
                          <select 
                            value={formState.subject}
                            onChange={(e) => setFormState({...formState, subject: e.target.value})}
                            className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl outline-none transition-all text-slate-900 font-medium appearance-none cursor-pointer"
                          >
                            <option>Product Curation Inquiry</option>
                            <option>Styling Consultation</option>
                            <option>Brand Partnership</option>
                            <option>Order Assistance</option>
                          </select>
                          <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{settings.contactFormMessageLabel}</label>
                      <textarea 
                        rows={5} 
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-slate-900 rounded-2xl outline-none transition-all text-slate-900 font-medium resize-none placeholder:text-slate-300" 
                        placeholder="Type your message..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-primary hover:text-slate-900 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <span>{settings.contactFormButtonText}</span>
                          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                 </form>
               )}
            </div>
          </div>

          {/* Right Column: Info & FAQ */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-10">
             
             {/* Info Block */}
             <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] -mr-10 -mt-10"></div>
                
                <h3 className="text-2xl font-serif mb-8 flex items-center gap-3">
                  <Globe size={20} className="text-primary"/> {settings.contactInfoTitle || 'Global HQ'}
                </h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                     <MapPin className="text-slate-500 mt-1 flex-shrink-0" size={20} />
                     <div>
                       <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{settings.contactAddressLabel || 'Address'}</span>
                       <p className="text-lg leading-snug font-medium">{settings.address || 'Johannesburg, South Africa'}</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-4">
                     <Clock className="text-slate-500 mt-1 flex-shrink-0" size={20} />
                     <div>
                       <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{settings.contactHoursLabel || 'Operating Hours'}</span>
                       <p className="text-sm text-slate-300">{settings.contactHoursWeekdays}</p>
                       <p className="text-sm text-slate-300">{settings.contactHoursWeekends}</p>
                     </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-800 flex flex-wrap gap-3">
                  {(settings.socialLinks || []).map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-colors">
                      {link.iconUrl ? <img src={link.iconUrl} className="w-4 h-4 object-contain invert"/> : <ArrowRight size={14} className="-rotate-45" />}
                    </a>
                  ))}
                </div>
             </div>

             {/* FAQ Accordion */}
             <div className="space-y-4">
                <h3 className="text-xl font-serif text-slate-900 px-4 flex items-center gap-2">
                  <HelpCircle size={18} className="text-primary"/> Common Enquiries
                </h3>
                <div className="space-y-2">
                   {faqs.map((faq, idx) => (
                     <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300">
                        <button 
                          onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left"
                        >
                          <span className="text-sm font-bold text-slate-900 pr-4">{faq.q}</span>
                          <div className={`w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center transition-transform duration-300 ${openFaq === idx ? 'rotate-180 bg-slate-900 text-white' : 'text-slate-400'}`}>
                             {openFaq === idx ? <Minus size={12}/> : <Plus size={12}/>}
                          </div>
                        </button>
                        <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                           <p className="text-xs text-slate-500 leading-relaxed font-light">{faq.a}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
