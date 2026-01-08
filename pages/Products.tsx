
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, ExternalLink, ShoppingBag, CheckCircle, FileText, Video as VideoIcon, ChevronDown, Filter, ArrowUpDown, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSettings } from '../App';
import { Product } from '../types';

const Products: React.FC = () => {
  const { settings, products, categories, subCategories: allSubCategories } = useSettings();
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

  const subCategories = useMemo(() => {
    if (selectedCat === 'all') return [];
    return allSubCategories.filter((s: any) => s.categoryId === selectedCat || s.category_id === selectedCat);
  }, [selectedCat, allSubCategories]);

  const filteredProducts = useMemo(() => {
    let result = [...products].filter((p: Product) => {
      const name = p.name || '';
      const desc = p.description || '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase());
      const pCat = p.categoryId || (p as any).category_id;
      const pSub = p.subCategoryId || (p as any).sub_category_id;
      const matchesCat = selectedCat === 'all' || pCat === selectedCat;
      const matchesSub = selectedSub === 'all' || pSub === selectedSub;
      return matchesSearch && matchesCat && matchesSub;
    });

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': 
        result.sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
          const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
          return dateB - dateA;
        }); 
        break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [search, selectedCat, selectedSub, sortBy, products]);

  const renderProductMedia = (product: Product) => {
    const media = product.media || [];
    const primary = media[0];
    if (!primary) return <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200"><ShoppingBag size={32} /></div>;
    if (primary.type?.startsWith('image/')) return <img src={primary.url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />;
    return <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white"><VideoIcon size={48} className="opacity-30" /></div>;
  };

  return (
    <div className="min-h-screen pb-20 md:pb-32 bg-[#FDFCFB]">
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden mb-8 md:mb-16 bg-slate-900">
        {heroImages.map((img, index) => (
          <div key={index} className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ${index === currentHeroIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} style={{ backgroundImage: `url(${img})` }} />
        ))}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-12 md:pb-20 text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4 block">Catalog</span>
          <h1 className="text-3xl md:text-[5rem] font-serif text-white mb-4 tracking-tighter leading-none">{settings.productsHeroTitle}</h1>
          <p className="text-white/80 text-xs md:text-xl font-light max-w-xl">{settings.productsHeroSubtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-8">
        <div className="relative -mt-12 mb-10 group">
           <div className="relative flex items-center bg-white border border-slate-100 rounded-[2rem] shadow-xl overflow-hidden max-w-2xl mx-auto">
             <Search className="ml-6 text-slate-300" size={20} />
             <input type="text" placeholder={settings.productsSearchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-4 md:py-6 outline-none text-slate-900" />
           </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button onClick={() => { setSelectedCat('all'); setSelectedSub('all'); }} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${selectedCat === 'all' ? 'bg-primary text-slate-900' : 'bg-white text-slate-500'}`}>All</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => { setSelectedCat(cat.id); setSelectedSub('all'); }} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${selectedCat === cat.id ? 'bg-primary text-slate-900' : 'bg-white text-slate-500'}`}>{cat.name}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col text-left">
              <div className="aspect-[3/4] overflow-hidden relative">
                {renderProductMedia(product)}
                <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-xl text-sm font-black shadow-lg">R {product.price.toLocaleString()}</div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-serif mb-2">{product.name}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 font-light">{product.description}</p>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-[9px] text-slate-300 font-mono uppercase">{product.sku}</span>
                   <ExternalLink size={14} className="text-primary"/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
