import React from 'react';
import {
  Smartphone,
  Laptop,
  Shirt,
  ShoppingBag,
  Sparkles,
  Home,
  Dumbbell,
  Car,
  Utensils,
  Headphones,
  Watch,
  Gamepad2,
  ArrowRight
} from 'lucide-react';
import { Category } from '../types';

interface CategoriesSectionProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Smartphone,
  Laptop,
  Shirt,
  ShoppingBag,
  Sparkles,
  Home,
  Dumbbell,
  Car,
  Utensils,
  Headphones,
  Watch,
  Gamepad2,
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-blue-600 font-bold text-xs tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Browse UmarMart Catalog</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Curated Product Categories
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center space-x-1.5 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 text-slate-700 hover:text-blue-600 hover:bg-slate-200'
            }`}
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.iconName] || Laptop;
            const isSelected = selectedCategory === cat.slug;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.slug)}
                className={`group relative overflow-hidden rounded-2xl p-5 border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'bg-slate-50/80 border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-sm'
                }`}
              >
                {/* Background image preview with soft overlay */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    width="300"
                    height="200"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3 rounded-xl transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'bg-white border border-slate-200 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                      {cat.itemCount} items
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {cat.description}
                    </p>
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
