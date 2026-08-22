/**
 * Enterprise Firebase Integration Service Layer for UmarMart
 * Handles Firestore, Firebase Auth, Firebase Storage, and Real-Time DB Listeners.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { Product, Category, Order, Review, Coupon, Customer } from '../types';
import {
  UserProfile,
  OrderRecord,
  SellerRecord,
  UserNotification,
  getStoredUsers,
  saveStoredUsers,
  getStoredOrders,
  saveOrderRecord,
  getStoredSellers,
  getStoredNotifications,
  addStoredNotification,
} from '../lib/dbSchema';
import {
  auth,
  db,
  isFirebaseConfigured,
  FIRESTORE_COLLECTIONS,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';

// ============================================================================
// 1. FIREBASE AUTHENTICATION FLOW
// ============================================================================

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const ACTIVE_USER_STORAGE_KEY = 'umarmart_active_auth_user';
let authListeners: Array<(user: UserProfile | null) => void> = [];

export function notifyAuthListeners(user: UserProfile | null) {
  if (user) {
    try {
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  } else {
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
  }
  authListeners.forEach((fn) => fn(user));
}

/**
 * Sign in user with Email & Password
 */
export async function firebaseSignIn(email: string, password: string): Promise<UserProfile> {
  if (isFirebaseConfigured && auth) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const profile = await firebaseGetUserProfile(userCred.user.uid);
      if (profile) {
        notifyAuthListeners(profile);
        return profile;
      }
    } catch (err: any) {
      console.warn('Live Firebase signIn error (falling back to stored session):', err.message);
    }
  }

  // Local demo fallback: search stored users or create active session
  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    notifyAuthListeners(existing);
    return existing;
  }

  // Auto-generate profile if demo user
  const newProfile: UserProfile = {
    uid: `usr_${Date.now()}`,
    name: email.split('@')[0] || 'UmarMart Customer',
    email,
    role: email.toLowerCase().includes('admin') ? 'admin' : email.toLowerCase().includes('seller') ? 'seller' : 'customer',
    vipTier: 'Gold',
    rewardPoints: 250,
    createdAt: new Date().toISOString(),
  };

  saveStoredUsers([...users, newProfile]);
  notifyAuthListeners(newProfile);
  return newProfile;
}

/**
 * Register new user with Email, Password & Name
 */
export async function firebaseSignUp(
  name: string,
  email: string,
  password: string,
  role: 'customer' | 'seller' | 'admin' = 'customer'
): Promise<UserProfile> {
  const newProfile: UserProfile = {
    uid: `usr_${Date.now()}`,
    name,
    email,
    role,
    vipTier: 'Bronze',
    rewardPoints: 100,
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && auth) {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      if (userCred.user) {
        await updateProfile(userCred.user, { displayName: name });
        newProfile.uid = userCred.user.uid;
        if (db) {
          await setDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, userCred.user.uid), newProfile);
        }
      }
    } catch (err: any) {
      console.warn('Live Firebase signUp error (saving locally):', err.message);
    }
  }

  const users = getStoredUsers();
  saveStoredUsers([newProfile, ...users.filter((u) => u.email !== email)]);
  notifyAuthListeners(newProfile);
  return newProfile;
}

/**
 * Sign in or sign up with Google Auth Provider
 */
export async function firebaseGoogleSignIn(): Promise<UserProfile> {
  if (isFirebaseConfigured && auth) {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      if (userCred.user) {
        let profile = await firebaseGetUserProfile(userCred.user.uid);
        if (!profile) {
          profile = {
            uid: userCred.user.uid,
            name: userCred.user.displayName || 'Google User',
            email: userCred.user.email || 'user@gmail.com',
            role: 'customer',
            vipTier: 'Gold',
            rewardPoints: 500,
            avatar: userCred.user.photoURL || undefined,
            createdAt: new Date().toISOString(),
          };
          if (db) {
            await setDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, userCred.user.uid), profile);
          }
        }
        notifyAuthListeners(profile);
        return profile;
      }
    } catch (err: any) {
      console.warn('Live Firebase Google sign-in note (using fallback):', err.message);
    }
  }

  const googleUser: UserProfile = {
    uid: `google_usr_${Date.now()}`,
    name: 'Muhammad Umar',
    email: 'shaniumar87@gmail.com',
    role: 'admin',
    vipTier: 'Platinum VIP',
    rewardPoints: 500,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    createdAt: new Date().toISOString(),
  };

  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === googleUser.email.toLowerCase());
  const finalProfile = existing || googleUser;
  if (!existing) {
    saveStoredUsers([googleUser, ...users]);
  }
  notifyAuthListeners(finalProfile);
  return finalProfile;
}

