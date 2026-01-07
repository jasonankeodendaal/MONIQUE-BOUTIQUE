
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, ShieldCheck, ArrowLeft, Play, Package, Share2, Tag } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../constants';
import { useSettings } from '../App';
import { Product, DiscountRule, ProductStats } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const products = useMemo(() => {
    const saved = localStorage.getItem('admin_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  }, []);

  const product = useMemo(() => products.find((p: Product) => p.id === id), [products, id]);
  
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => setIsLoaded(true), 100);
    
    // Track View and Start Session Timer
    if (id) {
      const savedStats = JSON.parse(localStorage.getItem('admin_product_stats') || '[]');
      const index = savedStats.findIndex((s: ProductStats) => s.productId === id);
      if (index > -1) {
        savedStats[index].views += 1;
        savedStats[index].lastUpdated = Date.now();
      } else {
        savedStats.push({ productId: id, views: 1, clicks: 0, totalViewTime: 0, lastUpdated: Date.now() });
      }
      localStorage.setItem('admin_product_stats', JSON.stringify(savedStats));

      // Start View Time Tracker
      const startTime = Date.now();
      const interval = setInterval(() => {
        const currentStats = JSON.parse(localStorage.getItem('admin_product_stats') || '[]');
        const idx = currentStats.findIndex((s: ProductStats) => s.productId === id);
        if (idx > -1) {
          currentStats[idx].totalViewTime = (currentStats[idx].totalViewTime || 0) + 1;
          currentStats[idx].lastUpdated = Date.now();
          localStorage.setItem('admin_product_stats', JSON.stringify(currentStats));
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => clearTimeout(timeout);
  }, [id]);

  const handleTrackClick = () => {
    if (id) {
      const savedStats = JSON.parse(localStorage.getItem('admin_product_stats') || '[]');
      const index = savedStats.findIndex((s: ProductStats) => s.productId === id);
      if (index > -1) {
        savedStats[index].clicks += 1;
        savedStats[index].lastUpdated = Date.now();
        localStorage.setItem('admin_product_stats', JSON.stringify(savedStats));
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center p-6">
        <div>
          <Package size={64} className="text-slate-200 mx-auto mb-6" />
          <h2 className="text-3xl font-serif mb-4">Piece Not Found</h2>
          <button onClick={() => navigate('/products')} className="text-primary font-bold uppercase tracking-widest text-xs">Return to Collection</button>
        </div>
      </div>
    );
  }

  const media = product.media || [];
  const currentMedia = media[activeMediaIndex];

  const nextMedia = () => setActiveMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  const prevMedia = () => setActiveMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));

  return (
    <main className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden">
        
        {/* Left Side: Cinematic Media Gallery */}
        <div className="w-full lg:w-3/5 h-[40vh] md:h-[50vh] lg:h-full relative bg-slate-100 overflow-hidden group">
          <button 
            onClick={() => navigate('/products')}
            className="absolute top-6 left-6 md:top-10 md:left-10 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl border border-white/20"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="absolute inset-0 flex items-center justify-center">
            {currentMedia ? (
              currentMedia.type.startsWith('video') ? (
                <video 
                  key={currentMedia.id}
                  src={currentMedia.url} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                />
              ) : (
                <img 
                  key={currentMedia.id}
                  src={currentMedia.url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                />
              )
            ) : (
              <div className="text-slate-200"><Package size={80} className="md:w-32 md:h-32"/></div>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>

          {media.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 w-24 md:w-32 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prevMedia} className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 w-24 md:w-32 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={nextMedia} className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {media.map((_: any, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveMediaIndex(i)}
                    className={`h-1.5 transition-all duration-500 rounded-full ${activeMediaIndex === i ? 'w-12 bg-primary' : 'w-4 bg-white/30'}`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 z-20 flex gap-4">
             {currentMedia?.type.startsWith('video') && (
               <div className="px-3 py-1.5 md:px-4 md:py-2 bg-primary text-slate-900 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Play className="w-[10px] h-[10px] md:w-[12px] md:h-[12px]" fill="currentColor" /> Cinematic Preview
               </div>
             )}
          </div>
        </div>

        {/* Right Side: Curator Details */}
        <div className="w-full lg:w-2/5 h-full lg:overflow-y-auto bg-white custom-scrollbar flex flex-col">
          <div className="p-6 md:p-20 flex-grow">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Verified Authenticity</span>
              </div>
              <button className="text-slate-300 hover:text-slate-900 transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            {/* FLUID TITLE */}
            <h1 className="font-serif text-slate-900 mb-4 md:mb-6 leading-tight tracking-tighter text-balance" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}>
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 md:gap-6 mb-8 md:mb-12">
              <span className="text-2xl md:text-4xl font-bold text-slate-900">R {product.price}</span>
              <div className="px-3 py-1 md:px-4 md:py-1.5 border border-slate-100 rounded-full text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} /> ID: {product.sku}
              </div>
            </div>

            <div className="space-y-6 md:space-y-8 mb-10 md:mb-16">
              <div className="flex items-center gap-4">
                <div className="h-px flex-grow bg-slate-100"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Description</span>
                <div className="h-px flex-grow bg-slate-100"></div>
              </div>
              <p className="text-base md:text-xl text-slate-500 font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.discountRules && product.discountRules.length > 0 && (
              <div className="mb-10 md:mb-16 p-6 md:p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Active Privileges</h4>
                <div className="space-y-4">
                  {product.discountRules.map((rule: DiscountRule) => (
                    <div key={rule.id} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{rule.description}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-widest">Promotional Benefit</span>
                      </div>
                      <span className="text-2xl font-serif text-primary italic">
                        {rule.type === 'percentage' ? `-${rule.value}%` : `-R${rule.value}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleTrackClick}
              className="group relative w-full py-5 md:py-8 bg-slate-900 text-white rounded-full overflow-hidden flex items-center justify-center gap-4 md:gap-6 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] hover:-translate-y-1 transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] group-hover:text-slate-900 transition-colors">Acquire This Piece</span>
              <ExternalLink size={16} className="relative z-10 group-hover:text-slate-900 transition-colors md:w-5 md:h-5" />
            </a>
          </div>

          <div className="p-8 md:p-12 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-1">Curation Date</span>
              <span className="text-xs font-bold text-slate-500">
                {new Date(product.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <img src={settings.companyLogoUrl || ''} className="h-6 md:h-8 opacity-20 grayscale" alt="" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
