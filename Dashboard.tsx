
import React, { useState, useEffect, useCallback, memo } from 'react';
import { LogOut, Instagram, Hash, Shield, Search, Zap, User, LayoutGrid, Users, ArrowLeft, Target, Settings, CheckCircle, XCircle, Send, Ban, ShieldAlert, Server } from 'lucide-react';
import { ref, runTransaction, onValue } from 'firebase/database';
import { database } from '../firebase';
import { AppConfig, Emote, Category, ServerConfig } from '../types';
import { AdBanner } from './AdBanner';
import { RGBText } from './RGBText';

interface DashboardProps {
  onLogout: () => void;
  config: AppConfig;
}

// Optimized Child Component for Emote Items
interface EmoteItemProps {
  emote: Emote;
  isProcessing: boolean;
  isSuccess: boolean;
  onClick: () => void;
}

const EmoteItem = memo(({ emote, isProcessing, isSuccess, onClick }: EmoteItemProps) => {
  return (
    <button
        onClick={onClick}
        draggable="false"
        disabled={isProcessing}
        className={`group relative bg-white rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] border-2 ${isSuccess ? 'border-violet-600 ring-2 ring-violet-600/50' : 'border-transparent hover:border-violet-600'} will-change-transform touch-manipulation`}
    >
        {/* Card Content - Reduced padding from p-6 to p-2 for smaller images */}
        <div className="aspect-square p-2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
            <img 
                src={emote.imageUrl} 
                alt={emote.name} 
                draggable="false"
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300 select-none" 
            />
        </div>
        
        {/* Processing Overlay */}
        {isProcessing && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 backdrop-blur-[2px]">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-violet-600 rounded-full animate-spin mb-1"></div>
                <span className="text-[8px] font-bold text-violet-600 uppercase animate-pulse">Sending...</span>
            </div>
        )}
        
        {/* Success Flash */}
        {isSuccess && (
            <div className="absolute inset-0 bg-violet-600/20 pointer-events-none animate-pulse"></div>
        )}
    </button>
  );
});