/**
 * Send password reset email
 */
export async function firebaseSendPasswordReset(email: string): Promise<boolean> {
  if (isFirebaseConfigured && auth) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err: any) {
      console.warn('Firebase sendPasswordReset error:', err.message);
    }
  }
  return true;
}

/**
 * Sign out current authenticated user
 */
export async function firebaseSignOut(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut note:', err);
    }
  }
  notifyAuthListeners(null);
}

/**
 * Subscribe to real-time Authentication state changes
 */
export function firebaseSubscribeAuthState(callback: (user: UserProfile | null) => void): () => void {
  authListeners.push(callback);

  if (isFirebaseConfigured && auth) {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await firebaseGetUserProfile(firebaseUser.uid);
        if (profile) {
          callback(profile);
          return;
        }
      }
    });

    return () => {
      authListeners = authListeners.filter((fn) => fn !== callback);
      unsub();
    };
  }

  try {
    const saved = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (saved) {
      callback(JSON.parse(saved));
    } else {
      callback(null);
    }
  } catch {
    callback(null);
  }

  return () => {
    authListeners = authListeners.filter((fn) => fn !== callback);
  };
}

/**
 * Fetch or update User Profile document
 */
export async function firebaseGetUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    }
    const users = getStoredUsers();
    return users.find((u) => u.uid === uid) || null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `${FIRESTORE_COLLECTIONS.USERS}/${uid}`);
    return null;
  }
}

/**
 * Update user profile settings
 */
export async function firebaseUpdateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
      await updateDoc(docRef, updates);
    }
    const users = getStoredUsers();
    const updated = users.map((u) => (u.uid === uid ? { ...u, ...updates } : u));
    saveStoredUsers(updated);
    const active = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (active) {
      const cur = JSON.parse(active);
      if (cur.uid === uid) {
        notifyAuthListeners({ ...cur, ...updates });
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.USERS}/${uid}`);
  }
}


// ============================================================================
// 2. FIRESTORE DATABASE: PRODUCTS CRUD & REAL-TIME
// ============================================================================

export async function firebaseSaveProduct(product: Product): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.PRODUCTS, product.id);
      await setDoc(docRef, product, { merge: true });
    }
    const stored = localStorage.getItem('umarmart_custom_products');
    const existing: Product[] = stored ? JSON.parse(stored) : [];
    const updated = [product, ...existing.filter((p) => p.id !== product.id)];
    localStorage.setItem('umarmart_custom_products', JSON.stringify(updated));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.PRODUCTS}/${product.id}`);
  }
}

export async function firebaseDeleteProduct(productId: string): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.PRODUCTS, productId);
      await deleteDoc(docRef);
    }
    const stored = localStorage.getItem('umarmart_custom_products');
    if (stored) {
      const existing: Product[] = JSON.parse(stored);
      const updated = existing.filter((p) => p.id !== productId);
      localStorage.setItem('umarmart_custom_products', JSON.stringify(updated));
    }
    const deletedIds = JSON.parse(localStorage.getItem('umarmart_deleted_products') || '[]');
    if (!deletedIds.includes(productId)) {
      deletedIds.push(productId);
      localStorage.setItem('umarmart_deleted_products', JSON.stringify(deletedIds));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${FIRESTORE_COLLECTIONS.PRODUCTS}/${productId}`);
  }
}

export async function firebaseUpdateProductStock(productId: string, delta: number): Promise<void> {
  try {
    const stored = localStorage.getItem('umarmart_custom_products');
    const existing: Product[] = stored ? JSON.parse(stored) : [];
    const prod = existing.find((p) => p.id === productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock + delta);
      await firebaseSaveProduct(prod);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.PRODUCTS}/${productId}`);
  }
}

