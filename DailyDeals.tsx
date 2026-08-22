import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, ArrowRight, Zap } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/formatters';
import { ProductCard } from './ProductCard';

interface DailyDealsProps {
  products: Product[];
  currency: Currency;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export const DailyDeals: React.FC<DailyDealsProps> = ({
  products,
  currency,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}) => {
  // Timer state for Daily Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products for daily deals
  const dealProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 4);

  return (
    <section className="py-8 bg-gradient-to-b from-amber-50/50 to-white border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-200">
                <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
                <span>24-HOUR SUPER DISCOUNTS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Daraz-Style Daily Mega Deals
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 font-medium">
                Up to 50% OFF top tech gadgets & luxury fashion. Resetting at midnight!
              </p>
            </div>

            {/* Live Countdown Box */}
            <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0">
              <Clock className="w-5 h-5 text-amber-300 animate-spin-slow" />
              <span className="text-xs font-bold text-white mr-1">Deals Expire In:</span>
              <div className="flex items-center space-x-1 font-mono font-black text-sm">
                <span className="bg-white text-slate-900 px-2 py-1 rounded-lg">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white text-slate-900 px-2 py-1 rounded-lg">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white text-slate-900 px-2 py-1 rounded-lg">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Deals Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard
                product={p}
                currency={currency}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={wishlistIds.includes(p.id)}
              />
              {/* Deal Progress bar */}
              <div className="mt-2 bg-slate-100 p-2 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>Sold: {p.salesCount || 48}%</span>
                  <span className="text-amber-600">Only {p.stock} Left!</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                    style={{ width: `${Math.min(100, (p.salesCount || 48) + 15)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
