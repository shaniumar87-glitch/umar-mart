import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  Zap,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Flame,
  Award,
  TrendingUp,
  Star,
  Store,
  Camera,
  Mic,
  Gift,
  LogOut,
  Package,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Settings,
} from 'lucide-react';
import { Category, Product, Currency, User as UserType } from '../types';
import { formatPrice } from '../lib/formatters';
import { searchProducts } from '../services/firebaseService';

interface HeaderProps {
  categories: Category[];
  products: Product[];
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  currentUser?: UserType | null;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  onOpenContact?: () => void;
  onOpenFAQ?: () => void;
  onOpenOrderTracking?: () => void;
  onOpenAdmin?: () => void;
  onOpenSeller?: () => void;
  onOpenImageSearch?: () => void;
  onOpenSpinWin?: () => void;
  onOpenAuction?: () => void;
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  currency: Currency;
  onScrollToSection: (sectionId: string) => void;
  onShowToast?: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  products,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  currentUser,
  onOpenProfile,
  onLogout,
  onOpenContact,
  onOpenFAQ,
  onOpenOrderTracking,
  onOpenAdmin,
  onOpenSeller,
  onOpenImageSearch,
  onOpenSpinWin,
  onOpenAuction,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  currency,
  onScrollToSection,
  onShowToast,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVoiceSearch = () => {
    // Web Speech API check
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      setIsListening(true);
      if (onShowToast) onShowToast('🎤 Listening... Speak product name now');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSearchChange(transcript);
        setIsListening(false);
        if (onShowToast) onShowToast(`Voice search: "${transcript}"`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        fallbackVoiceSearch();
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      fallbackVoiceSearch();
    }
  };

  const fallbackVoiceSearch = () => {
    setIsListening(true);
    if (onShowToast) onShowToast('🎤 Listening to speech... (Try saying "iPhone", "Laptop" or "Headphones")');
    setTimeout(() => {
      setIsListening(false);
      const demoWords = ['Headphones', 'MacBook', 'Sneakers', 'iPhone', 'Watch'];
      const randomWord = demoWords[Math.floor(Math.random() * demoWords.length)];
      onSearchChange(randomWord);
      if (onShowToast) onShowToast(`Voice Recognized: "${randomWord}"`);
    }, 2000);
  };