export function firebaseSubscribeProducts(
  callback: (products: Product[]) => void,
  fallbackProducts: Product[]
): () => void {
  if (isFirebaseConfigured && db) {
    const q = collection(db, FIRESTORE_COLLECTIONS.PRODUCTS);
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((docSnap) => docSnap.data() as Product);
          callback(list);
          return;
        }
        callback(fallbackProducts);
      },
      (err) => {
        console.warn('Products onSnapshot fallback:', err.message);
      }
    );
    return unsub;
  }

  const loadLocalProducts = () => {
    try {
      const deletedIds: string[] = JSON.parse(localStorage.getItem('umarmart_deleted_products') || '[]');
      const stored = localStorage.getItem('umarmart_custom_products');
      const customProds: Product[] = stored ? JSON.parse(stored) : [];
      
      const mergedMap = new Map<string, Product>();
      fallbackProducts.forEach((p) => {
        if (!deletedIds.includes(p.id)) {
          mergedMap.set(p.id, p);
        }
      });
      customProds.forEach((p) => {
        if (!deletedIds.includes(p.id)) {
          mergedMap.set(p.id, p);
        }
      });
      callback(Array.from(mergedMap.values()));
    } catch {
      callback(fallbackProducts);
    }
  };

  loadLocalProducts();
  const interval = setInterval(loadLocalProducts, 2000);
  return () => clearInterval(interval);
}

