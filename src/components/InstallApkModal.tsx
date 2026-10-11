import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Apple, Monitor, CheckCircle, Shield, HardDrive, Share2, Sparkles, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallApkModal: React.FC<InstallApkModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'windows'>('android');
  const [isGeneratingPackage, setIsGeneratingPackage] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Trigger instruction
      alert('To install on your device: Tap your browser menu (⋮ or Share) and select "Install app" or "Add to Home screen".');
    }
  };

  const downloadApkConfigBundle = () => {
    setIsGeneratingPackage(true);
    setTimeout(() => {
      // Package web app configuration bundle for Android APK build / offline use
      const packageConfig = {
        app_name: 'IronCore Gym Pro',
        package_name: 'com.ironcore.gym.erp',
        version: '1.0.0',
        platform: 'Android PWA / WebAPK / TWA',
        standalone_url: window.location.origin,
        offline_storage: 'Physical Phone Storage (LocalStorage + IndexedDB)',
        capacity: '500+ Members, 4 Branches',
        manifest: {
          name: 'IronCore Gym Pro',
          short_name: 'IronCore',
          start_url: '/',
          display: 'standalone',
          theme_color: '#151719',
          background_color: '#151719',
        },
      };

      const blob = new Blob([JSON.stringify(packageConfig, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ironcore-gym-android-package-config.json';
      a.click();
      URL.revokeObjectURL(url);
      setIsGeneratingPackage(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#34393e] bg-[#202326] shadow-2xl text-[#f4f5f6]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#34393e] px-6 py-4 bg-[#181a1d]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b9f227] text-[#151719] font-black text-xl">
              IC
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Install IronCore Gym App</h2>
              <p className="text-xs text-[#a4abb2]">Direct Native App on Android (APK), iOS & Windows PC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#a4abb2] hover:bg-[#282c30] hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Device Tabs */}
        <div className="flex border-b border-[#34393e] bg-[#1a1d20]">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-xs font-bold transition border-b-2 ${
              activeTab === 'android'
                ? 'border-[#b9f227] text-[#b9f227] bg-[#242921]'
                : 'border-transparent text-[#a4abb2] hover:text-white'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Android (APK / WebAPK)
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-xs font-bold transition border-b-2 ${
              activeTab === 'ios'
                ? 'border-[#b9f227] text-[#b9f227] bg-[#242921]'
                : 'border-transparent text-[#a4abb2] hover:text-white'
            }`}
          >
            <Apple className="h-4 w-4" />
            iPhone & iPad (iOS)
          </button>
          <button
            onClick={() => setActiveTab('windows')}
            className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-xs font-bold transition border-b-2 ${
              activeTab === 'windows'
                ? 'border-[#b9f227] text-[#b9f227] bg-[#242921]'
                : 'border-transparent text-[#a4abb2] hover:text-white'
            }`}
          >
            <Monitor className="h-4 w-4" />
            Windows PC & Mac
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'android' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#34393e] bg-[#282c30] p-4 flex items-start gap-4">
                <div className="rounded-lg bg-[#30382a] p-3 text-[#b9f227]">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">Instant Android Installation</h3>
                    <span className="rounded bg-[#2b3328] px-2 py-0.5 text-[10px] font-extrabold text-[#b9f227]">RECOMMENDED</span>
                  </div>
                  <p className="mt-1 text-xs text-[#a4abb2] leading-relaxed">
                    Install IronCore directly into your phone’s app drawer. Runs full screen without browser bars, saves data permanently in your phone’s storage, and works offline anytime!
                  </p>
                </div>
              </div>

              {/* Install Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleInstallPWA}
                  className="flex items-center justify-center gap-2.5 rounded-xl bg-[#b9f227] px-4 py-3 text-xs font-black text-[#151719] hover:brightness-110 shadow-lg shadow-[#b9f227]/20 transition"
                >
                  <Download className="h-4 w-4" />
                  {isInstalled ? 'App Already Installed ✓' : 'Install Native Android App'}
                </button>
                <button
                  onClick={downloadApkConfigBundle}
                  disabled={isGeneratingPackage}
                  className="flex items-center justify-center gap-2.5 rounded-xl border border-[#34393e] bg-[#282c30] px-4 py-3 text-xs font-bold text-white hover:bg-[#34393e] transition"
                >
                  <HardDrive className="h-4 w-4 text-[#b9f227]" />
                  {isGeneratingPackage ? 'Exporting Package...' : 'Download APK Config Bundle'}
                </button>
              </div>

              {/* Android Steps */}
              <div className="rounded-xl border border-[#34393e] bg-[#1a1d20] p-4 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#a4abb2]">
                  How to install on Android phone:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-[#f4f5f6]">
                  <li>
                    Tap the <strong>three vertical dots (⋮)</strong> at the top-right of Chrome / Brave browser.
                  </li>
                  <li>
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>
                    Tap <strong>"Install"</strong> — Android creates a native standalone launcher icon on your phone desktop.
                  </li>
                  <li>
                    Open the app directly from your phone screen. All gym data remains safely stored in your phone’s internal flash storage!
                  </li>
                </ol>
              </div>

              {/* Offline note */}
              <div className="flex items-center gap-3 rounded-lg border border-[#3a4823] bg-[#232b1c] p-3 text-xs text-[#d7ff7d]">
                <HardDrive className="h-4 w-4 flex-shrink-0" />
                <span>Zero cloud size limits: All 500+ member records, photos, payments, and expenses are saved directly to your physical device storage.</span>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#34393e] bg-[#282c30] p-4 flex items-start gap-4">
                <div className="rounded-lg bg-[#30382a] p-3 text-[#b9f227]">
                  <Apple className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">iPhone & iPad Installation (iOS Safari)</h3>
                  <p className="mt-1 text-xs text-[#a4abb2]">
                    Apple iOS supports Progressive Web Apps directly via Safari without requiring the App Store.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#34393e] bg-[#1a1d20] p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b9f227] text-black font-bold text-xs flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Tap the Share icon</p>
                    <p className="text-[11px] text-[#a4abb2]">
                      In Safari toolbar at the bottom of your iPhone, tap the square icon with an upward arrow (<Share2 className="inline h-3 w-3" />).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b9f227] text-black font-bold text-xs flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Select "Add to Home Screen"</p>
                    <p className="text-[11px] text-[#a4abb2]">
                      Scroll down through the share options and tap the <strong>Add to Home Screen</strong> (+) button.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#b9f227] text-black font-bold text-xs flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Tap "Add" in Top Right Corner</p>
                    <p className="text-[11px] text-[#a4abb2]">
                      The <strong>IronCore Gym Pro</strong> icon will appear on your iPhone home screen with native full-screen performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'windows' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#34393e] bg-[#282c30] p-4 flex items-start gap-4">
                <div className="rounded-lg bg-[#30382a] p-3 text-[#b9f227]">
                  <Monitor className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Windows 10 / 11 & Mac Desktop App</h3>
                  <p className="mt-1 text-xs text-[#a4abb2]">
                    Run as a standalone desktop application with dedicated taskbar pin, window controls, and keyboard shortcuts.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#34393e] bg-[#1a1d20] p-4 space-y-3">
                <p className="text-xs text-[#f4f5f6]">
                  In <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> on Windows:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[#a4abb2]">
                  <li>Look at the right side of the URL address bar for the <strong className="text-white">App Install icon (⊕)</strong>.</li>
                  <li>Click <strong>"Install IronCore Gym Pro"</strong>.</li>
                  <li>Pin the application to your Windows Taskbar or Start Menu for instant access at the gym front desk.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#34393e] bg-[#181a1d] px-6 py-4">
          <div className="flex items-center gap-2 text-[11px] text-[#a4abb2]">
            <Shield className="h-3.5 w-3.5 text-[#b9f227]" />
            <span>Encrypted offline storage on this physical machine</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-[#34393e] bg-[#282c30] px-4 py-2 text-xs font-bold text-white hover:bg-[#34393e] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
