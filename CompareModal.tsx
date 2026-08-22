import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, Star, Check, ShoppingBag, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/formatters';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onClearCompare: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  currency: Currency;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
  currency,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-slate-900 my-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Compare Products</h3>
                <p className="text-xs text-slate-500">Side-by-side specification & price matrix</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {compareList.length > 0 && (
                <button
                  onClick={onClearCompare}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Matrix */}
          {compareList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Scale className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">No Products Selected for Comparison</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the compare icon on any product card in UmarMart store to add items here for a detailed feature comparison.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Browse UmarMart Store
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[650px] grid grid-cols-5 gap-4 divide-x divide-slate-100 text-xs">
                {/* Labels Column */}
                <div className="space-y-6 pt-2 pr-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  <div className="h-40 flex items-center">Product Info</div>
                  <div className="h-10 flex items-center border-t border-slate-100 pt-2">Price</div>
                  <div className="h-10 flex items-center border-t border-slate-100 pt-2">Rating & Reviews</div>
                  <div className="h-10 flex items-center border-t border-slate-100 pt-2">Category</div>
                  <div className="h-10 flex items-center border-t border-slate-100 pt-2">Stock Availability</div>
                  <div className="h-10 flex items-center border-t border-slate-100 pt-2">Warranty</div>
                  <div className="h-20 flex items-center border-t border-slate-100 pt-2">Action</div>
                </div>

                {/* Items Columns */}
                {compareList.map((product) => (
                  <div key={product.id} className="pl-4 space-y-6 flex flex-col justify-between">
                    {/* Item Image & Title */}
                    <div className="h-40 flex flex-col justify-between relative">
                      <button
                        onClick={() => onRemoveFromCompare(product.id)}
                        className="absolute top-0 right-0 p-1 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-full transition-colors z-10"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-xl border border-slate-200 mx-auto shadow-2xs"
                      />

                      <h5 className="font-black text-slate-900 text-xs text-center line-clamp-2 mt-2">
                        {product.name}
                      </h5>
                    </div>

                    {/* Price */}
                    <div className="h-10 flex items-center border-t border-slate-100 pt-2 font-black text-blue-600 text-sm">
                      {formatPrice(product.price, currency)}
                    </div>

                    {/* Rating */}
                    <div className="h-10 flex items-center border-t border-slate-100 pt-2 text-slate-800 font-bold">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 text-[10px] ml-1">({product.reviewsCount})</span>
                    </div>

                    {/* Category */}
                    <div className="h-10 flex items-center border-t border-slate-100 pt-2 text-slate-700 font-medium capitalize">
                      {product.category}
                    </div>

                    {/* Stock */}
                    <div className="h-10 flex items-center border-t border-slate-100 pt-2">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {product.stock} in stock
                      </span>
                    </div>

                    {/* Warranty */}
                    <div className="h-10 flex items-center border-t border-slate-100 pt-2 text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 mr-1 shrink-0" />
                      <span>1-Year Warranty</span>
                    </div>

                    {/* Action Button */}
                    <div className="h-20 flex items-center border-t border-slate-100 pt-2">
                      <button
                        onClick={() => {
                          onAddToCart(product, 1);
                          onClose();
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-xl shadow-xs text-xs flex items-center justify-center space-x-1 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add To Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
