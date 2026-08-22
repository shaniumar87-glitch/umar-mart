import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, ExternalLink, Send, CheckCircle2, Headphones, Sparkles, ShieldCheck } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '+92 3152643791',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('general');

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

  const topicWelcomeMessages: Record<string, string> = {
    order: 'Assalam-o-Alaikum UmarMart Support! I would like to place an order / inquire about a product.',
    payment: 'Assalam-o-Alaikum! I need help with EasyPaisa / JazzCash / Bank Transfer payment for my order.',
    tracking: 'Hello UmarMart! I would like to check my order delivery status and TCS / Leopard tracking ID.',
    general: 'Assalam-o-Alaikum! Welcome to UmarMart Support (+92 3152643791). I have a question regarding your store.',
  };

  const getFinalUrl = (overrideText?: string) => {
    const textToSend = overrideText || customMsg || topicWelcomeMessages[selectedTopic] || topicWelcomeMessages.general;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textToSend)}`;
  };

  const handleOpenChat = (overrideText?: string) => {
    const url = getFinalUrl(overrideText);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2 }}
            className="mb-3 bg-white border border-slate-200 rounded-3xl shadow-2xl w-80 sm:w-96 text-slate-900 relative overflow-hidden"
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-4 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-sm text-white shadow-inner">
                      <Headphones className="w-5 h-5 text-emerald-200" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-800 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-xs text-white">UmarMart Pakistan</h4>
                      <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-400/30 text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                        Verified
                      </span>
                    </div>
                    {/* Online Support Badge */}
                    <div className="flex items-center space-x-1.5 text-[10px] text-emerald-100 font-semibold mt-0.5">
                      <span className="inline-flex items-center space-x-1 bg-emerald-800/80 px-1.5 py-0.5 rounded-full border border-emerald-400/40 text-[9px] text-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                        <span>Online Support</span>
                      </span>
                      <span>• Replies in &lt;1 min</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors"
                  title="Close support window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body Container */}
            <div className="p-4 space-y-3 bg-slate-50">
              {/* Agent Welcome Message Bubble */}
              <div className="bg-white border border-emerald-200 rounded-2xl p-3 shadow-sm text-xs space-y-1.5 relative">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Support Team
                  </span>
                  <span>{phoneNumber}</span>
                </div>
                <p className="font-bold text-slate-900">
                  Assalam-o-Alaikum! 👋 Welcome to UmarMart Support.
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  How can we help you today? Select a topic below or type your custom message to start instant WhatsApp chat.
                </p>
              </div>

              {/* Quick Topic Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                  Select Quick Inquiry Topic:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedTopic('order');
                      handleOpenChat(topicWelcomeMessages.order);
                    }}
                    className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left text-[11px] font-semibold text-slate-700 hover:text-emerald-800 transition-all shadow-2xs flex items-center space-x-1.5"
                  >
                    <span>🛒 New Order</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTopic('payment');
                      handleOpenChat(topicWelcomeMessages.payment);
                    }}
                    className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left text-[11px] font-semibold text-slate-700 hover:text-emerald-800 transition-all shadow-2xs flex items-center space-x-1.5"
                  >
                    <span>💳 EasyPaisa/JazzCash</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTopic('tracking');
                      handleOpenChat(topicWelcomeMessages.tracking);
                    }}
                    className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left text-[11px] font-semibold text-slate-700 hover:text-emerald-800 transition-all shadow-2xs flex items-center space-x-1.5"
                  >
                    <span>🚚 TCS Courier Tracking</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTopic('general');
                      handleOpenChat(topicWelcomeMessages.general);
                    }}
                    className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left text-[11px] font-semibold text-slate-700 hover:text-emerald-800 transition-all shadow-2xs flex items-center space-x-1.5"
                  >
                    <span>💬 Live Chat</span>
                  </button>
                </div>
              </div>

              {/* Custom Welcome Message Input */}
              <div className="space-y-1 pt-1">
                <div className="relative">
                  <input
                    type="text"
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    placeholder="Type your message or question..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleOpenChat();
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenChat()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Main Open Chat Button */}
              <button
                type="button"
                onClick={() => handleOpenChat()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all transform active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-current text-white" />
                <span>Open WhatsApp Chat ({phoneNumber})</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/80">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Online Support Active</span>
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-slate-400" />
                  <span>24/7 Response</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Trigger with "Online Support" Badge */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2.5 border-2 border-white focus:outline-none"
        title={`Click for WhatsApp Online Support (${phoneNumber})`}
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-current text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full border-2 border-emerald-800 animate-ping" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-black tracking-tight leading-tight">WhatsApp Support</span>
          </div>
          <div className="flex items-center space-x-1 text-[9px] text-emerald-100 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span>Online Support</span>
          </div>
        </div>
      </motion.button>
    </div>
  );
};

