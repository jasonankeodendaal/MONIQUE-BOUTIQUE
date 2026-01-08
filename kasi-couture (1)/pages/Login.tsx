
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LogIn, Mail, Lock, AlertCircle, Chrome, Terminal, Info } from 'lucide-react';
import { useSettings } from '../App';

const Login: React.FC = () => {
  const { settings, isLocalMode } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulation for Local Mode
    if (isLocalMode) {
      setTimeout(() => {
        setLoading(false);
        // In local mode, ProtectedRoute allows access regardless of user state
        navigate('/admin');
      }, 1500);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      if (!isLocalMode) setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLocalMode) {
       // Simulation for Local Mode
       navigate('/admin');
       return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          // Use origin to prevent HashRouter issues during callback
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Handle the specific 404 NOT_FOUND error from Supabase/GoTrue
      if (err.message?.includes('NOT_FOUND') || err.message?.includes('404')) {
        setError('Configuration Error: Google Login is disabled in Supabase or the Project URL is incorrect.');
      } else {
        setError(err.message || 'Google authentication failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-2xl shadow-primary/20 border border-primary/20">
            <Lock size={28} className="md:w-8 md:h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2 tracking-tight">Portal <span className="text-primary italic font-light">Access</span></h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-[2.5rem] shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {isLocalMode && (
             <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-left space-y-2">
                 <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest">
                    <Info size={14} /> Simulation Mode
                 </div>
                 <p className="text-slate-400 text-[10px] leading-relaxed">
                   Supabase is not configured. Authentication is simulated. Enter any details to proceed.
                 </p>
             </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Identity Mailbox</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                  placeholder="admin@kasicouture.com"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-slate-900 font-black uppercase text-xs tracking-[0.2em] rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={18} />
                  {isLocalMode ? 'Simulate Entry' : 'Authenticate'}
                </>
              )}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <span className="relative px-4 bg-slate-900 text-[9px] font-black text-slate-600 uppercase tracking-widest">Or Secure With</span>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all border border-slate-200"
          >
            <Chrome size={18} />
            {isLocalMode ? 'Simulate Google Login' : 'Sign in with Google'}
          </button>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="mt-8 w-full text-center text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
        >
          Return to Public Front
        </button>
      </div>
    </div>
  );
};

export default Login;
