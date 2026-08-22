import React from 'react';
import { Crown, Star } from 'lucide-react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface BestSellersProps {
  products: Product[];
  currency: Currency;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({
  products,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const bestSellersList = products.filter((p) => p.isBestSeller);

  return (
    <section id="best-sellers" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-amber-600 font-bold text-xs tracking-wider uppercase mb-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Best Sellers
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Our most acclaimed, 5-star rated products backed by thousands of satisfied customers around the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bestSellersList.map((product) => (
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
