import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import RGBText from "./components/RGBText";
import { AlertTriangle } from "lucide-react";

/* ---------- TYPES ---------- */

enum ViewState {
  LOGIN,
  DASHBOARD,
  ADMIN,
  MAINTENANCE,
}

interface AppConfig {
  accessKey: string;
  maintenanceMode: boolean;
  videoLink: string;
  emoteApiUrl: string;
  logoUrl: string;
  socialLinks: {
    telegram?: string;
    youtube?: string;
    instagram?: string;
  };
}

/* ---------- APP ---------- */

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);

  const [config] = useState<AppConfig>({
    accessKey: "825032",
    maintenanceMode: false, // true karoge to maintenance screen dikhegi
    videoLink: "",
    emoteApiUrl: "https://t-ee0r.onrender.com/join",
    logoUrl:
      "https://img.sanishtech.com/u/d77d54bafa3d1b5d7122eca0b9409ade.jpg",
    socialLinks: {
      telegram: "https://t.me/najmiffexperiment6",
      youtube:
        "https://youtube.com/@najmi_ff_experiment?si=Za92yXnG7VuE5Iul",
      instagram: "https://instagram.com",
    },
  });

  /* ---------- MAINTENANCE ---------- */
  if (config.maintenanceMode && view !== ViewState.ADMIN) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white">
        <AlertTriangle className="text-yellow-500 w-20 h-20 mb-6 animate-pulse" />

        <RGBText
          text="MAINTENANCE MODE"
          className="text-4xl md:text-5xl mb-4"
        />

        <p className="text-slate-400 max-w-md">
          System upgrade chal raha hai. Thodi der baad try karein.
        </p>

        <div className="mt-6 flex gap-4">
          {config.socialLinks.telegram && (
            <a
              href={config.socialLinks.telegram}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              Telegram
            </a>
          )}
          {config.socialLinks.youtube && (
            <a
              href={config.socialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              className="text-red-400 underline"
            >
              YouTube
            </a>
          )}
        </div>

        <button
          onClick={() => setView(ViewState.ADMIN)}
          className="mt-10 text-xs text-slate-500"
        >
          Admin Access
        </button>
      </div>
    );
  }

  /* ---------- NORMAL FLOW ---------- */

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
        <AdminPanel onLogout={() => setView(ViewState.LOGIN)} />
      )}
    </>
  );
};

export default App;import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import RGBText from "./components/RGBText";
import { AlertTriangle } from "lucide-react";

/* ---------- TYPES ---------- */

enum ViewState {
  LOGIN,
  DASHBOARD,
  ADMIN,
  MAINTENANCE,
}

interface AppConfig {
  accessKey: string;
  maintenanceMode: boolean;
  videoLink: string;
  emoteApiUrl: string;
  logoUrl: string;
  socialLinks: {
    telegram?: string;
    youtube?: string;
    instagram?: string;
  };
}

/* ---------- APP ---------- */

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);

  const [config] = useState<AppConfig>({
    accessKey: "825032",
    maintenanceMode: false, // true karoge to maintenance screen dikhegi
    videoLink: "",
    emoteApiUrl: "https://t-ee0r.onrender.com/join",
    logoUrl:
      "https://img.sanishtech.com/u/d77d54bafa3d1b5d7122eca0b9409ade.jpg",
    socialLinks: {
      telegram: "https://t.me/najmiffexperiment6",
      youtube:
        "https://youtube.com/@najmi_ff_experiment?si=Za92yXnG7VuE5Iul",
      instagram: "https://instagram.com",
    },
  });

  /* ---------- MAINTENANCE ---------- */
  if (config.maintenanceMode && view !== ViewState.ADMIN) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white">
        <AlertTriangle className="text-yellow-500 w-20 h-20 mb-6 animate-pulse" />

        <RGBText
          text="MAINTENANCE MODE"
          className="text-4xl md:text-5xl mb-4"
        />

        <p className="text-slate-400 max-w-md">
          System upgrade chal raha hai. Thodi der baad try karein.
        </p>

        <div className="mt-6 flex gap-4">
          {config.socialLinks.telegram && (
            <a
              href={config.socialLinks.telegram}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              Telegram
            </a>
          )}
          {config.socialLinks.youtube && (
            <a
              href={config.socialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              className="text-red-400 underline"
            >
              YouTube
            </a>
          )}
        </div>

        <button
          onClick={() => setView(ViewState.ADMIN)}
          className="mt-10 text-xs text-slate-500"
        >
          Admin Access
        </button>
      </div>
    );
  }

  /* ---------- NORMAL FLOW ---------- */

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
        <AdminPanel onLogout={() => setView(ViewState.LOGIN)} />
      )}
    </>
  );
};

export default App;import RGBText from "./components/RGBText";
import { AlertTriangle } from "lucide-react";

/* ---------- TYPES ---------- */

enum ViewState {
  LOGIN,
  DASHBOARD,
  ADMIN,
  MAINTENANCE,
}

interface AppConfig {
  accessKey: string;
  maintenanceMode: boolean;
  videoLink: string;
  emoteApiUrl: string;
  logoUrl: string;
  socialLinks: {
    telegram?: string;
    youtube?: string;
    instagram?: string;
  };
}

/* ---------- APP ---------- */

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);

  const [config] = useState<AppConfig>({
    accessKey: "825032",
    maintenanceMode: false, // true karoge to maintenance screen dikhegi
    videoLink: "",
    emoteApiUrl: "https://t-ee0r.onrender.com/join",
    logoUrl:
      "https://img.sanishtech.com/u/d77d54bafa3d1b5d7122eca0b9409ade.jpg",
    socialLinks: {
      telegram: "https://t.me/najmiffexperiment6",
      youtube:
        "https://youtube.com/@najmi_ff_experiment?si=Za92yXnG7VuE5Iul",
      instagram: "https://instagram.com",
    },
  });

  /* ---------- MAINTENANCE ---------- */
  if (config.maintenanceMode && view !== ViewState.ADMIN) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white">
        <AlertTriangle className="text-yellow-500 w-20 h-20 mb-6 animate-pulse" />

        <RGBText
          text="MAINTENANCE MODE"
          className="text-4xl md:text-5xl mb-4"
        />

        <p className="text-slate-400 max-w-md">
          System upgrade chal raha hai. Thodi der baad try karein.
        </p>

        <div className="mt-6 flex gap-4">
          {config.socialLinks.telegram && (
            <a
              href={config.socialLinks.telegram}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline"
            >
              Telegram
            </a>
          )}
          {config.socialLinks.youtube && (
            <a
              href={config.socialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              className="text-red-400 underline"
            >
              YouTube
            </a>
          )}
        </div>

        <button
          onClick={() => setView(ViewState.ADMIN)}
          className="mt-10 text-xs text-slate-500"
        >
          Admin Access
        </button>
      </div>
    );
  }

  /* ---------- NORMAL FLOW ---------- */

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
        <AdminPanel onLogout={() => setView(ViewState.LOGIN)} />
      )}
    </>
  );
};

export default App;
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
