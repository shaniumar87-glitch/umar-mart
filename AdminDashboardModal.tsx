import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Ticket,
  Star,
  Boxes,
  TrendingUp,
  DollarSign,
  Lock,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  Eye,
  Tag,
  Check,
  Database,
  Download,
  Upload,
  Wrench,
  Store
} from 'lucide-react';
import { Product, Category, Order, Review, Coupon, Customer, Currency } from '../types';
import { formatPrice } from '../lib/formatters';
import { exportDatabaseBackupJSON, importDatabaseBackupJSON, getStoredSettings, saveStoredSettings, SellerRecord } from '../lib/dbSchema';
import {
  firebaseSaveProduct,
  firebaseDeleteProduct,
  firebaseUpdateProductStock,
  firebaseSaveCategory,
  firebaseDeleteCategory,
  firebaseUpdateOrderStatus,
  firebaseDeleteOrder,
  firebaseSaveCoupon,
  firebaseToggleCoupon,
  firebaseDeleteCoupon,
  firebaseDeleteReview,
  firebaseUpdateCustomerStatus,
  firebaseSubscribeSellers,
  firebaseUpdateSellerStatus,
  firebaseDeleteSeller,
} from '../services/firebaseService';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  reviews: Review[];
  onUpdateReviews: (reviews: Review[]) => void;
  coupons: Coupon[];
  onUpdateCoupons: (coupons: Coupon[]) => void;
  customers: Customer[];
  onUpdateCustomers: (customers: Customer[]) => void;
  currency: Currency;
  onShowToast: (msg: string) => void;
}

