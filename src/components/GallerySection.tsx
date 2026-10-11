import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Sparkles, 
  Eye, 
  Check, 
  AlertCircle, 
  Image as ImageIcon, 
  ZoomIn,
  Layers,
  Play,
  Pause
} from 'lucide-react';
import { GalleryItem } from '../types';
import { soundManager } from '../utils/audio';
import Stack from './Stack';

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'The Championship Arena',
    category: 'snooker',
    caption: '12-foot tournament tables under directional shadowless LED pendants.',
    author: 'Casa Milano Pro Staff',
    imageUrl: '/images/zones/zone1_snooker.jpg'
  },
  {
    id: 'g-2',
    title: 'Private OLED Pod Bay 04',
    category: 'ps5',
    caption: 'DualSense Edge controllers and 55" 120Hz 4K OLED screens with acoustic panels.',
    author: 'Esports League',
    imageUrl: '/images/zones/zone2_ps5.jpg'
  },
  {
    id: 'g-3',
    title: 'Direct-Drive Sim Cockpit #2',
    category: 'racing',
    caption: 'Fanatec DD2 25Nm wheelbase and triple curved 165Hz displays dialed for GT3.',
    author: 'Sim Racing Team',
    imageUrl: '/images/zones/zone3_racing.jpg'
  },
  {
    id: 'g-4',
    title: 'Milano Truffle Smash & Craft Drinks',
    category: 'cafe',
    caption: 'Double Angus beef patties, house truffle aioli and cold brew served in-bay.',
    author: 'Chef Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format'
  },
  {
    id: 'g-5',
    title: 'Japanese Candy Arcade Row',
    category: 'arcade',
    caption: 'Sanwa Denshi joysticks and CRT phosphor aesthetics with modern fighting games.',
    author: 'Community Night',
    imageUrl: '/images/zones/zone4_arcade.jpg'
  },
  {
    id: 'g-6',
    title: 'Midnight Cyan Atmosphere',
    category: 'lounge',
    caption: 'The main lounge atrium bathed in atmospheric ultraviolet and electric cyan ambient neon.',
    author: 'Weekend Showcase',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format'
  }
];

