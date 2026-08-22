import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  HelpCircle,
  ChevronDown,
  Search,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: 'payments' | 'shipping' | 'returns' | 'authenticity';
}

const FAQS: FAQItem[] = [
  {
    category: 'payments',
    question: 'How do EasyPaisa and JazzCash payments work on UmarMart?',
    answer:
      'When you select EasyPaisa or JazzCash at checkout, enter your registered Pakistani mobile number. You will receive an instant payment push notification or OTP SMS on your mobile phone to confirm the transaction securely.'
  },
  {
    category: 'payments',
    question: 'Is Cash on Delivery (COD) available across Pakistan?',
    answer:
      'Yes! We offer 100% Cash on Delivery (COD) across all major cities and rural districts in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Quetta, Multan, Hyderabad, Sialkot, and Gujranwala. You pay cash directly to the courier rider upon doorstep delivery.'
  },
  {
    category: 'shipping',
    question: 'What are the delivery times and shipping fees in Pakistan?',
    answer:
      'Free TCS / Leopard Express Courier Shipping is available on all orders over Rs. 2,999 across Pakistan (Standard courier fee is Rs. 250 for smaller orders). Nationwide doorstep delivery takes 2 to 5 working days across Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Quetta, Multan, Hyderabad, and all surrounding regions.'
  },
  {
    category: 'shipping',
    question: 'How do I track my live order shipment status?',
    answer:
      'Once your order is placed, you receive a unique tracking ID (e.g. UM-TRK-981240-PK). You can use our live Order Tracking tool in the menu or contact our 24/7 WhatsApp support line (+92 315 2643791) for instant courier updates.'
  },
  {
    category: 'returns',
    question: 'What is the UmarMart 7-Day Money Back & Replacement Warranty?',
    answer:
      'We offer an hassle-free 7-day money-back guarantee and free replacement for any defective or damaged items. Simply contact our support team on WhatsApp or email, and our courier rider will pick up the item from your doorstep.'
  },
  {
    category: 'authenticity',
    question: 'Are all products 100% original and covered by official warranty?',
    answer:
      'Yes, all products on UmarMart are 100% genuine and imported directly from authorized brand distributors with official brand warranties and serial number registration.'
  }
];

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'payments' | 'shipping' | 'returns'>('all');
  const [search, setSearch] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesTab = activeTab === 'all' || faq.category === activeTab;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-5 text-slate-900 my-8 overflow-hidden"
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
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Got questions about EasyPaisa, JazzCash, Cash on Delivery, or delivery timelines? Find instant answers below.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions (e.g. EasyPaisa, COD, Delivery, Return)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex space-x-2 text-xs font-bold overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap flex items-center space-x-1 ${
                activeTab === 'payments'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>EasyPaisa & JazzCash</span>
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap flex items-center space-x-1 ${
                activeTab === 'shipping'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Shipping & Delivery</span>
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap flex items-center space-x-1 ${
                activeTab === 'returns'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Returns & Warranty</span>
            </button>
          </div>

          {/* Accordion Questions */}
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {filteredFaqs.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">
                No matching questions found for "{search}".
              </p>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
                  >
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="w-full p-4 text-left font-bold text-xs text-slate-900 flex items-center justify-between hover:bg-slate-100 transition-colors"
                    >
                      <span className="pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-200/60 leading-relaxed bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
