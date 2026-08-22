import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Gift,
  Trophy,
  Copy,
  Check,
  CheckCircle2,
  Zap,
  RotateCw
} from 'lucide-react';
import { Currency } from '../types';

interface SpinWinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

const PRIZES = [
  { label: '10% OFF', code: 'SPIN10', color: 'bg-blue-600 text-white' },
  { label: 'PKR 500 OFF', code: 'UMAR500', color: 'bg-emerald-600 text-white' },
  { label: 'FREE SHIPPING', code: 'FREESHIP', color: 'bg-indigo-600 text-white' },
  { label: '15% OFF', code: 'SPIN15', color: 'bg-amber-500 text-white' },
  { label: 'PKR 1000 OFF', code: 'VIP1000', color: 'bg-rose-600 text-white' },
  { label: '20% OFF', code: 'SUPER20', color: 'bg-purple-600 text-white' },
];

export const SpinWinModal: React.FC<SpinWinModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [wonPrize, setWonPrize] = useState<(typeof PRIZES)[0] | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);
    setCopied(false);

    // Pick a random prize index
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const degreesPerSlice = 360 / PRIZES.length;
    // Extra full 5 spins (1800 deg) plus offset to target prize slice
    const targetDeg = 1800 + (360 - prizeIndex * degreesPerSlice - degreesPerSlice / 2);

    setRotationDegrees(targetDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = PRIZES[prizeIndex];
      setWonPrize(prize);
      onShowToast(`🎉 Congratulations! You won "${prize.label}"! Code: ${prize.code}`);
    }, 3500);
  };

  const handleCopyCode = () => {
    if (!wonPrize) return;
    navigator.clipboard.writeText(wonPrize.code);
    setCopied(true);
    onShowToast(`Copied promo code "${wonPrize.code}" to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-slate-900 my-8 overflow-hidden text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Daily Spin & Win Rewards</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              UmarMart Fortune Wheel
            </h3>
            <p className="text-xs text-slate-500">
              Spin the wheel to unlock exclusive Pakistani shopping vouchers & discounts!
            </p>
          </div>

          {/* Wheel Graphic */}
          <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
            {/* Top Pointer Arrow */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-8 border-r-8 border-t-[16px] border-l-transparent border-r-transparent border-t-rose-600 drop-shadow-md" />

            {/* Rotating Wheel Container */}
            <div
              className="w-full h-full rounded-full border-4 border-amber-400 overflow-hidden shadow-xl relative transition-transform duration-[3500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
              style={{ transform: `rotate(${rotationDegrees}deg)` }}
            >
              {PRIZES.map((prize, idx) => {
                const angle = (360 / PRIZES.length) * idx;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 origin-center flex items-start justify-center pt-4 font-black text-[11px] ${prize.color}`}
                    style={{
                      clipPath: 'polygon(50% 50%, 0% 0%, 100% 0%)',
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    <span className="mt-1 font-bold">{prize.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Center Spin Button Badge */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`absolute z-10 w-16 h-16 rounded-full bg-slate-900 text-amber-400 border-4 border-amber-400 font-black text-xs flex flex-col items-center justify-center shadow-2xl transition-transform ${
                isSpinning ? 'opacity-80 scale-95' : 'hover:scale-110 active:scale-95'
              }`}
            >
              <RotateCw className={`w-4 h-4 mb-0.5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING' : 'SPIN'}</span>
            </button>
          </div>

          {/* Won Prize Result Display */}
          {wonPrize && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-2 text-center"
            >
              <div className="flex items-center justify-center space-x-1 text-emerald-800 font-black text-sm">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>You Won: {wonPrize.label}!</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Use this coupon code at checkout for instant savings:
              </p>
              <div className="flex items-center justify-center space-x-2 pt-1">
                <span className="bg-white border border-emerald-300 font-mono font-black text-slate-900 px-4 py-1.5 rounded-xl text-sm tracking-wider">
                  {wonPrize.code}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2 rounded-xl text-xs flex items-center space-x-1 shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Bottom Action */}
          <div>
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3 rounded-2xl text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSpinning ? 'Spinning Fortune Wheel...' : 'Spin the Wheel Now'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
