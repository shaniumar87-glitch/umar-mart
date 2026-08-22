import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/formatters';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  wishlistIds: string[];
  currency: Currency;
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  wishlistIds,
  currency,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-900">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Saved Wishlist</h3>
                <p className="text-xs text-slate-500">
                  {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-100">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Heart className="w-8 h-8 text-rose-400" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Your wishlist is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Save items you love by clicking the heart icon on product cards.
                </p>
              </div>
            ) : (
              wishlistProducts.map((prod) => (
                <div key={prod.id} className="pt-4 first:pt-0 flex space-x-4">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate pr-2">
                        {prod.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(prod)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-blue-600 font-bold">
                      {formatPrice(prod.price, currency)}
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart(prod);
                      }}
                      className="mt-2 w-full flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full text-xs shadow-md shadow-blue-600/20"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move To Cart</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
