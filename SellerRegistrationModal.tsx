import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Store,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  User,
  MapPin,
  CreditCard,
  Award,
  Package,
  Plus,
  TrendingUp,
  LayoutDashboard,
  Edit2,
  Trash2,
  Save,
  DollarSign,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/formatters';
import { CURRENCIES } from '../data/mockData';

interface SellerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
  products?: Product[];
  onAddProduct?: (product: Product) => void;
  onUpdateProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  currency?: Currency;
}

type SellerTab = 'register' | 'plans' | 'analytics' | 'products' | 'add_product';

export const SellerRegistrationModal: React.FC<SellerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  currency = CURRENCIES[0],
}) => {
  const [activeTab, setActiveTab] = useState<SellerTab>('register');
  const [storeName, setStoreName] = useState('Umar Express Electronics');
  const [sellerName, setSellerName] = useState('Muhammad Umar');
  const [email, setEmail] = useState('shaniumar87@gmail.com');
  const [phone, setPhone] = useState('+92 315 2643791');
  const [city, setCity] = useState('Karachi');
  const [category, setCategory] = useState('Mobiles');
  const [cnic, setCnic] = useState('42101-9876543-1');
  const [iban, setIban] = useState('PK36MEZN000201010123456');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'basic' | 'pro' | 'enterprise'>('pro');

  // Add Product Form State
  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState(2999);
  const [prodStock, setProdStock] = useState(25);
  const [prodCategory, setProdCategory] = useState('Mobiles');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onShowToast('🎉 Seller Registration Application Submitted! Welcome to UmarMart Seller Hub.');
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) {
      onShowToast('Please enter a product title');
      return;
    }

    const newProduct: Product = {
      id: 'seller-prod-' + Date.now(),
      name: prodTitle,
      category: prodCategory,
      categorySlug: prodCategory.toLowerCase().replace(/\s+/g, '-'),
      price: Number(prodPrice),
      originalPrice: Number(prodPrice) * 1.25,
      rating: 5.0,
      reviewsCount: 1,
      image: prodImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      stock: Number(prodStock),
      salesCount: 0,
      description: `Official item listed by verified seller ${storeName} (${sellerName}).`,
      features: ['1 Year Seller Warranty', 'Fast Nationwide Shipping'],
      specs: [{ label: 'Seller', value: storeName }],
      isNew: true,
    };

    if (onAddProduct) {
      onAddProduct(newProduct);
    }
    onShowToast(`Product "${prodTitle}" added to UmarMart Marketplace!`);
    setProdTitle('');
    setActiveTab('products');
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditTitle(p.name);
    setEditPrice(p.price);
    setEditStock(p.stock);
  };

  const handleSaveEditProduct = () => {
    if (!editingProduct) return;
    const updated: Product = {
      ...editingProduct,
      name: editTitle,
      price: Number(editPrice),
      stock: Number(editStock),
    };

    if (onUpdateProduct) {
      onUpdateProduct(updated);
    }
    onShowToast(`Updated product "${editTitle}" in store catalog.`);
    setEditingProduct(null);
  };

  const handleDeleteProductClick = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from store inventory?`)) {
      if (onDeleteProduct) {
        onDeleteProduct(id);
      }
      onShowToast(`Product "${name}" deleted from store.`);
    }
  };

  const handleQuickStockChange = (p: Product, delta: number) => {
    const newStock = Math.max(0, p.stock + delta);
    const updated: Product = { ...p, stock: newStock };
    if (onUpdateProduct) {
      onUpdateProduct(updated);
    }
    onShowToast(`Stock updated for ${p.name}: ${newStock} units available.`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white p-5 relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0 font-black">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg sm:text-xl font-black text-white">UmarMart Seller Hub & Dashboard</h3>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    PKR Seller Portal
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Seller registration, upload & edit products, stock management, sales report & earnings summary
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center space-x-2 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'register' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Seller Registration</span>
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'plans' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Subscription Plans</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'analytics' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Sales Report & Earnings</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'products' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Store Products & Stock ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('add_product')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'add_product' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-extrabold">+ Upload Product</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* 1. SELLER REGISTRATION */}
            {activeTab === 'register' && (
              <>
                {isSubmitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900">Seller Account Active!</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      Congratulations <strong>{sellerName}</strong>! Your store <strong>{storeName}</strong> is verified on UmarMart Seller Hub in {city}.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto text-left text-xs space-y-2">
                      <div className="flex justify-between text-slate-600">
                        <span>Store Name:</span>
                        <strong className="text-slate-900">{storeName}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Category:</span>
                        <strong className="text-slate-900">{category}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Owner:</span>
                        <strong className="text-slate-900">{sellerName}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Payout IBAN:</span>
                        <strong className="text-slate-900 font-mono">Verified (Meezan Bank)</strong>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => setActiveTab('add_product')}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
                      >
                        + Upload Your First Product
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-3 gap-3 bg-blue-50/70 border border-blue-100 rounded-2xl p-3 text-center">
                      <div>
                        <Award className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <span className="font-bold text-slate-900 block text-[11px]">Free Onboarding</span>
                        <span className="text-[10px] text-slate-500">0% commission for 30 days</span>
                      </div>
                      <div>
                        <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                        <span className="font-bold text-slate-900 block text-[11px]">Weekly Payouts</span>
                        <span className="text-[10px] text-slate-500">Bank / EasyPaisa / JazzCash</span>
                      </div>
                      <div>
                        <Sparkles className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                        <span className="font-bold text-slate-900 block text-[11px]">Pan-Pakistan Express</span>
                        <span className="text-[10px] text-slate-500">TCS & Leopard Logistics</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Store / Business Name *</label>
                        <div className="relative">
                          <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="e.g. Umar Tech Emporium"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Owner Full Name *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="e.g. Muhammad Umar"
                            value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="email"
                            placeholder="shaniumar87@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="tel"
                            placeholder="+92 315 2643791"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Business City *</label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                          >
                            <option value="Karachi">Karachi</option>
                            <option value="Lahore">Lahore</option>
                            <option value="Islamabad">Islamabad</option>
                            <option value="Rawalpindi">Rawalpindi</option>
                            <option value="Faisalabad">Faisalabad</option>
                            <option value="Peshawar">Peshawar</option>
                            <option value="Multan">Multan</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">CNIC Number (13 digits) *</label>
                        <input
                          type="text"
                          placeholder="42101-9876543-1"
                          value={cnic}
                          onChange={(e) => setCnic(e.target.value)}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-medium focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl shadow-md shadow-blue-600/20 text-xs transition-all flex items-center justify-center space-x-2"
                      >
                        <Store className="w-4 h-4" />
                        <span>Submit Seller Registration</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* 1B. SELLER SUBSCRIPTION PLANS & VERIFIED BADGE */}
            {activeTab === 'plans' && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pakistani Seller Membership Tiers</span>
                  </span>
                  <h4 className="text-xl font-black text-slate-900">Choose Your Store Growth Plan</h4>
                  <p className="text-slate-500 text-xs">Unlock lower commissions, Verified Blue Badge & Multi-warehouse features</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Free Plan */}
                  <div
                    onClick={() => setSelectedPlan('free')}
                    className={`bg-white border p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-all ${
                      selectedPlan === 'free' ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="font-extrabold text-slate-700">Free Starter</div>
                      <div className="text-2xl font-black text-slate-900">PKR 0 <span className="text-xs text-slate-400 font-normal">/mo</span></div>
                      <p className="text-[11px] text-slate-500">Perfect for new home sellers</p>
                      <ul className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" /> Max 10 Products</li>
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" /> 5% Commission</li>
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" /> Standard Courier</li>
                      </ul>
                    </div>
                  </div>

                  {/* Basic Plan */}
                  <div
                    onClick={() => setSelectedPlan('basic')}
                    className={`bg-white border p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-all ${
                      selectedPlan === 'basic' ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="font-extrabold text-slate-800">Basic Business</div>
                      <div className="text-2xl font-black text-blue-600">PKR 2,999 <span className="text-xs text-slate-400 font-normal">/mo</span></div>
                      <p className="text-[11px] text-slate-500">For growing retail shops</p>
                      <ul className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" /> Max 50 Products</li>
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" /> 3.5% Commission</li>
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" /> Fast TCS Pickup</li>
                      </ul>
                    </div>
                  </div>

                  {/* Pro Plan (Popular) */}
                  <div
                    onClick={() => setSelectedPlan('pro')}
                    className={`bg-slate-900 text-white border p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-all relative ${
                      selectedPlan === 'pro' ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-800'
                    }`}
                  >
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      Most Popular
                    </span>
                    <div className="space-y-2">
                      <div className="font-extrabold text-amber-300 flex items-center gap-1">
                        Pro Vendor <ShieldCheck className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-black text-white">PKR 7,999 <span className="text-xs text-slate-400 font-normal">/mo</span></div>
                      <p className="text-[11px] text-slate-300">Verified seller badge included</p>
                      <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" /> Unlimited Products</li>
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" /> 1.5% Commission</li>
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" /> Verified Blue Badge</li>
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" /> AI Low-Stock Alerts</li>
                      </ul>
                    </div>
                  </div>

                  {/* Enterprise Plan */}
                  <div
                    onClick={() => setSelectedPlan('enterprise')}
                    className={`bg-white border p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-all ${
                      selectedPlan === 'enterprise' ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="font-extrabold text-indigo-700">Enterprise Superstore</div>
                      <div className="text-2xl font-black text-indigo-900">PKR 19,999 <span className="text-xs text-slate-400 font-normal">/mo</span></div>
                      <p className="text-[11px] text-slate-500">Multi-warehouse & 0% fee</p>
                      <ul className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" /> 0% Marketplace Fee</li>
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" /> Multi-Warehouse Hub</li>
                        <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" /> Dedicated Key Manager</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h5 className="font-black text-slate-900 text-xs">Apply for Verified Seller Blue Badge</h5>
                      <p className="text-[11px] text-slate-600">
                        Display the official UmarMart Verified Badge on all your product listings to boost conversion rate by up to +45%.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onShowToast(`✓ Subscription plan switched to ${selectedPlan.toUpperCase()}! Verified badge request submitted for review.`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shrink-0 shadow-md shadow-emerald-600/20"
                  >
                    Subscribe & Verify Now
                  </button>
                </div>
              </div>
            )}

            {/* 2. SALES REPORT & EARNINGS SUMMARY */}
            {activeTab === 'analytics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-4 rounded-2xl shadow-xs space-y-2">
                    <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">Total Revenue / Earnings</span>
                    <div className="text-2xl font-black text-amber-400">
                      {formatPrice(485000, currency)}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +18.5% weekly growth
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Orders Fulfilled</span>
                    <div className="text-2xl font-black text-slate-900">142 Orders</div>
                    <span className="text-[10px] text-blue-600 font-bold">Pan-Pakistan TCS & Leopard</span>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Payout IBAN Account</span>
                    <div className="text-xs font-mono font-bold text-slate-800 truncate">{iban}</div>
                    <span className="text-[10px] text-emerald-600 font-bold">Meezan Bank Weekly Payout</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Earnings Summary & Recent Payouts</h4>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-slate-900 block">Weekly Payout #UM-48201</strong>
                        <span className="text-slate-500 text-[11px]">Transferred to Meezan Bank</span>
                      </div>
                      <span className="font-black text-emerald-600">+ PKR 125,000</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-slate-900 block">Weekly Payout #UM-47910</strong>
                        <span className="text-slate-500 text-[11px]">Transferred to EasyPaisa Business Wallet</span>
                      </div>
                      <span className="font-black text-emerald-600">+ PKR 89,500</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. STORE PRODUCTS, EDIT PRODUCT, DELETE PRODUCT & STOCK MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-sm">Stock Management & Catalog ({products.length})</h4>
                  <button
                    onClick={() => setActiveTab('add_product')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload New Product</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((p) => (
                    <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between gap-3 shadow-2xs">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-slate-900 truncate text-xs">{p.name}</h5>
                          <div className="flex items-center space-x-2 text-[11px] mt-0.5">
                            <span className="font-black text-blue-600">{formatPrice(p.price, currency)}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500">{p.category}</span>
                          </div>
                          {/* Stock Counter Controls */}
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-[10px] font-bold text-slate-500">Stock:</span>
                            <button
                              onClick={() => handleQuickStockChange(p, -1)}
                              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className={`font-mono font-bold text-xs ${p.stock < 5 ? 'text-rose-600 font-black' : 'text-slate-900'}`}>
                              {p.stock}
                            </span>
                            <button
                              onClick={() => handleQuickStockChange(p, 1)}
                              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                            {p.stock < 5 && (
                              <span className="text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">Low Stock</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => startEditProduct(p)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold rounded-lg text-[11px] flex items-center space-x-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProductClick(p.id, p.name)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-[11px] flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. UPLOAD / ADD PRODUCT */}
            {activeTab === 'add_product' && (
              <form onSubmit={handleAddProductSubmit} className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  Upload Product to UmarMart Marketplace
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                    >
                      <option value="Mobiles">Mobiles</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Grocery">Grocery</option>
                      <option value="Home Appliances">Home Appliances</option>
                      <option value="Sports">Sports</option>
                      <option value="Books">Books</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price in PKR *</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Image URL *</label>
                  <input
                    type="url"
                    required
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow-md text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Product Listing to UmarMart</span>
                </button>
              </form>
            )}
          </div>

          {/* EDIT PRODUCT MODAL OVERLAY */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-sm">Edit Seller Product</h4>
                  <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price (PKR)</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEditProduct}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
