import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Gamepad2, Calendar, Users, Phone, Clock, Sparkles, Copy, Check } from 'lucide-react';
import { GamingActivityId, BookingFormData } from '../types';
import { soundManager } from '../utils/audio';

interface BookingModalProps {
  isOpen: boolean;
  initialActivity?: GamingActivityId;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  initialActivity = 'snooker',
  onClose
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    contact: '',
    activity: initialActivity,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '20:00',
    partySize: 2,
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    if (initialActivity) {
      setFormData(prev => ({ ...prev, activity: initialActivity }));
    }
  }, [initialActivity]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter a valid name.';
    }

    if (!formData.contact.trim()) {
      errs.contact = 'Phone number or email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\d\s+\-()]{7,20}$/;
      if (!emailRegex.test(formData.contact) && !phoneRegex.test(formData.contact)) {
        errs.contact = 'Please enter a valid email address or phone number.';
      }
    }

    if (!formData.date) {
      errs.date = 'Please select a reservation date.';
    }

    if (!formData.timeSlot) {
      errs.timeSlot = 'Please select a time slot.';
    }

    if (formData.partySize < 1 || formData.partySize > 12) {
      errs.partySize = 'Party size must be between 1 and 12 players.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      soundManager.playConfirm();
      setIsSubmitted(true);
    } else {
      soundManager.playBlip(300, 0.1);
    }
  };

  const handleCopySummary = () => {
    const summary = `Casa Milano Session Request:\nGuest: ${formData.fullName}\nContact: ${formData.contact}\nActivity: ${formData.activity.toUpperCase()}\nDate: ${formData.date} at ${formData.timeSlot}\nPlayers: ${formData.partySize}${formData.notes ? `\nNotes: ${formData.notes}` : ''}`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    });
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      contact: '',
      activity: 'snooker',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '20:00',
      partySize: 2,
      notes: ''
    });
    setErrors({});
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="relative w-full max-w-xl bg-[#090e1e] border border-cyan-900/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => {
            soundManager.playBlip(400);
            onClose();
          }}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:bg-slate-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Close reservation dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LOUNGE RESERVATIONS & INQUIRIES</span>
            </div>
            
            <h2 id="modal-title" className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white mb-2">
              Reserve Your Session
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Book your championship snooker table, private PS5 bay, or motion racing cockpit.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Activity Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Select Gaming Experience
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'snooker', label: 'Snooker', img: '/images/zones/zone1_snooker.jpg' },
                    { id: 'ps5', label: 'PS5 Pods', img: '/images/zones/zone2_ps5.jpg' },
                    { id: 'racing', label: 'Sim Racing', img: '/images/zones/zone3_racing.jpg' },
                    { id: 'arcade', label: 'Arcade', img: '/images/zones/zone4_arcade.jpg' }
                  ].map((act) => (
                    <button
                      type="button"
                      key={act.id}
                      onClick={() => {
                        soundManager.playBlip(520);
                        setFormData({ ...formData, activity: act.id as GamingActivityId });
                      }}
                      className={`flex items-center gap-2 p-1.5 pr-2.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        formData.activity === act.id
                          ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img src={act.img} alt={act.label} className="w-7 h-7 rounded-md object-cover shrink-0" />
                      <span className="truncate">{act.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Alex Mercer"
                    className={`w-full px-3.5 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      errors.fullName ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Email or Phone *
                  </label>
                  <input
                    id="contact"
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="alex@domain.com or +1 555..."
                    className={`w-full px-3.5 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      errors.contact ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                  {errors.contact && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.contact}
                    </p>
                  )}
                </div>
              </div>

              {/* Date, Time Slot, and Party Size */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="date" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Date *
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label htmlFor="timeSlot" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Time Slot *
                  </label>
                  <select
                    id="timeSlot"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="20:00">08:00 PM (Peak)</option>
                    <option value="22:00">10:00 PM (Late Night)</option>
                    <option value="00:00">12:00 AM (Midnight)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="partySize" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Party Size
                  </label>
                  <input
                    id="partySize"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.partySize}
                    onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor="notes" className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Special Requests / Tournament Setup (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Need specific cues, racing game title, birthday celebration..."
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 text-sm font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  Submit Session Request
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center font-mono">
                No immediate payment required · Walk-ins also welcome daily
              </p>
            </form>
          </div>
        ) : (
          /* Submission Feedback & Summary State */
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-white mb-2">
              Session Request Prepared
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-md mx-auto">
              Your inquiry for <strong className="text-cyan-400 uppercase">{formData.activity}</strong> has been logged in this demo preview.
            </p>

            {/* Summary Ticket */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left text-xs font-mono space-y-2 mb-6">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Guest:</span>
                <span className="text-white font-semibold">{formData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Experience:</span>
                <span className="text-cyan-400 uppercase font-semibold">{formData.activity}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Scheduled:</span>
                <span className="text-slate-200">{formData.date} at {formData.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Party Size:</span>
                <span className="text-slate-200">{formData.partySize} Players</span>
              </div>
            </div>

            {/* Integration Notice as required by prompt */}
            <div className="text-[11px] text-slate-400 bg-cyan-950/20 border border-cyan-800/30 rounded-xl p-3 text-left mb-6 leading-relaxed">
              <span className="text-cyan-400 font-bold block mb-1">Demo Integration Note:</span>
              This demo preview validates all required inputs client-side without storing live records on a remote server. 
              To connect this to your café's live reservation software (e.g., SevenRooms, OpenTable, or custom POS API), 
              the endpoint can be hooked up instantly.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full sm:w-1/2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors inline-flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {copiedSummary ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSummary ? 'Copied Details' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
