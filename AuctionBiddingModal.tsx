import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Gavel,
  Clock,
  Flame,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  UserCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/formatters';

interface AuctionBiddingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onShowToast: (msg: string) => void;
}

interface AuctionItem {
  id: string;
  title: string;
  category: string;
  image: string;
  currentBid: number;
  startingBid: number;
  minIncrement: number;
  endTimeSeconds: number;
  totalBids: number;
  topBidder: string;
  bidsHistory: { bidder: string; amount: number; time: string }[];
}

const INITIAL_AUCTION_ITEMS: AuctionItem[] = [
  {
    id: 'auc-1',
    title: 'Apple iPhone 16 Pro Max 1TB - Desert Titanium (PTA Approved)',
    category: 'Mobiles & Tech',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    currentBid: 485000,
    startingBid: 350000,
    minIncrement: 5000,
    endTimeSeconds: 3820, // ~1 hr 3 mins
    totalBids: 24,
    topBidder: 'Kamran_Lahore',
    bidsHistory: [
      { bidder: 'Kamran_Lahore', amount: 485000, time: '2 mins ago' },
      { bidder: 'Tariq_Karachi', amount: 480000, time: '8 mins ago' },
      { bidder: 'Shani_Rawalpindi', amount: 470000, time: '15 mins ago' },
    ],
  },
  {
    id: 'auc-2',
    title: 'Rolex Submariner Date Luxury Steel Watch (Authentic certified)',
    category: 'Luxury Watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    currentBid: 2850000,
    startingBid: 2000000,
    minIncrement: 25000,
    endTimeSeconds: 7420,
    totalBids: 41,
    topBidder: 'Usman_Islamabad',
    bidsHistory: [
      { bidder: 'Usman_Islamabad', amount: 2850000, time: '5 mins ago' },
      { bidder: 'Bilal_Quetta', amount: 2825000, time: '12 mins ago' },
      { bidder: 'Hamza_Peshawar', amount: 2800000, time: '20 mins ago' },
    ],
  },
  {
    id: 'auc-3',
    title: 'Custom RTX 4090 Intel i9 14900K Liquid Cooled Beast Rig',
    category: 'Gaming Computers',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
    currentBid: 920000,
    startingBid: 750000,
    minIncrement: 10000,
    endTimeSeconds: 1850,
    totalBids: 18,
    topBidder: 'Zain_Faisalabad',
    bidsHistory: [
      { bidder: 'Zain_Faisalabad', amount: 920000, time: '1 min ago' },
      { bidder: 'Ali_Multan', amount: 910000, time: '10 mins ago' },
    ],
  },
];

export const AuctionBiddingModal: React.FC<AuctionBiddingModalProps> = ({
  isOpen,
  onClose,
  currency,
  onShowToast,
}) => {
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>(INITIAL_AUCTION_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState<string>(INITIAL_AUCTION_ITEMS[0].id);
  const [bidInput, setBidInput] = useState<number>(0);

  const selectedItem = auctionItems.find((i) => i.id === selectedItemId) || auctionItems[0];

  useEffect(() => {
    if (selectedItem) {
      setBidInput(selectedItem.currentBid + selectedItem.minIncrement);
    }
  }, [selectedItemId, selectedItem?.currentBid]);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setAuctionItems((prev) =>
        prev.map((item) => ({
          ...item,
          endTimeSeconds: item.endTimeSeconds > 0 ? item.endTimeSeconds - 1 : 0,
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidInput <= selectedItem.currentBid) {
      onShowToast(`Bid must be greater than current bid ${formatPrice(selectedItem.currentBid, currency)}`);
      return;
    }

    const updatedItem: AuctionItem = {
      ...selectedItem,
      currentBid: bidInput,
      totalBids: selectedItem.totalBids + 1,
      topBidder: 'You (Verified Customer)',
      bidsHistory: [
        { bidder: 'You (Verified Customer)', amount: bidInput, time: 'Just now' },
        ...selectedItem.bidsHistory,
      ],
    };

    setAuctionItems((prev) => prev.map((item) => (item.id === selectedItem.id ? updatedItem : item)));
    onShowToast(`🔥 Outstanding! Your bid of ${formatPrice(bidInput, currency)} was placed successfully!`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-slate-900 my-8 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                <Gavel className="w-3.5 h-3.5 text-rose-600" />
                <span>Live Pakistan Auctions & Bidding Hub</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                UmarMart Exclusive Bidding Arena
              </h3>
            </div>

            <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AI Fraud Protected & PTA Verified Lots</span>
            </div>
          </div>

          {/* Auction Lots Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {auctionItems.map((item) => {
              const isSelected = item.id === selectedItemId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-xl shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-slate-900 text-xs truncate">{item.title}</h5>
                    <div className="flex items-center justify-between text-[11px] mt-0.5">
                      <span className="font-black text-blue-600">{formatPrice(item.currentBid, currency)}</span>
                      <span className="text-rose-600 font-extrabold font-mono text-[10px] flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {formatTimer(item.endTimeSeconds)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Item Details & Bidding Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 border border-slate-200 p-5 rounded-3xl">
            {/* Left Image & Stats */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white font-mono font-black text-xs px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>Ends: {formatTimer(selectedItem.endTimeSeconds)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white border border-slate-200 p-3 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Starting Price</div>
                  <div className="font-extrabold text-slate-700">{formatPrice(selectedItem.startingBid, currency)}</div>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Bids Placed</div>
                  <div className="font-black text-blue-600">{selectedItem.totalBids} Bids</div>
                </div>
              </div>
            </div>

            {/* Right Bidding Action Box */}
            <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {selectedItem.category}
                </div>
                <h4 className="text-lg font-black text-slate-900 leading-snug">
                  {selectedItem.title}
                </h4>

                <div className="bg-white border border-blue-200 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Current Highest Bid
                    </span>
                    <span className="text-2xl font-black text-blue-600">
                      {formatPrice(selectedItem.currentBid, currency)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Top Bidder
                    </span>
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {selectedItem.topBidder}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bidding Form */}
              <form onSubmit={handlePlaceBid} className="space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Enter Your Bid Amount:</span>
                  <span className="text-slate-400 text-[10px]">
                    Min Step: +{formatPrice(selectedItem.minIncrement, currency)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bidInput}
                    onChange={(e) => setBidInput(Number(e.target.value))}
                    step={selectedItem.minIncrement}
                    min={selectedItem.currentBid + selectedItem.minIncrement}
                    className="flex-1 bg-white border border-slate-300 rounded-2xl px-4 py-3 text-sm font-mono font-black text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition-all shadow-md shadow-blue-600/30 flex items-center space-x-1.5"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Place Bid Now</span>
                  </button>
                </div>
              </form>

              {/* Bids History */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Recent Bidding Activity
                </span>
                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {selectedItem.bidsHistory.map((bh, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 p-2 rounded-xl text-xs flex items-center justify-between"
                    >
                      <span className="font-bold text-slate-800">{bh.bidder}</span>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-black text-blue-600">
                          {formatPrice(bh.amount, currency)}
                        </span>
                        <span className="text-[10px] text-slate-400">{bh.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
