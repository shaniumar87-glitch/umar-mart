import React, { useState } from 'react';
import { Award, Sparkles } from 'lucide-react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  currency: Currency;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const featuredList = products.filter((p) => p.isFeatured);
  
  const filteredProducts = activeTab === 'all'
    ? featuredList
    : featuredList.filter((p) => p.categorySlug === activeTab);

  const TABS = [
    { id: 'all', label: 'All Featured' },
    { id: 'audio', label: 'Audio & Sound' },
    { id: 'watches', label: 'Luxury Watches' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'mens-fashion', label: "Men's Fashion" }
  ];

  return (
    <section id="featured" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-blue-600 font-bold text-xs tracking-wider uppercase mb-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Handpicked Excellence</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Featured Collections
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
