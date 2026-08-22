import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, CheckCircle2, Smartphone } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install UmarMart App on your mobile device, tap Share / Settings -> Add to Home Screen.');
    }
  };

  if (dismissed) return null;

  return (
    <div className="space-y-2">
      {/* Offline Status Warning Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
            <span>You are currently offline. UmarMart is operating in Offline Cache Mode. Saved products remain accessible!</span>
          </div>
          <button onClick={() => setDismissed(true)} className="p-1 hover:bg-amber-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PWA App Install Banner */}
      {!isInstalled && deferredPrompt && (
        <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-white flex items-center space-x-1">
                <span>Install UmarMart Official App</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400">Faster loading, offline shopping & instant TCS tracking notifications</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
