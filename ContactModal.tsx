import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Building,
  Headphones,
  UserCheck,
  Globe,
  Navigation
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast('Thank you! Your message has been routed to owner Muhammad Umar & UmarMart Support.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      onClose();
    }, 800);
  };

  const waUrl = `https://wa.me/923152643791?text=${encodeURIComponent(
    'Hello UmarMart! I would like to make an inquiry regarding your products.'
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-slate-900 my-8 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md font-black text-xl">
              U
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Contact UmarMart Pakistan</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Get in touch directly with our leadership and support desk for orders, payments, and product inquiries.
            </p>
          </div>

          {/* Owner & Business Info Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shadow-inner">
            <div className="border-r border-slate-800 pr-3">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Business Name</span>
              <strong className="text-white text-sm font-black">UmarMart</strong>
            </div>
            <div className="border-r border-slate-800 pr-3">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Business Owner</span>
              <strong className="text-amber-400 font-bold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                Muhammad Umar
              </strong>
            </div>
            <div className="border-r border-slate-800 pr-3">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Country</span>
              <strong className="text-emerald-400 font-bold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                Pakistan (PKR)
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Response Time</span>
              <strong className="text-blue-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Instant / 24 Hours
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Details & Google Maps Column */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center space-x-2 text-sm">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Official Head Office</span>
                </h4>

                <div className="space-y-2.5 pt-1">
                  <div className="flex items-start space-x-2.5 text-slate-700">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold">UmarMart Headquarters</strong>
                      <span>Shahrah-e-Faisal, Suite 402, Karachi, Sindh, Pakistan</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 text-slate-700">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="text-slate-900">Phone: </strong>
                      <a href="tel:+923152643791" className="font-bold text-blue-600 hover:underline">
                        +92 315 2643791
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 text-slate-700">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <strong className="text-slate-900">Email: </strong>
                      <a href="mailto:shaniumar87@gmail.com" className="font-bold text-blue-600 hover:underline">
                        shaniumar87@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl flex items-center justify-between transition-all block group shadow-md shadow-emerald-600/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 fill-current text-white" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">Direct WhatsApp Support</h5>
                    <p className="text-[11px] text-emerald-100 font-semibold">+92 315 2643791 (Muhammad Umar)</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold bg-white text-emerald-800 px-3 py-1.5 rounded-xl group-hover:scale-105 transition-transform">
                  Chat Now →
                </span>
              </a>

              {/* Google Maps Placeholder */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 relative group shadow-sm">
                <div className="bg-slate-900 text-white px-3.5 py-2 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center space-x-1.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-400" />
                    <span>Location Map: Karachi, Pakistan</span>
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Shahrah-e-Faisal</span>
                </div>
                {/* Styled Map Graphic Canvas */}
                <div className="h-40 bg-slate-200 relative flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-40 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80')`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                  
                  {/* Map Pin Overlay */}
                  <div className="relative z-10 text-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white border-2 border-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                      <MapPin className="w-5 h-5 fill-current" />
                    </div>
                    <div className="bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-slate-700 shadow-md backdrop-blur-xs">
                      UmarMart HQ — Karachi, Pakistan
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 bg-slate-50/50 p-4 border border-slate-200 rounded-2xl">
              <h4 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-2">
                Send Us a Message
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="shaniumar87@gmail.com"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 315 2643791"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-semibold shadow-2xs"
                >
                  <option value="Order Inquiry">Order Inquiry & Tracking</option>
                  <option value="Payment Inquiry">EasyPaisa / JazzCash / COD Payment</option>
                  <option value="Direct Owner Contact">Contact Owner (Muhammad Umar)</option>
                  <option value="Seller Partnership">Become a Verified Seller</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your query or message here..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 resize-none shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-600/20 text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

