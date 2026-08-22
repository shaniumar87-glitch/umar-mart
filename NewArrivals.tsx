import React from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface NewArrivalsProps {
  products: Product[];
  currency: Currency;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  products,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const newList = products.filter((p) => p.isNew);

  return (
    <section id="new-arrivals" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-emerald-600 font-bold text-xs tracking-wider uppercase mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Fresh Off The Line</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              New Arrivals
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Be the first to experience our latest additions in luxury timepieces, audio technology, and smart lifestyle accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newList.map((product) => (
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
