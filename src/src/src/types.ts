export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  brand?: string;
  tags?: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  additionalImages?: string[];
  isNew?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSaleEnd?: string; // ISO date or time string
  stock: number;
  salesCount?: number;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  badge?: string;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  itemCount: number;
  featuredProduct?: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Review {
  id: string;
  productId?: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  productName: string;
  helpfulCount: number;
  location: string;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // relative to USD
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'bestsellers';

export interface AddressItem {
  id: string;
  title: string; // 'Home', 'Office', 'Parents' House', etc.
  isDefault: boolean;
  street: string;
  city: string;
  country: string;
  zipCode: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified?: boolean;
  avatar: string;
  phone?: string;
  addresses?: AddressItem[];
  address?: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  vipTier: 'Gold VIP' | 'Platinum VIP' | 'Diamond VIP';
  rewardPoints: number;
  joinedDate: string;
  notificationsEnabled?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'expired' | 'disabled';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  vipTier: 'Standard' | 'Gold VIP' | 'Platinum VIP' | 'Diamond VIP';
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  joinedDate: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  date: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  estimatedDelivery: string;
}

export interface FilterState {
  category: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
  minRating: number;
  onlyInStock: boolean;
  onlyFlashSale: boolean;
}

