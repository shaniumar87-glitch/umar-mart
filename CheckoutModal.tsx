import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  Lock,
  ArrowRight,
  PackageCheck,
  Building2,
  Copy,
  Check,
  Smartphone,
  Banknote,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { CartItem, Currency, Order } from '../types';
import { formatPrice } from '../lib/formatters';

export const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Quetta',
  'Multan',
  'Hyderabad',
  'Sialkot',
  'Gujranwala',
  'Bahawalpur',
  'Sukkur',
  'Mardan',
  'Abbottabad',
  'Other City (Pakistan)'
];

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  appliedDiscount: number;
  discountCode: string;
  onClearCart: () => void;
  onOrderSuccess?: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  appliedDiscount,
  discountCode,
  onClearCart,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  // Form Fields
  const [fullName, setFullName] = useState('Umar Farooq');
  const [email, setEmail] = useState('shaniumar87@gmail.com');
  const [address, setAddress] = useState('House 45, Block 4, Clifton');
  const [city, setCity] = useState('Karachi');
  const [country, setCountry] = useState('Pakistan');
  const [paymentMethod, setPaymentMethod] = useState<
    'easypaisa' | 'jazzcash' | 'meezan' | 'hbl' | 'cod' | 'card'
  >('easypaisa');
  const [pakMobileNumber, setPakMobileNumber] = useState('03152643791');
  const [bankTrxRef, setBankTrxRef] = useState('TRX-' + Math.floor(10000000 + Math.random() * 90000000));
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleCopyText = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulateVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1000);
  };

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost = subtotal >= 2999 || subtotal === 0 ? 0 : 250;
  const grandTotal = Math.max(0, subtotal - appliedDiscount + shippingCost);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = 'UM-' + Math.floor(100000 + Math.random() * 900000);
    setTrackingId(generatedId);

    let formattedPaymentMethod = 'Cash on Delivery (COD)';
    if (paymentMethod === 'easypaisa') {
      formattedPaymentMethod = `EasyPaisa Mobile Wallet (${pakMobileNumber})`;
    } else if (paymentMethod === 'jazzcash') {
      formattedPaymentMethod = `JazzCash Mobile Wallet (${pakMobileNumber})`;
    } else if (paymentMethod === 'meezan') {
      formattedPaymentMethod = `Meezan Bank IBFT (Ref: ${bankTrxRef})`;
    } else if (paymentMethod === 'hbl') {
      formattedPaymentMethod = `HBL Habib Bank IBFT (Ref: ${bankTrxRef})`;
    } else if (paymentMethod === 'card') {
      formattedPaymentMethod = 'Credit / Debit Card (Visa/PayPak)';
    }

    const newOrder: Order = {
      id: 'ord-' + Math.floor(10000 + Math.random() * 90000),
      trackingNumber: generatedId,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        image: i.product.image,
        price: i.product.price,
        quantity: i.quantity,
        selectedColor: i.selectedColor,
        selectedSize: i.selectedSize,
      })),
      totalAmount: grandTotal,
      shippingAddress: `${address}, ${city}, ${country}`,
      paymentMethod: formattedPaymentMethod,
      estimatedDelivery: '2-5 Working Days (TCS / Leopard)',
    };

    if (onOrderSuccess) {
      onOrderSuccess(newOrder);
    }

    setStep('confirmation');
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 my-8 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">UmarMart Checkout</h3>
              <p className="text-[11px] text-slate-500">Secure 256-Bit Encrypted Order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step !== 'confirmation' && (
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-200 pb-4">
            <div className={`flex items-center space-x-2 ${step === 'details' ? 'text-blue-600' : 'text-emerald-600'}`}>
              <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px]">1</span>
              <span>Shipping</span>
            </div>
            <div className="h-0.5 flex-1 bg-slate-200 mx-4" />
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-blue-600' : 'text-slate-400'}`}>
              <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px]">2</span>
              <span>Payment</span>
            </div>
          </div>
        )}

        {/* Step 1: Shipping Details */}
        {step === 'details' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep('payment');
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shipping Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City (Pakistan)</label>
                <select
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  {PAKISTANI_CITIES.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  readOnly
                  value="Pakistan"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping Fee (TCS / Leopard)</span>
                <span className={`font-bold ${shippingCost === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {shippingCost === 0 ? 'FREE (Orders over Rs. 2,999)' : formatPrice(shippingCost, currency)}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher Discount</span>
                  <span>-{formatPrice(appliedDiscount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Due</span>
                <span className="text-blue-600">{formatPrice(grandTotal, currency)}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-blue-700 pt-1 font-semibold">
                <Truck className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                <span>Delivery Time: 2-5 Working Days across Pakistan</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 text-sm transition-all"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Payment Selection */}
        {step === 'payment' && (
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Select Payment Method</label>

              {/* EasyPaisa Option */}
              <div
                onClick={() => {
                  setPaymentMethod('easypaisa');
                  setIsVerified(false);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'easypaisa'
                    ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                    EP
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      EasyPaisa Mobile Wallet
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold">Popular PK</span>
                    </h5>
                    <p className="text-[10px] text-slate-500">Telenor Microfinance Bank direct mobile prompt</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'easypaisa'} readOnly className="accent-emerald-600" />
              </div>

              {/* JazzCash Option */}
              <div
                onClick={() => {
                  setPaymentMethod('jazzcash');
                  setIsVerified(false);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'jazzcash'
                    ? 'bg-rose-50 border-rose-600 ring-1 ring-rose-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                    JC
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      JazzCash Mobile Wallet
                      <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-md font-bold">Mobilink</span>
                    </h5>
                    <p className="text-[10px] text-slate-500">Instant MPIN payment prompt or till transaction</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'jazzcash'} readOnly className="accent-rose-600" />
              </div>

              {/* Meezan Bank Option */}
              <div
                onClick={() => setPaymentMethod('meezan')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'meezan'
                    ? 'bg-emerald-50 border-emerald-700 ring-1 ring-emerald-600'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 font-black text-[10px] flex items-center justify-center shrink-0 shadow-sm border border-emerald-900">
                    MBL
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      Meezan Bank (Bank Transfer / IBFT)
                      <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded-md font-bold">Premier Islamic Bank</span>
                    </h5>
                    <p className="text-[10px] text-slate-500">Direct online account transfer / 1-Tap IBFT</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'meezan'} readOnly className="accent-emerald-700" />
              </div>

              {/* HBL Bank Option */}
              <div
                onClick={() => setPaymentMethod('hbl')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'hbl'
                    ? 'bg-emerald-50 border-teal-600 ring-1 ring-teal-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-700 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-sm">
                    HBL
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      HBL - Habib Bank Limited
                      <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-md font-bold">Largest Bank</span>
                    </h5>
                    <p className="text-[10px] text-slate-500">Transfer via HBL Mobile App, Konnect or ATM</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'hbl'} readOnly className="accent-teal-600" />
              </div>

              {/* Cash on Delivery Option */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-sm">
                    COD
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      Cash on Delivery (Nationwide Pakistan)
                      <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md font-bold">100% Available</span>
                    </h5>
                    <p className="text-[10px] text-slate-500">Pay cash upon delivery in Karachi, Lahore, Isb, & all cities</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'cod'} readOnly className="accent-blue-600" />
              </div>

              {/* Credit Card Option */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-slate-100 border-slate-600 ring-1 ring-slate-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-slate-700 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Credit / Debit Card (PayPak, Visa, Mastercard)</h5>
                    <p className="text-[10px] text-slate-500">256-Bit SSL Encrypted International Gateway</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'card'} readOnly className="accent-slate-700" />
              </div>
            </div>

            {/* EasyPaisa Interactive Panel */}
            {paymentMethod === 'easypaisa' && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-emerald-900">
                    EasyPaisa Registered Mobile Number
                  </label>
                  <span className="text-[10px] text-emerald-700 font-semibold">Telenor Microfinance</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    required
                    value={pakMobileNumber}
                    onChange={(e) => setPakMobileNumber(e.target.value)}
                    placeholder="0315 2643791"
                    className="flex-1 bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSimulateVerification}
                    disabled={isVerifying}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1 transition-all"
                  >
                    {isVerifying ? (
                      <span>Pushing Prompt...</span>
                    ) : isVerified ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Prompt Sent ✓</span>
                      </>
                    ) : (
                      <span>Send Push Prompt</span>
                    )}
                  </button>
                </div>
                {isVerified && (
                  <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-[11px] text-emerald-900 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>EasyPaisa payment prompt sent to {pakMobileNumber}. Approve on your phone or confirm below!</span>
                  </div>
                )}
                <p className="text-[10px] text-emerald-800">
                  Enter your 11-digit EasyPaisa account number. You will receive an instant approval pop-up on your smartphone.
                </p>
              </div>
            )}

            {/* JazzCash Interactive Panel */}
            {paymentMethod === 'jazzcash' && (
              <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-rose-900">
                    JazzCash Registered Mobile Number
                  </label>
                  <span className="text-[10px] text-rose-700 font-semibold">Mobilink Bank</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    required
                    value={pakMobileNumber}
                    onChange={(e) => setPakMobileNumber(e.target.value)}
                    placeholder="0300 1234567"
                    className="flex-1 bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-600 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSimulateVerification}
                    disabled={isVerifying}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1 transition-all"
                  >
                    {isVerifying ? (
                      <span>Verifying...</span>
                    ) : isVerified ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>MPIN Prompt Sent ✓</span>
                      </>
                    ) : (
                      <span>Send MPIN Prompt</span>
                    )}
                  </button>
                </div>
                {isVerified && (
                  <div className="p-2.5 bg-rose-100 border border-rose-300 rounded-xl text-[11px] text-rose-900 flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>JazzCash MPIN prompt initialized on {pakMobileNumber}. Enter your 4-digit MPIN on mobile screen.</span>
                  </div>
                )}
                <p className="text-[10px] text-rose-800">
                  Enter your 11-digit JazzCash mobile wallet number to approve payment instantly.
                </p>
              </div>
            )}

            {/* Meezan Bank Interactive Panel */}
            {paymentMethod === 'meezan' && (
              <div className="p-4 bg-emerald-50/90 border border-emerald-300 rounded-2xl space-y-3 text-xs text-slate-800">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-emerald-800" />
                    <span className="font-bold text-emerald-950">Meezan Bank Account Details</span>
                  </div>
                  <span className="bg-emerald-800 text-amber-300 text-[9px] font-extrabold px-2 py-0.5 rounded">
                    ISLAMIC BANKING
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">Account Title</span>
                    <strong className="text-slate-900 font-bold block">UmarMart Private Limited</strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">Branch & Code</span>
                    <strong className="text-slate-900 font-bold block">Clifton Block 4, KHI (Code: 0102)</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Account Number</span>
                    <strong className="font-mono text-xs font-black text-slate-900">01020104889211</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('01020104889211', 'meezan_acc')}
                    className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                  >
                    {copiedField === 'meezan_acc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'meezan_acc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">IBAN Number (for 1-Tap IBFT)</span>
                    <strong className="font-mono text-xs font-black text-slate-900">PK36 MEZN 0001 0201 0488 9211</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('PK36MEZN0001020104889211', 'meezan_iban')}
                    className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                  >
                    {copiedField === 'meezan_iban' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'meezan_iban' ? 'Copied' : 'Copy IBAN'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bank Transfer Reference / TRX ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={bankTrxRef}
                    onChange={(e) => setBankTrxRef(e.target.value)}
                    placeholder="e.g. TRX-82019482 or Deposit Slip #"
                    className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* HBL Bank Interactive Panel */}
            {paymentMethod === 'hbl' && (
              <div className="p-4 bg-teal-50/90 border border-teal-300 rounded-2xl space-y-3 text-xs text-slate-800">
                <div className="flex items-center justify-between border-b border-teal-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-teal-800" />
                    <span className="font-bold text-teal-950">Habib Bank Limited (HBL) Account Details</span>
                  </div>
                  <span className="bg-teal-700 text-white text-[9px] font-extrabold px-2 py-0.5 rounded">
                    PAKISTAN'S LARGEST BANK
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-teal-200 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">Account Title</span>
                    <strong className="text-slate-900 font-bold block">UmarMart Pakistan Ltd</strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-teal-200 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">Branch & Code</span>
                    <strong className="text-slate-900 font-bold block">Gulberg Main Market, LHR (Code: 0021)</strong>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-teal-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Account Number</span>
                    <strong className="font-mono text-xs font-black text-slate-900">0021948102948211</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('0021948102948211', 'hbl_acc')}
                    className="px-2.5 py-1 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                  >
                    {copiedField === 'hbl_acc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'hbl_acc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-teal-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">IBAN Number (HBL Mobile / Konnect)</span>
                    <strong className="font-mono text-xs font-black text-slate-900">PK82 HABB 0002 1948 1029 4821</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('PK82HABB0002194810294821', 'hbl_iban')}
                    className="px-2.5 py-1 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-lg text-[11px] font-bold flex items-center space-x-1"
                  >
                    {copiedField === 'hbl_iban' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'hbl_iban' ? 'Copied' : 'Copy IBAN'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bank Transfer Reference / TRX ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={bankTrxRef}
                    onChange={(e) => setBankTrxRef(e.target.value)}
                    placeholder="e.g. TRX-90182412 or Deposit Slip #"
                    className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-teal-600 shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Cash on Delivery Panel */}
            {paymentMethod === 'cod' && (
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2 text-xs text-blue-900">
                <div className="flex items-center space-x-2 font-black text-sm text-blue-950">
                  <Banknote className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Nationwide Cash on Delivery (COD)</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Available in <strong>150+ Pakistani cities & towns</strong> including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Quetta, Multan, Hyderabad, Sialkot, and Gujranwala.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-bold text-blue-900">
                  <div className="bg-white/80 p-2 rounded-xl border border-blue-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>0 Advance Payment</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-blue-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Inspect Parcel Before Paying</span>
                  </div>
                </div>
              </div>
            )}

            {/* Credit Card Panel */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <input
                  type="text"
                  placeholder="Card Number: 4532 •••• •••• 8821"
                  defaultValue="4532 9182 3042 8821"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="08/29"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <input
                    type="password"
                    placeholder="CVV: ***"
                    defaultValue="892"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 text-sm transition-all"
            >
              <PackageCheck className="w-5 h-5" />
              <span>Confirm & Pay {formatPrice(grandTotal, currency)}</span>
            </button>
          </form>
        )}

        {/* Step 3: Confirmation Screen */}
        {step === 'confirmation' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Payment Successful
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Order Confirmed!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Thank you, <strong className="text-slate-900">{fullName}</strong>! We sent your order receipt to <span className="text-blue-600 font-semibold">{email}</span>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Tracking Number:</span>
                <span className="font-mono font-bold text-slate-900">{trackingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-bold text-emerald-700 truncate max-w-[200px]">
                  {paymentMethod === 'easypaisa'
                    ? `EasyPaisa (${pakMobileNumber})`
                    : paymentMethod === 'jazzcash'
                    ? `JazzCash (${pakMobileNumber})`
                    : paymentMethod === 'meezan'
                    ? 'Meezan Bank IBFT'
                    : paymentMethod === 'hbl'
                    ? 'HBL Habib Bank IBFT'
                    : paymentMethod === 'card'
                    ? 'Credit / Debit Card'
                    : 'Cash on Delivery (COD)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="font-bold text-slate-900">2-5 Working Days (TCS / Leopard)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="text-slate-700 truncate max-w-[200px]">{address}, {city}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full shadow-md shadow-blue-600/20 text-xs"
            >
              Back to UmarMart Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
