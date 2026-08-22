import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, PackageSearch, Sparkles, X } from 'lucide-react';
import { Product, CartItem, Review, Currency, User, Order } from './types';
import {
  PRODUCTS,
  CATEGORIES,
  REVIEWS,
  CURRENCIES,
  DEMO_USER,
  MOCK_ORDERS,
  MOCK_COUPONS,
  MOCK_CUSTOMERS
} from './data/mockData';
import {
  firebaseSubscribeAuthState,
  firebaseSignOut,
  firebaseSubscribeProducts,
  searchProducts
} from './services/firebaseService';
import { ProductCard } from './components/ProductCard';

// Components
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoriesSection } from './components/CategoriesSection';
import { BrandLogos } from './components/BrandLogos';
import { DailyDeals } from './components/DailyDeals';
import { FlashSale } from './components/FlashSale';
import { FeaturedProducts } from './components/FeaturedProducts';
import { TrendingProducts } from './components/TrendingProducts';
import { NewArrivals } from './components/NewArrivals';
import { BestSellers } from './components/BestSellers';
import { CustomerReviews } from './components/CustomerReviews';
import { RecentlyViewed } from './components/RecentlyViewed';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';

// Drawers & Modals
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ContactModal } from './components/ContactModal';
import { FAQModal } from './components/FAQModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SellerRegistrationModal } from './components/SellerRegistrationModal';
import { PolicyModal } from './components/PolicyModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Toast } from './components/Toast';
import { CompareModal } from './components/CompareModal';
import { AIChatWidget } from './components/AIChatWidget';
import { ImageSearchModal } from './components/ImageSearchModal';
import { SpinWinModal } from './components/SpinWinModal';
import { SmartRecommendations } from './components/SmartRecommendations';
import { MobileAppDownloadSection } from './components/MobileAppDownloadSection';
import { AuctionBiddingModal } from './components/AuctionBiddingModal';
import { DigitalMarketplaceSection } from './components/DigitalMarketplaceSection';