export const GallerySection: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [stackLayout, setStackLayout] = useState<'pile' | 'fan' | 'cascade' | 'deck'>('pile');
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'snooker' | 'ps5' | 'racing' | 'arcade' | 'cafe' | 'lounge'>('lounge');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = [
    { id: 'all', label: 'All Shots' },
    { id: 'snooker', label: 'Billiards Arena' },
    { id: 'ps5', label: 'Console Bays' },
    { id: 'racing', label: 'Sim Cockpits' },
    { id: 'arcade', label: 'Arcade Hall' },
    { id: 'cafe', label: 'Gourmet Kitchen' },
    { id: 'lounge', label: 'Lounge Vibe' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  const handleCategoryChange = (catId: string) => {
    soundManager.playBlip(500);
    setActiveCategory(catId);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      setUploadError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      setUploadError('Please give this photo a title.');
      return;
    }
    if (!uploadPreview) {
      setUploadError('Please select an image file to upload.');
      return;
    }

    soundManager.playConfirm();

    const newItem: GalleryItem = {
      id: `custom-${Date.now()}`,
      title: uploadTitle.trim(),
      category: uploadCategory,
      caption: uploadCaption.trim() || 'Community member snapshot at Casa Milano.',
      imageUrl: uploadPreview,
      author: uploadAuthor.trim() || 'Verified Guest',
      isCustomUpload: true
    };

    setGallery([newItem, ...gallery]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadModalOpen(false);
      setUploadTitle('');
      setUploadCaption('');
      setUploadAuthor('');
      setUploadPreview(null);
    }, 1500);
  };

  // SVG Artwork generators for default items
  const renderItemVisual = (item: GalleryItem) => {
    if (item.imageUrl) {
      return (
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      );
    }

    // High fidelity curated visual stages for each category
    switch (item.category) {
      case 'snooker':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#061e15] via-[#040e0b] to-[#010504] relative flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-400/20 blur-2xl" />
            <svg viewBox="0 0 200 140" className="w-full h-full object-contain filter drop-shadow-md">
              <rect x="20" y="30" width="160" height="80" rx="4" fill="#04432c" stroke="#523624" strokeWidth="4" />
              <line x1="60" y1="30" x2="60" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <circle cx="130" cy="70" r="4" fill="#dc2626" />
              <circle cx="138" cy="65" r="4" fill="#dc2626" />
              <circle cx="138" cy="75" r="4" fill="#dc2626" />
              <circle cx="146" cy="70" r="4" fill="#0f172a" />
              <circle cx="60" cy="70" r="4" fill="#ffffff" />
            </svg>
          </div>
        );
      case 'ps5':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#080d26] via-[#050819] to-[#02040b] relative flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-32 bg-cyan-500/20 blur-2xl" />
            <svg viewBox="0 0 200 140" className="w-full h-full object-contain">
              <rect x="40" y="20" width="120" height="75" rx="4" fill="#090d16" stroke="#00f0ff" strokeWidth="1.5" />
              <path d="M 50,75 L 80,45 L 120,65 L 150,35" stroke="#8b5cf6" strokeWidth="2" fill="none" />
              <ellipse cx="100" cy="115" rx="35" ry="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="85" cy="115" r="5" fill="#0f172a" />
              <circle cx="115" cy="115" r="5" fill="#0f172a" />
            </svg>
          </div>
        );
      case 'racing':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#1a081f] via-[#09030c] to-[#020104] relative flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-32 bg-fuchsia-500/20 blur-2xl" />
            <svg viewBox="0 0 200 140" className="w-full h-full object-contain">
              <polygon points="20,40 60,45 60,95 20,90" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
              <rect x="65" y="38" width="70" height="60" rx="2" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <polygon points="140,45 180,40 180,90 140,95" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
              <ellipse cx="100" cy="110" rx="25" ry="15" fill="#262626" stroke="#525252" strokeWidth="2" />
            </svg>
          </div>
        );
      case 'cafe':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#1c1209] via-[#0f0904] to-[#040201] relative flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-32 bg-amber-500/20 blur-2xl" />
            <svg viewBox="0 0 200 140" className="w-full h-full object-contain">
              <ellipse cx="100" cy="95" rx="50" ry="12" fill="#1c1917" stroke="#382e2b" strokeWidth="1" />
              <path d="M 65,80 C 65,60 135,60 135,80 Z" fill="#d97706" />
              <rect x="60" y="80" width="80" height="8" rx="2" fill="#451a03" />
              <rect x="62" y="88" width="76" height="4" rx="1" fill="#f59e0b" />
              <rect x="65" y="92" width="70" height="6" rx="2" fill="#d97706" />
              {/* Cold brew glass */}
              <polygon points="145,55 165,55 160,90 150,90" fill="rgba(6,182,212,0.2)" stroke="#38bdf8" strokeWidth="1" />
            </svg>
          </div>
        );
      case 'arcade':
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#1b1008] via-[#0d0704] to-[#030101] relative flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-32 bg-amber-500/20 blur-2xl" />
            <svg viewBox="0 0 200 140" className="w-full h-full object-contain">
              <path d="M 60,30 L 140,30 L 145,70 L 130,110 L 55,110 Z" fill="#18181b" stroke="#f59e0b" strokeWidth="1.5" />
              <rect x="70" y="45" width="60" height="40" rx="3" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="85" cy="100" r="4" fill="#ef4444" />
              <circle cx="110" cy="98" r="3" fill="#3b82f6" />
              <circle cx="120" cy="98" r="3" fill="#3b82f6" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-[#0c142c] via-[#070b1a] to-[#020409] relative flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-cyan-400/20 blur-3xl" />
            <svg viewBox="0 0 200 140" className="w-full h-full object-contain">
              <circle cx="100" cy="70" r="35" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="100" cy="70" r="18" fill="rgba(6,182,212,0.15)" stroke="#8b5cf6" strokeWidth="1" />
              <path d="M 40,110 L 160,110" stroke="#00f0ff" strokeWidth="1" />
            </svg>
          </div>
        );
    }
  };

  const stackCards = gallery.map((item, idx) => (
    <div
      key={item.id}
      className="relative w-full h-full bg-[#080d1e] overflow-hidden flex flex-col justify-between group cursor-grab active:cursor-grabbing border border-cyan-500/30 rounded-[20px]"
    >
      <div className="absolute inset-0 bg-slate-950">
        {renderItemVisual(item)}
      </div>

      {/* Top category & index pill */}
      <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 bg-[#060a17]/90 backdrop-blur-md border border-cyan-500/30 px-2.5 py-1 rounded-full shadow-lg">
          {item.category.toUpperCase()}
        </span>
        <span className="text-[10px] font-mono text-slate-300 bg-black/80 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
          {idx + 1} / {gallery.length}
        </span>
      </div>

      {/* Bottom overlay with title and caption */}
      <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/75 to-transparent pointer-events-none">
        <h4 className="text-sm sm:text-base font-bold font-display uppercase tracking-wide text-white leading-tight">
          {item.title}
        </h4>
        <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-2 mt-1">
          {item.caption}
        </p>
      </div>
    </div>
  ));

  return (
    <section id="gallery" className="relative py-28 bg-[#060a17] border-t border-white/5 overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase text-balance">
            CASA MILANO{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              IN ACTION.
            </span>
          </h2>
        </div>

        {/* Interactive 3D Stack Showcase */}
        <div className="flex flex-col items-center justify-center">
          
          {/* 3D Physics Card Stack Viewport */}
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-xl p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#090e21] via-[#060a17] to-[#04060e] border border-cyan-900/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative flex flex-col items-center justify-center overflow-visible">
              
              <div 
                style={{ width: 280, height: 280 }} 
                className="sm:!w-[360px] sm:!h-[360px] md:!w-[420px] md:!h-[420px] relative flex items-center justify-center p-2"
              >
                <Stack
                  layout={stackLayout}
                  sendToBackOnClick={true}
                  cards={stackCards}
                  visible={6}
                  spread={0.5}
                  depth={0.5}
                  radius={20}
                  frame={0}
                  frameColor="#ffffff"
                  shadow={true}
                  tilt={30}
                  threshold={90}
                  speed={1}
                  autoplay={isAutoplay}
                  autoplayDelay={3000}
                  pauseOnHover={true}
                  onChange={(idx) => {
                    soundManager.playSelect();
                    setActiveStackIndex(idx);
                  }}
                />
              </div>

              {/* Interaction hints & Quick Actions */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-cyan-400">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Drag or flick cards to cycle</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40">
                  <Check className="w-3.5 h-3.5" />
                  <span>Click top card to send to back</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playSelect();
                    setSelectedItem(gallery[activeStackIndex]);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/40 text-cyan-400 transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Fullscreen View</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative w-full max-w-4xl bg-[#090e1e] border border-cyan-800/60 rounded-3xl overflow-hidden shadow-2xl text-slate-100 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                soundManager.playBlip(400);
                setSelectedItem(null);
              }}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white rounded-lg bg-black/60 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Close image lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-[360px] sm:h-[480px] w-full bg-slate-950 flex items-center justify-center">
              {renderItemVisual(selectedItem)}
            </div>

            <div className="p-6 bg-[#080d1b] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 mb-1">
                  <span>Zone: {selectedItem.category}</span>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-slate-400">Captured by {selectedItem.author}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display uppercase text-white">
                  {selectedItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {selectedItem.caption}
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl whitespace-nowrap self-start sm:self-auto"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Upload Modal */}
      {isUploadModalOpen && (
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
                setIsUploadModalOpen(false);
              }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:bg-slate-800/80 transition-colors"
              aria-label="Close upload modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!uploadSuccess ? (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
                  <Upload className="w-3.5 h-3.5" />
                  <span>COMMUNITY PHOTO UPLOAD</span>
                </div>

                <h3 className="text-2xl font-bold font-display uppercase text-white">
                  Share Your Casa Milano Moment
                </h3>

                <p className="text-xs text-slate-400">
                  Upload photos of your snooker century break, tournament victory, or favorite lounge burger.
                </p>

                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                    Select Image File *
                  </label>
                  <label className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/60">
                    {uploadPreview ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden">
                        <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-[10px] font-mono text-cyan-300">
                          Click to change
                        </span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-cyan-400/80 mb-2" />
                        <span className="text-xs font-medium text-slate-300">Choose or drag photo</span>
                        <span className="text-[11px] text-slate-500 font-mono mt-0.5">PNG, JPG or WebP</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Photo Title *
                    </label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. F1 24 Qualifying Run"
                      className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                      Zone Category
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <option value="snooker">Billiards Arena</option>
                      <option value="ps5">Console Bays</option>
                      <option value="racing">Sim Cockpits</option>
                      <option value="arcade">Arcade Hall</option>
                      <option value="cafe">Gourmet Kitchen</option>
                      <option value="lounge">Lounge Vibe</option>
                    </select>
                  </div>
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Your Name / Gamer Tag
                  </label>
                  <input
                    type="text"
                    value={uploadAuthor}
                    onChange={(e) => setUploadAuthor(e.target.value)}
                    placeholder="e.g. Marcus V. (@ApexRacer)"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="What made this match or meal memorable?"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {uploadError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  >
                    Post to Live Gallery
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-400/40">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display uppercase text-white mb-2">
                  Photo Added Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Your community shot has been added to the live gallery showcase.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
