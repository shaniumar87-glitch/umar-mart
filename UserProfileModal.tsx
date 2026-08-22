import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User as UserIcon,
  X,
  Package,
  MapPin,
  Shield,
  LogOut,
  Award,
  CheckCircle2,
  Truck,
  ChevronRight,
  Sparkles,
  Edit2,
  Save,
  Heart,
  Plus,
  Trash2,
  Building2,
  Home,
  Check,
  ShoppingBag,
  Bell,
  Mail,
  Smartphone,
  KeyRound,
  ShieldAlert,
  ExternalLink,
  LayoutDashboard,
  Settings,
  Ticket,
  FileText,
  QrCode,
  Share2,
  Copy,
  MessageSquare,
  Send,
  HelpCircle,
  Gift
} from 'lucide-react';
import { User, Order, Currency, Product, AddressItem } from '../types';
import { formatPrice } from '../lib/formatters';
import { PAKISTANI_CITIES } from './CheckoutModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  orders: Order[];
  currency: Currency;
  onLogout: () => void;
  onUpdateProfile?: (updated: Partial<User>) => void;
  onShowToast: (msg: string) => void;
  products?: Product[];
  wishlistIds?: string[];
  onAddToCart?: (product: Product, quantity?: number) => void;
  onToggleWishlist?: (product: Product) => void;
}

