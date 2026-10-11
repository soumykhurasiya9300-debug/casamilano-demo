import React, { useState } from 'react';
import { 
  Trophy, 
  Gamepad2, 
  Zap, 
  Flame, 
  UtensilsCrossed, 
  ChevronRight, 
  Check, 
  Clock, 
  Users, 
  Sparkles,
  Coffee,
  Beer,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';
import { GamingActivity, GamingActivityId } from '../types';
import { SnookerVisual, PS5Visual, RacingVisual, ArcadeVisual } from './ArenaVisuals';
import { soundManager } from '../utils/audio';

const ACTIVITIES: GamingActivity[] = [
  {
    id: 'snooker',
    title: 'Championship Snooker',
    subtitle: 'English Slate · Strachan 6811 · Tournament Standard',
    tagline: 'Precision Geometry & Classic Billiards Excellence',
    image: '/images/zones/zone1_snooker.jpg',
    description: '12 full-size tournament English slate tables covered with genuine Strachan 6811 tournament cloth and precision Aramith Tournament Champion balls. Lit by shadowless directional softboxes for uninterrupted cueing.',
    specs: [
      '12 Full-Size 12ft English Slate Tables',
      'Strachan 6811 Tournament 100% Wool Cloth',
      'Aramith Pro Tournament Phenolic Balls',
      'Custom Matched Ash Cues & Brass Rests',
      'Overhead Shadowless LED Diffusers'
    ],
    capacity: '1 to 4 Players per Table',
    pricingHint: 'Hourly session rates · Walk-ins & reservations',
    color: {
      accent: 'text-emerald-400',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
      border: 'border-emerald-500/30'
    }
  },
  {
    id: 'ps5',
    title: 'PS5 Battle Stations',
    subtitle: 'Private Bays · 4K 120Hz OLED · DualSense Haptics',
    tagline: 'Immersive Console Gaming in Private Acoustic Bays',
    image: '/images/zones/zone2_ps5.jpg',
    description: '16 private, sound-dampened gaming booths featuring Sony PlayStation 5 consoles linked to 55-inch 120Hz 4K OLED screens. Equipped with Pulse 3D spatial audio headsets and tournament-grade ergonomic seating.',
    specs: [
      'Sony PS5 Disc & Digital Fleet',
      '55" 4K OLED HDR 120Hz Ultra-Low Latency',
      'Pulse 3D Wireless Audio Headsets',
      'DualSense Edge Wireless Controllers',
      'Pre-loaded AAA Titles, FC 25, Warzone, Tekken 8'
    ],
    capacity: '1 to 4 Players per Pod (Local Co-op / VS)',
    pricingHint: 'Session passes · Multiplayer bundle rates',
    color: {
      accent: 'text-cyan-400',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.25)]',
      border: 'border-cyan-500/30'
    }
  },
  {
    id: 'racing',
    title: 'Motion Racing Simulators',
    subtitle: 'Direct Drive 25Nm · Triple Curved 165Hz · Hydraulic Pedals',
    tagline: 'High-G Force Direct-Drive Motorsport Immersion',
    image: '/images/zones/zone3_racing.jpg',
    description: 'Experience professional sim racing in custom 3DOF motion cockpits powered by Fanatec Podium DD2 direct-drive wheelbases and hydraulic load-cell pedals. Surrounded by panoramic triple 32-inch 165Hz curved monitors.',
    specs: [
      'Fanatec Podium DD2 25Nm Direct Drive Wheels',
      '3DOF Real-Time Motion Platform Chassis',
      'Triple 32" Curved 165Hz Surround Displays',
      'Hydraulic Inverted Load-Cell Pedal Box',
      'Assetto Corsa, F1 24, iRacing, Gran Turismo 7'
    ],
    capacity: '1 Driver per Rig · Head-to-Head Telemetry',
    pricingHint: 'Sprint laps & Grand Prix race passes',
    color: {
      accent: 'text-fuchsia-400',
      glow: 'shadow-[0_0_30px_rgba(217,70,239,0.25)]',
      border: 'border-fuchsia-500/30'
    }
  },
  {
    id: 'arcade',
    title: 'Retro-Modern Arcade',
    subtitle: 'Japanese Candy Cabs · Sanwa Controls · 120+ Classic Hits',
    tagline: 'Authentic Arcade Culture Reborn with Contemporary Hardware',
    image: '/images/zones/zone4_arcade.jpg',
    description: 'Step into an authentic arcade hall featuring restored and modern Japanese candy cabinets fitted with crisp low-lag screens, authentic Sanwa Denshi joysticks, micro-switch buttons, and rhythm machines.',
    specs: [
      'Custom Vewlix Japanese Candy Cabinets',
      'Tournament Sanwa Denshi Sticks & Buttons',
      'Street Fighter 6, Tekken, Metal Slug, Neo-Geo',
      'Rhythm & Beatmania Station',
      '4-Player Arcade Brawler Cabinets'
    ],
    capacity: 'Solo, Versus & 4-Player Co-op',
    pricingHint: 'Token cards & Unlimited hour wristbands',
    color: {
      accent: 'text-amber-400',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
      border: 'border-amber-500/30'
    }
  }
];

