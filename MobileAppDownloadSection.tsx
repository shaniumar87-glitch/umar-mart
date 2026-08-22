import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Smartphone,
  QrCode,
  Download,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Send,
  Star,
  Award,
  Bell
} from 'lucide-react';

interface MobileAppDownloadSectionProps {
  onShowToast: (msg: string) => void;
}

export const MobileAppDownloadSection: React.FC<MobileAppDownloadSectionProps> = ({ onShowToast }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkSent, setLinkSent] = useState(false);

  const handleSendAppLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      onShowToast('Please enter your Pakistani mobile number (+92 3XX XXXXXXX)');
      return;
    }
    setLinkSent(true);
    onShowToast(`📲 UmarMart App download link SMS dispatched to ${phoneNumber}!`);
    setTimeout(() => setLinkSent(false), 4000);
  };

  return (
    <section className="py-12 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white relative overflow-hidden my-6 border-y border-blue-800/40">
      {/* Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & SMS Link Sender */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Official UmarMart Mobile App v3.2</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Shop 10x Faster on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-300 to-amber-400">
                UmarMart App for iOS & Android
              </span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Get app-exclusive PKR 500 discount vouchers, real-time TCS/Leopard courier push tracking, instant voice & image search, and early access to Pakistan Flash Sales!
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1 max-w-lg mx-auto lg:mx-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold text-slate-100 text-[11px]">Exclusive App Deals</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center space-x-2">
                <Bell className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-100 text-[11px]">Instant Order Push</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center space-x-2 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-bold text-slate-100 text-[11px]">Secure EasyPaisa</span>
              </div>
            </div>

            {/* SMS Link Form */}
            <form onSubmit={handleSendAppLink} className="pt-2">
              <div className="text-xs font-bold text-slate-300 mb-1.5">
                Send Download Link via SMS:
              </div>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto lg:mx-0">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+92 315 2643791"
                  className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs font-mono font-bold text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>{linkSent ? 'SMS Dispatched!' : 'Send SMS Link'}</span>
                </button>
              </div>
            </form>

            {/* Store Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              {/* Google Play Store */}
              <button
                onClick={() => onShowToast('Google Play Store download initiated!')}
                className="bg-black/80 hover:bg-black border border-white/20 text-white rounded-2xl px-5 py-2.5 flex items-center space-x-3 transition-all hover:scale-105 shadow-md"
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L18.81,13.12C19.31,12.62 19.31,11.88 18.81,11.38L16.81,9.38L14.81,11.38L16.81,13.12M15.1,12L4.5,1.4L15.1,12M4.5,22.6L15.1,12L4.5,22.6Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">GET IT ON</div>
                  <div className="text-xs font-black">Google Play</div>
                </div>
              </button>

              {/* Apple App Store */}
              <button
                onClick={() => onShowToast('Apple App Store download initiated!')}
                className="bg-black/80 hover:bg-black border border-white/20 text-white rounded-2xl px-5 py-2.5 flex items-center space-x-3 transition-all hover:scale-105 shadow-md"
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.09,21.97C7.79,22 6.87,20.68 6.03,19.47C4.31,17 3,12.5 4.8,9.38C5.7,7.82 7.3,6.83 9,6.8C10.3,6.77 11.53,7.68 12.32,7.68C13.11,7.68 14.61,6.58 16.22,6.76C16.9,6.79 18.79,7.03 19.96,8.74C19.86,8.8 17.65,10.09 17.67,12.72C17.7,15.89 20.44,16.95 20.5,16.97C20.45,17.12 20.03,18.57 18.71,19.5M15.97,5.03C16.63,4.22 17.08,3.09 16.95,1.96C15.98,2 14.81,2.61 14.12,3.42C13.5,4.14 12.98,5.3 13.13,6.41C14.22,6.5 15.31,5.84 15.97,5.03Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Download on the</div>
                  <div className="text-xs font-black">App Store</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Mobile Phone Screen & QR Mockup */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6">
            
            {/* Phone Screen Mockup */}
            <div className="relative w-56 h-[380px] bg-slate-900 border-4 border-slate-700 rounded-[36px] shadow-2xl overflow-hidden p-2 flex flex-col justify-between shrink-0">
              {/* Notch */}
              <div className="w-20 h-4 bg-slate-800 rounded-b-xl mx-auto z-20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-950" />
              </div>

              {/* App UI Screen */}
              <div className="bg-slate-950 flex-1 rounded-[28px] overflow-hidden p-3 space-y-3 relative text-white">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                  <span>UmarMart App</span>
                  <span className="text-emerald-400">● Live 5G</span>
                </div>

                <div className="bg-blue-600 rounded-2xl p-3 text-left space-y-1">
                  <div className="text-[10px] uppercase font-black text-blue-200">Exclusive App Gift</div>
                  <div className="text-xs font-black">PKR 500 OFF Code</div>
                  <span className="inline-block bg-white text-blue-900 font-mono font-black text-[9px] px-2 py-0.5 rounded-md">
                    UMARAPP500
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Flash Sales Today</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-center">
                      <div className="w-full h-12 bg-slate-800 rounded-lg mb-1" />
                      <div className="text-[9px] font-bold truncate">Wireless Earbuds</div>
                      <div className="text-[9px] font-black text-amber-400">PKR 2,499</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-center">
                      <div className="w-full h-12 bg-slate-800 rounded-lg mb-1" />
                      <div className="text-[9px] font-bold truncate">Smart Watch Pro</div>
                      <div className="text-[9px] font-black text-amber-400">PKR 4,999</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 left-3 right-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-xl p-2 text-center text-[9px] font-bold text-slate-300">
                  🚀 4.9 ★★★★★ Rating (150K+ Reviews)
                </div>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl text-center space-y-2 shrink-0">
              <div className="w-28 h-28 bg-white rounded-2xl p-2 mx-auto flex items-center justify-center shadow-lg">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <div className="text-xs font-black text-white">Scan to Download</div>
              <div className="text-[10px] text-slate-300">Point phone camera at QR code</div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
