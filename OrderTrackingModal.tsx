import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  PhoneCall,
  ExternalLink,
  Sparkles,
  MessageSquare,
  Mail,
  Box,
  Check,
  Send
} from 'lucide-react';
import { Order, Currency } from '../types';
import { formatPrice } from '../lib/formatters';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currency: Currency;
  onShowToast: (msg: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  currency,
  onShowToast,
}) => {
  const [searchCode, setSearchCode] = useState('UM-TRK-981240-PK');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [emailNotificationSent, setEmailNotificationSent] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchCode.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.trackingNumber.toLowerCase().includes(query) ||
        o.id.toLowerCase().includes(query)
    );

    if (found) {
      setSelectedOrder(found);
      onShowToast(`Found order #${found.id.toUpperCase()}`);
    } else {
      const demoOrder: Order = {
        id: 'ord-' + Math.floor(10000 + Math.random() * 90000),
        trackingNumber: searchCode.toUpperCase(),
        date: 'Today, 2026',
        status: 'In Transit',
        items: [
          {
            productId: 'demo-1',
            name: 'Verified UmarMart Express Order Package',
            image:
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
            price: 199.0,
            quantity: 1,
          },
        ],
        totalAmount: 199.0,
        shippingAddress: 'Express Doorstep Delivery, Pakistan',
        paymentMethod: 'EasyPaisa / JazzCash / COD',
        estimatedDelivery: '2-5 Working Days',
      };
      setSelectedOrder(demoOrder);
      onShowToast(`Tracking #${searchCode.toUpperCase()} synchronized with Express Courier network.`);
    }
  };

  const handleSendWhatsAppUpdate = () => {
    setWhatsappSent(true);
    onShowToast('📲 WhatsApp Order Tracking update sent to customer phone (+92 315 2643791)!');
  };

  const handleSendEmailNotification = () => {
    setEmailNotificationSent(true);
    onShowToast('✉️ Delivery status notification email sent to shaniumar87@gmail.com');
  };

  // 6 Stage Order Progress Mapping
  const STAGES = [
    { title: 'Ordered', desc: 'Order placed by customer & queued', icon: Box, statusMatch: ['Ordered', 'Confirmed', 'Packed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'] },
    { title: 'Confirmed', desc: 'Verified by UmarMart & seller', icon: CheckCircle2, statusMatch: ['Confirmed', 'Packed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'] },
    { title: 'Packed', desc: 'Sealed with tamper-evident tape', icon: PackageCheck, statusMatch: ['Packed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'] },
    { title: 'Shipped', desc: 'Dispatched via TCS / Leopard Courier', icon: Truck, statusMatch: ['Shipped', 'In Transit', 'Out for Delivery', 'Delivered'] },
    { title: 'Out for Delivery', desc: 'Assigned to doorstep delivery rider', icon: Clock, statusMatch: ['Out for Delivery', 'Delivered'] },
    { title: 'Delivered', desc: 'Handed over & signed at destination', icon: Check, statusMatch: ['Delivered'] },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-slate-900 my-8 overflow-hidden"
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
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              UmarMart Express Order Tracking
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Track real-time shipment progress: Ordered → Confirmed → Packed → Shipped → Out for Delivery → Delivered
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Enter Tracking # (e.g. UM-TRK-981240-PK)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-colors shadow-md shadow-blue-600/20"
            >
              Track Order
            </button>
          </form>

          {/* Quick Select Recent Orders */}
          {orders.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto text-xs pb-1">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Your Recent:</span>
              {orders.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setSearchCode(o.trackingNumber);
                    setSelectedOrder(o);
                  }}
                  className={`px-3 py-1 rounded-xl text-[11px] font-mono font-bold transition-colors whitespace-nowrap ${
                    selectedOrder?.id === o.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  #{o.id.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* Order Details Display */}
          {selectedOrder && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="text-xs font-bold text-slate-500">
                    Tracking ID:{' '}
                    <span className="font-mono text-slate-900 text-xs">{selectedOrder.trackingNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Order Date: {selectedOrder.date} • Method: {selectedOrder.paymentMethod}
                  </div>
                </div>

                <div className="bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-black flex items-center space-x-1 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Status: {selectedOrder.status}</span>
                </div>
              </div>

              {/* 6 Stage Timeline */}
              <div className="space-y-4 pt-1">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    6-Step Order Progress Pipeline
                  </h5>
                  <span className="text-[11px] text-blue-600 font-bold">TCS / Leopard Express Sync</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
                  {STAGES.map((stg, idx) => {
                    const isCompleted = stg.statusMatch.includes(selectedOrder.status);
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-2xl border transition-all ${
                          isCompleted
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl mx-auto flex items-center justify-center mb-1.5 text-xs font-bold ${
                            isCompleted ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span className="font-extrabold block text-[11px] leading-tight mb-0.5">
                          {stg.title}
                        </span>
                        <span className="text-[9px] text-slate-500 block line-clamp-2">
                          {stg.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instant Notification Trigger Controls */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <h6 className="font-bold text-slate-900">Instant Order Updates & Alerts</h6>
                  <p className="text-[11px] text-slate-500">Get automated notifications via WhatsApp & Email</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSendWhatsAppUpdate}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 text-xs ${
                      whatsappSent
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{whatsappSent ? '✓ WhatsApp Sent' : 'Send WhatsApp Update'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendEmailNotification}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 text-xs ${
                      emailNotificationSent
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{emailNotificationSent ? '✓ Email Sent' : 'Email Receipt'}</span>
                  </button>
                </div>
              </div>

              {/* Items Summary */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Destination Address:</span>
                  <p className="font-bold text-slate-800">{selectedOrder.shippingAddress}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onShowToast('Courier helpline (+92 315 2643791) contacted for live update.')
                  }
                  className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-xl font-bold hover:bg-blue-100 flex items-center space-x-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Hotline</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