export interface FoodMenuItem {
  id: string;
  name: string;
  category: 'All' | 'Mains' | 'Bites' | 'Drinks' | 'Desserts';
  categoryLabel: string;
  price: number;
  image: string;
  desc: string;
  badge?: string;
  dietary?: string;
  prepTime?: string;
}

const CAFE_ITEMS: FoodMenuItem[] = [
  {
    id: 'food-1',
    name: 'Milano Smash Burger',
    category: 'Mains',
    categoryLabel: 'Gourmet Mains',
    price: 14.50,
    image: '/images/food/burger.jpg',
    desc: 'Double Angus beef patties, melted aged cheddar, house truffle aioli & crispy shallots on toasted brioche.',
    badge: "Chef's Signature",
    dietary: 'Angus Beef',
    prepTime: '10-12 mins'
  },
  {
    id: 'food-2',
    name: 'Artisan Wood-Fired Pizza',
    category: 'Mains',
    categoryLabel: 'Gourmet Mains',
    price: 16.00,
    image: '/images/food/pizza.jpg',
    desc: 'San Marzano tomato base, fresh buffalo mozzarella, fresh basil, cold-pressed olive oil & chili drizzle.',
    badge: 'Popular',
    dietary: 'Vegetarian',
    prepTime: '12-14 mins'
  },
  {
    id: 'food-3',
    name: 'Truffle Parmesan Fries',
    category: 'Bites',
    categoryLabel: 'Lounge Bites',
    price: 8.50,
    image: '/images/food/fries.jpg',
    desc: 'Hand-cut russet potatoes, aromatic white truffle oil, shaved 24-month aged parmesan & rosemary sea salt.',
    badge: 'Top Shareable',
    dietary: 'Vegetarian',
    prepTime: '6-8 mins'
  },
  {
    id: 'food-4',
    name: 'Smoked Crispy Glazed Wings',
    category: 'Bites',
    categoryLabel: 'Lounge Bites',
    price: 12.00,
    image: '/images/food/wings.jpg',
    desc: 'Crispy jumbo wings tossed in hot honey gochujang glaze with roasted sesame & homemade blue cheese dip.',
    badge: 'Fan Favorite',
    dietary: 'Gluten-Free',
    prepTime: '8-10 mins'
  },
  {
    id: 'food-5',
    name: 'Ultraviolet Citrus Fizz',
    category: 'Drinks',
    categoryLabel: 'Craft Mocktail',
    price: 7.50,
    image: '/images/food/cocktail.jpg',
    desc: 'Butterfly pea flower tea, fresh yuzu reduction, bruised organic mint, sparkling elderflower splash.',
    badge: 'Signature Mocktail',
    dietary: 'Zero Alcohol',
    prepTime: '3-4 mins'
  },
  {
    id: 'food-6',
    name: 'Nitro Cold Brew Boost',
    category: 'Drinks',
    categoryLabel: 'Fuel & Coffee',
    price: 6.00,
    image: '/images/food/coffee.jpg',
    desc: 'Velvety single-origin Ethiopian cold brew charged with nitrogen for natural cascading creamy sweetness.',
    badge: 'Gaming Energy',
    dietary: 'Vegan / Keto',
    prepTime: '2 mins'
  },
  {
    id: 'food-7',
    name: 'Street Birria Tacos (3 pcs)',
    category: 'Mains',
    categoryLabel: 'Gourmet Mains',
    price: 13.50,
    image: '/images/food/tacos.jpg',
    desc: 'Slow-braised beef chuck, melted quesillo cheese, grilled corn tortillas with rich savory dipping consommé.',
    badge: 'New Arrival',
    dietary: 'High Protein',
    prepTime: '8-10 mins'
  },
  {
    id: 'food-8',
    name: 'Warm Lava Brioche French Toast',
    category: 'Desserts',
    categoryLabel: 'Sweet Fuel',
    price: 9.50,
    image: '/images/food/dessert.jpg',
    desc: 'Golden brioche, melted Belgian dark chocolate core, Madagascar vanilla bean gelato & crushed pistachios.',
    badge: 'Late Night Sweet',
    dietary: 'Vegetarian',
    prepTime: '6-8 mins'
  }
];

