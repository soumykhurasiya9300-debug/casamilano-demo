import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Plus, 
  X, 
  Sparkles, 
  Quote, 
  ThumbsUp, 
  Calendar 
} from 'lucide-react';
import { ReviewItem } from '../types';
import { soundManager } from '../utils/audio';
import Folder from './Folder';

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Ethan Cole',
    role: 'Regional WPBSA Amateur Finalist',
    rating: 5,
    date: '3 days ago',
    category: 'snooker',
    highlight: 'Tournament tables kept in pristine condition',
    comment: 'The Strachan 6811 cloths on these slate tables are kept in authentic championship condition. Zero roll-off, crisp cushions, perfectly matched Aramith balls. Easily the best cue sports venue in the territory.'
  },
  {
    id: 'rev-3',
    author: 'David & Sarah',
    role: 'Weekend Lounge Diners',
    rating: 5,
    date: '2 weeks ago',
    category: 'cafe',
    highlight: 'The Milano Smash Burger rival top gourmet bistros',
    comment: 'Came for casual FC 25 on the 4K OLED pods and stayed for the craft kitchen. The double smash truffle burger and ultraviolet citrus fizz are incredible. The acoustic pods actually work—you can talk without loud arcade noise bleeding in.'
  },
  {
    id: 'rev-5',
    author: 'Julian Rossi',
    role: 'Corporate Invitational Host',
    rating: 5,
    date: '1 month ago',
    category: 'snooker',
    highlight: 'Flawless venue for our 24-person private tournament',
    comment: 'We booked the VIP snooker suite and sim bays for an executive championship. The dedicated 10Gbps LAN, catering service, and tournament refereeing support were world-class. Every attendee was thoroughly impressed.'
  }
];

export const ReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Folder 3D items generated from current reviews
  const folderItems = reviews.slice(0, 6).map((rev) => ({
    title: rev.highlight,
    description: `"${rev.comment.slice(0, 75)}..." — ${rev.author} (${rev.role})`
  }));

  // New Review Form State
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<'snooker' | 'gaming' | 'racing' | 'cafe'>('snooker');
  const [highlight, setHighlight] = useState('');
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const filters = [
    { id: 'all', label: 'All Reviews' },
    { id: 'snooker', label: 'Championship Snooker' },
    { id: 'racing', label: 'Sim Racing Rigs' },
    { id: 'gaming', label: 'Console & Arcade' },
    { id: 'cafe', label: 'Gourmet Café & Drinks' }
  ];

  const filteredReviews = activeFilter === 'all'
    ? reviews
    : reviews.filter(r => r.category === activeFilter);

  const handleFilterClick = (filterId: string) => {
    soundManager.playBlip(520);
    setActiveFilter(filterId);
  };

  const handleRatingHover = (val: number) => {
    setHoverRating(val);
  };

  const handleRatingClick = (val: number) => {
    soundManager.playBlip(600);
    setRating(val);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!highlight.trim()) {
      setFormError('Please write a short summary highlight.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 15) {
      setFormError('Please write at least 15 characters of feedback.');
      return;
    }

    soundManager.playConfirm();

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      role: role.trim() || 'Verified Lounge Player',
      rating,
      date: 'Just now',
      category,
      highlight: highlight.trim(),
      comment: comment.trim()
    };

    setReviews([newRev, ...reviews]);
    setSelectedReviewIndex(0);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsModalOpen(false);
      setAuthor('');
      setRole('');
      setHighlight('');
      setComment('');
      setRating(5);
      setFormError('');
    }, 1500);
  };

  return (
    <section id="reviews" className="relative py-28 bg-[#050811] border-t border-white/5 overflow-hidden">
      
      {/* Ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase text-balance">
              VERIFIED LOUNGE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">
                EXPERIENCES.
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-white font-bold">4.98 / 5.0</span>
              <span className="text-slate-600">·</span>
              <span>380+ Reviews</span>
            </div>

            <button
              onClick={() => {
                soundManager.playSelect();
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Plus className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* 3D Animated Reviews Folder Formation */}
        <div className="flex flex-col items-center justify-center py-6 my-4">
          
          {/* The Interactive 3D Folder Component */}
          <div className="flex flex-col items-center">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#090e21] via-[#060a17] to-[#04060e] border border-cyan-900/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative flex items-center justify-center overflow-visible">
              <Folder
                label="reviews"
                items={folderItems}
                onItemClick={(_item: any, index: number) => {
                  soundManager.playSelect();
                  setSelectedReviewIndex(index);
                }}
                mode="book"
                variant="solid"
                layout="spread"
                color="#00F0FF"
                paperColor="#ffffff"
                tabPosition="center"
                openOn="click"
                size={1.3}
                frost={0.25}
                tilt={0.6}
                speed={1}
                bounce={0.75}
                peek
                intro={false}
                draggable
                zoomOnClick
                theme="dark"
              />
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Click folder to open · Drag or click cards to inspect</span>
            </div>
          </div>

        </div>

      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative w-full max-w-lg bg-[#090e1e] border border-cyan-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                soundManager.playBlip(400);
                setIsModalOpen(false);
              }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:bg-slate-800/80 transition-colors"
              aria-label="Close review dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {!formSuccess ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SHARE YOUR VERDICT</span>
                </div>

                <h3 className="text-2xl font-bold font-display uppercase text-white">
                  Write a Review for Casa Milano
                </h3>

                <p className="text-xs text-slate-400">
                  Your feedback helps maintain tournament standards and shape our gourmet kitchen menu.
                </p>

                {/* Star Rating Picker */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                    Your Rating: {rating} / 5 Stars
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => handleRatingHover(star)}
                        onMouseLeave={() => handleRatingHover(0)}
                        className="p-1 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Liam Foster"
                      className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Role / Subtitle
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Regular Snooker Player"
                      className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                {/* Zone Category */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Primary Zone Reviewed
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="snooker">Championship Snooker</option>
                    <option value="racing">Sim Racing Cockpits</option>
                    <option value="gaming">PS5 Pods & Retro Arcade</option>
                    <option value="cafe">Gourmet Café & Drinks</option>
                  </select>
                </div>

                {/* Headline Highlight */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    placeholder="e.g. Best Strachan tables in the city"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Detailed Review *
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell other players and diners about equipment calibration, table quality, smash burger taste, or staff service..."
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-rose-400">
                    {formError}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    Post Review to Community Wall
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-400/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display uppercase text-white mb-2">
                  Review Published!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Thank you for rating Casa Milano. Your review has been added to the verified community wall.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