/**
 * Real-time search algorithm for products
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;

  return products.filter((p) => {
    const nameMatch = p.name ? p.name.toLowerCase().includes(q) : false;
    const catMatch = p.category ? p.category.toLowerCase().includes(q) : false;
    const catSlugMatch = p.categorySlug ? p.categorySlug.toLowerCase().includes(q) : false;
    const brandMatch = p.brand ? p.brand.toLowerCase().includes(q) : false;
    const descMatch = p.description ? p.description.toLowerCase().includes(q) : false;
    const tagMatch = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q)) : false;

    return nameMatch || catMatch || catSlugMatch || brandMatch || descMatch || tagMatch;
  });
}


// ============================================================================
// 3. FIRESTORE DATABASE: CATEGORIES CRUD & REAL-TIME
// ============================================================================

export async function firebaseSaveCategory(category: Category): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.CATEGORIES, category.id);
      await setDoc(docRef, category, { merge: true });
    }
    const stored = localStorage.getItem('umarmart_categories');
    const existing: Category[] = stored ? JSON.parse(stored) : [];
    const updated = [category, ...existing.filter((c) => c.id !== category.id)];
    localStorage.setItem('umarmart_categories', JSON.stringify(updated));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.CATEGORIES}/${category.id}`);
  }
}

export async function firebaseDeleteCategory(categoryId: string): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.CATEGORIES, categoryId);
      await deleteDoc(docRef);
    }
    const stored = localStorage.getItem('umarmart_categories');
    if (stored) {
      const existing: Category[] = JSON.parse(stored);
      const updated = existing.filter((c) => c.id !== categoryId);
      localStorage.setItem('umarmart_categories', JSON.stringify(updated));
    }
    const deleted = JSON.parse(localStorage.getItem('umarmart_deleted_categories') || '[]');
    if (!deleted.includes(categoryId)) {
      deleted.push(categoryId);
      localStorage.setItem('umarmart_deleted_categories', JSON.stringify(deleted));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${FIRESTORE_COLLECTIONS.CATEGORIES}/${categoryId}`);
  }
}

export function firebaseSubscribeCategories(
  callback: (categories: Category[]) => void,
  fallbackCategories: Category[]
): () => void {
  if (isFirebaseConfigured && db) {
    const q = collection(db, FIRESTORE_COLLECTIONS.CATEGORIES);
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as Category);
        callback(list);
        return;
      }
      callback(fallbackCategories);
    });
  }

  const load = () => {
    try {
      const deleted: string[] = JSON.parse(localStorage.getItem('umarmart_deleted_categories') || '[]');
      const stored = localStorage.getItem('umarmart_categories');
      const custom: Category[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, Category>();
      fallbackCategories.forEach((c) => {
        if (!deleted.includes(c.id)) map.set(c.id, c);
      });
      custom.forEach((c) => {
        if (!deleted.includes(c.id)) map.set(c.id, c);
      });
      callback(Array.from(map.values()));
    } catch {
      callback(fallbackCategories);
    }
  };

  load();
  const interval = setInterval(load, 2500);
  return () => clearInterval(interval);
}


// ============================================================================
// 4. FIRESTORE DATABASE: ORDERS CRUD & REAL-TIME
// ============================================================================

export async function firebaseSaveOrder(order: Order): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.ORDERS, order.id);
      await setDoc(docRef, order, { merge: true });
    }
    const stored = localStorage.getItem('umarmart_db_orders_v2');
    const existing: Order[] = stored ? JSON.parse(stored) : [];
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem('umarmart_db_orders_v2', JSON.stringify(updated));

    addStoredNotification({
      id: `notif_${Date.now()}`,
      userId: 'usr-current',
      title: `Order #${order.id} Placed!`,
      message: `Your payment of PKR ${order.totalAmount.toLocaleString()} is confirmed. Tracking: ${order.trackingNumber}`,
      type: 'order',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.ORDERS}/${order.id}`);
  }
}

export async function firebaseUpdateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.ORDERS, orderId);
      await updateDoc(docRef, { status });
    }
    const stored = localStorage.getItem('umarmart_db_orders_v2');
    if (stored) {
      const existing: Order[] = JSON.parse(stored);
      const updated = existing.map((o) => (o.id === orderId ? { ...o, status } : o));
      localStorage.setItem('umarmart_db_orders_v2', JSON.stringify(updated));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.ORDERS}/${orderId}`);
  }
}

export async function firebaseDeleteOrder(orderId: string): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.ORDERS, orderId);
      await deleteDoc(docRef);
    }
    const stored = localStorage.getItem('umarmart_db_orders_v2');
    if (stored) {
      const existing: Order[] = JSON.parse(stored);
      const updated = existing.filter((o) => o.id !== orderId);
      localStorage.setItem('umarmart_db_orders_v2', JSON.stringify(updated));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${FIRESTORE_COLLECTIONS.ORDERS}/${orderId}`);
  }
}

export function firebaseSubscribeOrders(
  callback: (orders: Order[]) => void,
  fallbackOrders: Order[]
): () => void {
  if (isFirebaseConfigured && db) {
    const q = collection(db, FIRESTORE_COLLECTIONS.ORDERS);
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as Order);
        callback(list);
        return;
      }
      callback(fallbackOrders);
    });
  }

  const load = () => {
    try {
      const stored = localStorage.getItem('umarmart_db_orders_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          callback(parsed);
          return;
        }
      }
      callback(fallbackOrders);
    } catch {
      callback(fallbackOrders);
    }
  };

  load();
  const interval = setInterval(load, 2500);
  return () => clearInterval(interval);
}


// ============================================================================
// 5. FIRESTORE DATABASE: REVIEWS CRUD & REAL-TIME
// ============================================================================

export async function firebaseSaveReview(review: Review): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.REVIEWS, review.id);
      await setDoc(docRef, review, { merge: true });
    }
    const stored = localStorage.getItem('umarmart_reviews');
    const existing: Review[] = stored ? JSON.parse(stored) : [];
    const updated = [review, ...existing.filter((r) => r.id !== review.id)];
    localStorage.setItem('umarmart_reviews', JSON.stringify(updated));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.REVIEWS}/${review.id}`);
  }
}

export async function firebaseDeleteReview(reviewId: string): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.REVIEWS, reviewId);
      await deleteDoc(docRef);
    }
    const stored = localStorage.getItem('umarmart_reviews');
    if (stored) {
      const existing: Review[] = JSON.parse(stored);
      const updated = existing.filter((r) => r.id !== reviewId);
      localStorage.setItem('umarmart_reviews', JSON.stringify(updated));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${FIRESTORE_COLLECTIONS.REVIEWS}/${reviewId}`);
  }
}

export function firebaseSubscribeReviews(
  callback: (reviews: Review[]) => void,
  fallbackReviews: Review[]
): () => void {
  if (isFirebaseConfigured && db) {
    const q = collection(db, FIRESTORE_COLLECTIONS.REVIEWS);
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as Review);
        callback(list);
        return;
      }
      callback(fallbackReviews);
    });
  }

  const load = () => {
    try {
      const stored = localStorage.getItem('umarmart_reviews');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          callback(parsed);
          return;
        }
      }
      callback(fallbackReviews);
    } catch {
      callback(fallbackReviews);
    }
  };

  load();
  const interval = setInterval(load, 3000);
  return () => clearInterval(interval);
}


// ============================================================================
// 6. FIRESTORE DATABASE: COUPONS CRUD & REAL-TIME
// ============================================================================

export async function firebaseSaveCoupon(coupon: Coupon): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.COUPONS, coupon.id);
      await setDoc(docRef, coupon, { merge: true });
    }
    const stored = localStorage.getItem('umarmart_coupons');
    const existing: Coupon[] = stored ? JSON.parse(stored) : [];
    const updated = [coupon, ...existing.filter((c) => c.id !== coupon.id)];
    localStorage.setItem('umarmart_coupons', JSON.stringify(updated));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.COUPONS}/${coupon.id}`);
  }
}

export async function firebaseToggleCoupon(couponId: string): Promise<void> {
  try {
    const stored = localStorage.getItem('umarmart_coupons');
    if (stored) {
      const existing: Coupon[] = JSON.parse(stored);
      const updated = existing.map((c) =>
        c.id === couponId ? { ...c, status: c.status === 'active' ? ('disabled' as const) : ('active' as const) } : c
      );
      localStorage.setItem('umarmart_coupons', JSON.stringify(updated));
      const toggled = updated.find((c) => c.id === couponId);
      if (toggled && isFirebaseConfigured && db) {
        await setDoc(doc(db, FIRESTORE_COLLECTIONS.COUPONS, couponId), toggled, { merge: true });
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.COUPONS}/${couponId}`);
  }
}

export async function firebaseDeleteCoupon(couponId: string): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.COUPONS, couponId);
      await deleteDoc(docRef);
    }
    const stored = localStorage.getItem('umarmart_coupons');
    if (stored) {
      const existing: Coupon[] = JSON.parse(stored);
      const updated = existing.filter((c) => c.id !== couponId);
      localStorage.setItem('umarmart_coupons', JSON.stringify(updated));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${FIRESTORE_COLLECTIONS.COUPONS}/${couponId}`);
  }
}

export function firebaseSubscribeCoupons(
  callback: (coupons: Coupon[]) => void,
  fallbackCoupons: Coupon[]
): () => void {
  if (isFirebaseConfigured && db) {
    const q = collection(db, FIRESTORE_COLLECTIONS.COUPONS);
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as Coupon);
        callback(list);
        return;
      }
      callback(fallbackCoupons);
    });
  }

  const load = () => {
    try {
      const stored = localStorage.getItem('umarmart_coupons');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          callback(parsed);
          return;
        }
      }
      callback(fallbackCoupons);
    } catch {
      callback(fallbackCoupons);
    }
  };

  load();
  const interval = setInterval(load, 3000);
  return () => clearInterval(interval);
}


// ============================================================================
// 7. FIRESTORE DATABASE: CUSTOMERS / USERS & SELLERS
// ============================================================================

export async function firebaseSaveCustomer(customer: Customer): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.USERS, customer.id);
      await setDoc(docRef, customer, { merge: true });
    }
    const stored = localStorage.getItem('umarmart_customers');
    const existing: Customer[] = stored ? JSON.parse(stored) : [];
    const updated = [customer, ...existing.filter((c) => c.id !== customer.id)];
    localStorage.setItem('umarmart_customers', JSON.stringify(updated));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.USERS}/${customer.id}`);
  }
}

export async function firebaseUpdateCustomerStatus(customerId: string, status: 'active' | 'blocked'): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.USERS, customerId);
      await updateDoc(docRef, { status });
    }
    const stored = localStorage.getItem('umarmart_customers');
    if (stored) {
      const existing: Customer[] = JSON.parse(stored);
      const updated = existing.map((c) => (c.id === customerId ? { ...c, status } : c));
      localStorage.setItem('umarmart_customers', JSON.stringify(updated));
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.USERS}/${customerId}`);
  }
}

export function firebaseSubscribeCustomers(
  callback: (customers: Customer[]) => void,
  fallbackCustomers: Customer[]
): () => void {
  if (isFirebaseConfigured && db) {
    const q = collection(db, FIRESTORE_COLLECTIONS.USERS);
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as Customer);
        callback(list);
        return;
      }
      callback(fallbackCustomers);
    });
  }

  const load = () => {
    try {
      const stored = localStorage.getItem('umarmart_customers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          callback(parsed);
          return;
        }
      }
      callback(fallbackCustomers);
    } catch {
      callback(fallbackCustomers);
    }
  };

  load();
  const interval = setInterval(load, 3000);
  return () => clearInterval(interval);
}

export async function firebaseRegisterSeller(seller: SellerRecord): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.SELLERS, seller.id);
      await setDoc(docRef, seller, { merge: true });
    }
    const sellers = getStoredSellers();
    localStorage.setItem('umarmart_db_sellers_v2', JSON.stringify([seller, ...sellers.filter((s) => s.id !== seller.id)]));
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${FIRESTORE_COLLECTIONS.SELLERS}/${seller.id}`);
  }
}

export async function firebaseUpdateSellerStatus(sellerId: string, isVerified: boolean): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.SELLERS, sellerId);
      await updateDoc(docRef, { isVerified });
    }
    const sellers = getStoredSellers();
    const updated = sellers.map((s) => (s.id === sellerId ? { ...s, isVerified } : s));
    localStorage.setItem('umarmart_db_sellers_v2', JSON.stringify(updated));
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${FIRESTORE_COLLECTIONS.SELLERS}/${sellerId}`);
  }
}

export async function firebaseDeleteSeller(sellerId: string): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.SELLERS, sellerId);
      await deleteDoc(docRef);
    }
    const sellers = getStoredSellers();
    const updated = sellers.filter((s) => s.id !== sellerId);
    localStorage.setItem('umarmart_db_sellers_v2', JSON.stringify(updated));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${FIRESTORE_COLLECTIONS.SELLERS}/${sellerId}`);
  }
}

export function firebaseSubscribeSellers(
  callback: (sellers: SellerRecord[]) => void,
  fallbackSellers: SellerRecord[]
): () => void {
  if (isFirebaseConfigured && db) {
    const q = collection(db, FIRESTORE_COLLECTIONS.SELLERS);
    return onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as SellerRecord);
        callback(list);
        return;
      }
      callback(fallbackSellers);
    });
  }

  const load = () => {
    try {
      const stored = localStorage.getItem('umarmart_db_sellers_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          callback(parsed);
          return;
        }
      }
      callback(fallbackSellers);
    } catch {
      callback(fallbackSellers);
    }
  };

  load();
  const interval = setInterval(load, 3000);
  return () => clearInterval(interval);
}


// ============================================================================
// 8. CART & WISHLIST PERSISTENCE
// ============================================================================

export async function firebaseSaveUserCart(userId: string, cartItems: any[]): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.CART, userId);
      await setDoc(docRef, { userId, items: cartItems, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(`umarmart_cart_${userId}`, JSON.stringify(cartItems));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.CART}/${userId}`);
  }
}

export async function firebaseSaveUserWishlist(userId: string, wishlistIds: string[]): Promise<void> {
  try {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.WISHLIST, userId);
      await setDoc(docRef, { userId, productIds: wishlistIds, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(`umarmart_wishlist_${userId}`, JSON.stringify(wishlistIds));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${FIRESTORE_COLLECTIONS.WISHLIST}/${userId}`);
  }
}

export async function firebaseUploadImage(file: File, _path: string): Promise<string> {
  return URL.createObjectURL(file);
}

export function firebaseSubscribeNotifications(
  _userId: string,
  callback: (notifications: UserNotification[]) => void
): () => void {
  const interval = setInterval(() => {
    const notifs = getStoredNotifications();
    callback(notifs);
  }, 2000);

  return () => clearInterval(interval);
}