interface ArenaProps {
  onSelectActivityForBooking: (activityId: GamingActivityId) => void;
}

export const Arena: React.FC<ArenaProps> = ({ onSelectActivityForBooking }) => {
  const [selectedActivityId, setSelectedActivityId] = useState<GamingActivityId>('snooker');
  const [hoveredCard, setHoveredCard] = useState<GamingActivityId | null>(null);

  // Café & Food Menu Interactive State
  const [foodCategory, setFoodCategory] = useState<'All' | 'Mains' | 'Bites' | 'Drinks' | 'Desserts'>('All');
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [deliveryBay, setDeliveryBay] = useState('Snooker Bay 03');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderedItems, setLastOrderedItems] = useState<{ name: string; count: number; price: number }[]>([]);

  const activeActivity = ACTIVITIES.find(a => a.id === selectedActivityId) || ACTIVITIES[0];

  const handleSelect = (id: GamingActivityId) => {
    soundManager.playSelect();
    setSelectedActivityId(id);
  };

  const addToCart = (item: FoodMenuItem) => {
    soundManager.playConfirm();
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    soundManager.playBlip(320);
    setCart(prev => {
      const next = { ...prev };
      if (next[itemId] > 1) {
        next[itemId] -= 1;
      } else {
        delete next[itemId];
      }
      return next;
    });
  };

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalCartPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = CAFE_ITEMS.find(i => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playConfirm();
    const ordered = Object.entries(cart).map(([id, qty]) => {
      const item = CAFE_ITEMS.find(i => i.id === id)!;
      return { name: item.name, count: qty, price: item.price };
    });
    setLastOrderedItems(ordered);
    setOrderSuccess(true);
    setCart({});
  };

  const filteredFoodItems = foodCategory === 'All' 
    ? CAFE_ITEMS 
    : CAFE_ITEMS.filter(item => item.category === foodCategory);

  const renderVisual = (id: GamingActivityId, isHovered: boolean) => {
    switch (id) {
      case 'snooker':
        return <SnookerVisual isHovered={isHovered} />;
      case 'ps5':
        return <PS5Visual isHovered={isHovered} />;
      case 'racing':
        return <RacingVisual isHovered={isHovered} />;
      case 'arcade':
        return <ArcadeVisual isHovered={isHovered} />;
    }
  };

  return (
    <section id="arena" className="relative py-28 bg-[#070b16] border-t border-white/5 overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
              <Sparkles className="w-4 h-4" />
              <span>THE INTERACTIVE ARENA</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase text-balance">
              FOUR WORLDS.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                ONE ROOF.
              </span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-md font-normal leading-relaxed text-balance">
            Engineered for casual matches, high-stakes tournaments, and sensory immersion. 
            Select any gaming experience below to inspect specs and reserve your bay.
          </p>
        </div>

        {/* Dynamic Activity Selector Tabs (Clean Segmented Controller) */}
        <div id="experiences" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {ACTIVITIES.map((act) => {
            const isActive = act.id === selectedActivityId;
            return (
              <button
                key={act.id}
                onClick={() => handleSelect(act.id)}
                className={`group relative p-3 sm:p-4 rounded-xl text-left transition-all duration-300 border flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 overflow-hidden ${
                  isActive
                    ? `bg-slate-900/95 ${act.color.border} ${act.color.glow} shadow-xl scale-[1.01]`
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden border shrink-0 transition-all duration-300 ${
                    isActive ? `${act.color.border} ring-2 ring-cyan-400/30 scale-105 shadow-md` : 'border-slate-800/90 group-hover:border-slate-700'
                  }`}>
                    <img 
                      src={act.image} 
                      alt={act.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider ${isActive ? act.color.accent : 'text-slate-400'}`}>
                        Zone 0{ACTIVITIES.indexOf(act) + 1}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </div>
                    <h3 className={`text-xs sm:text-sm md:text-base font-bold font-display uppercase tracking-wide truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {act.title}
                    </h3>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                  {act.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Featured Interactive Arena Showcase (Asymmetric 2-Column Presentation) */}
        <div className="bg-[#090e1f] rounded-3xl border border-slate-800/80 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle interior glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Visual Canvas Stage (7 Columns) */}
            <div 
              className="lg:col-span-7 h-[340px] sm:h-[420px] md:h-[480px] w-full"
              onMouseEnter={() => setHoveredCard(activeActivity.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {renderVisual(activeActivity.id, hoveredCard === activeActivity.id)}
            </div>

            {/* Hardware & Experience Detail Card (5 Columns) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                <span>{activeActivity.capacity}</span>
                <span className="text-cyan-500" aria-hidden="true">·</span>
                <span className={activeActivity.color.accent}>Active Specification</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display uppercase tracking-tight text-white mb-2">
                {activeActivity.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-cyan-400 font-medium mb-4">
                {activeActivity.subtitle}
              </p>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {activeActivity.description}
              </p>

              {/* Verified Hardware Specifications List */}
              <div className="space-y-2.5 mb-8 border-t border-b border-slate-800 py-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Pro-Tier Hardware Config:
                </span>
                {activeActivity.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons for this Experience */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => {
                    soundManager.playConfirm();
                    onSelectActivityForBooking(activeActivity.id);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span>Reserve {activeActivity.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="text-xs text-slate-400 text-center sm:text-left sm:pl-2">
                  <span className="block font-medium text-slate-300">Instant Bay Allocation</span>
                  <span>{activeActivity.pricingHint}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* =========================================================================
            THE GOURMET CAFÉ & FOOD EXPERIENCE (IN-BAY DIGITAL ORDERING MENU)
            ========================================================================= */}
        <div 
          id="cafe" 
          className="mt-16 rounded-3xl border border-slate-700/80 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl bg-cover bg-center bg-no-repeat transition-all duration-300"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(10, 15, 29, 0.88) 0%, rgba(7, 11, 22, 0.82) 45%, rgba(5, 8, 17, 0.94) 100%), url('/images/cafe-bg.jpg')`
          }}
        >
          {/* Subtle Ambient Decorative Gradients & High-Contrast Overlay */}
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />


          {/* Café Section Header & In-Bay Order Status */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <UtensilsCrossed className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
                  <span>CASA MILANO FOOD & BEVERAGE</span>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    KITCHEN ACTIVE
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display uppercase tracking-tight text-white">
                  Craft Kitchen & Artisan Fuel Bar
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  Chef-prepared gourmet burgers, crisp artisan bites, specialty espresso, and signature mocktails served directly to your snooker table or console station.
                </p>
              </div>
            </div>

            {/* Quick Order Cart Summary & Station Delivery Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Open till <strong>03:00 AM</strong></span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundManager.playSelect();
                  setIsOrderModalOpen(true);
                }}
                className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                  totalCartCount > 0
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 scale-105'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Order {totalCartCount > 0 && `(${totalCartCount})`}</span>
                {totalCartCount > 0 && (
                  <span className="bg-black/20 text-black px-2 py-0.5 rounded-full text-xs font-mono font-black ml-1">
                    ${totalCartPrice.toFixed(2)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar relative z-10">
            {(['All', 'Mains', 'Bites', 'Drinks', 'Desserts'] as const).map((cat) => {
              const isSelected = foodCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundManager.playBlip(480);
                    setFoodCategory(cat);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 border ${
                    isSelected
                      ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-105'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  {cat === 'All' ? 'All Menu Items' : cat}
                </button>
              );
            })}
          </div>

          {/* Food Menu Items Grid: Photo on Top, Clear Name & Order Details Below */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {filteredFoodItems.map((item) => {
              const inCartQty = cart[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-amber-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  {/* Food Item Image with Tag & Price Badge */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      {item.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-black backdrop-blur-sm shadow-md">
                          {item.badge}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider bg-black/60 text-slate-300 backdrop-blur-sm border border-white/10">
                          {item.categoryLabel}
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/75 text-amber-400 backdrop-blur-sm border border-amber-500/30">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Dietary / Prep Time Pill at bottom of image */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-slate-300 pointer-events-none">
                      <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm text-slate-300">
                        {item.dietary}
                      </span>
                      <span className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400 inline" />
                        {item.prepTime}
                      </span>
                    </div>
                  </div>

                  {/* Food Details Below Image */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400/90 mb-1">
                        {item.categoryLabel}
                      </div>

                      {/* Prominent Food Item Name below the image */}
                      <h4 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-amber-300 transition-colors leading-tight mb-2">
                        {item.name}
                      </h4>

                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    {/* Price and Ordering Button Row */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Price</span>
                        <span className="text-base font-extrabold font-mono text-amber-400">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      {inCartQty > 0 ? (
                        <div className="flex items-center gap-1.5 bg-slate-950 border border-amber-500/40 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors focus-visible:outline-none"
                            aria-label={`Remove one ${item.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-bold text-white">
                            {inCartQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition-colors focus-visible:outline-none"
                            aria-label={`Add another ${item.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-500 text-amber-400 hover:text-black text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery to Station Guarantee Banner */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-300 font-medium">In-Bay Ordering Service:</span>
              <span>Enjoy continuous play — our stewards deliver directly to your table or sim cockpit.</span>
            </div>
            {totalCartCount > 0 && (
              <button
                type="button"
                onClick={() => setIsOrderModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 flex items-center gap-1 shrink-0"
              >
                Complete In-Bay Order ({totalCartCount} items · ${totalCartPrice.toFixed(2)}) →
              </button>
            )}
          </div>

          {/* Order Checkout / Station Selection Modal */}
          {isOrderModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
              <div 
                className="bg-[#0b1020] border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-display uppercase tracking-wider text-white">
                        Your Café Order
                      </h4>
                      <p className="text-xs text-slate-400">Direct In-Bay Table Delivery</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundManager.playBlip(300);
                      setIsOrderModalOpen(false);
                      setOrderSuccess(false);
                    }}
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {orderSuccess ? (
                  /* Success Confirmation State */
                  <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-display uppercase tracking-wide text-white">
                        Order Sent to Kitchen!
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        Delivering fresh to <strong className="text-amber-400">{deliveryBay}</strong> in ~10–12 minutes.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2">
                      <div className="text-slate-400 font-mono uppercase tracking-wider">Order Items:</div>
                      {lastOrderedItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-slate-200">
                          <span>{item.count}x {item.name}</span>
                          <span className="font-mono text-amber-400">${(item.price * item.count).toFixed(2)}</span>
                        </div>
                      ))}
                      {orderNotes && (
                        <div className="pt-2 border-t border-slate-800 text-slate-400 italic">
                          "{orderNotes}"
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playConfirm();
                        setIsOrderModalOpen(false);
                        setOrderSuccess(false);
                      }}
                      className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    >
                      Back to Gaming & Menu
                    </button>
                  </div>
                ) : (
                  /* Cart Form State */
                  <form onSubmit={handlePlaceOrder} className="p-6 space-y-5">
                    {/* Items List */}
                    <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                      {totalCartCount === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">
                          Your order is empty. Select items from the menu above to order!
                        </div>
                      ) : (
                        Object.entries(cart).map(([itemId, qty]) => {
                          const item = CAFE_ITEMS.find(i => i.id === itemId);
                          if (!item) return null;
                          return (
                            <div
                              key={itemId}
                              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-bold text-white truncate">{item.name}</h5>
                                <span className="text-xs font-mono text-amber-400">
                                  ${item.price.toFixed(2)} each
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <span className="w-5 text-center text-xs font-mono font-bold text-white">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addToCart(item)}
                                  className="w-6 h-6 rounded bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {totalCartCount > 0 && (
                      <>
                        {/* Select Gaming Bay for Delivery */}
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                            Deliver to Station / Table
                          </label>
                          <select
                            value={deliveryBay}
                            onChange={(e) => setDeliveryBay(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          >
                            <option value="Snooker Table 01 (Tournament)">Snooker Table 01 (Tournament Slate)</option>
                            <option value="Snooker Table 02 (Pro)">Snooker Table 02 (Pro Slate)</option>
                            <option value="Snooker Bay 03">Snooker Bay 03 (Standard 12ft)</option>
                            <option value="PS5 Battle Station #01 (OLED)">PS5 Battle Station #01 (OLED)</option>
                            <option value="PS5 Battle Station #02 (Co-op)">PS5 Battle Station #02 (Co-op)</option>
                            <option value="Motion Sim Cockpit #01 (Formula)">Motion Sim Cockpit #01 (Formula)</option>
                            <option value="Motion Sim Cockpit #02 (GT3)">Motion Sim Cockpit #02 (GT3)</option>
                            <option value="Arcade Hall Cab #04">Arcade Hall Cab #04</option>
                            <option value="Fuel Bar / Lounge Seating">Fuel Bar / Lounge Seating</option>
                          </select>
                        </div>

                        {/* Order Notes / Special Instructions */}
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                            Special Instructions / Dietary Notes (Optional)
                          </label>
                          <input
                            type="text"
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            placeholder="e.g. Extra napkins, no ice, dressing on the side..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        {/* Total Bill Calculation */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-400 block">Total In-Bay Order:</span>
                            <span className="text-xl font-mono font-black text-amber-400">
                              ${totalCartPrice.toFixed(2)}
                            </span>
                          </div>
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                          >
                            Send Order to Kitchen
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
