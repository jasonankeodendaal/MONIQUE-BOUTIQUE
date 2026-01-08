
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, ShieldCheck, ArrowLeft, Package, Share2, Tag, Sparkles, MessageCircle, Star, Check, Plus, Minus, Truck, Box } from 'lucide-react';
import { useSettings } from '../App';
import { Review } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings, products, categories, incrementStat } = useSettings();
  
  const product = products.find(p => p.id === id);
  const category = categories.find(c => c.id === product?.categoryId);
  
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => setIsLoaded(true), 100);
    
    // Track View via Central Context (Supabase or Local)
    if (id) {
      incrementStat(id, 'view');
    }

    return () => clearTimeout(timeout);
  }, [id, incrementStat]);

  const handleTrackClick = () => {
    if (id) incrementStat(id, 'click');
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 3);
  }, [products, product]);

  const averageRating = useMemo(() => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round(sum / product.reviews.length);
  }, [product?.reviews]);

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

  return (
    <main className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="hidden lg:block absolute top-28 left-10 md:left-20 z-30">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
           <Link to="/" className="hover:text-primary transition-colors">Home</Link>
           <ChevronRight size={10} />
           <Link to="/products" className="hover:text-primary transition-colors">Collections</Link>
           {category && <><ChevronRight size={10} /><Link to={`/products?category=${category.id}`} className="hover:text-primary transition-colors">{category.name}</Link></>}
           <ChevronRight size={10} />
           <span className="text-slate-900 truncate max-w-[150px]">{product.name}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden">
        <div className="w-full lg:w-3/5 h-[45vh] md:h-[55vh] lg:h-full relative bg-slate-100 overflow-hidden group">
          <button onClick={() => navigate('/products')} className="absolute top-6 left-6 md:top-10 md:left-10 lg:hidden z-30 w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20"><ArrowLeft size={20} /></button>
          <div className="absolute inset-0 flex items-center justify-center">
            {currentMedia ? <img src={currentMedia.url} alt={product.name} className="w-full h-full object-cover" /> : <div className="text-slate-200"><Package size={80}/></div>}
          </div>
        </div>

        <div className="w-full lg:w-2/5 h-full lg:overflow-y-auto bg-white custom-scrollbar flex flex-col pt-12 lg:pt-32">
          <div className="p-6 md:p-12 lg:p-16 flex-grow">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-2">
                 <div className="flex items-center gap-1 text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" className={i < averageRating ? "" : "text-slate-200"} />)}
                    <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-widest">({product.reviews?.length || 0} Reviews)</span>
                 </div>
                 <h1 className="font-serif text-slate-900 leading-tight tracking-tighter text-3xl md:text-5xl">{product.name}</h1>
                 <div className="flex items-center gap-4 pt-2">
                    <span className="text-2xl font-bold text-slate-900">R {product.price.toLocaleString()}</span>
                 </div>
              </div>
            </div>

            <div className="space-y-8 mb-10">
              <p className="text-base text-slate-600 font-light leading-relaxed">{product.description}</p>
              {product.features && product.features.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={12} className="text-primary"/> Highlights</h4>
                  <ul className="space-y-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                        <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" onClick={handleTrackClick} className="group relative w-full py-5 bg-slate-900 text-white rounded-2xl overflow-hidden flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 transition-all active:scale-95 mb-12">
              <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em]">Acquire This Piece</span>
              <ExternalLink size={16} className="relative z-10" />
            </a>

            {/* Related Curations */}
            {relatedProducts.length > 0 && (
              <div className="mb-16">
                 <h3 className="text-xl font-serif text-slate-900 mb-6">Complete The Look</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {relatedProducts.map(rp => (
                       <Link to={`/product/${rp.id}`} key={rp.id} className="group block">
                          <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
                             <img src={rp.media?.[0]?.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-slate-900">R {rp.price}</div>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{rp.name}</h4>
                       </Link>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
