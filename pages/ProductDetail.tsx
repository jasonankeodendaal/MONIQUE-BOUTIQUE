
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, ShieldCheck, ArrowLeft, Play, Package, Share2, Tag, Sparkles, MessageCircle, Star, Send, Check, ChevronDown, Minus, Plus, Box, Truck, X, Facebook, Twitter, Mail, Copy, CheckCircle } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../constants';
import { useSettings } from '../App';
import { Product, DiscountRule, ProductStats, Review } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  // Use state for products to allow local updates (for reviews)
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('admin_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const product = allProducts.find((p: Product) => p.id === id);
  const category = INITIAL_CATEGORIES.find(c => c.id === product?.categoryId);
  
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Review Form State
  const [newReview, setNewReview] = useState({ userName: '', comment: '', rating: 5 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Accordion State
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  // Share State
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSubmittingReview(true);
    
    setTimeout(() => {
      const review: Review = {
        id: Date.now().toString(),
        userName: newReview.userName || 'Guest',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: Date.now()
      };

      const updatedProducts = allProducts.map(p => 
        p.id === id ? { ...p, reviews: [review, ...(p.reviews || [])] } : p
      );
      
      setAllProducts(updatedProducts);
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      
      setNewReview({ userName: '', comment: '', rating: 5 });
      setIsSubmittingReview(false);
    }, 800);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name} at ${settings.companyName}`,
          url: window.location.href
        });
      } catch (err) {
        console.log("Share skipped", err);
      }
    } else {
      setIsShareOpen(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 3);
  }, [allProducts, product]);

  const averageRating = useMemo(() => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round(sum / product.reviews.length);
  }, [product?.reviews]);

  const socialShares = useMemo(() => {
     const url = window.location.href;
     const text = `Check out ${product?.name}`;
     return [
      { name: 'WhatsApp', icon: MessageCircle, color: 'bg-[#25D366]', text: 'text-white', url: `https://wa.me/?text=${encodeURIComponent(`${text}: ${url}`)}` },
      { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]', text: 'text-white', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
      { name: 'Twitter', icon: Twitter, color: 'bg-[#1DA1F2]', text: 'text-white', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
      { name: 'Email', icon: Mail, color: 'bg-slate-100', text: 'text-slate-900', url: `mailto:?subject=${encodeURIComponent(product?.name || '')}&body=${encodeURIComponent(`${text}: ${url}`)}` },
    ];
  }, [product]);

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
      
      {/* --- Breadcrumbs --- */}
      <div className="hidden lg:block absolute top-28 left-10 md:left-20 z-30">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
           <Link to="/" className="hover:text-primary transition-colors">Home</Link>
           <ChevronRight size={10} />
           <Link to="/products" className="hover:text-primary transition-colors">Collections</Link>
           {category && (
             <>
               <ChevronRight size={10} />
               <Link to={`/products?category=${category.id}`} className="hover:text-primary transition-colors">{category.name}</Link>
             </>
           )}
           <ChevronRight size={10} />
           <span className="text-slate-900 truncate max-w-[150px]">{product.name}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden">
        
        {/* Left Side: Cinematic Media Gallery */}
        <div className="w-full lg:w-3/5 h-[45vh] md:h-[55vh] lg:h-full relative bg-slate-100 overflow-hidden group">
          <button 
            onClick={() => navigate('/products')}
            className="absolute top-6 left-6 md:top-10 md:left-10 lg:hidden z-30 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl border border-white/20"
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
        </div>

        {/* Right Side: Curator Details */}
        <div className="w-full lg:w-2/5 h-full lg:overflow-y-auto bg-white custom-scrollbar flex flex-col pt-12 lg:pt-32">
          <div className="p-6 md:p-12 lg:p-16 flex-grow">
            
            {/* --- Header Section --- */}
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-2">
                 {/* Rating Badge */}
                 <div className="flex items-center gap-1 text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" className={i < averageRating ? "" : "text-slate-200"} />
                    ))}
                    <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-widest">({product.reviews?.length || 0} Reviews)</span>
                 </div>
                 <h1 className="font-serif text-slate-900 leading-tight tracking-tighter text-3xl md:text-5xl">{product.name}</h1>
                 <div className="flex items-center gap-4 pt-2">
                    <span className="text-2xl font-bold text-slate-900">R {product.price.toLocaleString()}</span>
                    {product.discountRules && product.discountRules.length > 0 && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[10px]">
                        {product.discountRules[0].type === 'percentage' ? `-${product.discountRules[0].value}%` : `-R${product.discountRules[0].value}`}
                      </div>
                    )}
                 </div>
              </div>
              <button 
                onClick={handleShare}
                className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Share this product"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* --- Descriptions --- */}
            <div className="space-y-8 mb-10">
              <p className="text-base text-slate-600 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Key Features List */}
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

            {/* --- Affiliate CTA --- */}
            <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleTrackClick}
              className="group relative w-full py-5 bg-slate-900 text-white rounded-2xl overflow-hidden flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 transition-all active:scale-95 mb-12"
            >
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">Acquire This Piece</span>
              <ExternalLink size={16} className="relative z-10 group-hover:text-slate-900 transition-colors" />
            </a>

            {/* --- Accordions for Details --- */}
            <div className="space-y-2 mb-16 border-t border-slate-100 pt-8">
               {/* Specifications */}
               <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                    className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-3"><Tag size={16} className="text-slate-400"/> Specifications</span>
                    {openAccordion === 'specs' ? <Minus size={16} className="text-slate-400"/> : <Plus size={16} className="text-slate-400"/>}
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${openAccordion === 'specs' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-5 pt-0 bg-white">
                       <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                         {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key}>
                               <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{key}</span>
                               <span className="text-sm font-medium text-slate-700">{value}</span>
                            </div>
                         )) : (
                            <div className="col-span-2 text-slate-400 text-xs italic">Standard sizing applies. Please refer to retailer chart.</div>
                         )}
                         <div className="col-span-2 pt-2 border-t border-slate-100 mt-2">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SKU</span>
                            <span className="text-xs font-mono text-slate-500">{product.sku}</span>
                         </div>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Shipping & Authenticity */}
               <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                    className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-3"><Truck size={16} className="text-slate-400"/> Delivery & Authenticity</span>
                    {openAccordion === 'shipping' ? <Minus size={16} className="text-slate-400"/> : <Plus size={16} className="text-slate-400"/>}
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${openAccordion === 'shipping' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-5 pt-0 bg-white space-y-4">
                       <div className="flex items-start gap-3">
                          <ShieldCheck size={18} className="text-green-600 mt-1 flex-shrink-0"/>
                          <div>
                             <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Guaranteed Authentic</h5>
                             <p className="text-xs text-slate-500 leading-relaxed">Every item listed is vetted by our curation team. We only partner with authorized retailers and official brand partners.</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-3">
                          <Box size={18} className="text-blue-600 mt-1 flex-shrink-0"/>
                          <div>
                             <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Retailer Fulfillment</h5>
                             <p className="text-xs text-slate-500 leading-relaxed">This item is sold and shipped by a third-party partner. Returns and exchanges are subject to the retailer's policy.</p>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* --- Related Curations --- */}
            {relatedProducts.length > 0 && (
              <div className="mb-16">
                 <h3 className="text-xl font-serif text-slate-900 mb-6">Complete The Look</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {relatedProducts.map(rp => (
                       <Link to={`/product/${rp.id}`} key={rp.id} className="group block">
                          <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
                             <img src={rp.media?.[0]?.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-slate-900">
                                R {rp.price}
                             </div>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{rp.name}</h4>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest">{category?.name}</span>
                       </Link>
                    ))}
                 </div>
              </div>
            )}

            {/* REVIEWS SECTION */}
            <div className="border-t border-slate-100 pt-16">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-serif text-slate-900 flex items-center gap-3">
                     <MessageCircle size={24} className="text-primary"/> Impressions
                  </h3>
               </div>
               
               {/* Review List */}
               <div className="space-y-6 mb-12">
                  {product.reviews && product.reviews.length > 0 ? (
                     product.reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative">
                           <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-slate-900 text-sm">{review.userName}</span>
                              <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                     <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-200"} />
                                  ))}
                              </div>
                           </div>
                           <p className="text-slate-500 text-sm font-light leading-relaxed">{review.comment}</p>
                           <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-2 block">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                     ))
                  ) : (
                     <p className="text-slate-400 text-sm italic">Be the first to share your thoughts.</p>
                  )}
               </div>

               {/* Add Review Form */}
               <form onSubmit={handleSubmitReview} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-4">Leave a Review</h4>
                  <div className="space-y-3">
                     <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={newReview.userName}
                        onChange={e => setNewReview({...newReview, userName: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm focus:border-primary transition-all"
                        required
                     />
                     <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                           <button 
                              key={star} 
                              type="button" 
                              onClick={() => setNewReview({...newReview, rating: star})}
                              className={`p-1.5 rounded-lg transition-all ${newReview.rating >= star ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-300 bg-white border border-slate-200'}`}
                           >
                              <Star size={14} fill={newReview.rating >= star ? "currentColor" : "none"} />
                           </button>
                        ))}
                     </div>
                     <textarea 
                        placeholder="Your thoughts..." 
                        rows={3}
                        value={newReview.comment}
                        onChange={e => setNewReview({...newReview, comment: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm focus:border-primary transition-all resize-none"
                        required
                     />
                     <button 
                        type="submit" 
                        disabled={isSubmittingReview}
                        className="w-full py-3 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary hover:text-slate-900 transition-all disabled:opacity-50"
                     >
                        {isSubmittingReview ? 'Publishing...' : 'Publish'}
                     </button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 relative shadow-2xl">
            <button onClick={() => setIsShareOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                <X size={20} className="text-slate-500" />
            </button>
            
            <h3 className="text-2xl font-serif text-slate-900 mb-2">Share</h3>
            <p className="text-slate-500 text-sm mb-8">Spread the word about this curation.</p>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
                {socialShares.map((platform) => (
                  <a 
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 ${platform.color} ${platform.text}`}
                    title={`Share on ${platform.name}`}
                  >
                      <platform.icon size={24} />
                  </a>
                ))}
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex-grow truncate text-xs text-slate-500 font-mono">
                  {window.location.href}
                </div>
                <button onClick={handleCopyLink} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-slate-900 transition-colors">
                  {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetail;
