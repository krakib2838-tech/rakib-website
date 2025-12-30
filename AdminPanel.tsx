
import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, update, get, push, remove, set } from 'firebase/database';
import { AppConfig, ServerConfig, DailyAnalytics, Emote, Category } from '../types';
import { LogOut, Save, Plus, Trash2, Server, Smile, List, Link as LinkIcon, Lock, Activity, BarChart2, Users, UserPlus, Zap, Eye, Calendar, HelpCircle, AlertTriangle, AlertOctagon, Loader2, CheckCircle, DownloadCloud } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

interface AdminPanelProps {
  onLogout: () => void;
}

const PRESET_EMOTES = [
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041005.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041006.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041007.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041008.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041009.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041010.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041011.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041012.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041013.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041014.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909041015.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042001.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042002.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042003.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042004.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042005.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042006.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042007.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042008.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042009.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042011.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042012.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042013.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042016.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042017.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909042018.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043001.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043002.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043003.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043004.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043005.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043006.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043007.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043008.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043009.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043010.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909043013.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044001.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044002.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044003.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044004.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044005.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044006.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044007.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044008.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044009.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044010.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044011.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044012.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044015.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909044016.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045001.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045002.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045003.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045004.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045005.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045006.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045007.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045008.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045009.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045010.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045011.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045012.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045015.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045016.png",
"https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909045017.png"
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000013.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000014.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000015.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000016.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000017.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000018.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000019.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000020.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000021.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000022.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000023.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000024.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000025.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000026.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000027.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000028.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000029.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000031.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000032.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000033.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000034.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000035.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000036.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000037.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000038.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000039.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000040.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000041.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000042.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000043.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000044.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000045.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000046.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000047.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000048.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000049.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000051.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000052.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000053.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000054.png
https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/909000055.png
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('najmiffexperiment69@gmail.com');
  const [adminPass, setAdminPass] = useState('');
  
  const [activeTab, setActiveTab] = useState<'server' | 'emote' | 'category' | 'links' | 'settings' | 'analytics'>('server');
  
  // Data States
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Analytics State
  const [analyticsData, setAnalyticsData] = useState<DailyAnalytics[]>([]);
  const [dateRange, setDateRange] = useState<7 | 30>(7);

  // Form States
  const [serverForm, setServerForm] = useState({ name: '', apiKey: '', region: '', order: '' });
  const [emoteForm, setEmoteForm] = useState({ imageUrl: '', category: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '', order: '' });
  const [linksForm, setLinksForm] = useState({ telegram: '', youtube: '', instagram: '' });
  const [accessKeyForm, setAccessKeyForm] = useState('');
  const [maintenanceForm, setMaintenanceForm] = useState(false);
  const [emoteApiForm, setEmoteApiForm] = useState('');
  const [videoLinkForm, setVideoLinkForm] = useState('');
  const [logoUrlForm, setLogoUrlForm] = useState('');

  // Processing States
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
        fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
        // Config
        const configSnap = await get(ref(database, 'settings'));
        if (configSnap.exists()) {
            const data = configSnap.val();
            setConfig(data);
            setAccessKeyForm(data.accessKey || '');
            setMaintenanceForm(data.maintenanceMode || false);
            setEmoteApiForm(data.emoteApiUrl || '');
            setVideoLinkForm(data.videoLink || '');
            setLogoUrlForm(data.logoUrl || '');
            setLinksForm({
                telegram: data.socialLinks?.telegram || '',
                youtube: data.socialLinks?.youtube || '',
                instagram: data.socialLinks?.instagram || ''
            });
        }

        // Servers
        const serversSnap = await get(ref(database, 'servers'));
        if (serversSnap.exists()) {
            const list: ServerConfig[] = [];
            serversSnap.forEach(child => {
                // CRITICAL FIX: Ensure ID comes LAST to prevent overwrite
                list.push({ ...child.val(), id: child.key as string });
            });
            setServers(list.sort((a, b) => a.order - b.order));
        }

        // Categories
        const catSnap = await get(ref(database, 'categories'));
        if (catSnap.exists()) {
            const list: Category[] = [];
            catSnap.forEach(child => {
                list.push({ ...child.val(), id: child.key as string });
            });
            setCategories(list.sort((a, b) => a.order - b.order));
        }

        // Emotes
        const emoteSnap = await get(ref(database, 'emotes'));
        if (emoteSnap.exists()) {
            const list: Emote[] = [];
            emoteSnap.forEach(child => {
                // CRITICAL FIX: Ensure ID comes LAST to prevent overwrite
                list.push({ ...child.val(), id: child.key as string });
            });
            setEmotes(list);
        } else {
            setEmotes([]); // Ensure empty if node doesn't exist
        }

        // Analytics Fetch
        const analyticsSnap = await get(ref(database, 'analytics'));
        if (analyticsSnap.exists()) {
            const data = analyticsSnap.val();
            const processed = Object.entries(data).map(([date, val]: [string, any]) => ({
                date: date,
                displayDate: date.substring(5), // MM-DD
                activeUsers: val.activeUsers || 0,
                newUsers: val.newUsers || 0,
                pageViews: val.pageViews || 0,
                emoteSends: val.emoteSends || 0
            })).sort((a, b) => a.date.localeCompare(b.date));
            setAnalyticsData(processed);
        }
    } catch (e) {
        console.error("Error fetching data", e);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === '@Malda123') {
        setIsAuthenticated(true);
    } else {
        alert('Invalid Password');
    }
  };

  // --- Handlers ---

  const saveServer = async (e: React.FormEvent) => {
    e.preventDefault();
    await push(ref(database, 'servers'), {
        name: serverForm.name,
        apiKey: serverForm.apiKey,
        region: serverForm.region,
        order: Number(serverForm.order) || 0
    });
    setServerForm({ name: '', apiKey: '', region: '', order: '' });
    fetchData();
  };

  const saveEmote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-extract ID from URL
    let extractedId = 'unknown';
    try {
        const filename = emoteForm.imageUrl.substring(emoteForm.imageUrl.lastIndexOf('/') + 1);
        extractedId = filename.split('.')[0] || 'emote_' + Date.now();
        extractedId = decodeURIComponent(extractedId);
    } catch (e) {
        extractedId = 'emote_' + Date.now();
    }

    await push(ref(database, 'emotes'), {
        name: extractedId,
        emoteId: extractedId,
        imageUrl: emoteForm.imageUrl,
        category: emoteForm.category
    });
    setEmoteForm({ imageUrl: '', category: '' });
    fetchData();
  };

  const importPresetEmotes = async () => {
    if (!emoteForm.category) {
        alert("Please select a Category from the form below first! (e.g. create a 'New' category and select it)");
        return;
    }

    if (!confirm(`This will add ${PRESET_EMOTES.length} emotes to the '${emoteForm.category}' category. Continue?`)) return;

    setIsImporting(true);
    let addedCount = 0;
    
    try {
        for (const url of PRESET_EMOTES) {
             let extractedId = 'unknown';
             try {
                const filename = url.substring(url.lastIndexOf('/') + 1);
                extractedId = filename.split('.')[0] || 'emote_' + Date.now();
                extractedId = decodeURIComponent(extractedId);
            } catch (e) {
                extractedId = 'emote_' + Date.now();
            }

            // Check if emote ID already exists to avoid duplicates
            const exists = emotes.some(e => e.emoteId === extractedId);
            if (!exists) {
                await push(ref(database, 'emotes'), {
                    name: extractedId,
                    emoteId: extractedId,
                    imageUrl: url,
                    category: emoteForm.category
                });
                addedCount++;
            }
        }
        alert(`Successfully added ${addedCount} new emotes!`);
    } catch (e: any) {
        console.error(e);
        alert("Error importing emotes: " + e.message);
    } finally {
        setIsImporting(false);
        fetchData();
    }
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await push(ref(database, 'categories'), {
        name: categoryForm.name,
        icon: categoryForm.icon,
        order: Number(categoryForm.order) || 0
    });
    setCategoryForm({ name: '', icon: '', order: '' });
    fetchData();
  };

  const saveSettings = async () => {
    await update(ref(database, 'settings'), {
        accessKey: accessKeyForm,
        maintenanceMode: maintenanceForm,
        emoteApiUrl: emoteApiForm,
        videoLink: videoLinkForm,
        logoUrl: logoUrlForm,
        socialLinks: linksForm
    });
    alert('Settings Saved!');
  };

  const deleteItem = async (path: string, id: string) => {
    if (!id) {
        alert('Error: Invalid Item ID. Please refresh page.');
        return;
    }
    
    if(!confirm('Are you sure you want to delete this item?')) return;

    // Set loading state for this specific item
    setDeletingIds(prev => new Set(prev).add(id));

    try {
        await remove(ref(database, `${path}/${id}`));
        
        // Optimistic update
        if (path === 'emotes') setEmotes(prev => prev.filter(e => e.id !== id));
        else if (path === 'servers') setServers(prev => prev.filter(s => s.id !== id));
        else if (path === 'categories') setCategories(prev => prev.filter(c => c.id !== id));
        
    } catch (error: any) {
        console.error("Failed to delete", error);
        if (error.code === 'PERMISSION_DENIED') {
            alert("PERMISSION DENIED: Firebase Database Rules are blocking this delete. Please check your Rules tab in Firebase Console.");
        } else {
            alert("Failed to delete: " + error.message);
        }
        fetchData(); // Revert optimistic update on error
    } finally {
        setDeletingIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }
  };

  const deleteAllEmotes = async () => {
      if(!confirm('⚠️ WARNING: This will delete ALL emotes permanently from the website. This action cannot be undone.\n\nAre you sure?')) return;
      if(!confirm('Double Check: Are you really sure you want to remove everything?')) return;

      setIsDeletingAll(true);
      try {
          await remove(ref(database, 'emotes'));
          setEmotes([]);
          alert('All emotes have been deleted successfully.');
      } catch (error: any) {
          console.error("Error deleting emotes", error);
          if (error.code === 'PERMISSION_DENIED') {
             alert("PERMISSION DENIED: Firebase Rules are preventing bulk deletion. Please set '.write': true in your rules temporarily or sign in.");
          } else {
             alert('Error deleting emotes: ' + error.message);
          }
      } finally {
          setIsDeletingAll(false);
      }
  };

  // Filter analytics based on range
  const displayedAnalytics = analyticsData.slice(-dateRange);
  
  // Calculate Totals for Today
  const todayDate = new Date().toISOString().split('T')[0];
  const todayStats = analyticsData.find(d => d.date === todayDate) || { activeUsers: 0, newUsers: 0, pageViews: 0, emoteSends: 0 };

  if (!isAuthenticated) {
      return (
          <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
              <div className="w-full max-w-md bg-[#1e293b] rounded-2xl shadow-2xl p-8 border border-slate-700">
                  <div className="text-center mb-8">
                      <div className="text-4xl mb-2">🔐</div>
                      <h1 className="text-2xl font-bold text-white">ADMIN PANEL</h1>
                      <p className="text-slate-400 text-sm">NAJMI FF EXPERIMENT Control Center</p>
                  </div>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                      <input 
                        type="email" 
                        value={adminEmail} 
                        onChange={e => setAdminEmail(e.target.value)} 
                        className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:border-indigo-500 outline-none"
                        required
                        disabled 
                      />
                      <input 
                        type="password" 
                        value={adminPass} 
                        onChange={e => setAdminPass(e.target.value)} 
                        className="w-full bg-[#0f172a] border border-slate-700 text-white p-3 rounded-lg focus:border-indigo-500 outline-none" 
                        placeholder="Admin Password"
                        required
                      />
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors">Access Admin Panel</button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
        {/* Header */}
        <header className="bg-[#1e293b] border-b border-slate-700 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <h1 className="text-xl font-black text-white tracking-wider">ADMIN PANEL</h1>
                </div>
                <button onClick={onLogout} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <nav className="lg:col-span-1 space-y-2">
                <button onClick={() => setActiveTab('server')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'server' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#1e293b] text-slate-400 hover:bg-slate-700'}`}>
                    <Server size={18} /> Server Mgmt
                </button>
                <button onClick={() => setActiveTab('emote')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'emote' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#1e293b] text-slate-400 hover:bg-slate-700'}`}>
                    <Smile size={18} /> Emote Mgmt
                </button>
                <button onClick={() => setActiveTab('category')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'category' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#1e293b] text-slate-400 hover:bg-slate-700'}`}>
                    <List size={18} /> Categories
                </button>
                <button onClick={() => setActiveTab('links')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'links' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#1e293b] text-slate-400 hover:bg-slate-700'}`}>
                    <LinkIcon size={18} /> Social Links
                </button>
                <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#1e293b] text-slate-400 hover:bg-slate-700'}`}>
                    <Lock size={18} /> General Settings
                </button>
                <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#1e293b] text-slate-400 hover:bg-slate-700'}`}>
                    <Activity size={18} /> Analytics
                </button>
            </nav>

            {/* Main Content */}
            <main className="lg:col-span-3 space-y-6">
                
                {/* ANALYTICS SECTION */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-purple-400">
                                <Activity size={24} />
                                <h2 className="text-xl font-bold text-white">DASHBOARD ANALYTICS</h2>
                            </div>
                            <div className="flex bg-[#1e293b] p-1 rounded-lg border border-slate-700">
                                <button onClick={() => setDateRange(7)} className={`px-4 py-1 text-xs font-bold rounded-md transition-colors ${dateRange === 7 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>7 Days</button>
                                <button onClick={() => setDateRange(30)} className={`px-4 py-1 text-xs font-bold rounded-md transition-colors ${dateRange === 30 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>30 Days</button>
                            </div>
                        </div>

                        {/* Stats Cards - Today's Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-indigo-900 to-[#1e293b] p-5 rounded-2xl border border-indigo-500/30 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                                        <Users size={14} /> Active Users (Today)
                                    </div>
                                    <div className="text-3xl font-black text-white">{todayStats.activeUsers}</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-900 to-[#1e293b] p-5 rounded-2xl border border-emerald-500/30 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                                        <UserPlus size={14} /> New Users (Today)
                                    </div>
                                    <div className="text-3xl font-black text-white">{todayStats.newUsers}</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-pink-900 to-[#1e293b] p-5 rounded-2xl border border-pink-500/30 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">
                                        <Zap size={14} /> Emotes Sent (Today)
                                    </div>
                                    <div className="text-3xl font-black text-white">{todayStats.emoteSends}</div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-900 to-[#1e293b] p-5 rounded-2xl border border-blue-500/30 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                                        <Eye size={14} /> Page Views (Today)
                                    </div>
                                    <div className="text-3xl font-black text-white">{todayStats.pageViews}</div>
                                </div>
                            </div>
                        </div>

                        {/* Main Growth Chart */}
                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl">
                            <h3 className="text-sm font-bold text-slate-300 uppercase mb-6">User Growth Trends</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={displayedAnalytics}>
                                        <defs>
                                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="displayDate" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="activeUsers" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
                                        <Area type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" name="New Users" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Engagement Chart */}
                         <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl">
                            <h3 className="text-sm font-bold text-slate-300 uppercase mb-6">Emote Engagement</h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={displayedAnalytics}>
                                        <XAxis dataKey="displayDate" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <Tooltip 
                                            cursor={{fill: '#334155', opacity: 0.2}}
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Bar dataKey="emoteSends" fill="#ec4899" radius={[4, 4, 0, 0]} name="Emotes Sent" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* SERVER MANAGEMENT */}
                {activeTab === 'server' && (
                    <section className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700">
                        <div className="flex items-center gap-2 mb-6 text-indigo-400">
                            <Server size={24} />
                            <h2 className="text-xl font-bold text-white">SERVER MANAGEMENT</h2>
                        </div>
                        <form onSubmit={saveServer} className="space-y-4 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-indigo-500" placeholder="Server Name" value={serverForm.name} onChange={e => setServerForm({...serverForm, name: e.target.value})} required />
                                <div className="relative">
                                     <input className="w-full bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-indigo-500 pr-10" placeholder="API URL (with placeholders)" value={serverForm.apiKey} onChange={e => setServerForm({...serverForm, apiKey: e.target.value})} required />
                                     <div className="absolute right-3 top-3 group">
                                         <HelpCircle size={18} className="text-slate-500 cursor-help" />
                                         <div className="absolute right-0 top-8 w-64 p-3 bg-black border border-slate-600 rounded-lg text-xs text-slate-300 hidden group-hover:block z-20">
                                             Use <b>{`{tc}`}</b> or <b>{`{teamcode}`}</b>, <b>{`{uid}`}</b>, <b>{`{uid1}`}</b>...<b>{`{uid6}`}</b>, and <b>{`{emote_id}`}</b> or <b>{`{emote}`}</b> as placeholders.
                                         </div>
                                     </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-indigo-500" value={serverForm.region} onChange={e => setServerForm({...serverForm, region: e.target.value})} required>
                                    <option value="">Select Region</option>
                                    <option value="indian">🇮🇳 Indian Servers</option>
                                    <option value="bangladesh">🇧🇩 Bangladesh Servers</option>
                                    <option value="other">🌍 Other Servers</option>
                                </select>
                                <input type="number" className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-indigo-500" placeholder="Order" value={serverForm.order} onChange={e => setServerForm({...serverForm, order: e.target.value})} required />
                            </div>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors">ADD SERVER</button>
                        </form>
                        <div className="space-y-2">
                            {servers.map(s => (
                                <div key={s.id} className="flex items-center justify-between p-4 bg-[#0f172a] rounded-xl border border-slate-700">
                                    <div className="overflow-hidden">
                                        <div className="font-bold text-white">{s.name}</div>
                                        <div className="text-xs text-slate-500 truncate max-w-md">{s.apiKey}</div>
                                        <div className="text-[10px] text-slate-600 mt-1">{s.region} | Order: {s.order}</div>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteItem('servers', s.id); }} 
                                        className="text-red-400 hover:bg-red-400/10 p-3 rounded-lg transition-colors flex-shrink-0 z-10"
                                        disabled={deletingIds.has(s.id)}
                                    >
                                        {deletingIds.has(s.id) ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* EMOTE MANAGEMENT */}
                {activeTab === 'emote' && (
                    <section className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-pink-400">
                                <Smile size={24} />
                                <h2 className="text-xl font-bold text-white">EMOTE MANAGEMENT</h2>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                             {/* BIG DELETE ALL BUTTON */}
                            <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-red-400">
                                    <AlertOctagon size={24} />
                                    <div>
                                        <h3 className="font-bold text-white text-sm">DELETE ALL</h3>
                                    </div>
                                </div>
                                <button 
                                    onClick={deleteAllEmotes}
                                    disabled={isDeletingAll}
                                    className={`px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 ${isDeletingAll ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isDeletingAll ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                    {isDeletingAll ? '...' : 'EXECUTE'}
                                </button>
                            </div>

                             {/* BULK IMPORT BUTTON */}
                             <div className="p-4 bg-blue-950/30 border border-blue-900/50 rounded-xl flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <DownloadCloud size={24} />
                                    <div>
                                        <h3 className="font-bold text-white text-sm">IMPORT {PRESET_EMOTES.length} EMOTES</h3>
                                    </div>
                                </div>
                                <button 
                                    onClick={importPresetEmotes}
                                    disabled={isImporting}
                                    className={`px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isImporting ? <Loader2 className="animate-spin" size={16} /> : <DownloadCloud size={16} />}
                                    {isImporting ? '...' : 'IMPORT'}
                                </button>
                            </div>
                        </div>

                        <form onSubmit={saveEmote} className="space-y-4 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-pink-500" placeholder="Image URL (e.g. https://.../emote123.png)" value={emoteForm.imageUrl} onChange={e => setEmoteForm({...emoteForm, imageUrl: e.target.value})} required />
                                <select className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-pink-500" value={emoteForm.category} onChange={e => setEmoteForm({...emoteForm, category: e.target.value})} required>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                                </select>
                            </div>
                            <div className="bg-pink-900/10 border border-pink-900/30 p-3 rounded-lg text-xs text-pink-300">
                                ℹ️ Note: The <b>Emote ID</b> (for API) will be automatically extracted from your Image URL filename.
                            </div>
                            <button className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-lg transition-colors">ADD EMOTE</button>
                        </form>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {emotes.map(e => (
                                <div key={e.id} className="relative group bg-[#0f172a] rounded-xl p-3 border border-slate-700 flex flex-col items-center hover:border-pink-500/50 transition-colors">
                                    <img src={e.imageUrl} alt="emote" className="w-full h-24 object-contain mb-8 pointer-events-none select-none" />
                                    <div className="text-center w-full absolute bottom-2 left-0 right-0 px-2 flex flex-col items-center">
                                        <div className="text-[10px] text-slate-500 uppercase">{e.category}</div>
                                        <button 
                                            onClick={(ev) => { 
                                                ev.preventDefault(); 
                                                ev.stopPropagation(); 
                                                deleteItem('emotes', e.id); 
                                            }} 
                                            disabled={deletingIds.has(e.id)}
                                            className="mt-1 w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-1 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1 z-50 cursor-pointer border border-red-600/30"
                                            title="Delete Emote"
                                        >
                                            {deletingIds.has(e.id) ? <Loader2 className="animate-spin" size={12} /> : <Trash2 size={12} />}
                                            {deletingIds.has(e.id) ? '...' : 'DELETE'}
                                        </button>
                                    </div>
                                    <div className="absolute top-2 right-2 text-xs font-mono text-gray-600 opacity-50 pointer-events-none">{e.emoteId}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* CATEGORY MANAGEMENT */}
                {activeTab === 'category' && (
                    <section className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700">
                        <div className="flex items-center gap-2 mb-6 text-emerald-400">
                            <List size={24} />
                            <h2 className="text-xl font-bold text-white">CATEGORY MANAGEMENT</h2>
                        </div>
                        <form onSubmit={saveCategory} className="space-y-4 mb-8">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-emerald-500" placeholder="Name (e.g. HOT)" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} required />
                                <input className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-emerald-500" placeholder="Icon (e.g. 🔥)" value={categoryForm.icon} onChange={e => setCategoryForm({...categoryForm, icon: e.target.value})} />
                                <input type="number" className="bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-emerald-500" placeholder="Order" value={categoryForm.order} onChange={e => setCategoryForm({...categoryForm, order: e.target.value})} required />
                            </div>
                            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors">ADD CATEGORY</button>
                        </form>
                         <div className="space-y-2">
                            {categories.map(c => (
                                <div key={c.id} className="flex items-center justify-between p-4 bg-[#0f172a] rounded-xl border border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{c.icon}</span>
                                        <span className="font-bold text-white">{c.name}</span>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteItem('categories', c.id); }} 
                                        disabled={deletingIds.has(c.id)}
                                        className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors z-10"
                                    >
                                        {deletingIds.has(c.id) ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                 {/* SETTINGS MANAGEMENT */}
                 {(activeTab === 'settings' || activeTab === 'links') && (
                    <section className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700">
                         <div className="flex items-center gap-2 mb-6 text-blue-400">
                            <Lock size={24} />
                            <h2 className="text-xl font-bold text-white">SETTINGS</h2>
                        </div>
                        <div className="space-y-6">
                            {activeTab === 'settings' && (
                                <>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">User Access Key</label>
                                        <input className="w-full mt-1 bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-blue-500" value={accessKeyForm} onChange={e => setAccessKeyForm(e.target.value)} />
                                    </div>
                                     <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Get Key Video Link</label>
                                        <input className="w-full mt-1 bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-blue-500" value={videoLinkForm} onChange={e => setVideoLinkForm(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Logo URL (Top Left)</label>
                                        <input className="w-full mt-1 bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-blue-500" value={logoUrlForm} onChange={e => setLogoUrlForm(e.target.value)} placeholder="https://example.com/logo.jpg" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-[#0f172a] rounded-xl border border-slate-700">
                                        <span className="font-bold text-white">Maintenance Mode</span>
                                        <button onClick={() => setMaintenanceForm(!maintenanceForm)} className={`w-14 h-8 rounded-full p-1 transition-colors ${maintenanceForm ? 'bg-red-500' : 'bg-slate-600'}`}>
                                            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${maintenanceForm ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                </>
                            )}
                            {activeTab === 'links' && (
                                <>
                                     <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Telegram URL</label>
                                        <input className="w-full mt-1 bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-blue-500" value={linksForm.telegram} onChange={e => setLinksForm({...linksForm, telegram: e.target.value})} />
                                    </div>
                                     <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">YouTube URL</label>
                                        <input className="w-full mt-1 bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-blue-500" value={linksForm.youtube} onChange={e => setLinksForm({...linksForm, youtube: e.target.value})} />
                                    </div>
                                     <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Instagram URL</label>
                                        <input className="w-full mt-1 bg-[#0f172a] border border-slate-700 p-3 rounded-lg text-white outline-none focus:border-blue-500" value={linksForm.instagram} onChange={e => setLinksForm({...linksForm, instagram: e.target.value})} />
                                    </div>
                                </>
                            )}
                            <button onClick={saveSettings} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Save size={18} /> SAVE SETTINGS
                            </button>
                        </div>
                    </section>
                 )}
            </main>
        </div>
    </div>
  );
};
