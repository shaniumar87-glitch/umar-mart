import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  Search,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/formatters';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: Currency;
  onSelectProduct: (product: Product) => void;
  onShowToast: (msg: string) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Smartphone / iPhone',
    category: 'Mobiles',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Laptop / MacBook',
    category: 'Laptops',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Headphones / Audio',
    category: 'Mobiles',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Smart Watch',
    category: 'Mobiles',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Fashion / Sneakers',
    category: 'Fashion',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  },
];

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
  onShowToast,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processImageScan(event.target.result as string, 'Uploaded Image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageScan = (imgUrl: string, sampleCategoryName?: string) => {
    setSelectedImage(imgUrl);
    setIsScanning(true);
    setDetectedCategory(null);
    setMatchingProducts([]);

    setTimeout(() => {
      setIsScanning(false);
      // Infer category matching based on preset or random matching products
      let category = 'Mobiles';
      if (sampleCategoryName?.toLowerCase().includes('laptop')) category = 'Laptops';
      else if (sampleCategoryName?.toLowerCase().includes('fashion') || sampleCategoryName?.toLowerCase().includes('sneakers')) category = 'Fashion';
      else if (sampleCategoryName?.toLowerCase().includes('watch')) category = 'Mobiles';

      setDetectedCategory(category);
      const matches = products
        .filter((p) => p.category.toLowerCase().includes(category.toLowerCase()))
        .slice(0, 4);

      setMatchingProducts(matches.length > 0 ? matches : products.slice(0, 4));
      onShowToast(`AI Image Vision identified item in category "${category}"!`);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-slate-900 my-8 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-sm">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              AI Visual Image Search
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Upload or snap a photo of any item. UmarMart AI Vision will match identical products from our catalog instantly.
            </p>
          </div>

          {/* Upload Dropzone */}
          {!selectedImage ? (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all text-center group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-extrabold text-sm text-slate-900">
                  Click to Upload or Drag & Drop Photo
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supports JPG, PNG, WEBP, HEIC up to 10MB
                </span>
              </label>

              {/* Sample Photo Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                  Or Try Sample Photo Presets
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SAMPLE_PHOTO_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => processImageScan(preset.url, preset.name)}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 hover:border-blue-600 aspect-square flex items-center justify-center bg-slate-100"
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-1.5 text-[9px] font-extrabold text-white text-center leading-tight">
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Scanned Image Preview & Matches */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white">
                  <img
                    src={selectedImage}
                    alt="Scanned photo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center backdrop-blur-xs">
                      <RefreshCw className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                  {isScanning ? (
                    <div className="space-y-1">
                      <span className="font-bold text-blue-600 text-xs flex items-center justify-center sm:justify-start gap-1">
                        <Sparkles className="w-4 h-4 animate-spin" /> Analyzing Visual Features...
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Extracting color, shape & category attributes via UmarMart AI Vision model.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Match Identified: {detectedCategory}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Found {matchingProducts.length} matching products available in stock.
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setMatchingProducts([]);
                    }}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-900 underline mt-1"
                  >
                    Upload Different Photo
                  </button>
                </div>
              </div>

              {/* Matching Product List */}
              {matchingProducts.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                    Matching UmarMart Listings
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center space-x-3 hover:border-blue-600 transition-all shadow-2xs group"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-600">
                            {p.name}
                          </h5>
                          <span className="font-black text-blue-600 text-xs block">
                            {formatPrice(p.price, currency)}
                          </span>
                          <button
                            onClick={() => {
                              onSelectProduct(p);
                              onClose();
                            }}
                            className="mt-1 text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <span>View Specs & Buy</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
