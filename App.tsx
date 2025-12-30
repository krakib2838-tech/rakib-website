
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { database } from './firebase';
import { ref, onValue, runTransaction } from 'firebase/database';
import { AppConfig, ViewState } from './types';
import { RGBText } from './components/RGBText';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [config, setConfig] = useState<AppConfig>({
    accessKey: '825032', // Requested Default
    maintenanceMode: false,
    videoLink: '',
    emoteApiUrl: 'https://t-ee0r.onrender.com/join',
    logoUrl: 'https://img.sanishtech.com/u/d77d54bafa3d1b5d7122eca0b9409ade.jpg', // Default Logo
    socialLinks: {
      telegram: 'https://t.me/najmiffexperiment6',
      youtube: 'https://youtube.com/@najmi_ff_experiment?si=Za92yXnG7VuE5Iul',
      instagram: 'https://instagram.com'
    }
  });
  const [loading, setLoading] = useState(true);

  // Analytics Tracking on Mount
  useEffect(() => {
    const trackAnalytics = async () => {
      const today = new Date().toISOString().split('T')[0];
      const analyticsRef = ref(database, `analytics/${today}`);
      
      const lastVisit = localStorage.getItem('last_visit_date');
      const isFirstVisit = !localStorage.getItem('first_visit_timestamp');

      try {
        await runTransaction(analyticsRef, (currentData) => {
          const data = currentData || { pageViews: 0, activeUsers: 0, newUsers: 0, emoteSends: 0 };
          
          // Always increment page views
          data.pageViews = (data.pageViews || 0) + 1;

          // Increment active users if this is the first visit today
          if (lastVisit !== today) {
            data.activeUsers = (data.activeUsers || 0) + 1;
          }

          // Increment new users if this is the absolute first visit
          if (isFirstVisit) {
            data.newUsers = (data.newUsers || 0) + 1;
          }

          return data;
        });

        // Update local storage
        localStorage.setItem('last_visit_date', today);
        if (isFirstVisit) {
          localStorage.setItem('first_visit_timestamp', Date.now().toString());
        }
      } catch (e) {
        console.error("Analytics Error:", e);
      }
    };

    trackAnalytics();
  }, []);

  // Real-time listener for settings
  useEffect(() => {
    const configRef = ref(database, 'settings');
    const unsubscribe = onValue(configRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setConfig(prev => ({ ...prev, ...data }));
        
        // Force logout to maintenance screen if active and user is in dashboard
        if (data.maintenanceMode && view === ViewState.DASHBOARD) {
            setView(ViewState.MAINTENANCE);
        } else if (!data.maintenanceMode && view === ViewState.MAINTENANCE) {
            setView(ViewState.LOGIN);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [view]);

  if (loading) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
        </div>
    );
  }

  // Maintenance View
  if (config.maintenanceMode && view !== ViewState.ADMIN) {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
              <AlertTriangle className="text-yellow-500 w-24 h-24 mb-6 animate-pulse" />
              <RGBText text="MAINTENANCE MODE" className="text-4xl md:text-5xl mb-4" />
              <p className="text-slate-400 max-w-md">The system is currently undergoing upgrades. Please check back later. Follow us on Telegram for updates.</p>
              
              <div className="mt-8 flex gap-4 justify-center">
                {config.socialLinks?.telegram && (
                  <a href={config.socialLinks.telegram} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline">Telegram</a>
                )}
                {config.socialLinks?.youtube && (
                  <a href={config.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-red-400 hover:text-red-300 underline">YouTube</a>
                )}
              </div>

              <button 
                onClick={() => setView(ViewState.ADMIN)} // Secret way to admin during maintenance
                className="mt-12 text-slate-800 hover:text-slate-700 text-xs"
              >
                  Admin Access
              </button>
          </div>
      );
  }

  return (
    <>
      {view === ViewState.LOGIN && (
        <Login 
            onLogin={() => setView(ViewState.DASHBOARD)} 
            onAdminLogin={() => setView(ViewState.ADMIN)}
            requiredAccessKey={config.accessKey}
            videoLink={config.videoLink}
            socialLinks={config.socialLinks}
        />
      )}

      {view === ViewState.DASHBOARD && (
        <Dashboard 
            onLogout={() => setView(ViewState.LOGIN)} 
            config={config}
        />
      )}

      {view === ViewState.ADMIN && (
        <AdminPanel 
            onLogout={() => setView(ViewState.LOGIN)} 
        />
      )}
    </>
  );
};

export default App;
