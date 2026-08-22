import React from 'react';
import { Star, Heart, Eye, ShoppingBag, Zap, Scale } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice, calculateDiscount } from '../lib/formatters';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isCompared?: boolean;
  onToggleCompare?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isInWishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  isCompared = false,
  onToggleCompare,
}) => {
  const discount = calculateDiscount(product.price, product.originalPrice);

  return (
    <div className="group relative bg-white border border-slate-200/80 hover:border-blue-500/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Top Image Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width="400"
            height="400"
            referrerPolicy="no-referrer"
            onClick={() => onQuickView(product)}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
            {discount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                -{discount}% OFF
              </span>
            )}
            {product.isFlashSale && (
              <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center space-x-1 uppercase">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>FLASH</span>
              </span>
            )}
            {product.badge && !discount && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase">
                {product.badge}
              </span>
            )}
          </div>

          {/* Quick Action Overlay Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`p-2.5 rounded-full border backdrop-blur-md transition-all shadow-sm ${
                isInWishlist
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white/90 text-slate-600 border-slate-200 hover:text-rose-600 hover:bg-white'
              }`}
              title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white' : ''}`} />
            </button>

            {onToggleCompare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(product);
                }}
                className={`p-2.5 rounded-full border backdrop-blur-md transition-all shadow-sm ${
                  isCompared
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white/90 text-slate-600 border-slate-200 hover:text-blue-600 hover:bg-white'
                }`}
                title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              >
                <Scale className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-blue-600 border border-slate-200 backdrop-blur-md transition-all shadow-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Stock Meter if low stock */}
          {product.stock <= 10 && (
            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 text-white border border-slate-800 rounded-lg p-1.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold mb-1">
                <span>Only {product.stock} left in stock!</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${(product.stock / 20) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-600 font-bold tracking-wide uppercase text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center space-x-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-700 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline space-x-2 pt-1">
            <span className="text-lg font-black text-slate-900">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <button
          onClick={() => onAddToCart(product)}
          className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm group/btn"
        >
          <ShoppingBag className="w-4 h-4 text-slate-300 group-hover/btn:text-white transition-colors" />
          <span className="text-xs">Add To Cart</span>
        </button>
      </div>
    </div>
  );
};
