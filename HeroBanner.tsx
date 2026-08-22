import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  ArrowRight
} from 'lucide-react';
import { HERO_SLIDES } from '../data/mockData';

interface HeroBannerProps {
  onExploreCategory: (categorySlug: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCategory,
  onScrollToSection
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section id="hero" className="relative bg-slate-50 text-slate-900 py-6 sm:py-8">
      {/* Main Slide Carousel Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden text-white shadow-xl">
          {/* Background Decorative Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-slate-900 to-slate-950 z-0 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Slide Text Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-blue-900/60 border border-blue-700/60 rounded-full px-4 py-1.5 text-xs font-bold text-blue-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{slide.badge}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-sans">
                  {slide.heading}
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                  {slide.description}
                </p>

                {/* Price & CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white">{slide.price}</span>
                    <span className="text-sm text-slate-400 line-through font-medium">
                      {slide.originalPrice}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onExploreCategory(slide.categorySlug)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-full shadow-xl shadow-blue-900/30 transition-all transform hover:-translate-y-0.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{slide.ctaText}</span>
                    </button>

                    <button
                      onClick={() => onScrollToSection('flash-sale')}
                      className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-full transition-colors"
                    >
                      <span>Explore Gallery</span>
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Slide Hero Image */}
              <div className="lg:col-span-5 relative group">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-800 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3]">
                  <img
                    src={slide.image}
                    alt={slide.heading}
                    loading="eager"
                    decoding="async"
                    width="600"
                    height="450"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                  {/* Floating Discount Tag */}
                  <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-3 shadow-xl flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-black">
                      35%
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">UmarMart Certified</div>
                      <div className="text-[10px] text-slate-400">Authentic Premium Warranty</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators & Controls */}
          <div className="relative z-10 flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            <div className="flex space-x-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setCurrentSlide(
                    (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                  )
                }
                className="p-2.5 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="p-2.5 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Highlights Strip */}
      <div className="mt-8 bg-white border-y border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">2-5 Days Express Shipping</h4>
              <p className="text-[11px] text-slate-500">Free delivery on orders over Rs. 2,999 in Pakistan</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Authentic Guarantee</h4>
              <p className="text-[11px] text-slate-500">Directly sourced brand products</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">30-Day Easy Returns</h4>
              <p className="text-[11px] text-slate-500">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
              <Headphones className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">24/7 VIP Concierge</h4>
              <p className="text-[11px] text-slate-500">Dedicated shopping assistants</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
