import React from 'react';
import { Phone, Mail, Globe, ShieldCheck, Sparkles, User as UserIcon, LogOut, Lock } from 'lucide-react';
import { Currency, User } from '../types';

interface TopBarProps {
  currencies: Currency[];
  selectedCurrency: Currency;
  onSelectCurrency: (currency: Currency) => void;
  currentUser?: User | null;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
  onOpenSeller?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currencies,
  selectedCurrency,
  onSelectCurrency,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  onOpenAdmin,
  onOpenSeller,
}) => {
  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Contact & Support */}
        <div className="flex items-center space-x-4">
          <a
            href="tel:+923152643791"
            className="flex items-center space-x-1.5 hover:text-blue-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span>+92 315 2643791</span>
          </a>
          <span className="text-slate-700 hidden md:inline">|</span>
          <a
            href="mailto:support@umarmart.com"
            className="hidden md:flex items-center space-x-1.5 hover:text-blue-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>support@umarmart.com</span>
          </a>
        </div>

        {/* Center: Live Promotion Ticker */}
        <div className="flex items-center space-x-2 text-center font-medium text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse hidden sm:block" />
          <p className="line-clamp-1 text-[11px] sm:text-xs">
            <span className="text-emerald-400 font-bold">PAKISTAN DELIVERY:</span> 2-5 Working Days via TCS / Leopard! Free over Rs. 2,999 | Code: <span className="bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800 font-mono">UMAR10</span>
          </p>
        </div>

        {/* Right: Currency & Authenticity & Authentication & Admin & Seller */}
        <div className="flex items-center space-x-3">
          {/* User Authentication Status or Login / Sign Up buttons */}
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-0.5">
              <button
                onClick={onOpenProfile}
                className="flex items-center space-x-1.5 text-[11px] font-bold text-blue-300 hover:text-white transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[10px] bg-blue-950 text-blue-400 px-1 rounded font-semibold">{currentUser.vipTier}</span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-400 transition-colors pl-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onOpenAuth?.('signin')}
                className="text-[11px] font-bold text-slate-200 hover:text-blue-400 px-2 py-0.5 rounded transition-colors flex items-center space-x-1"
              >
                <UserIcon className="w-3 h-3 text-blue-400" />
                <span>Login</span>
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => onOpenAuth?.('signup')}
                className="text-[11px] font-extrabold text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-2.5 py-0.5 rounded-lg transition-all flex items-center space-x-1"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {onOpenSeller && (
            <button
              onClick={onOpenSeller}
              className="hidden md:flex bg-amber-500/20 hover:bg-amber-500 border border-amber-500/40 text-amber-300 hover:text-slate-900 px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sell on UmarMart</span>
            </button>
          )}

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="hidden lg:flex bg-blue-600/30 hover:bg-blue-600 border border-blue-500/50 text-blue-200 hover:text-white px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          )}

          {/* Currency Dropdown */}
          <div className="flex items-center space-x-1 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2 py-0.5">
            <Globe className="w-3 h-3 text-slate-400" />
            <select
              value={selectedCurrency.code}
              onChange={(e) => {
                const found = currencies.find((c) => c.code === e.target.value);
                if (found) onSelectCurrency(found);
              }}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer py-0.5 pr-1 font-medium"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                  {c.code} ({c.symbol.trim()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
