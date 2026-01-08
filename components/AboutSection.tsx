
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '../App';

const AboutSection: React.FC = () => {
  const { settings } = useSettings();

  return (
    <section className="py-12 md:py-32 bg-[#FDFCFB] overflow-visible relative">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          
          <div className="w-full md:w-5/12 relative order-2 md:order-1">
            <div className="relative z-10 group">
              <div className="hidden md:block absolute -inset-10 bg-primary/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 group-hover:-translate-y-2 md:group-hover:-translate-y-4 group-hover:rotate-1">
                <img 
                  src={settings.homeAboutImage} 
                  alt="About Kasi" 
                  className="w-full h-auto aspect-[3/4] object-cover"
                />
                
                {/* Signature Overlay */}
                {settings.aboutSignatureImage && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-90">
                    <img src={settings.aboutSignatureImage} alt="Signature" className="h-12 md:h-16 w-auto object-contain invert drop-shadow-md" />
                  </div>
                )}
              </div>
              
              <div className="hidden md:block absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-primary/30 rounded-tr-[3rem] z-20 pointer-events-none"></div>
              <div className="hidden md:block absolute -bottom-6 -left-6 w-32 h-32 border-b-2 border-l-2 border-primary/30 rounded-bl-[3rem] z-20 pointer-events-none"></div>
            </div>
          </div>

          <div className="w-full md:w-6/12 lg:w-5/12 order-1 md:order-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-4 md:mb-6">
              <Sparkles size={12} className="text-primary md:w-4 md:h-4" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400">Our Essence</span>
            </div>
            
            {/* Fluid Text */}
            <h2 className="font-serif text-slate-900 mb-6 md:mb-8 leading-tight tracking-tighter text-balance text-4xl md:text-6xl">
              {settings.homeAboutTitle.split(' ').slice(0, 2).join(' ')} <br className="hidden md:block"/>
              <span className="italic font-light text-primary">{settings.homeAboutTitle.split(' ').slice(2).join(' ')}</span>
            </h2>
            
            <p className="text-sm md:text-lg text-slate-500 font-light leading-relaxed mb-8 md:mb-10 line-clamp-4 md:line-clamp-none text-pretty">
              {settings.homeAboutDescription}
            </p>

            <Link 
              to="/about" 
              className="inline-flex items-center gap-3 md:gap-4 group bg-slate-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-primary hover:text-slate-900 transition-all duration-300"
            >
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
                {settings.homeAboutCta}
              </span>
              <ArrowRight size={14} className="md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
