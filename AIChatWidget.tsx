import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  Phone,
  HelpCircle,
  Truck,
  CreditCard,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/formatters';

interface AIChatWidgetProps {
  products: Product[];
  currency: Currency;
  onOpenOrderTracking: () => void;
  onShowToast: (msg: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  suggestedProducts?: Product[];
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  products,
  currency,
  onOpenOrderTracking,
  onShowToast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Assalam-o-Alaikum! Welcome to UmarMart AI Customer Support Assistant. How can I help you today in Pakistan?',
      timestamp: 'Just now',
      quickReplies: [
        '📦 Track My Order',
        '💳 EasyPaisa & JazzCash Help',
        '🚚 Shipping Cities & Delivery Time',
        '🔄 7-Day Return Policy',
        '📞 Owner Direct Contact'
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateAIResponse = (userQuery: string) => {
    const q = userQuery.toLowerCase();
    let replyText = '';
    let quickReplies: string[] | undefined = undefined;
    let suggestedProds: Product[] | undefined = undefined;

    if (q.includes('track') || q.includes('order') || q.includes('status') || q.includes('where is my package')) {
      replyText = 'You can track your UmarMart shipment in real time using your Order ID or phone number (+92). Click below to open the Order Tracking portal directly.';
      quickReplies = ['Open Order Tracker Now', 'Talk to Support on WhatsApp'];
    } else if (q.includes('easypaisa') || q.includes('jazzcash') || q.includes('payment') || q.includes('cod') || q.includes('card')) {
      replyText = 'UmarMart accepts Cash on Delivery (COD) across 250+ cities in Pakistan, EasyPaisa, JazzCash, Visa & MasterCard debit/credit cards. For EasyPaisa/JazzCash, transfer directly to 0315-2643791 at checkout.';
      quickReplies = ['How does COD work?', 'WhatsApp Payment Confirmation'];
    } else if (q.includes('delivery') || q.includes('ship') || q.includes('time') || q.includes('karachi') || q.includes('lahore') || q.includes('islamabad')) {
      replyText = 'We offer Express 24-48 Hour Courier Delivery in Karachi, Lahore, and Islamabad, and 2-3 business days across all other cities in Pakistan via TCS, Leopard, and M&P.';
      quickReplies = ['Track My Order', 'Is shipping free above Rs. 2,000?'];
    } else if (q.includes('return') || q.includes('refund') || q.includes('warranty') || q.includes('policy')) {
      replyText = 'Every product on UmarMart is backed by our 7-Day Replacement Guarantee & Official 1-2 Year Brand Warranty. If your item is damaged or defective, we will pick it up free of charge.';
      quickReplies = ['File a Return Claim', 'Contact Owner Muhammad Umar'];
    } else if (q.includes('owner') || q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('umar')) {
      replyText = 'UmarMart is owned and operated by Muhammad Umar. Direct Contact Email: shaniumar87@gmail.com | WhatsApp & Phone: +92 315 2643791 (Available 24/7).';
      quickReplies = ['Open WhatsApp Chat', 'Send Contact Form Email'];
    } else if (q.includes('product') || q.includes('phone') || q.includes('watch') || q.includes('shoes') || q.includes('laptop') || q.includes('recommend') || q.includes('buy')) {
      replyText = 'Here are some of our top-rated trending items currently on sale with free nationwide delivery:';
      suggestedProds = products.slice(0, 3);
      quickReplies = ['Show Daily Deals', 'View Categories'];
    } else {
      replyText = `Thank you for reaching out! I am UmarMart's AI Shopping Assistant. For specific inquiries regarding your orders or products, feel free to contact owner Muhammad Umar at +92 315 2643791 or select a quick option below.`;
      quickReplies = ['📦 Track My Order', '💳 EasyPaisa & JazzCash Help', '📞 Owner Direct Contact'];
    }

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: 'msg-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies,
        suggestedProducts: suggestedProds,
      },
    ]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      generateAIResponse(query);
    }, 700);
  };

  const handleQuickReplyClick = (reply: string) => {
    if (reply === 'Open Order Tracker Now' || reply === '📦 Track My Order') {
      onOpenOrderTracking();
      onShowToast('Opened Order Tracking Portal');
      return;
    }
    if (reply === 'Talk to Support on WhatsApp' || reply === 'WhatsApp Payment Confirmation' || reply === 'Open WhatsApp Chat') {
      window.open('https://wa.me/923152643791', '_blank');
      return;
    }
    handleSendMessage(reply);
  };

  return (
    <>
      {/* Floating Widget Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-blue-600/40 flex items-center space-x-2 border-2 border-white/20 relative group"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-blue-600 animate-pulse" />
          </div>
          <span className="hidden sm:inline font-black text-xs pr-1">UmarMart AI Assistant</span>
        </motion.button>
      </div>

      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[520px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-black text-sm text-white">UmarMart AI Desk</h4>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                      Online 24/7
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Owner: Muhammad Umar (+92 315 2643791)</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start space-x-2 max-w-[88%]">
                    {msg.sender === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl space-y-2 ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                      }`}
                    >
                      <p className="leading-relaxed font-medium">{msg.text}</p>

                      {/* Suggested Products preview */}
                      {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          {msg.suggestedProducts.map((p) => (
                            <div
                              key={p.id}
                              className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center space-x-2"
                            >
                              <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <h6 className="font-bold text-[11px] text-slate-900 truncate">{p.name}</h6>
                                <span className="font-black text-blue-600 text-[10px]">
                                  {formatPrice(p.price, currency)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <span
                        className={`block text-[9px] text-right font-medium ${
                          msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Quick Reply Pills */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                      {msg.quickReplies.map((qr, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReplyClick(qr)}
                          className="bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2.5 py-1 rounded-full text-[10px] transition-colors shadow-2xs"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 text-slate-400 text-xs pl-2">
                  <Bot className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="italic font-medium">UmarMart AI is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about orders, EasyPaisa, delivery..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
