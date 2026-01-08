
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, LayoutPanelTop } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../App';

const Hero: React.FC = () => {
  const { settings, heroSlides: slides } = useSettings();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, slides.length]);

  const prevSlide = () => {
    if (isTransitioning || slides.length <= 1) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="h-screen w-full bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LayoutPanelTop className="mx-auto text-slate-700 mb-4" size={48} />
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No active hero slides</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6">
          <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="relative">
                {settings.companyLogoUrl ? (
                  <img src={settings.companyLogoUrl} alt={settings.companyName} className="h-10 md:h-12 w-auto object-contain transition-transform" />
                ) : (
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white font-black text-xs md:text-sm">{settings.companyLogo}</div>
                )}
              </div>
              <div className={`flex flex-col -space-y-1 text-left`}>
                <span className={`text-sm md:text-base font-serif font-bold tracking-tight text-white`}>{settings.companyName}</span>
              </div>
          </Link>
        </div>
      </div>

      {slides.map((slide, index) => (
        <div key={slide.id} className={`absolute inset-0 transition-all duration-[2s] ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          {slide.type === 'video' ? (
            <video autoPlay muted loop playsInline className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[12s] ${index === current ? 'scale-110' : 'scale-100'}`} src={slide.image} />
          ) : (
            <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-[12s] ${index === current ? 'scale-110 animate-kenburns' : 'scale-100'}`} style={{ backgroundImage: `url(${slide.image})` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-center items-start">
            <div className={`max-w-4xl transition-all duration-[1s] delay-500 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="flex items-center gap-4 mb-4 md:mb-8">
                <div className="h-px w-8 md:w-12 bg-primary"></div>
                <span className="text-[9px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] text-primary uppercase">{settings.homeHeroBadge || 'Kasi Couture Exclusive'}</span>
              </div>
              <h1 className="font-serif text-white mb-6 md:mb-8 leading-[1.1] md:leading-[0.85] tracking-tighter text-balance" style={{ fontSize: 'clamp(2.5rem, 8vw, 9rem)' }}>
                {slide.title.split(' ').slice(0, -1).join(' ')} <br className="hidden md:block"/>
                <span className="text-primary italic font-light lowercase">{slide.title.split(' ').slice(-1)}</span>
              </h1>
              <p className="text-base md:text-xl text-white/70 md:text-white/60 mb-8 md:mb-12 max-w-xs md:max-w-md font-light leading-relaxed text-balance">{slide.subtitle}</p>
              <Link to="/products" className="inline-flex items-center gap-4 md:gap-6 px-8 py-4 md:px-12 md:py-6 bg-primary text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-white transition-all shadow-2xl group">
                {slide.cta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      ))}
      {slides.length > 1 && (
        <div className="absolute bottom-6 md:bottom-12 right-6 md:right-12 z-20 flex gap-4">
          {/* Fixed: prevMedia replaced with prevSlide */}
          <button onClick={prevSlide} className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all backdrop-blur-sm"><ChevronLeft size={16}/></button>
          <button onClick={nextSlide} className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all backdrop-blur-sm"><ChevronRight size={16}/></button>
        </div>
      )}
    </div>
  );
};

export default Hero;
