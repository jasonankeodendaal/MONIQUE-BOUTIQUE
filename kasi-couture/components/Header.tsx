
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useSettings } from '../App';

const Header: React.FC = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide header entirely on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: settings.navHomeLabel, path: '/' },
    { name: settings.navProductsLabel, path: '/products' },
    { name: settings.navAboutLabel, path: '/about' },
    { name: settings.navContactLabel, path: '/contact' },
  ];

  // Enable dark section (transparent header, white text) for Home and About pages
  const isDarkSection = !scrolled && (location.pathname === '/' || location.pathname === '/about');

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-sm' 
        : 'bg-transparent py-5 md:py-8'
    } ${isOpen ? 'bg-white border-b border-slate-200' : ''}`}>
      <nav className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className={`flex items-center space-x-4 group ${location.pathname === '/' && !scrolled && !isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative">
              {settings.companyLogoUrl ? (
                <img 
                  src={settings.companyLogoUrl} 
                  alt={settings.companyName} 
                  className="h-12 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-sm" 
                />
              ) : (
                <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-lg md:text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  {settings.companyLogo}
                </div>
              )}
            </div>
            <div className={`flex flex-col -space-y-1 text-left ${settings.companyLogoUrl ? 'hidden md:flex' : 'flex'}`}>
              <span className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${
                scrolled || isOpen || !isDarkSection ? 'text-slate-900' : 'text-white'
              }`}>
                {settings.companyName}
              </span>
              <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] ${
                scrolled || isOpen || !isDarkSection ? 'text-primary' : 'text-primary/90'
              }`}>
                {settings.slogan || 'Boutique Curation'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary relative group ${
                  location.pathname === link.path 
                    ? 'text-primary' 
                    : (scrolled || isOpen || !isDarkSection ? 'text-slate-500' : 'text-white/80')
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
            
            <div className="flex items-center pl-6 border-l border-slate-200/20 space-x-4">
              <Link
                to="/products"
                className={`p-2 transition-colors ${scrolled || !isDarkSection ? 'text-slate-900 hover:text-primary' : 'text-white/80 hover:text-white'}`}
              >
                <ShoppingBag size={22} />
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${
                scrolled || isOpen || !isDarkSection ? 'text-slate-900' : 'text-white'
              }`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-2xl transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100 py-8 px-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-3xl font-serif font-bold ${
                  location.pathname === link.path ? 'text-primary' : 'text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
