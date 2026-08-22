import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';
import { formatTimeLeft } from '../lib/formatters';

interface FlashSaleProps {
  products: Product[];
  currency: Currency;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({
  products,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const flashProducts = products.filter((p) => p.isFlashSale);
  const targetDate = '2026-08-02T23:59:59';
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <section id="flash-sale" className="py-16 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Card Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                <Flame className="w-8 h-8 fill-red-500 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase tracking-widest mb-1">
                  <Zap className="w-3.5 h-3.5 fill-red-400" />
                  <span>Limited Time UmarMart Event</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Flash Sale Deals
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Grab maximum discounts on high-demand premium products before stock empties!
                </p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center space-x-2 sm:space-x-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-inner">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 mr-2 hidden sm:flex">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Ends In:</span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center min-w-[50px] bg-slate-900 border border-slate-700 rounded-xl py-2 px-3">
                <span className="text-lg sm:text-2xl font-black text-white font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Hours</span>
              </div>

              <span className="text-xl font-bold text-slate-400">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center min-w-[50px] bg-slate-900 border border-slate-700 rounded-xl py-2 px-3">
                <span className="text-lg sm:text-2xl font-black text-white font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Mins</span>
              </div>

              <span className="text-xl font-bold text-slate-400">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center min-w-[50px] bg-slate-900 border border-slate-700 rounded-xl py-2 px-3">
                <span className="text-lg sm:text-2xl font-black text-amber-400 font-mono">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {flashProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              isInWishlist={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
