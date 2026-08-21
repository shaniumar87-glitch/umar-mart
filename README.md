# UmarMart Pakistan — Enterprise E-Commerce Platform

![UmarMart E-Commerce Platform](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200)

**UmarMart** is a full-featured, real-world, enterprise-grade e-commerce marketplace tailored specifically for Pakistan's e-commerce ecosystem. It features multi-role authentication, live auction bidding, digital product downloads, Pakistani currency & local payment gateways (EasyPaisa, JazzCash, Cash on Delivery, Bank Transfer, Visa/Mastercard), multi-warehouse seller portals, admin analytics dashboards, and Progressive Web App (PWA) offline capabilities.

---

## 🌟 Key Features

### 1. 🔐 Multi-Role Authentication & Security
- **Customer, Vendor & Admin Roles**: Complete role-based access control (RBAC).
- **Authentication Workflows**: Sign Up, Sign In, Forgot Password, Email Verification, and SMS OTP verification.
- **Two-Factor Authentication (2FA)**: High-security account protection.
- **Active Device Management**: View active login locations, IP addresses, and revoke active sessions.

### 2. 🛍️ Storefront & Customer Experience
- **Interactive Product Showcase**: Rich product card view with color/size variant pickers, stock counters, discount badges, and image galleries.
- **Multi-Currency Converter**: Real-time switching between PKR (Rs.), USD ($), EUR (€), and GBP (£).
- **Smart Search & Filters**: Search by title, brand, price slider, stock availability, and category.
- **AI Chatbot Support & Visual Search**: AI shopping assistant powered by Gemini API, and visual camera image search upload.
- **Live Auctions & Bidding**: Bid on exclusive flash items with real-time countdown timers and highest-bidder logs.
- **Digital Downloads Marketplace**: Buy and download software, e-books, and courses instantly with license key management.

### 3. 💳 Multi-Channel Checkout & Invoicing
- **Local Pakistani Payments**: Integrated Cash on Delivery (COD), EasyPaisa, JazzCash, direct Bank Transfer, and Credit/Debit cards.
- **TCS & Leopard Courier Live Tracking**: Real-time order progress map and status timeline.
- **Printable Invoices & Receipts**: Downloadable PDF-ready order receipts with itemized tax and courier calculations.

### 4. 🏬 Seller & Vendor Panel
- **Store Onboarding & Verification**: Vendor registration with CNIC verification, IBAN bank account linking, and subscription plan selection (Free, Basic, Pro, Enterprise).
- **Inventory & Order Management**: Stock level tracking, variant creation, order fulfillment status updates, and payout history.
- **Revenue Analytics**: Visual sales reports, commission calculators, and store performance ratings.

### 5. 🛠️ Admin Dashboard & System Settings
- **Platform Analytics**: Total revenue graphs, customer growth charts, category distribution, and order metrics.
- **User & Vendor Management**: Approve/suspend seller accounts, manage customer reward points, and view customer order histories.
- **Database Backup & Restore**: One-click encrypted JSON backup export and schema restore utility.
- **Maintenance Mode & Broadcast Banners**: Control site-wide announcement banners and maintenance modes.

### 6. 📱 PWA & Offline Support
- **Mobile First Responsive Design**: Desktop-first precision with mobile-first Tailwind CSS execution.
- **PWA Installation**: Install as a standalone native app on Android, iOS, Windows, and macOS.
- **Offline Cache**: Browse saved products, view cart items, and read order histories even when offline.

---

## 📁 Architecture & File Structure

```text
/
├── src/
│   ├── components/            # Modular React components
│   │   ├── AdminDashboardModal.tsx   # Admin control panel & backup system
│   │   ├── AIChatWidget.tsx           # AI shopping assistant
│   │   ├── AuctionBiddingModal.tsx   # Live bidding & auction system
│   │   ├── AuthModal.tsx              # Sign In / Sign Up / OTP / Reset modal
│   │   ├── CartDrawer.tsx             # Slide-over shopping cart & discounts
│   │   ├── CheckoutModal.tsx         # Multi-step checkout & payment gateways
│   │   ├── DigitalMarketplaceSection.tsx # Software & e-books section
│   │   ├── ErrorBoundary.tsx         # Runtime error recovery & 500 page
│   │   ├── OrderTrackingModal.tsx    # Live courier tracking timeline
│   │   ├── PWAInstallBanner.tsx      # App installation banner & offline alert
│   │   ├── ProductCard.tsx           # High-performance product card
│   │   ├── ProductModal.tsx          # Detailed product view & reviews
│   │   ├── SellerRegistrationModal.tsx# Vendor portal & store manager
│   │   ├── UserProfileModal.tsx      # User profile, 2FA, address book & orders
│   │   └── ...                       # Additional UI components
│   ├── data/
│   │   └── mockData.ts        # Initial product catalog & category definitions
│   ├── lib/
│   │   ├── dbSchema.ts        # Database schemas, JSON backup & storage functions
│   │   ├── firebase.ts        # Firebase Firestore & Auth client utilities
│   │   └── formatters.ts      # Currency formatting & mathematical helper logic
│   ├── types.ts               # Global TypeScript definitions
│   ├── App.tsx                # Main app entry point & global layout manager
│   └── main.tsx               # React DOM root entry
├── firebase-blueprint.json    # Firestore collection definitions
├── firestore.rules            # Firestore security rules
├── metadata.json              # Applet configuration & metadata
└── package.json               # Dependencies & build scripts
```

---

## ⚙️ Technical Requirements & Setup

### Environment Variables
Configure environment variables in `.env`:
```env
# Server-side Gemini API key for AI assistant
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation & Build
```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Lint codebase for TypeScript & syntax compliance
npm run lint

# Build production bundle
npm run build
```

---

## 🔒 Security & Privacy Compliance
- **Firestore Security Rules**: Strict row-level security for user accounts, seller records, and order transactions in `firestore.rules`.
- **API Key Security**: Server-side Gemini API routing; secret keys are never exposed to client browsers.
- **XSS & Input Sanitization**: Form validation across authentication, address book, and checkout views.

---

## 📄 License
Commercial License © UmarMart Pakistan. All rights reserved.