type AdminTab =
  | 'analytics'
  | 'products'
  | 'categories'
  | 'orders'
  | 'inventory'
  | 'customers'
  | 'sellers'
  | 'coupons'
  | 'reviews'
  | 'settings';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  categories,
  onUpdateCategories,
  orders,
  onUpdateOrders,
  reviews,
  onUpdateReviews,
  coupons,
  onUpdateCoupons,
  customers,
  onUpdateCustomers,
  currency,
  onShowToast,
}) => {
  // Admin Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@umarmart.pk');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Sellers State
  const [sellers, setSellers] = useState<SellerRecord[]>([
    {
      id: 'sel-1',
      userId: 'usr-1',
      storeName: 'TechVision Pakistan Official',
      ownerName: 'Kamran Akmal',
      cnic: '42101-9876543-1',
      iban: 'PK36SCBL0000001123456701',
      plan: 'pro',
      isVerified: true,
      rating: 4.9,
      totalSalesPKR: 850000,
      totalOrdersCount: 142,
      joinedDate: 'Jan 2025',
    },
    {
      id: 'sel-2',
      userId: 'usr-2',
      storeName: 'Royal Leather & Apparels',
      ownerName: 'Bilal Farooq',
      cnic: '35202-1234567-3',
      iban: 'PK12HABB0000009988776602',
      plan: 'basic',
      isVerified: true,
      rating: 4.7,
      totalSalesPKR: 320000,
      totalOrdersCount: 68,
      joinedDate: 'Mar 2025',
    },
    {
      id: 'sel-3',
      userId: 'usr-3',
      storeName: 'Gul Ahmed Eastern Boutique',
      ownerName: 'Ayesha Tariq',
      cnic: '61101-5544332-9',
      iban: 'PK88MEZN0000004455667703',
      plan: 'enterprise',
      isVerified: false,
      rating: 5.0,
      totalSalesPKR: 1200000,
      totalOrdersCount: 230,
      joinedDate: 'May 2026',
    },
  ]);

  useEffect(() => {
    const unsub = firebaseSubscribeSellers((data) => {
      if (data && data.length > 0) {
        setSellers(data);
      }
    }, sellers);
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Product Form Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('mobiles');
  const [prodPrice, setProdPrice] = useState(1999);
  const [prodOriginalPrice, setProdOriginalPrice] = useState(2999);
  const [prodStock, setProdStock] = useState(50);
  const [prodImage, setProdImage] = useState('');
  const [prodDescription, setProdDescription] = useState('');

  // Category Form State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('');

  // Coupon Form State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountVal, setDiscountVal] = useState(15);
  const [minSpendVal, setMinSpendVal] = useState(2000);

  // Search Filter in Tabs
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // --- LOGIN HANDLER ---
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'admin@umarmart.pk' && adminPassword === 'admin123') {
      setIsLoggedIn(true);
      onShowToast('🔒 Welcome back, Super Administrator!');
    } else {
      onShowToast('Invalid credentials. Use admin@umarmart.pk / admin123');
    }
  };

  const handleQuickDemoLogin = () => {
    setAdminEmail('admin@umarmart.pk');
    setAdminPassword('admin123');
    setIsLoggedIn(true);
    onShowToast('⚡ Logged in as Administrator!');
  };

  // --- PRODUCT MANAGEMENT ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('mobiles');
    setProdPrice(2499);
    setProdOriginalPrice(3499);
    setProdStock(25);
    setProdImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
    setProdDescription('High quality product imported directly with official Pakistani warranty.');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.categorySlug);
    setProdPrice(p.price);
    setProdOriginalPrice(p.originalPrice || p.price * 1.2);
    setProdStock(p.stock);
    setProdImage(p.image);
    setProdDescription(p.description);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Edit
      const updatedProd: Product = {
        ...editingProduct,
        name: prodName,
        categorySlug: prodCategory,
        category: categories.find((c) => c.slug === prodCategory)?.name || prodCategory,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        stock: Number(prodStock),
        image: prodImage,
        description: prodDescription,
      };
      const updated = products.map((p) => (p.id === editingProduct.id ? updatedProd : p));
      onUpdateProducts(updated);
      await firebaseSaveProduct(updatedProd);
      onShowToast(`✓ Updated product "${prodName}" in Firestore!`);
    } else {
      // Add
      const newProd: Product = {
        id: 'prod-' + Date.now(),
        name: prodName,
        category: categories.find((c) => c.slug === prodCategory)?.name || 'Mobiles',
        categorySlug: prodCategory,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        rating: 5.0,
        reviewsCount: 1,
        image: prodImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        stock: Number(prodStock),
        salesCount: 0,
        description: prodDescription,
        features: ['1 Year Warranty', 'Express TCS Shipping'],
        specs: [{ label: 'Condition', value: 'Brand New' }],
        isNew: true,
      };
      onUpdateProducts([newProd, ...products]);
      await firebaseSaveProduct(newProd);
      onShowToast(`✓ Added new product "${prodName}" to Firestore!`);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    onUpdateProducts(updated);
    await firebaseDeleteProduct(id);
    onShowToast('✓ Product deleted from Firestore & inventory.');
  };

  const handleUpdateStockDirect = async (id: string, delta: number) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    );
    onUpdateProducts(updated);
    await firebaseUpdateProductStock(id, delta);
    onShowToast('Stock updated in Firestore!');
  };

  // --- CATEGORY MANAGEMENT ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: catName,
      slug: catSlug.toLowerCase().replace(/\s+/g, '-'),
      iconName: 'Package',
      image: catImage || 'https://images.unsplash.com/photo-1498049860654-af1a5c566876?auto=format&fit=crop&w=600&q=80',
      itemCount: 0,
      description: catDescription,
    };
    onUpdateCategories([...categories, newCat]);
    await firebaseSaveCategory(newCat);
    setIsCatModalOpen(false);
    onShowToast(`✓ Added category "${catName}" to Firestore!`);
  };

  const handleDeleteCategory = async (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    onUpdateCategories(updated);
    await firebaseDeleteCategory(id);
    onShowToast('✓ Category removed from Firestore.');
  };

  // --- ORDER MANAGEMENT ---
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    onUpdateOrders(updated);
    await firebaseUpdateOrderStatus(orderId, status);
    onShowToast(`✓ Order #${orderId.toUpperCase()} status updated to ${status} in Firestore!`);
  };

  const handleDeleteOrder = async (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    onUpdateOrders(updated);
    await firebaseDeleteOrder(orderId);
    onShowToast(`✓ Order #${orderId} deleted from database.`);
  };

  // --- COUPON MANAGEMENT ---
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const newC: Coupon = {
      id: 'c-' + Date.now(),
      code: couponCode.toUpperCase().replace(/\s+/g, ''),
      discountType,
      discountValue: Number(discountVal),
      minSpend: Number(minSpendVal),
      expiryDate: '2026-12-31',
      usageLimit: 500,
      usedCount: 0,
      status: 'active',
    };
    onUpdateCoupons([newC, ...coupons]);
    await firebaseSaveCoupon(newC);
    setIsCouponModalOpen(false);
    onShowToast(`✓ Coupon code ${newC.code} activated in Firestore!`);
  };

  const handleToggleCoupon = async (id: string) => {
    const updated = coupons.map((c) =>
      c.id === id
        ? { ...c, status: (c.status === 'active' ? 'disabled' : 'active') as Coupon['status'] }
        : c
    );
    onUpdateCoupons(updated);
    await firebaseToggleCoupon(id);
    onShowToast('✓ Coupon status updated in Firestore.');
  };

  const handleDeleteCoupon = async (id: string) => {
    const updated = coupons.filter((c) => c.id !== id);
    onUpdateCoupons(updated);
    await firebaseDeleteCoupon(id);
    onShowToast('✓ Coupon deleted from Firestore.');
  };

  // --- CUSTOMER MANAGEMENT ---
  const handleToggleCustomerBlock = async (id: string) => {
    const cust = customers.find((c) => c.id === id);
    const newStatus = cust?.status === 'active' ? ('blocked' as const) : ('active' as const);
    const updated = customers.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    onUpdateCustomers(updated);
    await firebaseUpdateCustomerStatus(id, newStatus);
    onShowToast(`✓ Customer account status updated to ${newStatus} in Firestore.`);
  };

  // --- SELLER MANAGEMENT ---
  const handleToggleSellerVerification = async (id: string, current: boolean) => {
    const next = !current;
    const updated = sellers.map((s) => (s.id === id ? { ...s, isVerified: next } : s));
    setSellers(updated);
    await firebaseUpdateSellerStatus(id, next);
    onShowToast(next ? '✓ Seller store APPROVED & VERIFIED in Firestore!' : '⚠️ Seller verification revoked.');
  };

  const handleDeleteSellerRecord = async (id: string) => {
    const updated = sellers.filter((s) => s.id !== id);
    setSellers(updated);
    await firebaseDeleteSeller(id);
    onShowToast('✓ Seller store removed from Firestore.');
  };

  // --- REVIEWS MODERATION ---
  const handleDeleteReview = async (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    onUpdateReviews(updated);
    await firebaseDeleteReview(id);
    onShowToast('✓ Review moderated and removed from Firestore.');
  };

  // Sales Analytics Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white border border-slate-200 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-600/30">
                UM
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-black tracking-tight text-white">UmarMart Admin Portal</h2>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    FIRESTORE LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Master Commerce & Inventory Control System</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    onShowToast('Signed out of Admin Portal');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* --- ADMIN LOGIN VIEW --- */}
          {!isLoggedIn ? (
            <div className="p-8 sm:p-12 max-w-md mx-auto my-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Administrator Portal</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter master credentials or use 1-click demo access to manage products, orders, inventory, sellers & coupons.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/25 text-xs transition-all"
                >
                  Authenticate & Open Dashboard
                </button>
              </form>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>1-Click Express Demo Admin Login</span>
              </button>
            </div>
          ) : (
            /* --- LOGGED IN DASHBOARD VIEW --- */
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Sidebar Navigation */}
              <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-1 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Sales & Revenue</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'products'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Manage Products ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'inventory'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Boxes className="w-4 h-4" />
                  <div className="flex items-center justify-between w-full">
                    <span>Inventory & Stock</span>
                    {lowStockCount > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                        {lowStockCount}
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Manage Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'categories'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <FolderTree className="w-4 h-4" />
                  <span>Categories ({categories.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('sellers')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'sellers'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Sellers & Stores ({sellers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('customers')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'customers'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Customers ({customers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('coupons')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'coupons'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>Coupons & Deals ({coupons.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Moderate Reviews ({reviews.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Database className="w-4 h-4 text-purple-600" />
                  <span>Backup & System Settings</span>
                </button>
              </div>

              {/* Main Tab Content View */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
                {/* 1. SALES & REVENUE ANALYTICS */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Revenue & Sales Dashboard</h3>
                        <p className="text-xs text-slate-500">Live transaction overview and store performance stats</p>
                      </div>
                      <button
                        onClick={() => onShowToast('Synced latest analytics metrics from Firestore!')}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Sync Firestore</span>
                      </button>
                    </div>

                    {/* Key Metric KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="text-xs font-bold text-slate-500">Total Net Revenue</span>
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <DollarSign className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{formatPrice(totalRevenue, currency)}</div>
                        <div className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+24.8% vs last month</span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="text-xs font-bold text-slate-500">Total Orders</span>
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{totalOrdersCount} Completed</div>
                        <div className="text-xs text-blue-600 font-bold">100% Delivery Fulfilled</div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="text-xs font-bold text-slate-500">Average Order Value</span>
                          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{formatPrice(avgOrderValue, currency)}</div>
                        <div className="text-xs text-slate-500 font-semibold">Per checkout transaction</div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="text-xs font-bold text-slate-500">Low Stock Warnings</span>
                          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{lowStockCount} Items</div>
                        <div className="text-xs text-rose-600 font-bold">Requires inventory restock</div>
                      </div>
                    </div>

                    {/* Category Breakdown & Top Selling Products */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                        <h4 className="text-sm font-bold text-slate-900">Category Sales Distribution</h4>
                        <div className="space-y-3 text-xs">
                          {categories.slice(0, 5).map((cat) => {
                            const count = products.filter((p) => p.categorySlug === cat.slug).length;
                            const percent = Math.round((count / Math.max(1, products.length)) * 100);
                            return (
                              <div key={cat.id} className="space-y-1">
                                <div className="flex justify-between font-bold text-slate-700">
                                  <span>{cat.name}</span>
                                  <span>{count} items ({percent}%)</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                        <h4 className="text-sm font-bold text-slate-900">Top Performing Products</h4>
                        <div className="space-y-3">
                          {products.slice(0, 4).map((p) => (
                            <div key={p.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-0">
                              <div className="flex items-center space-x-3 min-w-0">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                                />
                                <div className="min-w-0">
                                  <h5 className="font-bold text-slate-900 truncate">{p.name}</h5>
                                  <span className="text-slate-500 text-[11px]">{p.stock} units left</span>
                                </div>
                              </div>
                              <span className="font-black text-blue-600 shrink-0 ml-2">
                                {formatPrice(p.price, currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. MANAGE PRODUCTS */}
                {activeTab === 'products' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Manage Catalog Products</h3>
                        <p className="text-xs text-slate-500">Create, modify or remove catalog items and flash sales</p>
                      </div>
                      <button
                        onClick={handleOpenAddProduct}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/20 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Product</span>
                      </button>
                    </div>

                    {/* Products Grid / Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700">
                          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                            <tr>
                              <th className="p-3">Product Info</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Price</th>
                              <th className="p-3">Stock</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {products.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-3">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                                    />
                                    <div>
                                      <h5 className="font-bold text-slate-900 line-clamp-1">{p.name}</h5>
                                      <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 font-medium text-slate-600 capitalize">{p.categorySlug}</td>
                                <td className="p-3 font-bold text-slate-900">{formatPrice(p.price, currency)}</td>
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      p.stock < 10
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {p.stock} units
                                  </span>
                                </td>
                                <td className="p-3 text-right space-x-1 shrink-0">
                                  <button
                                    onClick={() => handleOpenEditProduct(p)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Product"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. MANAGE INVENTORY */}
                {activeTab === 'inventory' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Multi-Warehouse Inventory & Stock Control</h3>
                        <p className="text-xs text-slate-500">Karachi Central Hub, Lahore Logistics Depot, Islamabad Depot & Barcodes</p>
                      </div>
                      <button
                        onClick={() => onShowToast('📦 Synced stock levels across all Pakistani Warehouses!')}
                        className="px-3.5 py-1.5 bg-slate-900 text-white font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-md"
                      >
                        <Boxes className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sync Multi-Warehouse</span>
                      </button>
                    </div>

                    {/* Multi-Warehouse Status Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
                        <div className="font-extrabold text-blue-900 flex items-center justify-between">
                          <span>Karachi Central Hub</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">HQ</span>
                        </div>
                        <div className="text-lg font-black text-slate-900 mt-1">1,420 Units</div>
                        <div className="text-[10px] text-slate-400">Port Qasim Industrial Zone</div>
                      </div>
                      <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
                        <div className="font-extrabold text-emerald-900 flex items-center justify-between">
                          <span>Lahore Logistics Depot</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Express</span>
                        </div>
                        <div className="text-lg font-black text-slate-900 mt-1">850 Units</div>
                        <div className="text-[10px] text-slate-400">Sundar Industrial Estate</div>
                      </div>
                      <div className="bg-white border border-slate-200 p-3.5 rounded-2xl">
                        <div className="font-extrabold text-purple-900 flex items-center justify-between">
                          <span>Islamabad Depot</span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">North</span>
                        </div>
                        <div className="text-lg font-black text-slate-900 mt-1">410 Units</div>
                        <div className="text-[10px] text-slate-400">I-9 Industrial Area</div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                      <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 flex justify-between">
                        <span>Product Stock Meter & Barcodes</span>
                        <span className="text-rose-600">Items with &lt; 10 units flagged</span>
                      </div>
                      <div className="divide-y divide-slate-100 text-xs">
                        {products.map((p) => (
                          <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-3 min-w-0">
                              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                              <div className="min-w-0">
                                <h5 className="font-bold text-slate-900 truncate">{p.name}</h5>
                                <span className="text-[11px] text-slate-500">SKU: {p.id}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 shrink-0">
                              <span
                                className={`font-black text-sm px-3 py-1 rounded-xl ${
                                  p.stock < 10 ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-800'
                                }`}
                              >
                                {p.stock} units
                              </span>

                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleUpdateStockDirect(p.id, -5)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg"
                                >
                                  -5
                                </button>
                                <button
                                  onClick={() => handleUpdateStockDirect(p.id, 10)}
                                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg"
                                >
                                  +10
                                </button>
                                <button
                                  onClick={() => handleUpdateStockDirect(p.id, 50)}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg"
                                >
                                  +50
                                </button>
                                <button
                                  onClick={() => onShowToast(`🏷️ EAN-13 Barcode & QR Code generated for SKU: ${p.id} (${p.name})!`)}
                                  className="px-2.5 py-1 bg-slate-900 text-white font-mono font-bold text-[10px] rounded-lg hover:bg-slate-800 transition-colors"
                                  title="Print EAN-13 Barcode Label"
                                >
                                  Barcode █║▌║
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. MANAGE ORDERS */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Manage Customer Orders</h3>
                      <p className="text-xs text-slate-500">Review status, update courier tracking numbers & dispatch</p>
                    </div>

                    <div className="space-y-3">
                      {orders.map((o) => (
                        <div key={o.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                            <div>
                              <span className="font-black text-slate-900 text-sm">Order #{o.id.toUpperCase()}</span>
                              <span className="text-slate-400 font-mono ml-2">({o.trackingNumber})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-500">{o.date}</span>
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as Order['status'])}
                                className="bg-slate-100 border border-slate-300 font-bold text-xs text-slate-900 px-3 py-1 rounded-xl cursor-pointer focus:outline-none"
                              >
                                <option value="Processing">Processing</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={() => handleDeleteOrder(o.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs space-y-1">
                            <p className="text-slate-700 font-medium">Deliver to: {o.shippingAddress}</p>
                            <p className="text-slate-500">Payment: {o.paymentMethod} • Total: <strong className="text-slate-900">{formatPrice(o.totalAmount, currency)}</strong></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. MANAGE CATEGORIES */}
                {activeTab === 'categories' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Product Categories</h3>
                        <p className="text-xs text-slate-500">Organize store navigation and groupings</p>
                      </div>
                      <button
                        onClick={() => setIsCatModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Category</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((c) => (
                        <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img src={c.image} alt={c.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                            <div>
                              <h5 className="font-bold text-xs text-slate-900">{c.name}</h5>
                              <span className="text-[11px] text-slate-500">{c.slug}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteCategory(c.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. MANAGE SELLERS */}
                {activeTab === 'sellers' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Registered Sellers & Storefronts</h3>
                      <p className="text-xs text-slate-500">Approve vendor applications, verify bank accounts & monitor store revenue</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                          <tr>
                            <th className="p-3">Store & Owner</th>
                            <th className="p-3">CNIC & IBAN</th>
                            <th className="p-3">Plan</th>
                            <th className="p-3">Total Sales</th>
                            <th className="p-3">Verification Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {sellers.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/50">
                              <td className="p-3">
                                <div>
                                  <h5 className="font-bold text-slate-900">{s.storeName}</h5>
                                  <p className="text-[11px] text-slate-500">Owner: {s.ownerName} • Joined: {s.joinedDate}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="font-mono text-[11px] text-slate-600 block">CNIC: {s.cnic}</span>
                                <span className="font-mono text-[10px] text-slate-400">{s.iban}</span>
                              </td>
                              <td className="p-3">
                                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  {s.plan}
                                </span>
                              </td>
                              <td className="p-3 font-bold text-slate-900">
                                {formatPrice(s.totalSalesPKR, currency)}
                                <span className="block text-[10px] text-slate-400 font-normal">{s.totalOrdersCount} orders</span>
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    s.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {s.isVerified ? '✓ Verified & Active' : '⏳ Pending Approval'}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => handleToggleSellerVerification(s.id, s.isVerified)}
                                  className={`px-3 py-1 rounded-xl text-[11px] font-bold ${
                                    s.isVerified
                                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  }`}
                                >
                                  {s.isVerified ? 'Revoke Approval' : 'Approve Store'}
                                </button>
                                <button
                                  onClick={() => handleDeleteSellerRecord(s.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600"
                                  title="Delete Seller"
                                >
                                  <Trash2 className="w-4 h-4 inline" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 7. MANAGE CUSTOMERS */}
                {activeTab === 'customers' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Registered VIP Customers</h3>
                      <p className="text-xs text-slate-500">Monitor customer profiles, VIP tiers & fraud prevention</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                          <tr>
                            <th className="p-3">Customer</th>
                            <th className="p-3">VIP Tier</th>
                            <th className="p-3">Orders</th>
                            <th className="p-3">Total Spent</th>
                            <th className="p-3 text-right">Status Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {customers.map((c) => (
                            <tr key={c.id}>
                              <td className="p-3">
                                <div>
                                  <h5 className="font-bold text-slate-900">{c.name}</h5>
                                  <p className="text-[11px] text-slate-500">{c.email} • {c.phone}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {c.vipTier}
                                </span>
                              </td>
                              <td className="p-3 font-semibold">{c.totalOrders}</td>
                              <td className="p-3 font-bold text-slate-900">{formatPrice(c.totalSpent, currency)}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleToggleCustomerBlock(c.id)}
                                  className={`px-3 py-1 rounded-xl text-[11px] font-bold ${
                                    c.status === 'active'
                                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                  }`}
                                >
                                  {c.status === 'active' ? 'Block Account' : 'Unblock Account'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 8. MANAGE COUPONS */}
                {activeTab === 'coupons' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Discount Codes & Coupons</h3>
                        <p className="text-xs text-slate-500">Configure promotional vouchers for checkout</p>
                      </div>
                      <button
                        onClick={() => setIsCouponModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-md shadow-blue-600/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Coupon</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {coupons.map((cp) => (
                        <div key={cp.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-black text-blue-600 text-sm bg-blue-50 px-2.5 py-1 rounded-lg">
                              {cp.code}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                cp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {cp.status}
                            </span>
                          </div>
                          <p className="font-semibold text-slate-700">
                            {cp.discountType === 'percentage'
                              ? `${cp.discountValue}% OFF`
                              : `Rs. ${cp.discountValue} OFF`}{' '}
                            (Min spend Rs. {cp.minSpend})
                          </p>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <button
                              onClick={() => handleToggleCoupon(cp.id)}
                              className="text-blue-600 font-bold hover:underline"
                            >
                              Toggle
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(cp.id)}
                              className="text-rose-600 font-bold hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 9. MODERATE REVIEWS */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Customer Reviews Moderation</h3>
                      <p className="text-xs text-slate-500">Approve or moderate published product testimonials</p>
                    </div>

                    <div className="space-y-3">
                      {reviews.map((r) => (
                        <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-bold text-slate-900">{r.title}</h5>
                              <p className="text-slate-500">By {r.author} • {r.productName}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="text-rose-600 hover:bg-rose-50 p-1 rounded-lg font-bold"
                            >
                              Remove Review
                            </button>
                          </div>
                          <p className="text-slate-700">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. BACKUP & SYSTEM SETTINGS */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Database Backup & System Settings</h3>
                      <p className="text-xs text-slate-500">Export JSON backups, restore schemas, toggle maintenance mode & announcements</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Backup & Restore Panel */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                          <Database className="w-5 h-5 text-purple-600" />
                          <h4 className="text-sm font-black text-slate-900">Database Export & Restore</h4>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Export complete snapshot of Users, Orders, Sellers, Products & Settings as encrypted JSON. You can restore data on any instance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <button
                            onClick={() => {
                              const jsonStr = exportDatabaseBackupJSON();
                              const blob = new Blob([jsonStr], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `umarmart_backup_${new Date().toISOString().slice(0, 10)}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                              onShowToast('✓ Exported database backup snapshot (JSON)!');
                            }}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-purple-600/20"
                          >
                            <Download className="w-4 h-4" />
                            <span>Export Database JSON</span>
                          </button>
                          <label className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md cursor-pointer text-center">
                            <Upload className="w-4 h-4 text-amber-400" />
                            <span>Import Backup JSON</span>
                            <input
                              type="file"
                              accept=".json"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (evt) => {
                                    const content = evt.target?.result as string;
                                    if (content && importDatabaseBackupJSON(content)) {
                                      onShowToast('✓ Database backup restored successfully!');
                                    } else {
                                      onShowToast('❌ Invalid database backup file format.');
                                    }
                                  };
                                  reader.readAsText(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* System Maintenance & Announcement Controls */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                          <Wrench className="w-5 h-5 text-blue-600" />
                          <h4 className="text-sm font-black text-slate-900">Maintenance & Broadcast Controls</h4>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <div>
                              <span className="font-extrabold text-slate-900 block">Maintenance Mode</span>
                              <span className="text-slate-500 text-[11px]">Show maintenance warning banner across all storefront pages</span>
                            </div>
                            <button
                              onClick={() => {
                                const cur = getStoredSettings();
                                const updated = { ...cur, maintenanceMode: !cur.maintenanceMode };
                                saveStoredSettings(updated);
                                onShowToast(updated.maintenanceMode ? '⚠️ Maintenance mode ENABLED!' : '✓ Maintenance mode DISABLED!');
                              }}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                                getStoredSettings().maintenanceMode
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              }`}
                            >
                              {getStoredSettings().maintenanceMode ? 'ENABLED' : 'DISABLED'}
                            </button>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Global Top Broadcast Banner Text</label>
                            <input
                              type="text"
                              defaultValue={getStoredSettings().announcementBannerText}
                              onBlur={(e) => {
                                const cur = getStoredSettings();
                                saveStoredSettings({ ...cur, announcementBannerText: e.target.value });
                                onShowToast('✓ Global announcement banner updated!');
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- SUB MODAL: ADD/EDIT PRODUCT --- */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <form
                onSubmit={handleSaveProduct}
                className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="text-base font-black text-slate-900">
                    {editingProduct ? 'Edit Product' : 'Add New Catalog Product'}
                  </h4>
                  <button type="button" onClick={() => setIsProductModalOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Initial Stock Units</label>
                    <input
                      type="number"
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selling Price (Rs.)</label>
                    <input
                      type="number"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original Price (Rs.)</label>
                    <input
                      type="number"
                      value={prodOriginalPrice}
                      onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Image URL</label>
                  <input
                    type="url"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 bg-slate-200 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-600/20"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- SUB MODAL: ADD CATEGORY --- */}
          {isCatModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <form
                onSubmit={handleSaveCategory}
                className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 text-xs shadow-2xl"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="text-base font-black text-slate-900">Add New Category</h4>
                  <button type="button" onClick={() => setIsCatModalOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    required
                    placeholder="e.g. Smart Watches"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    required
                    placeholder="smart-watches"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCatModalOpen(false)}
                    className="px-4 py-2 bg-slate-200 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-600/20"
                  >
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- SUB MODAL: ADD COUPON --- */}
          {isCouponModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <form
                onSubmit={handleSaveCoupon}
                className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 text-xs shadow-2xl"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="text-base font-black text-slate-900">Create Discount Code</h4>
                  <button type="button" onClick={() => setIsCouponModalOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    required
                    placeholder="e.g. AZADI20"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 uppercase focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Type</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Flat (Rs.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Value</label>
                    <input
                      type="number"
                      value={discountVal}
                      onChange={(e) => setDiscountVal(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minimum Order Spend (Rs.)</label>
                  <input
                    type="number"
                    value={minSpendVal}
                    onChange={(e) => setMinSpendVal(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(false)}
                    className="px-4 py-2 bg-slate-200 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-600/20"
                  >
                    Activate Coupon
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
