
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, LayoutPanelTop } from 'lucide-react';
import { CarouselSlide } from '../types';
import { Link } from 'react-router-dom';
import { useSettings } from '../App';

const Hero: React.FC = () => {
  const { settings, heroSlides: slides } = useSettings();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning || (slides?.length || 0) <= 1) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, slides?.length]);

  const prevSlide = () => {
    if (isTransitioning || (slides?.length || 0) <= 1) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  useEffect(() => {
    if ((slides?.length || 0) <= 1) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide, slides?.length]);

  if (!slides || slides.length === 0) {
    return <div className="h-screen w-full bg-slate-900 flex items-center justify-center"><LayoutPanelTop className="text-slate-700" size={48} /></div>;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute top-0 left-0 right-0 z-30 pt-6 px-8 max-w-7xl mx-auto text-left">
        <Link to="/" className="inline-flex items-center space-x-3">{settings.companyLogoUrl ? <img src={settings.companyLogoUrl} className="h-10 w-auto" /> : <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white font-black text-xs">{settings.companyLogo}</div>}<span className="text-white font-serif font-bold">{settings.companyName}</span></Link>
      </div>
      {slides.map((slide, index) => (
        <div key={slide.id} className={`absolute inset-0 transition-all duration-[2s] ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          {slide.type === 'video' ? <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-105" src={slide.image} /> : <div className="absolute inset-0 bg-cover bg-center scale-105 animate-kenburns" style={{ backgroundImage: `url(${slide.image})` }} />}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-center items-start">
            <div className={`max-w-4xl transition-all duration-[1s] transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <span className="text-[10px] font-black tracking-[0.6em] text-primary uppercase mb-8 block">Kasi Couture Exclusive</span>
              <h1 className="font-serif text-white mb-8 leading-[0.85] tracking-tighter" style={{ fontSize: 'clamp(3rem, 8vw, 9rem)' }}>{slide.title}</h1>
              <p className="text-xl text-white/60 mb-12 max-w-md font-light">{slide.subtitle}</p>
              <Link to="/products" className="inline-flex items-center gap-6 px-12 py-6 bg-primary text-slate-900 font-black uppercase text-[10px] rounded-full hover:bg-white transition-all">Explore <ArrowRight size={16}/></Link>
            </div>
          </div>
        </div>
      ))}
      {slides.length > 1 && (
        <div className="absolute bottom-12 right-12 z-20 flex gap-4">
          <button onClick={prevSlide} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all backdrop-blur-sm"><ChevronLeft size={16}/></button>
          <button onClick={nextSlide} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all backdrop-blur-sm"><ChevronRight size={16}/></button>
        </div>
      )}
    </div>
  );
};

export default Hero;