  // Filter live search suggestions by Name, Category, Brand, Description & Tags
  const searchResults = searchQuery.trim().length > 0
    ? searchProducts(products, searchQuery).slice(0, 8)
    : [];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
          : 'bg-white border-b border-slate-200'
      }`}
    >
      {/* Top Utility & Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-1.5 font-semibold text-amber-400">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>EasyPaisa • JazzCash • Cash on Delivery (COD)</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              24/7 WhatsApp Support: <strong className="text-white">+92 3152643791</strong>
            </span>
          </div>

          <div className="flex items-center space-x-4 font-bold text-slate-300">
            <button
              onClick={onOpenOrderTracking}
              className="hover:text-blue-400 transition-colors flex items-center space-x-1"
            >
              <span>Track Order</span>
            </button>
            <span>•</span>
            <button
              onClick={onOpenFAQ}
              className="hover:text-blue-400 transition-colors"
            >
              FAQ
            </button>
            <span>•</span>
            <button
              onClick={onOpenContact}
              className="hover:text-blue-400 transition-colors text-blue-400 font-extrabold"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onScrollToSection('hero')}
              className="group flex items-center space-x-2 text-left focus:outline-none"
            >
              <span className="text-2xl font-black tracking-tighter text-blue-900 font-sans">
                UMARMART<span className="text-blue-500 underline underline-offset-4 decoration-2">.</span>
              </span>
            </button>
          </div>

          {/* Desktop Search Bar with Category Dropdown */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="flex w-full rounded-full bg-slate-100 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all overflow-hidden">
              {/* Category Select Button */}
              <div className="relative border-r border-slate-200 bg-slate-100">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="h-full px-4 text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center space-x-1 transition-colors"
                >
                  <span className="max-w-[100px] truncate">
                    {selectedCategory === 'all'
                      ? 'All Categories'
                      : categories.find((c) => c.slug === selectedCategory)?.name ||
                        'Categories'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                    <button
                      onClick={() => {
                        onSelectCategory('all');
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === 'all'
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>All Categories</span>
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.slug);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                          selectedCategory === cat.slug
                            ? 'bg-blue-50 text-blue-600 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({cat.itemCount})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex-1 flex items-center px-4">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="Search premium goods, electronics, luxury watches..."
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none py-2.5"
                />
                <div className="flex items-center space-x-1 pl-1">
                  {/* Voice Search Mic Button */}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-1.5 rounded-full transition-colors ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-slate-400 hover:text-blue-600 hover:bg-slate-200/60'
                    }`}
                    title="Voice Search (Microphone)"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* AI Visual Image Search Camera Button */}
                  {onOpenImageSearch && (
                    <button
                      type="button"
                      onClick={onOpenImageSearch}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-200/60 rounded-full transition-colors"
                      title="AI Image Search (Upload Photo)"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Predictive Search Dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100">
                <div className="p-3 bg-slate-50 text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center justify-between">
                  <span>Product Suggestions ({searchResults.length})</span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        setSearchFocused(false);
                      }}
                      className="p-3 flex items-center space-x-3 hover:bg-blue-50/60 cursor-pointer transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="text-blue-600 font-semibold">{product.category}</span>
                          {product.brand && (
                            <>
                              <span>•</span>
                              <span className="text-slate-600 font-medium">{product.brand}</span>
                            </>
                          )}
                          <span>•</span>
                          <div className="flex items-center text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900">{formatPrice(product.price, currency)}</span>
                        {product.originalPrice && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {formatPrice(product.originalPrice, currency)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-xs font-bold text-slate-700">No products matching "{searchQuery}"</p>
                    <p className="text-[11px] text-slate-500 mt-1">Try searching by category, brand (e.g. Apple, Nike, Rolex), or product name.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onOpenSpinWin && (
              <button
                onClick={onOpenSpinWin}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-full text-xs font-black transition-all shadow-sm animate-bounce"
                title="Spin & Win Daily Rewards"
              >
                <Gift className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Spin & Win</span>
              </button>
            )}

            {onOpenAuction && (
              <button
                onClick={onOpenAuction}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full text-xs font-black transition-all shadow-sm"
                title="Live Product Bidding & Auctions"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Live Auctions 🔨</span>
              </button>
            )}

            {onOpenSeller && (
              <button
                onClick={onOpenSeller}
                className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full text-xs font-black transition-all shadow-sm"
                title="Seller Registration"
              >
                <Store className="w-3.5 h-3.5 text-slate-900" />
                <span>Sell on UmarMart</span>
              </button>
            )}

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all shadow-sm"
                title="Admin Dashboard"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </button>
            )}

            {/* Account Icon / Logged in User Profile Dropdown vs Login / Sign Up buttons */}
            {currentUser ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pl-2 pr-3 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-800 rounded-full transition-all focus:outline-none"
                  title="User Profile Menu"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-white"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold leading-none">{currentUser.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-blue-600 font-semibold">{currentUser.vipTier}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                </button>

                {/* Profile Quick Menu Dropdown */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs font-medium space-y-1"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-black text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center space-x-1">
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                          {currentUser.vipTier}
                        </span>
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                          {currentUser.rewardPoints || 100} pts
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile?.();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-bold flex items-center space-x-2"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>My VIP Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenOrderTracking?.();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
                    >
                      <Package className="w-4 h-4 text-amber-600" />
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenWishlist();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                    >
                      <span className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Wishlist</span>
                      </span>
                      {wishlistCount > 0 && (
                        <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                          {wishlistCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenCart();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                    >
                      <span className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 text-emerald-600" />
                        <span>Shopping Cart</span>
                      </span>
                      {cartCount > 0 && (
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                          {cartCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenProfile?.();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span>Settings & Security</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-bold flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1.5">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3.5 py-2 text-slate-700 hover:text-blue-600 font-bold text-xs rounded-full hover:bg-slate-100 transition-colors flex items-center space-x-1"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-sm shadow-blue-600/20 transition-all flex items-center space-x-1"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors group"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-full shadow-md shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
              {cartCount > 0 ? (
                <span className="bg-white text-blue-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              ) : (
                <span className="text-xs text-blue-100 hidden sm:inline">(0)</span>
              )}
            </button>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-full"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, category or brand..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <div className="flex items-center space-x-1 pl-1">
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-1 rounded-full ${
                  isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400'
                }`}
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
              {onOpenImageSearch && (
                <button
                  type="button"
                  onClick={onOpenImageSearch}
                  className="p-1 text-slate-400"
                  title="AI Visual Search"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-1 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <nav className="hidden md:flex items-center justify-between border-t border-slate-200/80 py-3 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onScrollToSection('hero')}
              className="hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <span>Home</span>
            </button>
            <button
              onClick={() => onScrollToSection('flash-sale')}
              className="text-red-600 hover:text-red-700 transition-colors flex items-center space-x-1 font-bold uppercase tracking-wider text-[11px]"
            >
              <Flame className="w-3.5 h-3.5 fill-red-600 animate-bounce" />
              <span>Flash Sale</span>
            </button>
            <button
              onClick={() => onScrollToSection('categories')}
              className="hover:text-blue-600 transition-colors"
            >
              Categories
            </button>
            <button
              onClick={() => onScrollToSection('featured')}
              className="hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Featured</span>
            </button>
            <button
              onClick={() => onScrollToSection('trending')}
              className="hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Trending</span>
            </button>
            <button
              onClick={() => onScrollToSection('new-arrivals')}
              className="hover:text-blue-600 transition-colors"
            >
              New Arrivals
            </button>
            <button
              onClick={() => onScrollToSection('best-sellers')}
              className="hover:text-blue-600 transition-colors"
            >
              Best Sellers
            </button>
            <button
              onClick={() => onScrollToSection('reviews')}
              className="hover:text-blue-600 transition-colors"
            >
              Reviews
            </button>
          </div>

          <div className="flex items-center space-x-3 text-slate-500">
            <span className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Support Online</span>
            </span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 shadow-xl">
          {/* User Account Bar in Mobile Drawer */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-900 truncate">{currentUser.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {currentUser.vipTier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile?.();
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenOrderTracking?.();
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
                  >
                    <Package className="w-3.5 h-3.5 text-amber-600" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenWishlist();
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Wishlist ({wishlistCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Account Access</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('signin');
                    }}
                    className="py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <User className="w-4 h-4 text-slate-700" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('signup');
                    }}
                    className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <UserPlus className="w-4 h-4 text-white" />
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Navigation Menu
          </div>
          <button
            onClick={() => {
              onScrollToSection('hero');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-slate-700 hover:text-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => {
              onScrollToSection('flash-sale');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-red-600 font-bold flex items-center"
          >
            <Flame className="w-4 h-4 mr-2" /> Flash Sale
          </button>
          <button
            onClick={() => {
              onScrollToSection('categories');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-slate-700 hover:text-blue-600"
          >
            Categories
          </button>
          <button
            onClick={() => {
              onScrollToSection('featured');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-slate-700 hover:text-blue-600"
          >
            Featured Products
          </button>
          <button
            onClick={() => {
              onScrollToSection('trending');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-slate-700 hover:text-blue-600"
          >
            Trending
          </button>
          <button
            onClick={() => {
              onScrollToSection('reviews');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-slate-700 hover:text-blue-600"
          >
            Customer Reviews
          </button>
        </div>
      )}
    </header>
  );
};
