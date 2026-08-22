import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Zap,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Bell,
  BellRing,
  MapPin,
  Clock,
  Plus,
  PackageCheck
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice, calculateDiscount } from '../lib/formatters';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onShowToast?: (msg: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  currency,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  onShowToast,
}) => {
  if (!isOpen || !product) return null;

  const images = [product.image, ...(product.additionalImages || [])];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [priceDropSubscribed, setPriceDropSubscribed] = useState(false);
  const [backInStockSubscribed, setBackInStockSubscribed] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState('Karachi');

  const discount = calculateDiscount(product.price, product.originalPrice);

  const handleTogglePriceAlert = () => {
    const nextState = !priceDropSubscribed;
    setPriceDropSubscribed(nextState);
    if (onShowToast) {
      onShowToast(
        nextState
          ? `🔔 Subscribed to Price Drop Alerts for "${product.name}"!`
          : `Unsubscribed from Price Drop Alerts.`
      );
    }
  };

  const handleToggleBackInStock = () => {
    const nextState = !backInStockSubscribed;
    setBackInStockSubscribed(nextState);
    if (onShowToast) {
      onShowToast(
        nextState
          ? `📦 Back in Stock alert enabled! We will notify you via Email & SMS.`
          : `Unsubscribed from Back in Stock alert.`
      );
    }
  };

  const CITY_DELIVERY_TIMINGS: Record<string, string> = {
    Karachi: '⚡ Delivery in 1-2 Working Days (TCS Express)',
    Lahore: '⚡ Delivery in 2-3 Working Days (Leopard Courier)',
    Islamabad: '⚡ Delivery in 2-3 Working Days (M&P Courier)',
    Rawalpindi: '⚡ Delivery in 2-3 Working Days (TCS Express)',
    Faisalabad: '⚡ Delivery in 3-4 Working Days (Leopard Courier)',
    Peshawar: '⚡ Delivery in 3-4 Working Days (PostEx)',
    Multan: '⚡ Delivery in 3-4 Working Days (M&P)',
    Quetta: '⚡ Delivery in 4-5 Working Days (TCS Express)',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white border border-slate-200/80 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-8 text-slate-900">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between space-y-4 border-r border-slate-200/80">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-blue-600 scale-105'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Specs & Purchase Options */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            <div>
              <div className="flex items-center space-x-2 text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-emerald-600">In Stock ({product.stock})</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 mr-1 text-amber-400" />
                  <span className="font-bold text-sm text-slate-800">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500">
                  ({product.reviewsCount} customer reviews)
                </span>
              </div>
            </div>

            {/* Price Header & Alert Buttons */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black text-slate-900">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through font-medium">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleTogglePriceAlert}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1 ${
                      priceDropSubscribed
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Notify me when price drops"
                  >
                    <BellRing className={`w-3.5 h-3.5 ${priceDropSubscribed ? 'text-amber-600 fill-amber-500' : ''}`} />
                    <span className="hidden sm:inline text-[10px]">{priceDropSubscribed ? 'Alert On' : 'Price Alert'}</span>
                  </button>

                  <button
                    onClick={handleToggleBackInStock}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1 ${
                      backInStockSubscribed
                        ? 'bg-blue-100 border-blue-300 text-blue-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Notify me when back in stock"
                  >
                    <PackageCheck className={`w-3.5 h-3.5 ${backInStockSubscribed ? 'text-blue-600' : ''}`} />
                    <span className="hidden sm:inline text-[10px]">{backInStockSubscribed ? 'Stock Alert' : 'Stock Alert'}</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Pakistan Delivery Estimator */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 font-extrabold text-blue-900">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Delivery Estimator (Pakistan)</span>
                </div>
                <select
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  className="bg-white border border-blue-200 text-slate-800 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none"
                >
                  {Object.keys(CITY_DELIVERY_TIMINGS).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{CITY_DELIVERY_TIMINGS[deliveryCity]}</span>
              </p>
            </div>

            {/* Color selection if available */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Color: <span className="text-blue-600">{selectedColor}</span>
                </label>
                <div className="flex space-x-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColor === c.name
                          ? 'border-blue-600 scale-110 ring-2 ring-blue-600/30'
                          : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection if available */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Size: <span className="text-blue-600">{selectedSize}</span>
                </label>
                <div className="flex space-x-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                        selectedSize === s
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Features Bullet List */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Key Highlights
              </h4>
              <ul className="space-y-1.5">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-blue-600 mr-2 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Frequently Bought Together Bundle */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Frequently Bought Together
                </span>
                <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                  Save 15% Extra
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 overflow-hidden shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <Plus className="w-4 h-4 text-amber-600 shrink-0 font-bold" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-xs truncate">UmarMart Express Extended Warranty & Screen Protection</p>
                  <p className="text-[11px] font-bold text-amber-800">+ {formatPrice(799, currency)}</p>
                </div>
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor, selectedSize);
                    if (onShowToast) onShowToast('Added Product + Care Bundle to Cart!');
                    onClose();
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs shrink-0 shadow-2xs"
                >
                  + Add Bundle
                </button>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-slate-900 px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-full border transition-colors ${
                    isInWishlist
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-rose-600'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-white' : ''}`} />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor, selectedSize);
                    onClose();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-full shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add To Cart • {formatPrice(product.price * quantity, currency)}</span>
                </button>

                {/* WhatsApp Quick Order & Inquiry Button */}
                <a
                  href={`https://wa.me/923152643791?text=${encodeURIComponent(
                    `Assalam-o-Alaikum UmarMart! I am interested in purchasing "${product.name}" (Price: ${formatPrice(product.price, currency)}). Please assist me.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold py-2.5 px-6 rounded-full flex items-center justify-between text-xs transition-all group"
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span>Inquire / Order via WhatsApp</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Online Support
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-500 pt-2">
              <div className="flex items-center space-x-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2-Year UmarMart Warranty</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Express Courier Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

