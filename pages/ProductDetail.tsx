
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowLeft, Package, Share2, Star, MessageCircle, X, CheckCircle, Copy, Facebook, Twitter, Mail, Minus, Plus } from 'lucide-react';
import { useSettings } from '../App';
import { Product, ProductStats, Review } from '../types';
import { db } from '../lib/supabase';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings, products, categories, refreshData } = useSettings();
  
  const product = products.find((p: Product) => p.id === id);
  const category = categories.find(c => c.id === product?.categoryId || (product as any)?.category_id === c.id);
  
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoaded(true);
    if (id) {
       const trackView = async () => {
         const allStats = await db.stats.all();
         const existing = allStats.find(s => s.product_id === id);
         await db.stats.upsert({
           product_id: id,
           views: (existing?.views || 0) + 1,
           last_updated: new Date().toISOString()
         });
       };
       trackView();
    }
  }, [id]);

  const handleTrackClick = async () => {
    if (id) {
      const allStats = await db.stats.all();
      const existing = allStats.find(s => s.product_id === id);
      await db.stats.upsert({
        product_id: id,
        clicks: (existing?.clicks || 0) + 1,
        last_updated: new Date().toISOString()
      });
    }
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const media = product.media || [];
  const currentMedia = media[activeMediaIndex];

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-left">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-3/5 h-[50vh] lg:h-screen relative bg-slate-100 group">
          <button onClick={() => navigate('/products')} className="absolute top-6 left-6 z-30 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><ArrowLeft/></button>
          {currentMedia?.url ? <img src={currentMedia.url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package size={64}/></div>}
          {media.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {media.map((_, i) => <button key={i} onClick={() => setActiveMediaIndex(i)} className={`h-1.5 rounded-full transition-all ${i === activeMediaIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}/>)}
            </div>
          )}
        </div>
        <div className="w-full lg:w-2/5 p-6 md:p-12 lg:pt-32 space-y-8">
           <h1 className="text-4xl font-serif">{product.name}</h1>
           <div className="text-3xl font-black">R {product.price.toLocaleString()}</div>
           <a href={product.affiliateLink} target="_blank" rel="noopener" onClick={handleTrackClick} className="w-full py-5 bg-primary text-slate-900 font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3">
             Secure Acquisition <ExternalLink size={18}/>
           </a>
           <p className="text-slate-600 font-light leading-relaxed">{product.description}</p>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
