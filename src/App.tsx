import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, PackageSearch, Sparkles, X } from 'lucide-react';
import { Product, CartItem, Review, Currency, User, Order } from './types';
import {
  PRODUCTS,
  CATEGORIES,
  REVIEWS,
  CURRENCIES,
  DEMO_USER,
  MOCK_ORDERS,
  MOCK_COUPONS,
  MOCK_CUSTOMERS
} from './data/mockData';
import {
  firebaseSubscribeAuthState,
  firebaseSignOut,
  firebaseSubscribeProducts,
  searchProducts
} from './services/firebaseService';
import { ProductCard } from './components/ProductCard';

// Components
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoriesSection } from './components/CategoriesSection';
import { BrandLogos } from './components/BrandLogos';
import { DailyDeals } from './components/DailyDeals';
import { FlashSale } from './components/FlashSale';
import { FeaturedProducts } from './components/FeaturedProducts';
import { TrendingProducts } from './components/TrendingProducts';
import { NewArrivals } from './components/NewArrivals';
import { BestSellers } from './components/BestSellers';
import { CustomerReviews } from './components/CustomerReviews';
import { RecentlyViewed } from './components/RecentlyViewed';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';

