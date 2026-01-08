
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

  const heroImages = useMemo(() => (settings.productsHeroImages && settings.productsHeroImages.length > 0) ? settings.productsHeroImages : [settings.productsHeroImage], [settings]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => setCurrentHeroIndex(prev => (prev === heroImages.length - 1 ? 0 : prev + 1)), 6000);
    return () => clearInterval(interval);
  }, [heroImages]);

  const subCategories = useMemo(() => selectedCat === 'all' ? [] : allSubCategories.filter(s => s.categoryId === selectedCat), [selectedCat, allSubCategories]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
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

  return (
    <div className="min-h-screen pb-20 md:pb-32 bg-[#FDFCFB]">
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden mb-8 md:mb-16 bg-slate-900">
        {heroImages.map((img, index) => (
          <div key={index} className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ${index === currentHeroIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} style={{ backgroundImage: `url(${img})` }} />
        ))}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 to-transparent"></div>
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 z-30 w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white"><ArrowLeft size={20}/></button>
        <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-end pb-12">
          <h1 className="text-3xl md:text-7xl font-serif text-white tracking-tighter leading-none">{settings.productsHeroTitle}</h1>
          <p className="text-white/80 text-xs md:text-xl font-light mt-4">{settings.productsHeroSubtitle}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button onClick={() => setSelectedCat('all')} className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase ${selectedCat === 'all' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-100'}`}>All</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase ${selectedCat === cat.id ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-100'}`}>{cat.name}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all group flex flex-col">
              <div className="aspect-[4/5] relative overflow-hidden"><img src={product.media?.[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/><div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-xl text-sm font-bold">R {product.price}</div></div>
              <div className="p-6 text-left flex-grow flex flex-col">
                <h3 className="text-xl font-serif text-slate-900 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-slate-500 text-sm mt-4 line-clamp-2">{product.description}</p>
                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{categories.find(c => c.id === product.categoryId)?.name}</span><div className="p-2 bg-primary rounded-full text-slate-900"><ExternalLink size={14}/></div></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
