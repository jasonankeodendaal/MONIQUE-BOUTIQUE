
import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Target, Users, Award, ArrowLeft, Star, Heart, Quote, ImageIcon, Calendar, MapPin, Sparkles } from 'lucide-react';
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

  const renderIcon = (iconName: string, defaultIcon: React.ReactNode) => {
    if (!iconName) return defaultIcon;
    const IconComponent = CustomIcons[iconName] || (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={28} /> : defaultIcon;
  };

  const timeline = [
    { year: '2019', title: 'The Vision', desc: 'Starting as a style diary documenting the streets of Soweto.' },
    { year: '2021', title: 'The Expansion', desc: 'Curating for private clients across the continent.' },
    { year: '2024', title: 'Kasi Couture Pro', desc: 'Launching a global platform to bridge local taste with international luxury.' }
  ];

  return (
    <div className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Hero Section */}
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
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white font-black uppercase text-[10px] tracking-[0.4em] mb-6 shadow-lg">
                <Sparkles size={12} className="text-primary"/> The Origin Story
            </span>
            <h1 className="font-serif text-slate-900 leading-[0.9] tracking-tighter mb-8 drop-shadow-sm text-balance" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}>
                {settings.aboutHeroTitle.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? "italic font-light text-primary" : ""}>{word} </span>
                ))}
            </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-20 relative z-10 pb-24">
        
        {/* Intro Card */}
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] mb-16 border border-slate-100 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-slate-900 to-primary"></div>
             <Quote size={40} className="text-primary/20 mx-auto mb-6 fill-current" />
             <p className="text-xl md:text-3xl font-serif text-slate-600 leading-relaxed italic">
               "{settings.aboutHeroSubtitle}"
             </p>
             <div className="w-16 h-1 bg-primary mx-auto mt-10 rounded-full"></div>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-12 gap-16 mb-32 items-start">
            <div className="lg:col-span-8">
                <h3 className="text-4xl font-serif text-slate-900 mb-10">{settings.aboutHistoryTitle}</h3>
                <div className="prose prose-lg prose-slate text-slate-500 font-light leading-relaxed max-w-none">
                    <div className="whitespace-pre-wrap first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-slate-900 first-letter:float-left first-letter:mr-6 first-letter:mt-[-5px]">
                        {settings.aboutHistoryBody}
                    </div>
                </div>
                {settings.aboutSignatureImage && (
                  <div className="mt-16">
                    <img src={settings.aboutSignatureImage} alt="Founder Signature" className="h-24 object-contain opacity-70" />
                  </div>
                )}
            </div>

            <div className="lg:col-span-4 space-y-12">
               {/* Identity Card */}
               <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">The Curator</h4>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <Calendar className="text-primary flex-shrink-0" size={20} />
                      <div>
                        <span className="block text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1">Established</span>
                        <span className="text-lg font-serif">{settings.aboutEstablishedYear}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="text-primary flex-shrink-0" size={20} />
                      <div>
                        <span className="block text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1">HQ</span>
                        <span className="text-lg font-serif">{settings.aboutLocation}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Users className="text-primary flex-shrink-0" size={20} />
                      <div>
                        <span className="block text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1">Role</span>
                        <span className="text-lg font-serif">{settings.aboutFounderName}</span>
                      </div>
                    </div>
                  </div>
               </div>

               {/* Simple Timeline */}
               <div className="pl-4 space-y-10 border-l border-slate-200 ml-4">
                  {timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-primary rounded-full ring-4 ring-white shadow-sm"></div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">{item.year}</span>
                      <h5 className="font-serif text-lg text-slate-900 mb-2">{item.title}</h5>
                      <p className="text-xs text-slate-400 font-light">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
        </div>

        {/* Values and Integrity remain similarly structured but refined */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
            {[
              { icon: settings.aboutMissionIcon, def: <Target size={28}/>, title: settings.aboutMissionTitle, body: settings.aboutMissionBody },
              { icon: settings.aboutCommunityIcon, def: <Users size={28}/>, title: settings.aboutCommunityTitle, body: settings.aboutCommunityBody }
            ].map((v, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                  {renderIcon(v.icon, v.def)}
                </div>
                <h4 className="text-3xl font-serif text-slate-900 mb-6">{v.title}</h4>
                <p className="text-slate-500 leading-relaxed font-light">{v.body}</p>
              </div>
            ))}
        </div>

        {/* Integrity Statement */}
        <div className="relative rounded-[4rem] overflow-hidden bg-slate-950 text-white p-12 md:p-24 text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
            <div className="relative z-10">
                <div className="inline-block text-primary mx-auto mb-10">
                  {renderIcon(settings.aboutIntegrityIcon, <Award size={56} />)}
                </div>
                <h3 className="text-4xl md:text-6xl font-serif mb-8 tracking-tight">{settings.aboutIntegrityTitle}</h3>
                <p className="text-xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed mb-12">
                    {settings.aboutIntegrityBody}
                </p>
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-primary backdrop-blur-md">
                   Authenticity Verified
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;
