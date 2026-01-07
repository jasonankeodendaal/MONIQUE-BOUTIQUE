
import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Target, Users, Award, ArrowLeft, Star, Heart, Quote, ImageIcon } from 'lucide-react';
import { useSettings } from '../App';
import { useNavigate } from 'react-router-dom';
import { CustomIcons } from '../components/CustomIcons';

const About: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  // Helper to render dynamic icon
  const renderIcon = (iconName: string, defaultIcon: React.ReactNode) => {
    if (!iconName) return defaultIcon;
    const IconComponent = CustomIcons[iconName] || (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={28} /> : defaultIcon;
  };

  return (
    <div className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Hero Section with Parallax-like Image */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
           <img 
            src={settings.aboutMainImage} 
            alt="Curator" 
            className="w-full h-full object-cover opacity-80 scale-105 animate-kenburns"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-transparent to-black/30"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-20 flex flex-col items-center text-center pb-32">
            <span className="inline-block px-4 py-2 rounded-full border border-slate-900/10 bg-white/20 backdrop-blur-md text-slate-900 font-black uppercase text-[10px] tracking-[0.4em] mb-6 shadow-lg">
                The Origin Story
            </span>
            {/* Fluid Text */}
            <h1 className="font-serif text-slate-900 leading-[0.9] tracking-tighter mb-8 drop-shadow-sm text-balance" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}>
                {settings.aboutHeroTitle.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? "italic font-light text-primary" : ""}>{word} </span>
                ))}
            </h1>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-20 relative z-10 pb-24">
        
        {/* Intro Card */}
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] mb-16 border border-slate-100 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-slate-900 to-primary"></div>
             <Quote size={40} className="text-primary/20 mx-auto mb-6 fill-current" />
             <p className="text-xl md:text-3xl font-serif text-slate-600 leading-relaxed italic">
               "{settings.aboutHeroSubtitle}"
             </p>
             <div className="w-16 h-1 bg-primary mx-auto mt-10 rounded-full"></div>
        </div>

        {/* History / Main Body */}
        <div className="grid md:grid-cols-12 gap-12 mb-24">
            <div className="md:col-span-3 hidden md:block">
                <div className="sticky top-32 border-l-2 border-slate-100 pl-6 py-2">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Established</span>
                    <span className="text-xl font-serif text-slate-900 block mb-8">{settings.aboutEstablishedYear || '2024'}</span>
                    
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Founder</span>
                    <span className="text-xl font-serif text-slate-900 block mb-8">{settings.aboutFounderName || settings.companyName}</span>

                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Location</span>
                    <span className="text-xl font-serif text-slate-900 block">{settings.aboutLocation || 'South Africa'}</span>
                </div>
            </div>
            <div className="md:col-span-9 prose prose-lg prose-slate text-slate-500 font-light leading-loose text-left">
                <h3 className="text-3xl font-serif text-slate-900 font-bold mb-8">{settings.aboutHistoryTitle}</h3>
                <div className="whitespace-pre-wrap first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:text-slate-900 first-letter:float-left first-letter:mr-4 first-letter:mt-[-10px]">
                    {settings.aboutHistoryBody}
                </div>
                
                {settings.aboutSignatureImage && (
                  <div className="mt-12 not-prose">
                    <img src={settings.aboutSignatureImage} alt="Founder Signature" className="h-20 object-contain opacity-70" />
                  </div>
                )}
            </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-24">
            <div className="bg-slate-50 p-10 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 border border-slate-100 group text-left">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    {renderIcon(settings.aboutMissionIcon, <Target size={28} />)}
                </div>
                <h4 className="text-2xl font-serif text-slate-900 mb-4">{settings.aboutMissionTitle}</h4>
                <p className="text-slate-500 leading-relaxed">{settings.aboutMissionBody}</p>
            </div>
            <div className="bg-slate-50 p-10 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 border border-slate-100 group text-left">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                     {renderIcon(settings.aboutCommunityIcon, <Users size={28} />)}
                </div>
                <h4 className="text-2xl font-serif text-slate-900 mb-4">{settings.aboutCommunityTitle}</h4>
                <p className="text-slate-500 leading-relaxed">{settings.aboutCommunityBody}</p>
            </div>
        </div>
        
        {/* Gallery Section */}
        {settings.aboutGalleryImages && settings.aboutGalleryImages.length > 0 && (
          <div className="mb-24">
            <div className="text-center mb-12">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary block mb-4">Visual Journey</span>
               <h3 className="text-4xl font-serif text-slate-900">The Curator's Gallery</h3>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {settings.aboutGalleryImages.map((img, i) => (
                <div key={i} className="break-inside-avoid rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform duration-500 shadow-lg">
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-auto object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrity Section */}
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white p-10 md:p-20 text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <div className="inline-block text-primary mx-auto mb-8">
                  {renderIcon(settings.aboutIntegrityIcon, <Award size={48} />)}
                </div>
                <h3 className="text-3xl md:text-5xl font-serif mb-6 tracking-tight">{settings.aboutIntegrityTitle}</h3>
                <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed mb-10">
                    {settings.aboutIntegrityBody}
                </p>
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary border border-primary/30 px-6 py-3 rounded-full">
                    <Star size={12} fill="currentColor" /> Verified Excellence
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;
