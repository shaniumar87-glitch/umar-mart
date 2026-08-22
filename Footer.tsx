import React from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe
} from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onSelectCategory: (slug: string) => void;
  onOpenContact?: () => void;
  onOpenFAQ?: () => void;
  onOpenOrderTracking?: () => void;
  onOpenAdmin?: () => void;
  onOpenSeller?: () => void;
  onOpenPolicy?: (tab: 'about' | 'privacy' | 'terms' | 'return') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToSection,
  onSelectCategory,
  onOpenContact,
  onOpenFAQ,
  onOpenOrderTracking,
  onOpenAdmin,
  onOpenSeller,
  onOpenPolicy,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid: Brand & Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <span className="text-lg font-black text-white">U</span>
                </div>
              </div>
              <span className="text-2xl font-black text-white font-sans tracking-tight">
                Umar<span className="text-blue-500">Mart</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              UmarMart is Pakistan's premier online marketplace for certified smartphones, laptops, luxury fashion, daily groceries, and smart home electronics. Owned & operated by <strong>Muhammad Umar</strong>.
            </p>

            <div className="space-y-2 text-slate-300 pt-2 text-xs">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Shahrah-e-Faisal, Suite 402, Karachi, Pakistan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="tel:+923152643791" className="hover:text-blue-400 transition-colors font-bold">
                  +92 315 2643791
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:shaniumar87@gmail.com" className="hover:text-blue-400 transition-colors font-bold">
                  shaniumar87@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 1: Shop Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onSelectCategory('mobiles')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Mobiles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('laptops')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Laptops
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('fashion')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Fashion
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('grocery')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Grocery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('beauty')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Beauty
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('home-kitchen')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Home & Kitchen
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Navigation & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Policies & Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onOpenPolicy && onOpenPolicy('about')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  About UmarMart
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy && onOpenPolicy('privacy')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy && onOpenPolicy('terms')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy && onOpenPolicy('return')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-blue-400 transition-colors text-left font-semibold text-slate-300"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={onOpenOrderTracking}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFAQ}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  FAQ & EasyPaisa Help
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy && onOpenPolicy('return')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  7-Day Doorstep Returns
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-blue-400 transition-colors text-left font-bold text-emerald-400"
                >
                  WhatsApp Support (+92 3152643791)
                </button>
              </li>
              {onOpenSeller && (
                <li>
                  <button
                    onClick={onOpenSeller}
                    className="text-amber-400 hover:text-amber-300 transition-colors text-left font-bold flex items-center space-x-1"
                  >
                    <span>🏪 Sell on UmarMart (Seller Hub)</span>
                  </button>
                </li>
              )}
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-left font-bold flex items-center space-x-1"
                  >
                    <span>⚡ Admin Control Panel</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Payment Methods & Socials Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-slate-400 text-[11px] font-semibold mr-1">Accepted Payments:</span>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] font-bold">
              <span className="bg-emerald-950 border border-emerald-800 px-2 py-1 rounded text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> EASYPAISA
              </span>
              <span className="bg-rose-950 border border-rose-800 px-2 py-1 rounded text-rose-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> JAZZCASH
              </span>
              <span className="bg-blue-950 border border-blue-800 px-2 py-1 rounded text-blue-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> CASH ON DELIVERY (COD)
              </span>
              <span className="bg-slate-950 border border-slate-800 px-2 py-1 rounded text-slate-300">VISA</span>
              <span className="bg-slate-950 border border-slate-800 px-2 py-1 rounded text-amber-400">MASTERCARD</span>
              <span className="bg-slate-950 border border-slate-800 px-2 py-1 rounded text-white">APPLE PAY</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="UmarMart Facebook"
              className="p-2 bg-slate-950 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-blue-600 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="UmarMart Instagram"
              className="p-2 bg-slate-950 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-pink-600 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              title="UmarMart YouTube"
              className="p-2 bg-slate-950 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-red-600 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 border-t border-slate-800 text-center text-slate-500 text-[11px] space-y-1">
          <p>© {new Date().getFullYear()} UmarMart. Owned by Muhammad Umar. All Rights Reserved. Registered Business in Pakistan (PKR).</p>
        </div>
      </div>
    </footer>
  );
};
