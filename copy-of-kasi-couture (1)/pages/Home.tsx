
import React from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { INITIAL_CATEGORIES } from '../constants';
import { LayoutGrid, Sparkles, ShieldCheck, Globe, Star } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';

const SectionDivider: React.FC = () => (
  <div className="max-w-xs mx-auto py-12 md:py-20 flex items-center justify-center gap-4 opacity-30">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
    <div className="rotate-45 w-2 h-2 border border-slate-400"></div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
  </div>
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  return (
    <main className="pt-0">
      <Hero />
      
      <AboutSection />

      <SectionDivider />

      {/* Category Icons Strip */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-6 md:mb-12">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">{settings.homeCategorySectionTitle}</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-4 gap-4 md:gap-8">
            {INITIAL_CATEGORIES.map((cat) => {
              const Icon = CustomIcons[cat.icon] || (LucideIcons as any)[cat.icon] || LayoutGrid;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products?category=${cat.id}`)}
                  className="flex flex-col items-center group"
                >
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:-translate-y-2 transition-all duration-500 shadow-sm border border-transparent group-hover:border-primary/20">
                    <Icon size={18} className="md:w-7 md:h-7" strokeWidth={1.5} />
                  </div>
                  <span className="mt-3 md:mt-5 text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900 transition-colors truncate w-full text-center">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <CategoryGrid />

      <SectionDivider />

      {/* Trust & Methodology Section */}
      <section className="py-12 md:py-32 bg-[#FDFCFB] relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="text-center mb-8 md:mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary block mb-2">{settings.homeTrustSectionTitle}</span>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-16">
              {[
                { iconName: settings.homeTrustItem1Icon || 'ShieldCheck', title: settings.homeTrustItem1Title, desc: settings.homeTrustItem1Desc },
                { iconName: settings.homeTrustItem2Icon || 'Sparkles', title: settings.homeTrustItem2Title, desc: settings.homeTrustItem2Desc },
                { iconName: settings.homeTrustItem3Icon || 'Globe', title: settings.homeTrustItem3Title, desc: settings.homeTrustItem3Desc }
              ].map((item, i) => {
                const IconComponent = CustomIcons[item.iconName] || (LucideIcons as any)[item.iconName] || ShieldCheck;
                return (
                  <div key={i} className={`flex flex-col items-center text-center ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                    <div className="mb-4 md:mb-8 p-4 md:p-6 bg-white rounded-3xl shadow-xl border border-slate-50 text-primary group hover:scale-110 transition-transform duration-500">
                      <IconComponent size={20} className="md:w-8 md:h-8" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-sm md:text-lg font-bold mb-2 md:mb-4 tracking-tight">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-relaxed max-w-xs text-xs md:text-base">{item.desc}</p>
                  </div>
                );
              })}
           </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