// Enterprise Components & Systems
import { ErrorBoundary } from './components/ErrorBoundary';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { MaintenanceModeBanner } from './components/MaintenanceModeBanner';
import { getStoredSettings } from './lib/dbSchema';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);

  // User Session & Orders
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USER);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  
  // Navigation & Search Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Wishlist & Compare & History State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-2']);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(['prod-1', 'prod-3']);

  // Modals / Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isSpinWinOpen, setIsSpinWinOpen] = useState(false);
  const [isAuctionOpen, setIsAuctionOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<'about' | 'privacy' | 'terms' | 'return' | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Subscribe to real-time Firebase Auth state & Real-time Products updates
  useEffect(() => {
    const unsubscribeAuth = firebaseSubscribeAuthState((profile) => {
      if (profile) {
        setCurrentUser({
          id: profile.uid,
          name: profile.name,
          email: profile.email,
          isEmailVerified: true,
          avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          phone: '+92 315 2643791',
          vipTier: (profile.vipTier as any) || 'Gold VIP',
          rewardPoints: profile.rewardPoints || 250,
          joinedDate: 'Registered User',
        });
      } else {
        setCurrentUser(null);
      }
    });

    const unsubscribeProducts = firebaseSubscribeProducts((updatedProducts) => {
      setProducts(updatedProducts);
    }, PRODUCTS);

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
    };
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = async () => {
    await firebaseSignOut();
    setCurrentUser(null);
    setIsUserProfileOpen(false);
    setSelectedCategory('all');
    setSearchQuery('');
    showToast('Signed out of UmarMart session. Redirected to Home page.');
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setRecentlyViewedIds((prev) => Array.from(new Set([product.id, ...prev])));
  };

  // Discount
  const [appliedDiscountAmount, setAppliedDiscountAmount] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Cart logic
  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    color?: string,
    size?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor: color || product.colors?.[0]?.name,
          selectedSize: size || product.sizes?.[0],
        },
      ];
    });
    showToast(`🛒 Added "${product.name}" to cart!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed item from cart.');
  };

  // Wishlist logic
  const handleToggleWishlist = (product: Product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`Removed "${product.name}" from Wishlist.`);
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast(`❤️ Saved "${product.name}" to Wishlist!`);
    }
  };

  // Compare logic
  const handleToggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from Compare list.`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 products at once.');
          return prev;
        }
        showToast(`⚖️ Added "${product.name}" to Compare list!`);
        return [...prev, product];
      }
    });
  };

  const handleAddSellerProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  // Scroll smoothly to section
  const handleScrollToSection = (sectionId: string) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered Products for category view or search
  const filteredCatalogProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.categorySlug === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      searchProducts([p], searchQuery).length > 0;

    return matchesCategory && matchesSearch;
  });

  const cartTotalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const settings = getStoredSettings();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white relative">
        {/* PWA Install & Offline Banner */}
        <PWAInstallBanner />

        {/* Global Maintenance Banner */}
        <MaintenanceModeBanner
          isMaintenance={settings.maintenanceMode}
          announcementText={settings.announcementBannerText}
        />

        {/* Top Announcement Bar */}
        <TopBar
          currencies={CURRENCIES}
          selectedCurrency={selectedCurrency}
          onSelectCurrency={setSelectedCurrency}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenSeller={() => setIsSellerOpen(true)}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onOpenProfile={() => setIsUserProfileOpen(true)}
          onLogout={handleLogout}
        />

      {/* Main Header */}
      <Header
        categories={categories}
        products={products}
        cartCount={cartTotalItemsCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={handleOpenAuth}
        currentUser={currentUser}
        onOpenProfile={() => setIsUserProfileOpen(true)}
        onLogout={handleLogout}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenFAQ={() => setIsFAQOpen(true)}
        onOpenOrderTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSeller={() => setIsSellerOpen(true)}
        onOpenImageSearch={() => setIsImageSearchOpen(true)}
        onOpenSpinWin={() => setIsSpinWinOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(catSlug) => {
          setSelectedCategory(catSlug);
          if (catSlug !== 'all') {
            handleScrollToSection('featured');
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectProduct={(product) => handleQuickView(product)}
        currency={selectedCurrency}
        onScrollToSection={handleScrollToSection}
        onShowToast={showToast}
      />

      {/* Compare Floating Bar Indicator */}
      {compareList.length > 0 && (
        <div className="bg-slate-900 text-white px-4 py-2 text-xs font-bold flex items-center justify-between sticky top-0 z-30 border-b border-slate-800 shadow-md">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 px-2 py-0.5 rounded-md font-mono text-[10px]">
              {compareList.length}/4 Selected
            </span>
            <span className="truncate">
              Comparing: {compareList.map((p) => p.name).join(', ')}
            </span>
          </div>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl text-[11px] font-black shrink-0 transition-colors shadow-xs"
          >
            Open Side-by-Side Comparison
          </button>
        </div>
      )}

      <main>
        {/* Premium Hero Banner */}
        <HeroBanner
          onExploreCategory={(slug) => {
            setSelectedCategory(slug);
            handleScrollToSection('featured');
          }}
          onScrollToSection={handleScrollToSection}
        />

        {/* Product Categories */}
        <CategoriesSection
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => {
            setSelectedCategory(slug);
            handleScrollToSection('featured');
          }}
        />

        {/* Active Category Filter Status if selected */}
        {selectedCategory !== 'all' && (
          <div className="bg-blue-50 border-y border-blue-200 py-3 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-xs text-slate-700">
                Filtered by category:{' '}
                <strong className="text-blue-600 font-bold uppercase">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                </strong>{' '}
                ({filteredCatalogProducts.length} items found)
              </div>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Clear Filter ✕
              </button>
            </div>
          </div>
        )}

        {/* Real-time Live Search Results Banner & Grid */}
        {searchQuery.trim().length > 0 && (
          <div id="search-results" className="bg-slate-100/80 border-y border-slate-200 py-8 px-4 sm:px-8 transition-all">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="inline-flex items-center space-x-2 text-blue-600 font-bold text-xs tracking-wider uppercase mb-1">
                    <Search className="w-4 h-4 text-blue-600" />
                    <span>Real-time Search Results</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Search results for "<span className="text-blue-600">{searchQuery}</span>"
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Found <strong className="text-slate-800 font-bold">{filteredCatalogProducts.length}</strong> matching products across name, category, brand & tags.
                  </p>
                </div>

                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full border border-slate-200 shadow-xs transition-colors flex items-center space-x-1.5 shrink-0"
                >
                  <X className="w-4 h-4 text-slate-500" />
                  <span>Clear Search</span>
                </button>
              </div>

              {/* Grid of Results if items found */}
              {filteredCatalogProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                  {filteredCatalogProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currency={selectedCurrency}
                      isInWishlist={wishlistIds.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onQuickView={handleQuickView}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                /* Beautiful "No products found" Empty State */
                <div className="py-12 px-4 text-center max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-5 text-blue-600 shadow-sm">
                    <PackageSearch className="w-10 h-10" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                    No products found for "{searchQuery}"
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                    We couldn't find any items matching your search query. Try checking for typos or searching by category or brand name.
                  </p>

                  {/* Popular Suggested Search Badges */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-6 text-left">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Popular Search Suggestions:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['iPhone', 'MacBook', 'Headphones', 'Sneakers', 'Watch', 'Rolex', 'Samsung', 'Audio'].map((keyword) => (
                        <button
                          key={keyword}
                          onClick={() => setSearchQuery(keyword)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                        >
                          🔍 {keyword}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all"
                    >
                      Clear Search & View Catalog
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                    >
                      Browse All Categories
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Flash Sale Event */}
        <FlashSale
          products={filteredCatalogProducts}
          currency={selectedCurrency}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />

        {/* Daraz-Style Daily Mega Deals */}
        <DailyDeals
          products={filteredCatalogProducts}
          currency={selectedCurrency}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />

        {/* Smart AI Product Recommendations */}
        <SmartRecommendations
          products={filteredCatalogProducts}
          currency={selectedCurrency}
          onSelectProduct={handleQuickView}
          onAddToCart={handleAddToCart}
        />

        {/* Featured Products */}
        <FeaturedProducts
          products={filteredCatalogProducts}
          currency={selectedCurrency}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />

        {/* Trending Products */}
        <TrendingProducts
          products={filteredCatalogProducts}
          currency={selectedCurrency}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />

        {/* New Arrivals */}
        <NewArrivals
          products={filteredCatalogProducts}
          currency={selectedCurrency}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />

        {/* Best Sellers */}
        <BestSellers
          products={filteredCatalogProducts}
          currency={selectedCurrency}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />

        {/* Official Brand Logos Mall */}
        <BrandLogos
          onSelectBrand={(brandName) => {
            setSearchQuery(brandName);
            handleScrollToSection('featured');
          }}
        />

        {/* Customer Reviews */}
        <CustomerReviews
          reviews={reviews}
          onAddReview={(newRev) => {
            const added: Review = {
              ...newRev,
              id: 'rev-' + Date.now(),
              date: 'Just now',
              helpfulCount: 1,
            };
            setReviews((prev) => [added, ...prev]);
            showToast('Thank you! Your verified review has been published.');
          }}
        />

        {/* Digital Products Marketplace (E-Books, Software, Courses) */}
        <DigitalMarketplaceSection
          currency={selectedCurrency}
          onShowToast={showToast}
        />

        {/* Recently Viewed Products */}
        <RecentlyViewed
          products={products.filter((p) => recentlyViewedIds.includes(p.id))}
          currency={selectedCurrency}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
        />

        {/* UmarMart Official Mobile App Section */}
        <MobileAppDownloadSection onShowToast={showToast} />

        {/* Newsletter Signup */}
        <Newsletter onShowToast={showToast} />
      </main>

      {/* Modern Footer */}
      <Footer
        onScrollToSection={handleScrollToSection}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          handleScrollToSection('featured');
        }}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenFAQ={() => setIsFAQOpen(true)}
        onOpenOrderTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSeller={() => setIsSellerOpen(true)}
        onOpenPolicy={(tab) => setPolicyTab(tab)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={selectedCurrency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(discountAmt, code) => {
          setAppliedDiscountAmount(discountAmt);
          setAppliedDiscountCode(code);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={products}
        wishlistIds={wishlistIds}
        currency={selectedCurrency}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Product Compare Matrix Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareList={compareList}
        onRemoveFromCompare={(id) => setCompareList((prev) => prev.filter((p) => p.id !== id))}
        onClearCompare={() => setCompareList([])}
        onAddToCart={handleAddToCart}
        currency={selectedCurrency}
      />

      {/* Quick View Product Modal */}
      <ProductModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        currency={selectedCurrency}
        isInWishlist={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onShowToast={showToast}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={selectedCurrency}
        appliedDiscount={appliedDiscountAmount}
        discountCode={appliedDiscountCode}
        onClearCart={() => setCart([])}
        onOrderSuccess={(newOrder) => {
          setOrders((prev) => [newOrder, ...prev]);
          if (currentUser) {
            setCurrentUser((prev) =>
              prev
                ? {
                    ...prev,
                    rewardPoints: prev.rewardPoints + Math.round(newOrder.totalAmount * 5),
                  }
                : null
            );
          }
          showToast(`Order #${newOrder.id} confirmed! Tracking: ${newOrder.trackingNumber}`);
        }}
      />

      {/* Auth / VIP Sign In Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onShowToast={showToast}
        initialMode={authInitialMode}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* User VIP Profile Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={currentUser}
        orders={orders}
        currency={selectedCurrency}
        products={products}
        wishlistIds={wishlistIds}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onLogout={() => {
          setCurrentUser(null);
          setIsUserProfileOpen(false);
          showToast('Signed out of UmarMart VIP session.');
        }}
        onUpdateProfile={(updated) => {
          if (currentUser) {
            setCurrentUser({ ...currentUser, ...updated });
          }
        }}
        onShowToast={showToast}
      />

      {/* Contact Us Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onShowToast={showToast}
      />

      {/* FAQ Modal */}
      <FAQModal
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        currency={selectedCurrency}
        onShowToast={showToast}
      />

      {/* Complete Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProducts={(updatedProds) => setProducts(updatedProds)}
        categories={categories}
        onUpdateCategories={(updatedCats) => setCategories(updatedCats)}
        orders={orders}
        onUpdateOrders={(updatedOrders) => setOrders(updatedOrders)}
        reviews={reviews}
        onUpdateReviews={(updatedReviews) => setReviews(updatedReviews)}
        coupons={coupons}
        onUpdateCoupons={(updatedCoupons) => setCoupons(updatedCoupons)}
        customers={customers}
        onUpdateCustomers={(updatedCusts) => setCustomers(updatedCusts)}
        currency={selectedCurrency}
        onShowToast={showToast}
      />

      {/* Seller Registration & Dashboard Hub Modal */}
      <SellerRegistrationModal
        isOpen={isSellerOpen}
        onClose={() => setIsSellerOpen(false)}
        onShowToast={showToast}
        products={products}
        onAddProduct={handleAddSellerProduct}
        currency={selectedCurrency}
      />

      {/* Policy & Legal Information Modal */}
      <PolicyModal
        isOpen={!!policyTab}
        onClose={() => setPolicyTab(null)}
        initialTab={policyTab || 'about'}
      />

      {/* AI Visual Image Search Modal */}
      <ImageSearchModal
        isOpen={isImageSearchOpen}
        onClose={() => setIsImageSearchOpen(false)}
        products={products}
        currency={selectedCurrency}
        onSelectProduct={(product) => handleQuickView(product)}
        onShowToast={showToast}
      />

      {/* Spin & Win Fortune Wheel Modal */}
      <SpinWinModal
        isOpen={isSpinWinOpen}
        onClose={() => setIsSpinWinOpen(false)}
        onShowToast={showToast}
      />

      {/* Live Auction & Bidding System Modal */}
      <AuctionBiddingModal
        isOpen={isAuctionOpen}
        onClose={() => setIsAuctionOpen(false)}
        currency={selectedCurrency}
        onShowToast={showToast}
      />

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton phoneNumber="+92 3152643791" />

      {/* Smart AI Support Chatbot */}
      <AIChatWidget
        products={products}
        currency={selectedCurrency}
        onOpenOrderTracking={() => setIsTrackingOpen(true)}
        onShowToast={showToast}
      />

      {/* Floating Animated Quick Cart Button */}
      {cartTotalItemsCount > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-24 z-40 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3.5 rounded-full shadow-2xl flex items-center space-x-3 border border-white/30 backdrop-blur-md"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {cartTotalItemsCount}
            </span>
          </div>
          <span className="text-xs tracking-tight">View Cart</span>
        </motion.button>
      )}

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
    </ErrorBoundary>
  );
}export default App;
