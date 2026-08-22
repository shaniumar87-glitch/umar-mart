import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Download,
  Key,
  BookOpen,
  Video,
  Code,
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../lib/formatters';

interface DigitalMarketplaceSectionProps {
  currency: Currency;
  onShowToast: (msg: string) => void;
}

interface DigitalProduct {
  id: string;
  title: string;
  category: 'E-Book' | 'Course' | 'Software' | 'Template';
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  salesCount: number;
  fileSize: string;
  description: string;
}

const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'dig-1',
    title: 'Pakistani E-Commerce Mastery & Scaling Guide (2026 Edition)',
    category: 'E-Book',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
    price: 1499,
    originalPrice: 3999,
    rating: 4.9,
    salesCount: 1420,
    fileSize: '18.4 MB PDF',
    description: 'Complete playbook on COD logistics, Leopard/TCS API setups, Facebook Ads, and Easypaisa integration.',
  },
  {
    id: 'dig-2',
    title: 'Full-Stack React & Node.js AI SaaS Boilerplate Codebase',
    category: 'Software',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80',
    price: 4999,
    originalPrice: 9999,
    rating: 4.95,
    salesCount: 890,
    fileSize: '120 MB ZIP (Git Repo)',
    description: 'Production ready React + Express + Tailwind + Gemini API starter kit with instant license key.',
  },
  {
    id: 'dig-3',
    title: 'Figma Modern UI/UX Dashboard & Mobile App Kit (500+ Screens)',
    category: 'Template',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=500&q=80',
    price: 1999,
    originalPrice: 4500,
    rating: 4.85,
    salesCount: 2310,
    fileSize: 'Figma File Access',
    description: 'Pixel-perfect mobile UI design kit with dark mode, autolayout 5.0, and interactive prototypes.',
  },
  {
    id: 'dig-4',
    title: 'Amazon VA & Shopify Pakistan Masterclass Video Course (40 Hours)',
    category: 'Course',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80',
    price: 2999,
    originalPrice: 7999,
    rating: 4.92,
    salesCount: 3100,
    fileSize: '4K Stream + Download',
    description: 'Step-by-step video tutorials from top Pakistani sellers earning $10K+/month.',
  },
];

export const DigitalMarketplaceSection: React.FC<DigitalMarketplaceSectionProps> = ({
  currency,
  onShowToast,
}) => {
  const [purchasedId, setPurchasedId] = useState<string | null>(null);

  const handleBuyDigital = (item: DigitalProduct) => {
    setPurchasedId(item.id);
    const mockKey = `UMAR-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    onShowToast(`🎉 Purchase successful! License Key: ${mockKey}. Download link sent to email!`);
  };

  return (
    <section className="py-12 bg-slate-900 text-white relative overflow-hidden my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instant Digital Downloads</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              UmarMart Digital Marketplace
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Instant delivery of e-books, premium software licenses, video masterclasses, and UI templates directly to your account.
            </p>
          </div>
        </div>

        {/* Digital Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIGITAL_PRODUCTS.map((prod) => {
            const isPurchased = purchasedId === prod.id;
            return (
              <div
                key={prod.id}
                className="bg-slate-800/90 border border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-indigo-500/50 transition-all group"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {prod.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-slate-950/80 text-slate-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded-lg backdrop-blur-md">
                    {prod.fileSize}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        <span>{prod.rating}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{prod.salesCount} sold</span>
                    </div>

                    <h3 className="font-extrabold text-white text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {prod.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-indigo-400">
                        {formatPrice(prod.price, currency)}
                      </span>
                      <div className="text-[10px] text-slate-500 line-through">
                        {formatPrice(prod.originalPrice, currency)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyDigital(prod)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md flex items-center space-x-1.5 ${
                        isPurchased
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      }`}
                    >
                      {isPurchased ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Unlocked</span>
                        </>
                      ) : (
                        <>
                          <Key className="w-3.5 h-3.5" />
                          <span>Instant Access</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
