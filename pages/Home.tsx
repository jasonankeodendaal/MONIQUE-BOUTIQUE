
import React from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import CategoryGrid from '../components/CategoryGrid';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Star, ArrowRight, Quote, CheckCircle, Sparkles } from 'lucide-react';
import { useSettings } from '../App';
import { INITIAL_PRODUCTS } from '../constants';

const SectionDivider: React.FC = () => (
  <div className="max-w-xs mx-auto py-12 md:py-20 flex items-center justify-center gap-4 opacity-30">
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
    <div className="rotate-45 w-2 h-2 border border-slate-400"></div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
  </div>
);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { settings, products } = useSettings();

  const featuredProduct = products.length > 0 ? products[0] : INITIAL_PRODUCTS[0];

  return (
    <main className="pt-0">
      <Hero />
      
      {/* Intro Personal Note */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Quote size={32} />
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">
            "My mission is to bridge the gap between <span className="text-primary italic">authenticity</span> and world-class luxury."
          </h2>
          <p className="text-lg text-slate-500 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            I don't just list products. I curate stories. Every piece on this platform has been hand-selected for its craftsmanship, heritage, and the way it makes you feel.
          </p>
          <div className="flex flex-col items-center">
            {settings.aboutSignatureImage ? (
              <img src={settings.aboutSignatureImage} alt="Signature" className="h-16 object-contain opacity-60 mb-2" />
            ) : (
              <span className="font-serif italic text-2xl text-slate-400 mb-2">{settings.aboutFounderName || 'Your Name'}</span>
            )}
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Founder & Chief Curator</span>
          </div>
        </div>
      </section>

      <AboutSection />

      <SectionDivider />

      {/* Trust & Methodology Section */}
      <section className="py-12 md:py-32 bg-slate-950 text-white relative overflow-hidden rounded-[3rem] md:rounded-[5rem] mx-4">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
           <div className="text-center mb-20">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary block mb-6">The Curation Standard</span>
              <h2 className="text-4xl md:text-6xl font-serif mb-8">Why trust my <span className="text-primary italic">Selection?</span></h2>
           </div>
           <div className="grid md:grid-cols-3 gap-12">
              {[
                { 
                  icon: <ShieldCheck size={32} />, 
                  title: "Verified Links", 
                  desc: "I personally verify every affiliate partner to ensure you are buying from authorized, secure retailers." 
                },
                { 
                  icon: <Star size={32} />, 
                  title: "Taste over Trends", 
                  desc: "I ignore the noise. I only recommend pieces that offer long-term value and timeless aesthetic appeal." 
                },
                { 
                  icon: <CheckCircle size={32} />, 
                  title: "Zero Bias", 
                  desc: "My curation is independent. While I earn a commission, my first loyalty is always to the craft and your style." 
                }
              ].map((item, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group">
                  <div className="text-primary mb-6 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                  <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                  <p className="text-slate-400 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <SectionDivider />

      {/* Featured Recommendation */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#FDFCFB] rounded-[4rem] overflow-hidden border border-slate-100 flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 aspect-square lg:aspect-auto h-[500px] lg:h-[700px] overflow-hidden">
               <img 
                src={featuredProduct.media[0]?.url || 'https://images.unsplash.com/photo-1539109136881-3be06109477e?auto=format&fit=crop&q=80&w=800'} 
                alt="Featured" 
                className="w-full h-full object-cover"
               />
            </div>
            <div className="w-full lg:w-1/2 p-12 md:p-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-8">Curator's Seasonal Choice</span>
              <h3 className="text-4xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight">{featuredProduct.name}</h3>
              <p className="text-lg text-slate-500 font-light leading-relaxed mb-10">
                "{featuredProduct.description.split('.').slice(0, 2).join('.') + '.'}"
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link 
                  to={`/product/${featuredProduct.id}`}
                  className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-primary hover:text-slate-900 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Read Review <ArrowRight size={14} />
                </Link>
                <span className="text-2xl font-serif text-slate-900">R {featuredProduct.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid />

      {/* Final CTA */}
      <section className="py-32 bg-[#FDFCFB]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-7xl font-serif text-slate-900 mb-10 tracking-tighter">Ready to <span className="text-primary italic">Redefine</span> your closet?</h2>
          <p className="text-xl text-slate-400 font-light mb-12">Join the inner circle of style enthusiasts curating with purpose.</p>
          <Link 
            to="/products"
            className="inline-flex items-center gap-4 px-12 py-6 bg-primary text-slate-900 font-black uppercase tracking-widest text-[11px] rounded-full hover:scale-105 transition-all shadow-2xl"
          >
            Explore My Entire Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