// System Servers (Hardcoded to ensure they always appear)
const SYSTEM_SERVERS: ServerConfig[] = [
    { 
        id: 'sys_india', 
        name: 'INDIA SERVER', 
        region: 'indian', 
        order: -2, 
        apiKey: 'https://t-ee0r.onrender.com/join?tc={tc}&uid1={uid1}&uid2={uid2}&uid3={uid3}&uid4={uid4}&uid5={uid5}&uid6={uid6}&emote_id={emote_id}' 
    },
    { 
        id: 'sys_bd', 
        name: 'BANGLADESH SERVER', 
        region: 'bangladesh', 
        order: -1, 
        apiKey: 'https://godjexar-bangladesh-emote-bot-api.vercel.app/play_emote?region=bd&teamcode={teamcode}&uid={uid}&emote={emote}' 
    }
];

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, config }) => {
  const [viewMode, setViewMode] = useState<'home' | 'group56' | 'bannedCheck'>('home');

  // Home State
  const [tc, setTc] = useState('');
  const [uids, setUids] = useState<string[]>(['', '', '', '', '', '']);
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  
  // 5/6 Group State
  const [groupUid, setGroupUid] = useState('');
  const [groupSize, setGroupSize] = useState('5');
  const [groupStatus, setGroupStatus] = useState<{type: 'success' | 'error' | '', msg: string}>({ type: '', msg: '' });
  const [isGroupProcessing, setIsGroupProcessing] = useState(false);

  // Banned Check State
  const [bannedUid, setBannedUid] = useState('');
  const [isBannedChecking, setIsBannedChecking] = useState(false);
  const [bannedResult, setBannedResult] = useState<any>(null);
  const [bannedError, setBannedError] = useState('');

  // Data State (Real-time)
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Visual Feedback State
  const [processingEmoteId, setProcessingEmoteId] = useState<string | null>(null);
  const [lastSentEmoteId, setLastSentEmoteId] = useState<string | null>(null);
  const [status, setStatus] = useState<{type: 'success' | 'error' | '', msg: string}>({ type: '', msg: '' });

  // Real-time Data Listeners
  useEffect(() => {
    // Servers
    const serversRef = ref(database, 'servers');
    const unsubServers = onValue(serversRef, (snapshot) => {
        let dbServers: ServerConfig[] = [];
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                dbServers.push({ id: child.key as string, ...child.val() });
            });
        }
        
        // Merge System Servers with DB Servers
        const allServers = [...SYSTEM_SERVERS, ...dbServers].sort((a, b) => a.order - b.order);
        setServers(allServers);
        
        // Auto-select first server if none selected
        if (allServers.length > 0 && !selectedServerId) {
            setSelectedServerId(allServers[0].id);
        } else if (!selectedServerId) {
             // Fallback if strictly everything is empty (unlikely with system servers)
             setSelectedServerId(SYSTEM_SERVERS[0].id);
        }
    });

    // Emotes
    const emotesRef = ref(database, 'emotes');
    const unsubEmotes = onValue(emotesRef, (snapshot) => {
       if (snapshot.exists()) {
        const list: Emote[] = [];
        snapshot.forEach(child => {
            list.push({ id: child.key as string, ...child.val() });
        });
        setEmotes(list);
       } else {
        setEmotes([]);
       }
    });

    // Categories
    const catRef = ref(database, 'categories');
    const unsubCat = onValue(catRef, (snapshot) => {
      if (snapshot.exists()) {
        const list: Category[] = [];
        snapshot.forEach(child => {
            list.push({ id: child.key as string, ...child.val() });
        });
        setCategories(list.sort((a, b) => a.order - b.order));
      } else {
        setCategories([]);
       }
    });

    return () => {
        unsubServers();
        unsubEmotes();
        unsubCat();
    };
  }, [selectedServerId]);

  const handleUidChange = (index: number, value: string) => {
    const newUids = [...uids];
    newUids[index] = value;
    setUids(newUids);
  };

  const trackUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const analyticsRef = ref(database, `analytics/${today}/emoteSends`);
    runTransaction(analyticsRef, (currentCount) => {
      return (currentCount || 0) + 1;
    });
  };

  const constructApiUrl = (template: string, tc: string, uids: string[], emoteId: string) => {
      let url = template;
      
      // Standardize Replacements
      // Support both {tc} and {teamcode}
      url = url.replace(/\{tc\}/g, tc).replace(/\{teamcode\}/g, tc);
      
      // Support both {emote_id} and {emote}
      url = url.replace(/\{emote_id\}/g, emoteId).replace(/\{emote\}/g, emoteId);
      
      // Support {uid} (First UID) - Matches {uid} exactly, not {uid1}
      url = url.replace(/\{uid\}(?!\d)/g, uids[0]);

      // Support {uid1} to {uid6}
      uids.forEach((uid, index) => {
          url = url.replace(new RegExp(`\{uid${index + 1}\}`, 'g'), uid);
      });

      // Legacy/Raw Placeholder Support (e.g. "tc={}")
      if (url.includes('tc={}')) url = url.replace('tc={}', `tc=${tc}`);
      if (url.includes('teamcode={}')) url = url.replace('teamcode={}', `teamcode=${tc}`);
      
      if (url.includes('emote_id={}')) url = url.replace('emote_id={}', `emote_id=${emoteId}`);
      if (url.includes('emote={}')) url = url.replace('emote={}', `emote=${emoteId}`);

      if (url.includes('uid={}')) url = url.replace('uid={}', `uid=${uids[0]}`);
      
      uids.forEach((uid, index) => {
          if (url.includes(`uid${index + 1}={}`)) {
              url = url.replace(`uid${index + 1}={}`, `uid${index + 1}=${uid}`);
          }
      });

      // Add timestamp to prevent caching
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}_t=${Date.now()}`;
  };

  const selectedServer = servers.find(s => s.id === selectedServerId);

  const handleSendEmote = useCallback(async (targetEmoteId: string, internalId: string) => {
    if (!tc) {
        setStatus({ type: 'error', msg: 'ENTER TEAM CODE' });
        setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
        return;
    }

    if (!selectedServer) {
        setStatus({ type: 'error', msg: 'SELECT A SERVER' });
        setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
        return;
    }

    setProcessingEmoteId(internalId);

    // Use the API Key/URL from the selected server configuration
    const API_TEMPLATE = selectedServer.apiKey;
    const finalUrl = constructApiUrl(API_TEMPLATE, tc, uids, targetEmoteId);
    
    // Check if HTTP (needs proxy) or HTTPS
    const useProxy = finalUrl.startsWith('http://') && !finalUrl.startsWith('http://localhost');
    const fetchUrl = useProxy 
        ? `https://api.allorigins.win/raw?url=${encodeURIComponent(finalUrl)}` 
        : finalUrl;

    try {
        // --- STEP 1: First Request (Join Lobby) ---
        setStatus({ type: 'success', msg: 'JOINING...' });
        await fetch(fetchUrl, { method: 'GET', mode: 'no-cors', cache: 'no-cache' });

        // --- STEP 2: Wait for Bot ---
        await new Promise(resolve => setTimeout(resolve, 500));

        // --- STEP 3: Second Request (Show Emote) ---
        setStatus({ type: 'success', msg: 'EMOTING...' });
        // Update timestamp for second call
        const secondUrl = fetchUrl.replace(/_t=\d+/, `_t=${Date.now()}`);
        await fetch(secondUrl, { method: 'GET', mode: 'no-cors', cache: 'no-cache' });
        
        // Success State
        setLastSentEmoteId(internalId);
        trackUsage();
        setStatus({ type: 'success', msg: 'SENT SUCCESSFULLY!' });
        setTimeout(() => setStatus({ type: '', msg: '' }), 2000);

    } catch (e) {
        console.error(e);
        setStatus({ type: 'error', msg: 'NETWORK ERROR' });
        setTimeout(() => setStatus({ type: '', msg: '' }), 2000);
    } finally {
        setProcessingEmoteId(null);
    }
  }, [tc, uids, selectedServer]);

  const handleGroup56Submit = async () => {
    if (!groupUid.trim()) {
        setGroupStatus({ type: 'error', msg: 'Please enter a valid UID' });
        return;
    }
    if (!groupSize) {
        setGroupStatus({ type: 'error', msg: 'Please select a group size' });
        return;
    }

    setIsGroupProcessing(true);
    setGroupStatus({ type: '', msg: '' });

    try {
        await fetch(`https://5-6-player-group-api-ind-jexar.vercel.app/send_invite?uid=${groupUid}&groupsize=${groupSize}`, {
            method: 'GET',
            mode: 'no-cors'
        });
        setGroupStatus({ type: 'success', msg: 'Request Sent Successfully!' });
    } catch (error) {
        console.error(error);
        setGroupStatus({ type: 'error', msg: 'Network Connection Failed' });
    } finally {
        setIsGroupProcessing(false);
    }
  };

  const handleBannedCheck = async () => {
      if (!bannedUid.trim()) {
          setBannedError('Please enter a valid Player UID');
          return;
      }
      
      setIsBannedChecking(true);
      setBannedResult(null);
      setBannedError('');

      try {
          const targetUrl = `https://amin-team-api.vercel.app/check_banned?player_id=${bannedUid}`;
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

          const response = await fetch(proxyUrl);
          
          if (!response.ok) throw new Error('API Error');
          const data = await response.json();
          
          if (data) {
              setBannedResult(data);
          } else {
              setBannedError('Player Not Found');
          }
      } catch (error) {
          console.error("Banned Check Error:", error);
          setBannedError('Server Not Responding');
      } finally {
          setIsBannedChecking(false);
      }
  };

  const filteredEmotes = activeCategory === 'All' 
    ? emotes 
    : emotes.filter(e => e.category === activeCategory);

  return (
    <div className="min-h-screen pb-20 font-sans text-white">
      
      {/* --- HEADER --- */}
      <nav className="bg-white border-b-4 border-violet-600 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-black flex-shrink-0 border border-black rounded-lg overflow-hidden">
                    <img 
                        src={config.logoUrl || "https://img.sanishtech.com/u/d77d54bafa3d1b5d7122eca0b9409ade.jpg"} 
                        alt="Logo" 
                        draggable="false"
                        className="w-full h-full object-cover" 
                    />
                 </div>
                <div className="flex flex-col justify-center leading-none">
                    <span className="text-xl font-gaming font-black italic tracking-tighter text-black uppercase">
                        NAJMI EMOTE
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        Professional Tool v2.0
                    </span>
                </div>
            </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        
        {/* --- 5/6 GROUP INTERFACE --- */}
        {viewMode === 'group56' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <button 
                    onClick={() => setViewMode('home')}
                    className="mb-6 flex items-center gap-2 text-violet-300 hover:text-white transition-colors font-bold uppercase text-xs tracking-wider"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <div className="bg-[#111827] rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-violet-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="text-center mb-8 relative z-10">
                        <RGBText text="5/6 PLAYER GROUP TOOL" className="text-3xl md:text-4xl mb-2" />
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Advanced Group Management</p>
                    </div>

                    <div className="max-w-lg mx-auto space-y-6 relative z-10">
                        
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-wide">
                                <User size={14} /> Target UID
                            </label>
                            <input 
                                type="number" 
                                placeholder="Enter Player UID"
                                value={groupUid}
                                onChange={(e) => setGroupUid(e.target.value)}
                                className="w-full h-12 bg-[#1f2937] border border-gray-700 text-white rounded-xl px-4 font-bold outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-wide">
                                <Users size={14} /> Group Size
                            </label>
                            <select 
                                value={groupSize}
                                onChange={(e) => setGroupSize(e.target.value)}
                                className="w-full h-12 bg-[#1f2937] border border-gray-700 text-white rounded-xl px-4 font-bold outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all cursor-pointer"
                            >
                                <option value="5">5 GROUP</option>
                                <option value="6">6 GROUP</option>
                            </select>
                        </div>

                        <button 
                            onClick={handleGroup56Submit}
                            disabled={isGroupProcessing}
                            className={`w-full h-14 mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-lg uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] active:scale-95 transition-all flex items-center justify-center gap-3 ${isGroupProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isGroupProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    PROCESSING...
                                </>
                            ) : (
                                <>
                                    <Send size={20} /> SEND REQUEST
                                </>
                            )}
                        </button>

                        {groupStatus.msg && (
                            <div className={`p-4 rounded-xl border flex items-center gap-3 font-bold text-sm uppercase animate-in slide-in-from-top-2 ${groupStatus.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
                                {groupStatus.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                <span>{groupStatus.msg}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* --- BANNED CHECK INTERFACE --- */}
        {viewMode === 'bannedCheck' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <button 
                    onClick={() => setViewMode('home')}
                    className="mb-6 flex items-center gap-2 text-red-300 hover:text-white transition-colors font-bold uppercase text-xs tracking-wider"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <div className="bg-[#111827] rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)] border border-red-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="text-center mb-8 relative z-10">
                        <h1 className="text-3xl md:text-4xl mb-2 font-gaming font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                             BANNED CHECK TOOL
                        </h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Check Account Status Instantly</p>
                    </div>

                    <div className="max-w-lg mx-auto space-y-6 relative z-10">
                        
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wide">
                                <User size={14} /> Enter UID
                            </label>
                            <input 
                                type="number" 
                                placeholder="Enter Player UID"
                                value={bannedUid}
                                onChange={(e) => setBannedUid(e.target.value)}
                                className="w-full h-12 bg-[#1f2937] border border-gray-700 text-white rounded-xl px-4 font-bold outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-500"
                            />
                        </div>

                        <button 
                            onClick={handleBannedCheck}
                            disabled={isBannedChecking}
                            className={`w-full h-14 mt-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-lg uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] active:scale-95 transition-all flex items-center justify-center gap-3 ${isBannedChecking ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isBannedChecking ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    CHECKING...
                                </>
                            ) : (
                                <>
                                    <ShieldAlert size={20} /> CHECK STATUS
                                </>
                            )}
                        </button>

                        {(bannedResult || bannedError) && (
                            <div className="mt-8 bg-black/40 rounded-xl border border-gray-700 p-0 overflow-hidden animate-in zoom-in-95">
                                {bannedError ? (
                                    <div className="p-6 text-center text-red-500 font-bold uppercase tracking-wide flex flex-col items-center gap-2">
                                        <XCircle size={32} />
                                        {bannedError}
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-gray-800/50 p-3 text-center border-b border-gray-700">
                                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Result Details</span>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                                                <span className="text-gray-400 font-bold text-xs uppercase">Player Name</span>
                                                <span className="text-white font-bold text-sm">{bannedResult.Name || bannedResult.player_name || 'Unknown'}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                                                <span className="text-gray-400 font-bold text-xs uppercase">Player UID</span>
                                                <span className="text-white font-bold text-sm tracking-wider">{bannedUid}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                                                <span className="text-gray-400 font-bold text-xs uppercase">Region</span>
                                                <span className="text-white font-bold text-sm uppercase">DEFAULT</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-gray-400 font-bold text-xs uppercase">Status</span>
                                                <span className={`font-black text-sm uppercase flex items-center gap-2 ${
                                                    (bannedResult.Status === 'BANNED' || String(bannedResult.Status).includes('BANNED')) 
                                                    ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' 
                                                    : 'text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]'
                                                }`}>
                                                    {(bannedResult.Status === 'BANNED' || String(bannedResult.Status).includes('BANNED')) 
                                                        ? <><XCircle size={16}/> BANNED</> 
                                                        : <><CheckCircle size={16}/> NOT BANNED</>
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {viewMode === 'home' && (
            <>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] border-t-4 border-violet-600 relative overflow-hidden">
                    
                    <div className="flex justify-center gap-3 mb-6 relative z-10">
                         <button 
                            onClick={() => setViewMode('group56')}
                            className="flex items-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl uppercase text-xs tracking-wider transition-all shadow-lg shadow-violet-500/30 active:scale-95 flex-1 justify-center"
                        >
                            <Users size={16} /> 
                            <span>5/6 GROUP</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('bannedCheck')}
                            className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl uppercase text-xs tracking-wider transition-all shadow-lg shadow-red-500/30 active:scale-95 flex-1 justify-center"
                        >
                            <Ban size={16} /> 
                            <span>BANNED CHECK</span>
                        </button>
                    </div>

                    <div className="mb-6 text-center">
                        <RGBText text="NAJMI FF EXPERIMENT" className="text-2xl md:text-3xl" />
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Server className="w-5 h-5 text-violet-600" />
                            <span className="font-bold text-black text-sm">Select Server:</span>
                        </div>
                        <div className="relative">
                            <select 
                                value={selectedServerId}
                                onChange={(e) => setSelectedServerId(e.target.value)}
                                className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-xl text-black text-lg font-bold focus:border-violet-600 focus:ring-1 focus:ring-violet-600 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                            >
                                <option value="" disabled>-- Select a Server --</option>
                                {servers.map(server => (
                                    <option key={server.id} value={server.id}>
                                        {server.name} {server.region === 'indian' ? '🇮🇳' : server.region === 'bangladesh' ? '🇧🇩' : '🌍'}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <div className={`w-3 h-3 rounded-full ${selectedServer ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-5 h-5 text-violet-600" />
                            <span className="font-bold text-black text-sm">Team Code:</span>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Enter team code" 
                            value={tc}
                            onChange={(e) => setTc(e.target.value)}
                            className="w-full h-14 px-5 bg-gray-50 border border-gray-200 rounded-xl text-black text-xl font-bold focus:border-violet-600 focus:ring-1 focus:ring-violet-600 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium placeholder:text-lg shadow-inner"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {uids.map((uid, idx) => (
                            <div key={idx}>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <User className="w-4 h-4 text-violet-600" />
                                    <span className="font-bold text-gray-600 text-xs uppercase tracking-wide">
                                        UID {idx + 1}:
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    placeholder={idx === 0 ? "Required" : "Optional"}
                                    value={uid}
                                    onChange={(e) => handleUidChange(idx, e.target.value)}
                                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-medium focus:border-violet-600 focus:ring-1 focus:ring-violet-600 outline-none transition-all placeholder:text-gray-400 shadow-sm hover:bg-gray-100 focus:bg-white"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    {status.msg && (
                        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 font-bold uppercase tracking-wide text-sm ${status.type === 'error' ? 'bg-red-500 text-white' : 'bg-violet-600 text-white'}`}>
                            <Zap size={16} fill="currentColor" />
                            {status.msg}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={() => setActiveCategory('All')}
                            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${activeCategory === 'All' ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/30' : 'bg-[#1e293b] text-gray-400 border-[#334155] hover:text-white hover:border-violet-500'}`}
                        >
                            <span className="flex items-center gap-2"><LayoutGrid size={14} /> All</span>
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${activeCategory === cat.name ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/30' : 'bg-[#1e293b] text-gray-400 border-[#334155] hover:text-white hover:border-violet-500'}`}
                            >
                                <span>{cat.icon}</span> {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {filteredEmotes.length > 0 ? (
                            filteredEmotes.map(emote => (
                                <EmoteItem 
                                    key={emote.id}
                                    emote={emote}
                                    isProcessing={processingEmoteId === emote.id}
                                    isSuccess={lastSentEmoteId === emote.id}
                                    onClick={() => handleSendEmote(emote.emoteId, emote.id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center bg-[#1e293b] rounded-xl border border-dashed border-gray-700">
                                <Search className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No Emotes Found</p>
                                <p className="text-gray-500 text-[10px] mt-1">Add them via Admin Panel</p>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}

        <AdBanner />

        <div className="flex justify-center pb-8 pt-4 border-t border-[#334155]">
              {config.socialLinks?.instagram && (
                <a href={config.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#1e293b] hover:bg-white text-gray-400 hover:text-black transition-all border border-[#334155] hover:border-white group">
                    <Instagram size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Najmi FF Experiment</span>
                </a>
             )}
        </div>
      </main>
    </div>
  );
};
