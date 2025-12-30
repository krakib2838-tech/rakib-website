import React, { useState, useEffect } from 'react';
import { Youtube, Send, Lock, Instagram, Shield, LogIn, CheckCircle } from 'lucide-react';
import { SocialLinks } from '../types';
import { AdBanner } from './AdBanner';
import { RGBText } from './RGBText';

interface LoginProps {
  onLogin: () => void;
  onAdminLogin: () => void;
  requiredAccessKey: string;
  videoLink: string;
  socialLinks?: SocialLinks;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onAdminLogin, requiredAccessKey, videoLink, socialLinks }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (isSuccess && countdown === 0) {
      onLogin();
    }
    return () => clearTimeout(timer);
  }, [isSuccess, countdown, onLogin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey === requiredAccessKey) {
      setIsSuccess(true);
      setError('');
    } else {
      setError('Invalid Access Key');
      // Shake animation effect could be added here
    }
  };

  const openVideo = () => {
    if (videoLink) {
        window.open(videoLink, '_blank');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/20 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="w-full max-w-md bg-[#111827] rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(16,185,129,0.3)] border border-green-500/50 animate-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-6">
                <CheckCircle className="w-24 h-24 text-green-500 animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 font-gaming tracking-widest uppercase">Access Granted</h2>
            <p className="text-green-400 font-bold mb-8">Redirecting to Dashboard...</p>
            
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="#1f2937" strokeWidth="8" fill="transparent" />
                    <circle 
                        cx="64" cy="64" r="60" 
                        stroke="#10B981" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * countdown) / 5}
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                <span className="absolute text-4xl font-black text-white">{countdown}</span>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-[#0f172a] relative overflow-hidden">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-xl bg-[#111827] rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t-4 border-violet-600 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
           <div className="w-20 h-20 mb-4 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-600/30">
              <Shield className="w-10 h-10 text-white" fill="currentColor" />
           </div>
           
           <RGBText text="NAJMI FF EXPERIMENT" className="text-3xl md:text-4xl text-center mb-2 tracking-wider" />
           <p className="text-gray-400 font-medium text-sm tracking-wide">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
            
            {/* Access Key Input Block */}
            <div className="space-y-3">
               <label className="flex items-center gap-2 text-violet-400 text-base font-bold pl-1">
                  <Youtube size={20} fill="currentColor" />
                  <span>Access Key Password</span>
               </label>
               
               <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors z-10">
                     <Lock size={24} />
                  </div>
                  <input 
                     type="text" 
                     value={inputKey}
                     onChange={(e) => {
                       setInputKey(e.target.value);
                       setError('');
                     }}
                     className="w-full h-16 bg-white text-black pl-14 pr-4 rounded-xl font-bold text-xl outline-none focus:ring-4 focus:ring-violet-500/50 transition-all placeholder:text-gray-400 border-2 border-transparent focus:border-violet-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                     placeholder="Enter Key..."
                  />
               </div>

               {error && (
                  <p className="text-red-500 text-sm font-bold ml-1 animate-pulse bg-red-500/10 p-2 rounded-lg border border-red-500/20 text-center">{error}</p>
               )}

               <button 
                  type="button"
                  onClick={openVideo}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-600/30 active:scale-95 text-sm"
               >
                  <Youtube size={18} fill="currentColor" /> GET PASSWORD
               </button>
            </div>

            {/* Divider */}
            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                </div>
            </div>

            {/* Social Grid - Large Buttons */}
            <div className="grid grid-cols-3 gap-4">
               {/* Discord (Placeholder styling since explicit discord link might not be in config, mapping to telegram if needed or just static) */}
               <a href={socialLinks?.telegram} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center bg-[#5865F2] h-20 rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#5865F2]/20 group">
                  <div className="p-2 bg-white/20 rounded-full mb-1 group-hover:scale-110 transition-transform">
                    {/* Mock Discord Icon using Loader/Circle since lucide might not have exact discord brand icon */}
                    <div className="font-black text-white text-xs">DIS</div>
                  </div>
                  <span className="text-white text-xs font-bold uppercase">Discord</span>
               </a>
               
               {socialLinks?.telegram && (
                 <a href={socialLinks.telegram} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center bg-[#2AABEE] h-20 rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#2AABEE]/20 group">
                    <div className="p-2 bg-white/20 rounded-full mb-1 group-hover:scale-110 transition-transform">
                        <Send size={16} className="text-white" fill="currentColor" />
                    </div>
                    <span className="text-white text-xs font-bold uppercase">Telegram</span>
                 </a>
               )}

               {socialLinks?.youtube && (
                 <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center bg-[#FF0000] h-20 rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#FF0000]/20 group">
                    <div className="p-2 bg-white/20 rounded-full mb-1 group-hover:scale-110 transition-transform">
                        <Youtube size={16} className="text-white" fill="currentColor" />
                    </div>
                    <span className="text-white text-xs font-bold uppercase">YouTube</span>
                 </a>
               )}
            </div>

            {/* Login Button */}
            <button
                type="submit"
                className="w-full h-16 bg-[#10B981] hover:bg-[#059669] text-white font-black text-xl rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] active:scale-[0.98] uppercase tracking-wide"
            >
                <LogIn size={24} strokeWidth={3} /> Login Dashboard
            </button>
        </form>
        
        {/* Ad Banner inside Login */}
        <div className="mt-8">
            <AdBanner />
        </div>

        <div className="mt-6 text-center">
             <button 
                onClick={onAdminLogin} 
                className="text-xs text-gray-600 hover:text-gray-400 font-bold uppercase tracking-widest transition-colors"
             >
                Admin Access
             </button>
        </div>

      </div>
    </div>
  );
};