
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../App';
import { Shield, FileText, Info, ArrowLeft } from 'lucide-react';

const Legal: React.FC = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageData = () => {
    switch (location.pathname) {
      case '/disclosure':
        return {
          title: settings.disclosureTitle,
          content: settings.disclosureContent,
          icon: <Info className="text-primary" size={32} />
        };
      case '/privacy':
        return {
          title: settings.privacyTitle,
          content: settings.privacyContent,
          icon: <Shield className="text-primary" size={32} />
        };
      case '/terms':
        return {
          title: settings.termsTitle,
          content: settings.termsContent,
          icon: <FileText className="text-primary" size={32} />
        };
      default:
        return { title: 'Legal', content: '', icon: null };
    }
  };

  const { title, content, icon } = getPageData();

  return (
    <div className="min-h-screen pt-28 md:pt-40 pb-24 bg-[#FDFCFB] relative">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Back Button */}
        <button 
            onClick={() => navigate('/')}
            className="md:absolute md:top-32 md:left-12 mb-8 md:mb-0 w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-900 hover:bg-primary hover:text-white transition-all shadow-sm"
        >
            <ArrowLeft size={20} />
        </button>

        <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
          <div className="mb-6 p-4 bg-primary/5 rounded-3xl">
            {icon}
          </div>
          <h1 className="text-3xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">{title}</h1>
          <div className="w-16 h-px bg-primary/30"></div>
        </div>

        <div className="prose prose-slate max-w-none text-left">
          <div className="text-slate-600 leading-relaxed font-light whitespace-pre-wrap text-sm md:text-base">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('###')) {
                return <h3 key={i} className="text-xl md:text-2xl font-serif text-slate-900 mt-10 md:mt-12 mb-4 md:mb-6">{line.replace('###', '').trim()}</h3>;
              }
              if (line.startsWith('**')) {
                return <strong key={i} className="block text-slate-900 font-bold mt-6 md:mt-8 mb-2 uppercase text-[10px] md:text-xs tracking-widest">{line.replace(/\*\*/g, '').trim()}</strong>;
              }
              return <p key={i} className="mb-4">{line}</p>;
            })}
          </div>
        </div>
        
        <div className="mt-16 md:mt-20 pt-10 border-t border-slate-100 text-center">
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Last Updated</p>
          <p className="text-xs md:text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
};

export default Legal;
