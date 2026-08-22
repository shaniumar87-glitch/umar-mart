import React, { useState } from 'react';
import { Mail, Send, Sparkles, CheckCircle2 } from 'lucide-react';

interface NewsletterProps {
  onShowToast: (msg: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onShowToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribed(true);
    onShowToast('🎉 Welcome to UmarMart VIP! Promo code UMARVIP15 activated.');
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
          <div className="max-w-xl space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-900/80 border border-blue-700/80 text-blue-300 text-xs font-bold px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Join UmarMart VIP Circle</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Get $20 OFF Your First Order!
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Subscribe to receive exclusive access to luxury flash sales, private drop invitations, and secret discount coupons directly in your inbox.
            </p>
          </div>

          {/* Form / Success view */}
          <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[420px]">
            {subscribed ? (
              <div className="bg-slate-950 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-2 shadow-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">VIP Pass Activated!</h4>
                <p className="text-xs text-slate-300">
                  Your $20 welcome voucher is <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-amber-500/30">UMARVIP15</span>. Applied automatically at checkout!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your VIP email address..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-full pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-full shadow-md shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 shrink-0"
                >
                  <span>Claim $20</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
