

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, ExternalLink, ShoppingBag, CheckCircle, FileText, Video as VideoIcon, ChevronDown, Filter, ArrowUpDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES } from '../constants';
import { useSettings } from '../App';
import { Product } from '../types';

const Products: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const initialCat = query.get('category');

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(initialCat || 'all');
  const [selectedSub, setSelectedSub] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const sortRef = useRef<HTMLDivElement>(null);

  // Hero Carousel Logic
  const heroImages = useMemo(() => {
    return (settings.productsHeroImages && settings.productsHeroImages.length > 0)
      ? settings.productsHeroImages
      : [settings.productsHeroImage];
  }, [settings.productsHeroImage, settings.productsHeroImages]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const products = useMemo<Product[]>(() => {
    const saved = localStorage.getItem('admin_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  }, []);

  const subCategories = useMemo(() => {
    const savedSubs = localStorage.getItem('admin_subcategories');
    const subs = savedSubs ? JSON.parse(savedSubs) : INITIAL_SUBCATEGORIES;
    if (selectedCat === 'all') return [];
    return subs.filter((s: any) => s.categoryId === selectedCat);
  }, [selectedCat]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p: Product) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
      const matchesSub = selectedSub === 'all' || p.subCategoryId === selectedSub;
      return matchesSearch && matchesCat && matchesSub;
    });

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [search, selectedCat, selectedSub, sortBy, products]);

  const renderProductMedia = (product: Product) => {
    const media = product.media || [];
    const primary = media[0];
    
    if (!primary) return <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200"><ShoppingBag size={32} /></div>;

    if (primary.type?.startsWith('image/')) {
      return <img src={primary.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />;
    }
    
    if (primary.type?.startsWith('video/')) {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
          <VideoIcon size={48} className="mb-3 opacity-30" />
          <span className="text-[10px] uppercase font-black tracking-widest text-white/50">Cinematic Preview</span>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
        <FileText size={48} />
        <span className="text-[10px] uppercase font-black tracking-widest mt-3">{primary.type.split('/')[1]}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 md:pb-32 bg-[#FDFCFB] max-w-full overflow-x-hidden">
      
      {/* Full Width Editable Hero Carousel */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden mb-8 md:mb-16 bg-slate-900">
        {heroImages.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
              index === currentHeroIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        {/* Back Button */}
        <button 
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 md:top-10 md:left-10 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl border border-white/20"
        >
            <ArrowLeft size={20} />
        </button>

        <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-12 md:pb-20">
          <div className="max-w-3xl">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4 block">The Collective Catalog</span>
            <h1 className="text-3xl md:text-[5rem] font-serif text-white mb-4 md:mb-6 tracking-tighter leading-none">
              {settings.productsHeroTitle.split(' ').slice(0, -1).join(' ')} <br className="hidden md:block"/>
              <span className="italic font-light text-primary drop-shadow-sm">{settings.productsHeroTitle.split(' ').slice(-1)}</span>
            </h1>
            <p className="text-white/80 text-xs md:text-xl font-light leading-relaxed max-w-xl">
              {settings.productsHeroSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-8">
        
        {/* Search Bar - Floating Effect */}
        <div className="relative -mt-8 md:-mt-12 mb-6 md:mb-20 px-1 md:px-2 z-10">
           <div className="relative w-full max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center bg-white border border-slate-100 rounded-[2rem] shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl focus-within:-translate-y-1">
                <Search className="ml-6 text-slate-300" size={20} />
                <input
                  type="text"
                  placeholder={settings.productsSearchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-4 md:py-6 bg-transparent outline-none text-sm md:text-lg font-light text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>
        </div>

        <div className="space-y-4 md:space-y-6 mb-8 md:mb-20 px-1 md:px-2">
          {/* Main Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <button
              onClick={() => { setSelectedCat('all'); setSelectedSub('all'); }}
              className={`px-4 py-2 md:px-8 md:py-3.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                selectedCat === 'all' 
                ? 'bg-primary text-white shadow-xl shadow-primary/30 border-primary' 
                : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {INITIAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCat(cat.id); setSelectedSub('all'); }}
                className={`px-4 py-2 md:px-8 md:py-3.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${
                  selectedCat === cat.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/30 border-primary' 
                  : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sub-Category and Sort Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 p-2 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto px-2 md:px-4 py-2">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mr-2 flex-shrink-0">Refine:</span>
              <button
                onClick={() => setSelectedSub('all')}
                className={`px-4 py-2 md:px-5 md:py-2 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedSub === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                Show All
              </button>
              {subCategories.map((sub: any) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSub(sub.id)}
                  className={`px-4 py-2 md:px-5 md:py-2 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    selectedSub === sub.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 px-4 pb-2 sm:pb-0 w-full sm:w-auto">
              <div className="relative w-full" ref={sortRef}>
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-between gap-3 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-white transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ArrowUpDown size={14} className="text-primary" />
                    <span className="truncate">Sort: {sortBy.replace('-', ' ')}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSortOpen && (
                  <div className="absolute top-full right-0 mt-4 w-56 bg-white border border-slate-100 rounded-3xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-2 space-y-1">
                      {[
                        { id: 'newest', label: 'Newest Arrivals' },
                        { id: 'price-low', label: 'Price: Low to High' },
                        { id: 'price-high', label: 'Price: High to Low' },
                        { id: 'name', label: 'Alphabetical' },
                      ].map(option => (
                        <button
                          key={option.id}
                          onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                          className={`w-full text-left px-6 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                            sortBy === option.id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-12">
            {filteredProducts.map((product: Product) => (
              <Link 
                to={`/product/${product.id}`}
                key={product.id} 
                className="bg-white rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 flex flex-col relative"
              >
                {product.discountRules && product.discountRules.length > 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl z-20 animate-pulse">
                     {product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`} OFF
                  </div>
                )}
                
                <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
                  {renderProductMedia(product)}
                  <div className="absolute top-3 left-3 md:top-8 md:left-8 bg-white/90 backdrop-blur-xl px-3 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-lg font-black text-slate-900 shadow-2xl border border-white/40 z-10">
                    R {product.price}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hidden md:flex z-10">
                    <div className="bg-white text-slate-900 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl">
                       View Selection <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 md:p-12 flex-grow flex flex-col text-left">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-6">
                    <CheckCircle size={10} className="text-primary md:w-4 md:h-4" />
                    <span className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">Verified</span>
                  </div>
                  <h3 className="text-sm md:text-3xl font-serif text-slate-900 mb-2 md:mb-6 group-hover:text-primary transition-colors duration-500 leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="hidden md:block text-slate-500 text-sm md:text-base mb-6 md:mb-10 line-clamp-3 leading-relaxed font-light">
                    {product.description}
                  </p>
                  
                  <div className="mt-auto pt-3 md:pt-10 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[7px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5 md:mb-1">ID</span>
                      <span className="text-[9px] md:text-sm font-bold text-slate-500 font-mono tracking-tighter truncate max-w-[60px] md:max-w-none">{product.sku}</span>
                    </div>
                    <div 
                      className="p-2 md:px-10 md:py-5 bg-primary hover:brightness-110 text-slate-900 font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] rounded-full md:rounded-[2rem] flex items-center gap-0 md:gap-4 transition-all shadow-md"
                    >
                      <span className="hidden md:inline">Acquire</span>
                      <ExternalLink size={12} className="md:w-4 md:h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-48 bg-white rounded-[4rem] border border-dashed border-slate-200 mx-2">
            <div className="w-28 h-28 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-10">
              <ShoppingBag size={56} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Zero Match Detected</h3>
            <p className="text-slate-400 max-w-sm mx-auto text-lg font-light leading-relaxed">No products found in the current selection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
