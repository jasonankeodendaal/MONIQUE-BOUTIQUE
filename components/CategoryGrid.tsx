
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { INITIAL_CATEGORIES } from '../constants';
import { Category } from '../types';
import { CustomIcons } from './CustomIcons';

const CategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  const categories = useMemo<Category[]>(() => {
    const saved = localStorage.getItem('admin_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  }, []);

  const handleCategoryClick = (id: string) => {
    navigate(`/products?category=${id}`);
  };

  return (
    <section className="py-12 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-28 gap-4 md:gap-8">
          <div className="max-w-3xl text-center md:text-left">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] text-primary mb-2 md:mb-6 block">
              Curated Departments
            </span>
            {/* Fluid Text Sizing */}
            <h2 className="font-serif text-slate-900 leading-none tracking-tighter text-balance" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}>
              Shop by <br className="hidden md:block"/> <span className="italic font-light text-primary drop-shadow-sm">Department</span>
            </h2>
          </div>
          <p className="hidden md:block text-slate-400 max-w-xs font-light leading-relaxed mb-4 text-sm md:text-lg">
            Every piece hand-selected for the woman who appreciates modern elegance.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {categories.map((cat, idx) => {
            const IconComponent = CustomIcons[cat.icon] || (LucideIcons as any)[cat.icon] || LucideIcons.Package;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative h-[240px] md:h-[650px] w-full overflow-hidden rounded-[1.5rem] md:rounded-[3rem] transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-slate-100 hover:border-primary/20 hover:-translate-y-4"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800'})` }}
                />
                
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute inset-0 p-4 md:p-12 flex flex-col justify-end items-start text-left z-10">
                  <div className="w-8 h-8 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-3 md:mb-8 border border-white/20 transform -translate-y-4 md:-translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl">
                    <IconComponent size={14} className="md:w-6 md:h-6 text-white" />
                  </div>
                  
                  <span className="text-[7px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1 md:mb-4">
                    Collection 0{idx + 1}
                  </span>
                  
                  <h3 className="text-lg md:text-4xl font-serif text-white mb-2 md:mb-6 leading-tight group-hover:text-primary transition-colors duration-500">
                    {cat.name}
                  </h3>
                  
                  <p className="hidden md:block text-sm md:text-base text-white/60 leading-relaxed font-light mb-6 md:mb-10 max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100">
                    {cat.description}
                  </p>
                  
                  <div className="flex items-center gap-2 md:gap-4 text-white text-[8px] md:text-[11px] font-black uppercase tracking-[0.3em] group-hover:gap-4 md:group-hover:gap-8 transition-all duration-500">
                    Discover
                    <div className="h-px w-4 md:w-10 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
