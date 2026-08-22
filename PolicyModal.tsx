import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, RotateCcw, Info, Lock, Truck, Award } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'about' | 'privacy' | 'terms' | 'return';
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'privacy' | 'terms' | 'return'>(initialTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 relative flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-md">
                U
              </div>
              <div>
                <h3 className="text-xl font-black text-white">UmarMart Legal & Information Center</h3>
                <p className="text-xs text-slate-400">Trusted e-Commerce Standards across Pakistan</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 overflow-x-auto gap-2">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'about'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About UmarMart</span>
            </button>

            <button
              onClick={() => setActiveTab('return')}
              className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'return'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return & Refund Policy</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => setActiveTab('terms')}
              className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'terms'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Terms & Conditions</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 max-h-[60vh] overflow-y-auto text-xs text-slate-600 space-y-4 leading-relaxed">
            {activeTab === 'about' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start space-x-3">
                  <Award className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Pakistan's Premium Retail Experience</h4>
                    <p className="text-slate-600">
                      UmarMart is designed to empower online shoppers in Karachi, Lahore, Islamabad, Peshawar, Quetta, and across Pakistan with 100% authentic electronics, fashion, groceries, and luxury lifestyle products.
                    </p>
                  </div>
                </div>

                <h5 className="font-bold text-slate-900 text-sm">Our Core Pillars</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                    <strong className="text-slate-900 block font-bold mb-0.5">100% Authentic</strong>
                    <span>Direct official brand partnerships & official warranties.</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <Truck className="w-5 h-5 text-blue-600 mb-1" />
                    <strong className="text-slate-900 block font-bold mb-0.5">Nationwide COD</strong>
                    <span>Cash on Delivery via TCS, Leopard, and M&P express couriers.</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <RotateCcw className="w-5 h-5 text-amber-500 mb-1" />
                    <strong className="text-slate-900 block font-bold mb-0.5">Easy Returns</strong>
                    <span>7-day hassle-free door-step return guarantee.</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'return' && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">7-Day Hassle-Free Returns & Warranty</h4>
                <p>
                  We stand behind every item sold on UmarMart. If your item is damaged, defective, or incorrect, you can request an easy exchange or full refund within 7 days of delivery.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-800">Return Eligibility Criteria:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>The product must be unused and in original packaging with seals intact.</li>
                    <li>Electronic items must retain original brand warranty card and accessories.</li>
                    <li>Refunds are processed within 3-5 working days via EasyPaisa, JazzCash, or Bank Transfer.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Customer Data Protection & Privacy</h4>
                <p>
                  Your data privacy is strictly protected at UmarMart. We use end-to-end 256-bit SSL encryption for all transaction data, phone numbers, and delivery addresses.
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>We never share your personal or contact details with 3rd-party advertisers.</li>
                  <li>Payment details for EasyPaisa/JazzCash and Credit Cards are processed directly by licensed banking portals.</li>
                  <li>You can request address book deletion or account updates at any time via your user profile.</li>
                </ul>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Terms of Service</h4>
                <p>
                  By placing an order on UmarMart Pakistan, you agree to our standard customer protection and marketplace guidelines.
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>All product prices are inclusive of applicable sales taxes in Pakistani Rupees (Rs.).</li>
                  <li>Delivery times vary between 2-4 business days depending on city destination.</li>
                  <li>Seller Marketplace listings are subject to strict quality assurance audits by UmarMart inspectors.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer Close */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
