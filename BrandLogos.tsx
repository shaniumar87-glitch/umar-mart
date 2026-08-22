import React from 'react';
import { ShieldCheck, ArrowRight, Award } from 'lucide-react';

interface BrandLogosProps {
  onSelectBrand?: (brandName: string) => void;
}

const BRANDS = [
  { name: 'Samsung', tag: 'Official Flagship Store', logo: '📱' },
  { name: 'Apple', tag: 'Certified Reseller', logo: '🍏' },
  { name: 'Audionic', tag: 'Sound Crafters', logo: '🎧' },
  { name: 'Xiaomi', tag: 'Smart Living', logo: '⚡' },
  { name: 'Ronin', tag: 'Mobile Gear', logo: '🔋' },
  { name: 'Khaadi', tag: 'Luxury Apparel', logo: '🧵' },
  { name: 'Junaid Jamshed', tag: 'Ethnic Wear', logo: '👔' },
  { name: 'Soundpeats', tag: 'Hi-Fi Audio', logo: '🎵' },
  { name: 'Anker', tag: 'Fast Charging', logo: '🔌' },
  { name: 'Outfitters', tag: 'Urban Fashion', logo: '👕' },
];

export const BrandLogos: React.FC<BrandLogosProps> = ({ onSelectBrand }) => {
  return (
    <section className="py-10 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Official Brand Mall</h3>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                100% Guaranteed Original
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct from official manufacturer channels in Pakistan with official brand warranty.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-bold text-blue-600">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Verified Brand Partners</span>
          </div>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {BRANDS.map((b) => (
            <button
              key={b.name}
              onClick={() => onSelectBrand && onSelectBrand(b.name)}
              className="bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all group shadow-2xs hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">
                {b.logo}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {b.name}
              </h4>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">{b.tag}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
