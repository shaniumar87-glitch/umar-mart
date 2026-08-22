import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  X,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Review } from '../types';

interface CustomerReviewsProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  onAddReview,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, number>>({});

  // Review Form state
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [productName, setProductName] = useState('UmarMart Pro SoundMax Headphones');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleHelpful = (id: string) => {
    setHelpfulMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment || !title) return;

    onAddReview({
      author,
      location: location || 'Verified Buyer',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(author)}`,
      rating,
      title,
      comment,
      verified: true,
      productName,
    });

    // Reset
    setAuthor('');
    setLocation('');
    setTitle('');
    setComment('');
    setModalOpen(false);
  };

  return (
    <section id="reviews" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-amber-500 font-bold text-xs tracking-wider uppercase mb-2">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>Real Customer Feedback</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Loved by 15,000+ Shoppers
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Rating Summary Card */}
            <div className="flex items-center space-x-3 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xs">
              <div className="text-2xl font-black text-slate-900 font-mono">4.9</div>
              <div>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">98.6% positive rating</div>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-full shadow-md shadow-blue-600/20 transition-all text-xs"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => {
            const addedHelpful = helpfulMap[rev.id] || 0;

            return (
              <div
                key={rev.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  {/* Rating & Verified Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    {rev.verified && (
                      <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  {/* Review Title & Content */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-1.5">{rev.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Product Badge */}
                  <div className="inline-block bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-blue-600 font-bold truncate max-w-full">
                    Item: {rev.productName}
                  </div>
                </div>

                {/* Author Info Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{rev.author}</h5>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 text-slate-400 mr-0.5" />
                          {rev.location}
                        </span>
                        <span>•</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Helpful Button */}
                  <button
                    onClick={() => handleHelpful(rev.id)}
                    className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.helpfulCount + addedHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Write Your UmarMart Review</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harris Umar"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location / Country
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dubai, UAE"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Star Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Purchased
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Review Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exceptional sound and premium craftsmanship!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detailed Comment
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about build quality, performance, shipping..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
