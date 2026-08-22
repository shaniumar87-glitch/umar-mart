import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/formatters';

interface SmartRecommendationsProps {
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  products,
  currency,
  onSelectProduct,
  onAddToCart,
}) => {
  // Recommend 4 products based on high rating / popular categories
  const recommended = products.slice(0, 4);

  return (
    <section className="py-12 bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Personalized For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI Smart Recommendations
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Based on real-time Pakistani shopping trends and customer preferences, our AI engine handpicked these top deals for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.map((prod) => (
            <motion.div
              key={prod.id}
              whileHover={{ y: -6 }}
              className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group relative"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  AI Pick
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-blue-400 font-semibold">{prod.category}</span>
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span className="font-bold">{prod.rating}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(prod)}
                    className="font-black text-slate-100 text-sm line-clamp-1 hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {prod.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-white">
                      {formatPrice(prod.price, currency)}
                    </span>
                    {prod.originalPrice && (
                      <div className="text-[10px] text-slate-400 line-through">
                        {formatPrice(prod.originalPrice, currency)}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onAddToCart(prod)}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all shadow-md shadow-blue-600/30 group-hover:scale-105"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