type DashboardTab = 'dashboard' | 'orders' | 'rewards' | 'support' | 'wishlist' | 'addresses' | 'profile' | 'security';

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  currency,
  onLogout,
  onUpdateProfile,
  onShowToast,
  products = [],
  wishlistIds = [],
  onAddToCart,
  onToggleWishlist,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '+92 315 2643791');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [notifications, setNotifications] = useState(user?.notificationsEnabled ?? true);

  // Addresses State
  const [addressList, setAddressList] = useState<AddressItem[]>(
    user?.addresses || [
      {
        id: 'addr-1',
        title: 'Home (Primary)',
        isDefault: true,
        street: user?.address?.street || 'House 45, Block 4, Clifton',
        city: user?.address?.city || 'Karachi',
        country: 'Pakistan',
        zipCode: user?.address?.zipCode || '75600',
        phone: user?.phone || '+92 315 2643791',
      },
    ]
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Office');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Karachi');
  const [newAddrZip, setNewAddrZip] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState(user?.phone || '+92 315 2643791');

  // Email verification prompt
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');

  if (!isOpen || !user) return null;

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleVerifyEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({ isEmailVerified: true });
    }
    setIsVerifyingEmail(false);
    onShowToast('🎉 Email address verified successfully!');
  };

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: editName,
        phone: editPhone,
        email: editEmail,
        avatar: editAvatar || user?.avatar,
        notificationsEnabled: notifications,
      });
    }
    onShowToast('Profile settings updated successfully!');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: AddressItem = {
      id: 'addr-' + Date.now(),
      title: newAddrTitle || 'Address',
      isDefault: addressList.length === 0,
      street: newAddrStreet,
      city: newAddrCity,
      country: 'Pakistan',
      zipCode: newAddrZip || '75600',
      phone: newAddrPhone,
    };
    const updated = [...addressList, newAddr];
    setAddressList(updated);
    if (onUpdateProfile) {
      onUpdateProfile({ addresses: updated });
    }
    setIsAddingAddress(false);
    setNewAddrStreet('');
    setNewAddrZip('');
    onShowToast('New delivery address added!');
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addressList.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddressList(updated);
    const defaultOne = updated.find((a) => a.id === id);
    if (defaultOne && onUpdateProfile) {
      onUpdateProfile({
        addresses: updated,
        address: {
          street: defaultOne.street,
          city: defaultOne.city,
          country: defaultOne.country,
          zipCode: defaultOne.zipCode,
        },
      });
    }
    onShowToast('Set as default delivery address.');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addressList.filter((a) => a.id !== id);
    setAddressList(updated);
    if (onUpdateProfile) {
      onUpdateProfile({ addresses: updated });
    }
    onShowToast('Address removed.');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full relative shadow-2xl overflow-hidden text-slate-900 my-8"
        >
          {/* Top Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 relative p-6 flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{user.vipTier} Member</span>
              </span>

              {/* Email Verification Badge / Button */}
              {user.isEmailVerified ? (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-500/20 text-emerald-100 border-emerald-300/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Email Verified</span>
                </span>
              ) : (
                <button
                  onClick={() => {
                    if (onUpdateProfile) {
                      onUpdateProfile({ isEmailVerified: true });
                    }
                    onShowToast('✉️ Verification link sent & email verified!');
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-amber-500/30 text-amber-100 border-amber-300/60 hover:bg-amber-500/50 transition-colors cursor-pointer shadow-sm"
                  title="Click to send verification email"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>Verify Email Now</span>
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Header Info */}
          <div className="px-6 pb-4 relative pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-12 gap-4">
              <div className="flex items-end space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg bg-slate-100"
                />
                <div className="mb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-black text-slate-900">{user.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-center">
                  <div className="text-[10px] uppercase font-bold text-amber-700">VIP Points</div>
                  <div className="text-sm font-black text-amber-900">{user.rewardPoints} pts</div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex border-b border-slate-200 px-6 space-x-4 sm:space-x-6 text-xs font-bold text-slate-500 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 flex items-center space-x-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600 font-black'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 flex items-center space-x-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-blue-600 text-blue-600 font-black'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`py-3 flex items-center space-x-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'rewards'
                  ? 'border-blue-600 text-blue-600 font-black'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <Gift className="w-4 h-4 text-amber-500" />
              <span>Loyalty & Rewards</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`py-3 flex items-center space-x-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'support'
                  ? 'border-blue-600 text-blue-600 font-black'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Support Tickets</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`py-3 flex items-center space-x-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'wishlist'
                  ? 'border-blue-600 text-blue-600 font-black'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist ({wishlistIds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-3 flex items-center space-x-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'addresses'
                  ? 'border-blue-600 text-blue-600 font-black'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses ({addressList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 flex items-center space-x-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600 font-black'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`py-3 flex items-center space-x-1.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-blue-600 text-blue-600 font-black'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </button>
          </div>

          {/* Main Tab Content Container */}
          <div className="p-6 min-h-[350px] max-h-[460px] overflow-y-auto">
            {/* --- 1. OVERVIEW DASHBOARD TAB --- */}
            {activeTab === 'dashboard' && (
              <div className="space-y-5">
                {/* Email Verification Warning Banner if unverified */}
                {!user.isEmailVerified && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                        ✉️
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-amber-950">Verify Your Email Address</h5>
                        <p className="text-[11px] text-amber-800">
                          Verify <strong>{user.email}</strong> to receive instant SMS/email order tracking updates.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsVerifyingEmail(true)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-sm shrink-0"
                    >
                      Verify Now (OTP)
                    </button>
                  </div>
                )}

                {/* Email Verification OTP Prompt Modal / View */}
                {isVerifyingEmail && (
                  <form onSubmit={handleVerifyEmailSubmit} className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-bold text-blue-900">Enter Email Verification OTP (Demo: 482195)</h5>
                      <button
                        type="button"
                        onClick={() => setIsVerifyingEmail(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={emailOtpCode}
                        onChange={(e) => setEmailOtpCode(e.target.value)}
                        placeholder="Enter 6-digit OTP code"
                        className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setEmailOtpCode('482195')}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold"
                      >
                        Auto-fill
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                      >
                        Submit OTP
                      </button>
                    </div>
                  </form>
                )}

                {/* Dashboard Stats Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div
                    onClick={() => setActiveTab('orders')}
                    className="bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-4 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex justify-between text-slate-400">
                      <span>Total Orders</span>
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-xl font-black text-slate-900">{orders.length}</div>
                    <span className="text-[10px] text-blue-600 font-bold">View history →</span>
                  </div>

                  <div
                    onClick={() => setActiveTab('wishlist')}
                    className="bg-slate-50 border border-slate-200 hover:border-rose-300 rounded-2xl p-4 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex justify-between text-slate-400">
                      <span>Saved Wishlist</span>
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    </div>
                    <div className="text-xl font-black text-slate-900">{wishlistIds.length}</div>
                    <span className="text-[10px] text-rose-600 font-bold">View items →</span>
                  </div>

                  <div
                    onClick={() => setActiveTab('addresses')}
                    className="bg-slate-50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex justify-between text-slate-400">
                      <span>Saved Addresses</span>
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xl font-black text-slate-900">{addressList.length}</div>
                    <span className="text-[10px] text-emerald-600 font-bold">Manage locations →</span>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-1">
                    <div className="flex justify-between text-amber-700">
                      <span>Reward Points</span>
                      <Award className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-xl font-black text-amber-950">{user.rewardPoints}</div>
                    <span className="text-[10px] text-amber-700 font-bold">Rs. {user.rewardPoints * 2} value</span>
                  </div>
                </div>

                {/* Recent Order Quick Card */}
                {orders.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-900">Most Recent Order</span>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        All Orders ({orders.length}) →
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900">{orders[0].id.toUpperCase()}</span>
                        <p className="text-[11px] text-slate-500">{orders[0].items.length} items • {orders[0].date}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        {orders[0].status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- 2. ORDER HISTORY TAB --- */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 space-y-3">
                    <Package className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">No orders placed yet.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-xs text-slate-900">
                              {order.id.toUpperCase()}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {order.status === 'Delivered' ? (
                                <span className="flex items-center">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Truck className="w-3 h-3 mr-1" /> {order.status}
                                </span>
                              )}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Placed on {order.date}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-blue-600">
                            {formatPrice(order.totalAmount, currency)}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">
                            TRK: {order.trackingNumber}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-white"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 truncate">
                                {item.name}
                              </h5>
                              <p className="text-[10px] text-slate-500">
                                Qty: {item.quantity} • {formatPrice(item.price, currency)} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-200 gap-2">
                        <span>Est. Delivery: <strong>{order.estimatedDelivery}</strong></span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              onShowToast(`📄 Official UmarMart Tax Invoice #${order.id.toUpperCase()} (PDF) downloaded to your device!`)
                            }
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-bold text-slate-700 text-[11px] flex items-center space-x-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Download Invoice</span>
                          </button>
                          <button
                            onClick={() =>
                              onShowToast(`Courier Status for ${order.trackingNumber}: Package is safely in transit via TCS / Leopard.`)
                            }
                            className="text-blue-600 font-bold hover:underline flex items-center space-x-1"
                          >
                            <span>Track Courier</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- 2B. LOYALTY & REWARDS TAB --- */}
            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-5 rounded-2xl space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-400 px-3 py-1 rounded-full">
                      Current Level: {user.vipTier} Member
                    </span>
                    <Award className="w-6 h-6 text-slate-950" />
                  </div>
                  <div>
                    <div className="text-3xl font-black">{user.rewardPoints} VIP Points</div>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      Earn 1 VIP Point for every PKR 100 spent on UmarMart.
                    </p>
                  </div>
                </div>

                {/* Loyalty Tier Progress */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Pakistani Customer Loyalty Tiers
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                      <div className="font-extrabold text-amber-800">Bronze</div>
                      <div className="text-[10px] text-slate-400">0 - 1,000 pts</div>
                      <div className="text-[10px] font-bold text-emerald-600 mt-1">2% Cash Back</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                      <div className="font-extrabold text-slate-600">Silver</div>
                      <div className="text-[10px] text-slate-400">1,001 - 5,000 pts</div>
                      <div className="text-[10px] font-bold text-emerald-600 mt-1">5% Cash Back</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl ring-2 ring-amber-400/30">
                      <div className="font-extrabold text-amber-900">Gold ★</div>
                      <div className="text-[10px] text-amber-700 font-bold">5,001 - 15,000 pts</div>
                      <div className="text-[10px] font-black text-amber-900 mt-1">8% Cash Back</div>
                    </div>
                    <div className="bg-slate-900 text-white p-3 rounded-2xl">
                      <div className="font-extrabold text-purple-300">Platinum VIP</div>
                      <div className="text-[10px] text-slate-400">15,000+ pts</div>
                      <div className="text-[10px] font-bold text-purple-400 mt-1">12% Cash Back</div>
                    </div>
                  </div>
                </div>

                {/* Referral Link Generator */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <h5 className="text-xs font-black text-blue-950">Refer Friends & Earn PKR 500 Credit</h5>
                      <p className="text-[11px] text-blue-800">Share your referral link with family in Karachi, Lahore, Islamabad & get cash vouchers!</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={`https://umarmart.pk/ref/${user.name.toLowerCase().replace(/\s+/g, '')}-2026`}
                      className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://umarmart.pk/ref/${user.name.toLowerCase().replace(/\s+/g, '')}-2026`);
                        onShowToast('Copied referral link to clipboard!');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center space-x-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- 2C. CUSTOMER SUPPORT TICKETS TAB --- */}
            {activeTab === 'support' && (
              <div className="space-y-5">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <div>
                        <h5 className="text-xs font-black text-slate-900">UmarMart 24/7 Priority Support Desk</h5>
                        <p className="text-[11px] text-slate-500">Create a help ticket or track complaint status</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        onShowToast('Ticket #TKT-8821 created! An Urdu/English agent will call/WhatsApp you within 15 mins.')
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Ticket</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">Active Support Tickets</h5>
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-600">TKT-7402</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Resolved by Agent Tariq
                      </span>
                    </div>
                    <h6 className="font-bold text-slate-900">Delivery Address Modification Request</h6>
                    <p className="text-[11px] text-slate-500">Subject: Change address to Clifton Karachi Block 5 • Replied 10 mins ago</p>
                  </div>
                </div>
              </div>
            )}

            {/* --- 3. WISHLIST TAB --- */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Your Saved Wishlist Items</h4>
                  <span className="text-xs text-slate-500">{wishlistProducts.length} items</span>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 space-y-3">
                    <Heart className="w-10 h-10 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">Your wishlist is currently empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wishlistProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center space-x-3 hover:border-slate-300 transition-all relative"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 bg-white shrink-0"
                        />
                        <div className="flex-1 min-w-0 pr-6">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{product.name}</h5>
                          <span className="text-xs font-black text-blue-600 block mt-0.5">
                            {formatPrice(product.price, currency)}
                          </span>
                          <button
                            onClick={() => {
                              if (onAddToCart) onAddToCart(product, 1);
                              onShowToast(`Added "${product.name}" to cart!`);
                            }}
                            className="mt-1 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            if (onToggleWishlist) onToggleWishlist(product);
                          }}
                          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-600 p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- 4. SAVED ADDRESSES TAB --- */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Saved Delivery Addresses</h4>
                    <p className="text-xs text-slate-500">Manage multiple delivery locations in Pakistan</p>
                  </div>
                  {!isAddingAddress && (
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Address</span>
                    </button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleAddAddress} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Address Label</label>
                      <input
                        type="text"
                        value={newAddrTitle}
                        onChange={(e) => setNewAddrTitle(e.target.value)}
                        placeholder="e.g. Home, Office, Parents House"
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        placeholder="House / Flat #, Street, Block / Sector"
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">City (Pakistan)</label>
                        <select
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        >
                          {PAKISTANI_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={newAddrZip}
                          onChange={(e) => setNewAddrZip(e.target.value)}
                          placeholder="e.g. 75600"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center space-x-1 px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Location</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {addressList.map((addr) => (
                      <div
                        key={addr.id}
                        className={`bg-slate-50 border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                          addr.isDefault ? 'border-blue-400 bg-blue-50/20 shadow-xs' : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{addr.title}</span>
                            {addr.isDefault && (
                              <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600">{addr.street}, {addr.city} ({addr.zipCode}), Pakistan</p>
                          <p className="text-slate-500 text-[11px]">Contact: {addr.phone}</p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 rounded-xl text-[11px] font-bold transition-colors"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50"
                            title="Delete address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- 5. PROFILE SETTINGS TAB --- */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfileSettings} className="space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Personal Information</h4>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Profile Avatar Photo URL</label>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Notification Preferences</h4>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-700">Receive SMS / WhatsApp order status & tracking alerts</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Settings</span>
                  </button>
                </div>
              </form>
            )}

            {/* --- 6. SECURITY TAB --- */}
            {activeTab === 'security' && (
              <div className="space-y-5">
                <h4 className="text-sm font-black text-slate-900">Account Security, 2FA & Active Sessions</h4>

                {/* 2FA Toggle */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-slate-900 block text-sm">Two-Factor Authentication (2FA)</span>
                      <span className="text-slate-500 text-[11px]">Require SMS OTP code on every new device login</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onShowToast('🔒 Two-Factor Authentication (2FA via SMS) updated!');
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 text-white font-extrabold rounded-xl text-xs hover:bg-blue-700 shadow-sm"
                    >
                      Enable 2FA
                    </button>
                  </div>
                </div>

                {/* Password Update Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onShowToast('🔑 Security password updated successfully!');
                  }}
                  className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs"
                >
                  <h5 className="font-bold text-slate-800 text-xs">Change Password</h5>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-600/20"
                  >
                    Update Password
                  </button>
                </form>

                {/* Active Sessions & Device Management */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Active Login Sessions ({2})</span>
                    <button
                      onClick={() => onShowToast('✓ Logged out from all other active sessions!')}
                      className="text-rose-600 font-bold hover:underline text-[11px]"
                    >
                      Log Out All Devices
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">iPhone 15 Pro (UmarMart iOS App)</p>
                          <p className="text-[10px] text-slate-500">Karachi, Pakistan • IP: 103.255.4.12 • Active Now</p>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">Current Device</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <KeyRound className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">Chrome Browser on Windows 11</p>
                          <p className="text-[10px] text-slate-500">Lahore, Pakistan • IP: 182.180.88.9 • 2 hours ago</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onShowToast('Terminated session for Chrome Windows.')}
                        className="text-slate-400 hover:text-rose-600 text-[11px] font-bold"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

