import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart, Menu, X, Heart, Eye, ArrowRight, Star,
  Plus, Minus, Trash2, Instagram,
  ChevronDown, Gem, Gift, Award, Package, Sparkles, MessageCircle, Shield,
} from "lucide-react";
import { BangleViewer, DESIGN_TEMPLATES } from "./BangleViewer";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page = "home" | "collection" | "customization" | "about" | "cart" | "product";
interface CartItem {
  id: number; name: string; price: number; size: string; qty: number; img: string;
}

// ─── Image URLs ───────────────────────────────────────────────────────────────
const IMG = {
  hero1: "https://images.unsplash.com/photo-1601482438629-346a273776af?w=1400&h=900&fit=crop&auto=format",
  hero2: "https://images.unsplash.com/photo-1709456533985-254ebb7b00db?w=1400&h=900&fit=crop&auto=format",
  bangles1: "https://images.unsplash.com/photo-1762342345465-d021b8491309?w=800&h=1000&fit=crop&auto=format",
  bangles2: "https://images.unsplash.com/photo-1723144290281-de6d80a79028?w=800&h=1000&fit=crop&auto=format",
  bangles3: "https://images.unsplash.com/photo-1718878404004-6502a550c23b?w=800&h=1000&fit=crop&auto=format",
  bride: "https://images.unsplash.com/photo-1740431377901-c2f28d50c759?w=800&h=1000&fit=crop&auto=format",
  woman: "https://images.unsplash.com/photo-1688382654723-a7366006519b?w=800&h=1000&fit=crop&auto=format",
  artisan: "https://images.unsplash.com/photo-1721508490084-1b1de5b230d4?w=800&h=600&fit=crop&auto=format",
  lac1: "/images/raw_lac_resin.png",
  lac2: "/images/melting_lac.png",
  lac3: "/images/lac_sticks.png",
};

// ─── Fade-In Wrapper ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1C1209]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="relative w-28 h-28 mb-8"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <linearGradient id="bangGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4974A" />
              <stop offset="50%" stopColor="#E8C07D" />
              <stop offset="100%" stopColor="#C4974A" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="44" fill="none" stroke="url(#bangGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray="220 60" />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <circle
              key={i}
              cx={60 + 44 * Math.cos((deg * Math.PI) / 180)}
              cy={60 + 44 * Math.sin((deg * Math.PI) / 180)}
              r="4"
              fill="#C4974A"
            />
          ))}
        </svg>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.3em" }}
        animate={{ opacity: 1, letterSpacing: "0.5em" }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-[#C4974A] text-xs font-[Manrope] font-light uppercase tracking-[0.5em]"
      >
        Pilani Lac
      </motion.p>
    </motion.div>
  );
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
      }
    };
    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);
    document.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,[data-hover]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => document.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#C4974A] z-[999] pointer-events-none transition-transform duration-75" />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-[#C4974A]/60 z-[999] pointer-events-none transition-all duration-200 ${hovering ? "w-10 h-10 -translate-x-2 -translate-y-2 bg-[#C4974A]/10" : "w-9 h-9"}`}
      />
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, cartCount }: { page: Page; setPage: (p: Page) => void; cartCount: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links: { label: string; key: Page }[] = [
    { label: "Home", key: "home" },
    { label: "Collections", key: "collection" },
    { label: "Customization", key: "customization" },
    { label: "Our Story", key: "about" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#FAF8F5]/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <button
          onClick={() => setPage("home")}
          className="font-['DM_Serif_Display'] text-xl text-foreground tracking-wide"
        >
          Pilani<span className="text-[#C4974A]"> Lac</span>
        </button>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map(l => (
            <button
              key={l.key}
              onClick={() => setPage(l.key)}
              className={`relative font-[Manrope] text-sm font-medium transition-colors duration-200 ${page === l.key ? "text-[#6B1F1F]" : "text-foreground/70 hover:text-foreground"}`}
            >
              {l.label}
              {page === l.key && (
                <motion.span layoutId="navUnderline" className="absolute -bottom-1 left-0 right-0 h-px bg-[#C4974A]" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setPage("cart")} className="relative p-2 text-foreground/70 hover:text-foreground transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6B1F1F] text-white text-[10px] font-[Manrope] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-foreground/70">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-[#FAF8F5]/95 backdrop-blur-md border-t border-border"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {links.map(l => (
                <button
                  key={l.key}
                  onClick={() => { setPage(l.key); setMobileOpen(false); }}
                  className="font-[Manrope] text-base text-left text-foreground/80 hover:text-[#6B1F1F] transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── Bangle SVG Preview ───────────────────────────────────────────────────────
function BangleSVG({ primary, secondary, stoneColor, showStones, finish, pattern, size = 300 }: {
  primary: string; secondary: string; stoneColor: string; showStones: boolean; finish: string; pattern: string; size?: number;
}) {
  const r = 110;
  const cx = 150;
  const cy = 150;
  const stoneCount = 8;
  const strokeWidth = 28;

  return (
    <svg viewBox="0 0 300 300" width={size} height={size} className="drop-shadow-2xl">
      <defs>
        <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="50%" stopColor={secondary} />
          <stop offset="100%" stopColor={primary} />
        </linearGradient>
        <linearGradient id="shine1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </linearGradient>
        <filter id="bshadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>

      {/* main band */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#bg1)" strokeWidth={strokeWidth} filter="url(#bshadow)" />
      {/* shine overlay */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#shine1)" strokeWidth={strokeWidth - 2} opacity={finish === "Gloss" ? 0.8 : 0.3} />

      {/* pattern details */}
      {pattern !== "Plain" && (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray={pattern === "Geometric" ? "8 8" : pattern === "Floral" ? "4 12" : "6 6"} />
      )}

      {/* stones */}
      {showStones && Array.from({ length: stoneCount }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / stoneCount - Math.PI / 2;
        const sx = cx + r * Math.cos(angle);
        const sy = cy + r * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={sx} cy={sy} r={7} fill={stoneColor} opacity={0.95} />
            <circle cx={sx - 2} cy={sy - 2} r={2.5} fill="rgba(255,255,255,0.6)" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, onWishlist, wishlisted, onSelect }: {
  product: { id: number; name: string; price: number; sizes: string[]; img: string; img2?: string; tag?: string; desc?: string };
  onAddToCart: (p: typeof product, size: string) => void;
  onWishlist: (id: number) => void;
  wishlisted: boolean;
  onSelect?: (p: typeof product) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [showQuick, setShowQuick] = useState(false);

  return (
    <motion.div
      className="group relative bg-card rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect && onSelect(product)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-black p-8">
        <img
          src={product.img}
          alt={product.name}
          className={`w-full h-full object-contain transition-all duration-700 ${hovered && product.img2 ? "opacity-0" : "opacity-100"}`}
        />
        {product.img2 && (
          <img
            src={product.img2}
            alt={product.name + " alternate"}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
          />
        )}
        {product.tag && (
          <span className="absolute top-3 left-3 bg-[#6B1F1F] text-white text-[10px] font-[Manrope] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
            {product.tag}
          </span>
        )}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onWishlist(product.id); }}
            className="w-9 h-9 rounded-full bg-[#FAF8F5]/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <Heart size={15} fill={wishlisted ? "#6B1F1F" : "none"} stroke={wishlisted ? "#6B1F1F" : "currentColor"} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowQuick(!showQuick); }}
            className="w-9 h-9 rounded-full bg-[#FAF8F5]/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <Eye size={15} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-['DM_Serif_Display'] text-base text-foreground mb-1">{product.name}</h3>
        <p className="font-[Manrope] text-sm text-muted-foreground mb-3">₹{product.price.toLocaleString("en-IN")}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.sizes.map(s => (
            <button
              key={s}
              onClick={(e) => { e.stopPropagation(); setSelectedSize(s); }}
              className={`text-[11px] font-[Manrope] px-2.5 py-1 rounded-full border transition-all duration-200 ${selectedSize === s ? "border-[#6B1F1F] bg-[#6B1F1F] text-white" : "border-border text-muted-foreground hover:border-[#6B1F1F]/50"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product, selectedSize); }}
            className="flex-1 text-xs font-[Manrope] font-semibold uppercase tracking-widest py-2.5 rounded-full border border-[#6B1F1F] text-[#6B1F1F] hover:bg-[#6B1F1F] hover:text-white transition-all duration-300"
          >
            Add to Cart
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-xs font-[Manrope] font-semibold uppercase tracking-widest py-2.5 rounded-full bg-[#C4974A] text-white hover:bg-[#a87e38] transition-all duration-300"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ setPage }: { setPage: (p: Page) => void }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 12 });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* animated background gradient */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#FAF8F5] via-[#F5EFE6] to-[#EDE0CC]"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#C4974A]/8 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-[#6B1F1F]/6 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left text */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-[Manrope] text-xs uppercase tracking-[0.35em] text-[#C4974A] mb-6"
          >
            Handcrafted in India
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-['DM_Serif_Display'] text-5xl lg:text-7xl xl:text-8xl text-foreground leading-[1.05] mb-6"
          >
            Handcrafted Lac Bangles That{" "}
            <span className="italic text-[#6B1F1F]">Celebrate</span> Every Story.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="font-[Manrope] text-base lg:text-lg text-muted-foreground max-w-lg leading-relaxed mb-10"
          >
            Luxury handcrafted lac bangles inspired by Indian tradition and designed for modern elegance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => setPage("collection")}
              className="group flex items-center gap-2 bg-[#6B1F1F] text-white font-[Manrope] font-semibold text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#5a1a1a] transition-all duration-300"
            >
              Explore Collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => setPage("customization")}
              className="flex items-center gap-2 border border-[#6B1F1F] text-[#6B1F1F] font-[Manrope] font-semibold text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#6B1F1F]/5 transition-all duration-300"
            >
              Design Your Own
            </button>
          </motion.div>
        </div>

        {/* Right image */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{ x: mousePos.x, y: mousePos.y }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="w-80 h-80 lg:w-[480px] lg:h-[480px] rounded-full overflow-hidden shadow-2xl ring-1 ring-[#C4974A]/20">
              <img src={IMG.hero1} alt="Handcrafted lac bangles" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/50">
              <img src={IMG.bangles2} alt="Lac bangle detail" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full overflow-hidden shadow-xl ring-1 ring-white/50">
              <img src={IMG.bangles1} alt="Floral bangle" className="w-full h-full object-cover" />
            </div>
            {/* floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 -left-10 bg-[#FAF8F5]/90 backdrop-blur-sm rounded-2xl shadow-xl px-4 py-3"
            >
              <p className="font-[Manrope] text-xs text-muted-foreground">Handcrafted</p>
              <p className="font-['DM_Serif_Display'] text-sm text-foreground">Since Generations</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-[Manrope] text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <ChevronDown size={16} className="text-[#C4974A]" />
      </motion.div>
    </section>
  );
}


// ─── Craftsmanship Timeline ───────────────────────────────────────────────────
function CraftsmanshipSection() {
  const steps = [
    { num: "01", title: "Raw Lac", desc: "Sourced from the Kerria lacca insect, the finest resin is hand-selected." },
    { num: "02", title: "Heating", desc: "The lac is carefully heated over an open flame to soften and purify." },
    { num: "03", title: "Color Mixing", desc: "Natural pigments are blended in by hand to create vivid, lasting hues." },
    { num: "04", title: "Hand Rolling", desc: "Artisans roll the warm lac around a mandrel to form the perfect ring." },
    { num: "05", title: "Stone Setting", desc: "Kundan, pearl, or crystal stones are inlaid while the lac is still warm." },
    { num: "06", title: "Final Polish", desc: "Each bangle is buffed and inspected before leaving our studio." },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-28 bg-[#F5EFE6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-14">
        <FadeIn>
          <p className="font-[Manrope] text-xs uppercase tracking-[0.35em] text-[#C4974A] mb-3">The Process</p>
          <h2 className="font-['DM_Serif_Display'] text-4xl lg:text-5xl text-foreground">
            Our Craftsmanship
          </h2>
        </FadeIn>
      </div>

      <div ref={scrollRef} className="flex gap-6 px-6 lg:px-10 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {steps.map((s, i) => (
          <FadeIn key={s.num} delay={i * 0.08} className="snap-start flex-none w-72 lg:w-80">
            <div className="bg-[#FAF8F5] rounded-2xl p-8 h-full shadow-sm hover:shadow-md transition-shadow duration-300">
              <span className="font-['DM_Serif_Display'] text-5xl text-[#C4974A]/30 block mb-4">{s.num}</span>
              <h3 className="font-['DM_Serif_Display'] text-2xl text-foreground mb-3">{s.title}</h3>
              <p className="font-[Manrope] text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}


// ─── Design Your Own Banner ───────────────────────────────────────────────────
function DesignYourOwnBanner({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <section className="py-20 px-6 lg:px-10">
      <FadeIn>
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#1C1209] overflow-hidden relative">
          <div className="absolute inset-0 opacity-30">
            <img src={IMG.hero2} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1209] via-[#1C1209]/80 to-transparent" />
          <div className="relative px-10 lg:px-20 py-20 lg:py-24 max-w-2xl">
            <motion.div
              className="w-16 h-px bg-[#C4974A] mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <p className="font-[Manrope] text-xs uppercase tracking-[0.35em] text-[#C4974A] mb-4">Signature Experience</p>
            <h2 className="font-['DM_Serif_Display'] text-4xl lg:text-6xl text-white leading-tight mb-6">
              Design Your Own<br /><span className="italic">Lac Bangle</span>
            </h2>
            <p className="font-[Manrope] text-base text-white/60 leading-relaxed mb-10">
              Create a handcrafted bangle uniquely yours — select colours, patterns, stones, finishes, and sizes. Watch your design come alive in real time.
            </p>
            <button
              onClick={() => setPage("customization")}
              className="group flex items-center gap-3 bg-[#C4974A] text-white font-[Manrope] font-semibold text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#a87e38] transition-all duration-300"
            >
              Start Designing
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          {/* floating bangle preview */}
          <motion.div
            className="hidden lg:block absolute right-24 top-1/2 -translate-y-1/2 opacity-90"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <BangleSVG primary="#C4974A" secondary="#8B6914" stoneColor="#FAF8F5" showStones={true} finish="Gloss" pattern="Geometric" size={220} />
          </motion.div>
        </div>
      </FadeIn>
    </section>
  );
}

// ─── Why Choose Us ────────────────────────────────────────────────────────────
function WhyChooseUs() {
  const features = [
    { icon: Gem, title: "Handcrafted", desc: "Every bangle is individually shaped and finished by master artisans." },
    { icon: Award, title: "Premium Materials", desc: "Only the finest lac resin, natural pigments, and genuine stones." },
    { icon: Package, title: "Made in India", desc: "Rooted in centuries of Indian bangleware tradition." },
    { icon: Sparkles, title: "Custom Designs", desc: "Design a bangle as unique as your story." },
    { icon: Gift, title: "Perfect Gift", desc: "Presented in luxury packaging, ready to delight." },
    { icon: Star, title: "Long-lasting Finish", desc: "Our proprietary sealing process keeps colours vivid for years." },
  ];

  return (
    <section className="py-28 bg-[#F5EFE6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <FadeIn>
          <p className="font-[Manrope] text-xs uppercase tracking-[0.35em] text-[#C4974A] mb-3">Why Us</p>
          <h2 className="font-['DM_Serif_Display'] text-4xl lg:text-5xl text-foreground mb-16">
            The Pilani Lac Difference
          </h2>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <div className="bg-[#FAF8F5] rounded-2xl p-7 group hover:shadow-lg transition-shadow duration-300">
                <div className="w-11 h-11 rounded-xl bg-[#6B1F1F]/8 flex items-center justify-center mb-5 group-hover:bg-[#6B1F1F]/12 transition-colors duration-300">
                  <f.icon size={20} className="text-[#6B1F1F]" />
                </div>
                <h3 className="font-['DM_Serif_Display'] text-lg text-foreground mb-2">{f.title}</h3>
                <p className="font-[Manrope] text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-[#1C1209] text-white/60 pt-16 pb-8 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-2">
            <button onClick={() => setPage("home")} className="font-['DM_Serif_Display'] text-2xl text-white mb-4 block">
              Pilani<span className="text-[#C4974A]"> Lac</span>
            </button>
            <p className="font-[Manrope] text-sm leading-relaxed text-white/50 max-w-xs">
              Handcrafted Indian lac bangles, made with tradition, love, and uncompromising craftsmanship.
            </p>
          </div>
          <div>
            <p className="font-[Manrope] text-xs uppercase tracking-widest text-[#C4974A] mb-5">Navigate</p>
            <div className="flex flex-col gap-3">
              {(["collection", "customization", "about"] as Page[]).map(p => (
                <button key={p} onClick={() => setPage(p)} className="font-[Manrope] text-sm text-white/50 hover:text-white capitalize text-left transition-colors">
                  {p === "customization" ? "Customization" : p === "about" ? "Our Story" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-[Manrope] text-xs uppercase tracking-widest text-[#C4974A] mb-5">Connect</p>
            <div className="flex flex-col gap-3">
              <a href="#" className="flex items-center gap-2 font-[Manrope] text-sm text-white/50 hover:text-white transition-colors">
                <Instagram size={14} /> Instagram
              </a>
              <a href="#" className="flex items-center gap-2 font-[Manrope] text-sm text-white/50 hover:text-white transition-colors">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-[Manrope] text-xs text-white/30">© 2026 Pilani Lac. All rights reserved.</p>
          <p className="font-[Manrope] text-xs text-white/30">Handcrafted with love in India.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Collection Page ──────────────────────────────────────────────────────────
function CollectionPage({ onAddToCart, wishlist, onWishlist, onSelectProduct }: {
  onAddToCart: (p: any, size: string) => void; wishlist: number[]; onWishlist: (id: number) => void; onSelectProduct: (p: any) => void;
}) {
  const products = [
    { id: 1, name: "Crimson Twist", price: 1200, sizes: ["2.4", "2.6", "2.8"], img: "/products/product-01.png" },
    { id: 2, name: "Candy Swirl", price: 950, sizes: ["2.4", "2.6", "2.8"], img: "/products/product-02.png" },
    { id: 3, name: "Ocean Marble", price: 1400, sizes: ["2.4", "2.6", "2.8"], img: "/products/product-03.png" },
    { id: 4, name: "Heritage Red", price: 1800, sizes: ["2.4", "2.6", "2.8"], img: "/products/product-04.png" },
    { id: 5, name: "Pastel Rope", price: 1100, sizes: ["2.4", "2.6", "2.8"], img: "/products/product-05.png" },
    { id: 6, name: "Gold Spiral", price: 1600, sizes: ["2.4", "2.6", "2.8"], img: "/products/product-06.png" },
    { id: 7, name: "Rainbow Lac", price: 1250, sizes: ["2.4", "2.6", "2.8"], img: "/products/product-07.png" },
    { id: 8, name: "Artisan Wave", price: 2100, sizes: ["2.4", "2.6", "2.8"], img: "/products/product-08.png" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
      <FadeIn>
        <p className="font-[Manrope] text-xs uppercase tracking-[0.35em] text-[#C4974A] mb-3">Shop</p>
        <h1 className="font-['DM_Serif_Display'] text-4xl lg:text-6xl text-foreground mb-12">Our Collections</h1>
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p, i) => (
          <FadeIn key={p.id} delay={i * 0.06}>
            <ProductCard product={p} onAddToCart={onAddToCart} onWishlist={onWishlist} wishlisted={wishlist.includes(p.id)} onSelect={onSelectProduct} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

// ─── Customization Page ───────────────────────────────────────────────────────
const banglesColors = [
  { name: "Crimson", value: "#C0392B", secondary: "#922B21" },
  { name: "Maroon", value: "#6B1F1F", secondary: "#4A1515" },
  { name: "Emerald", value: "#1E7E4A", secondary: "#145A32" },
  { name: "Sapphire", value: "#1A4A8B", secondary: "#0E2F5A" },
  { name: "Royal Blue", value: "#2C3E8C", secondary: "#1A2560" },
  { name: "Orchid", value: "#8E44AD", secondary: "#6C3483" },
  { name: "Champagne", value: "#C4974A", secondary: "#8B6914" },
  { name: "Ivory", value: "#F5EFE6", secondary: "#DDD0BA" },
  { name: "Onyx", value: "#2C2C2C", secondary: "#1A1A1A" },
  { name: "Rose", value: "#C47A6A", secondary: "#A0523E" },
];
const widths = ["Thin (4mm)", "Medium (8mm)", "Wide (12mm)"];

function CustomizationPage({ onAddToCart }: { onAddToCart: (p: any, size: string) => void }) {
  const [activeDesignId, setActiveDesignId] = useState<number>(1);
  const activeTemplate = DESIGN_TEMPLATES[activeDesignId as keyof typeof DESIGN_TEMPLATES];
  
  // Initialize colors to the default regions of the selected template
  const [colors, setColors] = useState<Record<string, string>>(activeTemplate.regions);
  
  // Update colors when design changes
  useEffect(() => {
    setColors(DESIGN_TEMPLATES[activeDesignId as keyof typeof DESIGN_TEMPLATES].regions);
  }, [activeDesignId]);

  const [width, setWidth] = useState(widths[1]);
  const [qty, setQty] = useState(1);

  const basePrice = 1200;
  const totalPrice = basePrice * qty;

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <FadeIn>
          <p className="font-[Manrope] text-xs uppercase tracking-[0.35em] text-[#C4974A] mb-2">Bangle Studio</p>
          <h1 className="font-['DM_Serif_Display'] text-4xl lg:text-5xl text-foreground mb-12">Design Your Bangle</h1>
        </FadeIn>

        {/* Choose a Design */}
        <div className="mb-12">
          <label className="font-[Manrope] text-xs uppercase tracking-widest text-muted-foreground mb-4 block">Choose a Design</label>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {Object.values(DESIGN_TEMPLATES).map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setActiveDesignId(tpl.id)}
                className={`relative flex-none w-24 h-24 rounded-2xl overflow-hidden transition-all duration-300 ${activeDesignId === tpl.id ? "ring-2 ring-offset-2 ring-[#C4974A] scale-105" : "hover:scale-105 opacity-60 hover:opacity-100"}`}
              >
                <div className="absolute inset-0 bg-black" />
                <img src={tpl.img} alt={tpl.name} className="w-full h-full object-contain p-2 relative z-10" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Preview */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-[#F5EFE6] rounded-3xl overflow-hidden flex flex-col items-center justify-center aspect-square shadow-inner relative">
              <BangleViewer designId={activeDesignId} colors={colors} width={width} />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            {/* Dynamic Colors */}
            <div className="space-y-6">
              {Object.keys(activeTemplate.regions).map(region => (
                <div key={region}>
                  <label className="font-[Manrope] text-xs uppercase tracking-widest text-muted-foreground mb-3 block">{region} Color</label>
                  <div className="flex flex-wrap gap-3">
                    {banglesColors.map(c => (
                      <button
                        key={c.name}
                        onClick={() => setColors(prev => ({ ...prev, [region]: c.value }))}
                        title={c.name}
                        className={`w-8 h-8 rounded-full transition-all duration-200 ${colors[region] === c.value ? "ring-2 ring-offset-2 ring-[#C4974A] scale-110" : "hover:scale-105"}`}
                        style={{ background: c.value, border: c.value === "#F5EFE6" || c.value === "#ffffff" ? "1px solid #C4AE8C" : "none" }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Width */}
            <div>
              <label className="font-[Manrope] text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Width</label>
              <div className="flex gap-2">
                {widths.map(w => (
                  <button key={w} onClick={() => setWidth(w)}
                    className={`font-[Manrope] text-xs px-3 py-2 rounded-full border transition-all duration-200 ${width === w ? "bg-[#6B1F1F] border-[#6B1F1F] text-white" : "border-border text-muted-foreground hover:border-[#6B1F1F]/40"}`}>
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="font-[Manrope] text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-[#6B1F1F]/50 transition-colors">
                  <Minus size={14} />
                </button>
                <span className="font-[Manrope] text-base w-8 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-[#6B1F1F]/50 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Live Summary */}
            <div className="bg-[#FAF8F5] border border-border rounded-2xl p-6">
              <h3 className="font-['DM_Serif_Display'] text-xl text-foreground mb-4">Live Summary</h3>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between font-[Manrope] text-sm">
                  <span className="text-muted-foreground">Design</span>
                  <span className="font-medium text-foreground">{activeTemplate.name}</span>
                </div>
                <div className="flex justify-between font-[Manrope] text-sm">
                  <span className="text-muted-foreground">Width</span>
                  <span className="font-medium text-foreground">{width}</span>
                </div>
                {Object.entries(colors).map(([region, color]) => {
                  const colorName = banglesColors.find(c => c.value === color)?.name || color;
                  return (
                    <div key={region} className="flex justify-between font-[Manrope] text-sm">
                      <span className="text-muted-foreground">{region} Color</span>
                      <span className="font-medium text-foreground flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border" style={{ background: color }}></span>
                        {colorName}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-[Manrope] text-sm text-muted-foreground">Total Price (x{qty})</span>
                <span className="font-['DM_Serif_Display'] text-2xl text-[#6B1F1F]">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={() => onAddToCart({ id: activeTemplate.id, name: `Custom ${activeTemplate.name}`, price: basePrice, img: activeTemplate.img }, "Custom")}
                className="flex-1 border border-[#6B1F1F] text-[#6B1F1F] font-[Manrope] font-semibold text-xs uppercase tracking-widest py-3 rounded-full hover:bg-[#6B1F1F]/5 transition-all duration-300"
              >
                Add to Cart
              </button>
              <button className="flex-1 bg-[#C4974A] text-white font-[Manrope] font-semibold text-xs uppercase tracking-widest py-3 rounded-full hover:bg-[#a87e38] transition-all duration-300">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail Page ──────────────────────────────────────────────────────
function ProductDetailPage({ product, onAddToCart, onWishlist, wishlisted, onBack }: {
  product: any; onAddToCart: (p: any, size: string) => void; onWishlist: (id: number) => void; wishlisted: boolean; onBack: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(product.img);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
      <FadeIn>
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-[Manrope] text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowRight size={16} className="rotate-180" /> Back to Collections
        </button>
      </FadeIn>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Gallery */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-[4/5] bg-card rounded-3xl overflow-hidden relative shadow-sm">
              <img src={activeImg} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />
              {product.tag && (
                <span className="absolute top-5 left-5 bg-[#6B1F1F] text-white text-xs font-[Manrope] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                  {product.tag}
                </span>
              )}
            </div>
            {product.img2 && (
              <div className="flex gap-4">
                <button onClick={() => setActiveImg(product.img)} className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === product.img ? "border-[#C4974A] opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={product.img} className="w-full h-full object-cover" />
                </button>
                <button onClick={() => setActiveImg(product.img2)} className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === product.img2 ? "border-[#C4974A] opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={product.img2} className="w-full h-full object-cover" />
                </button>
              </div>
            )}
          </div>
        </FadeIn>
        {/* Right Info */}
        <FadeIn delay={0.2}>
          <div className="pt-4 lg:sticky lg:top-28">
            <div className="flex items-start justify-between mb-2">
              <h1 className="font-['DM_Serif_Display'] text-4xl lg:text-5xl text-foreground leading-tight">{product.name}</h1>
              <button onClick={() => onWishlist(product.id)} className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors flex-none">
                <Heart size={20} fill={wishlisted ? "#6B1F1F" : "none"} stroke={wishlisted ? "#6B1F1F" : "currentColor"} />
              </button>
            </div>
            <p className="font-['DM_Serif_Display'] text-3xl text-[#6B1F1F] mb-6">₹{product.price.toLocaleString("en-IN")}</p>
            <p className="font-[Manrope] text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {product.desc || "Experience the timeless elegance of handcrafted Pilani Lac. Each piece is meticulously shaped by our master artisans, combining traditional techniques with contemporary design. Perfect for both everyday wear and special occasions."}
            </p>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="font-[Manrope] text-xs uppercase tracking-widest text-muted-foreground block">Select Size</span>
                <span className="font-[Manrope] text-xs text-[#C4974A] underline cursor-pointer hover:text-[#6B1F1F]">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`font-[Manrope] text-sm px-6 py-3 rounded-full border transition-all duration-300 ${selectedSize === s ? "border-[#6B1F1F] bg-[#6B1F1F] text-white shadow-md" : "border-border text-foreground hover:border-[#6B1F1F]/50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-10">
              <span className="font-[Manrope] text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Quantity</span>
              <div className="flex items-center gap-4 w-fit bg-card rounded-full p-1.5 border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-background transition-colors"><Minus size={14}/></button>
                <span className="w-8 text-center font-[Manrope] text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-background transition-colors"><Plus size={14}/></button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button onClick={() => { for(let i=0; i<qty; i++) onAddToCart(product, selectedSize); }} className="flex-1 font-[Manrope] font-semibold text-sm uppercase tracking-widest py-4 rounded-full border-2 border-[#6B1F1F] text-[#6B1F1F] hover:bg-[#6B1F1F] hover:text-white transition-all duration-300 text-center">
                Add to Cart
              </button>
              <button className="flex-1 font-[Manrope] font-semibold text-sm uppercase tracking-widest py-4 rounded-full bg-[#C4974A] text-white hover:bg-[#a87e38] shadow-lg shadow-[#C4974A]/20 transition-all duration-300 text-center">
                Buy Now
              </button>
            </div>
            <div className="pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Package size={20} className="text-[#C4974A] flex-none mt-1" />
                <div>
                  <p className="font-['DM_Serif_Display'] text-base text-foreground mb-1">Free Shipping</p>
                  <p className="font-[Manrope] text-xs text-muted-foreground">On all orders over ₹2000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-[#C4974A] flex-none mt-1" />
                <div>
                  <p className="font-['DM_Serif_Display'] text-base text-foreground mb-1">Authenticity</p>
                  <p className="font-[Manrope] text-xs text-muted-foreground">100% genuine handcrafted lac</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-background">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-28">
        <FadeIn>
          <p className="font-[Manrope] text-xs uppercase tracking-[0.35em] text-[#C4974A] mb-4">Our Origin</p>
          <h1 className="font-['DM_Serif_Display'] text-5xl lg:text-7xl text-foreground leading-[1.1] mb-8">
            Born in Pilani, <br /><span className="italic text-[#6B1F1F]">Built for Artisans</span>
          </h1>
          <p className="font-[Manrope] text-base text-muted-foreground leading-relaxed mb-6">
            Our story began when seven friends arrived in Pilani for an internship. Inspired by the rich cultural heritage and the untold stories of local craftspeople, we saw an opportunity to make a real difference.
          </p>
          <p className="font-[Manrope] text-base text-muted-foreground leading-relaxed">
            Pilani Lac was founded not just as a luxury jewelry brand, but as an incubator. We exist to empower local sellers, enhance their livelihoods, and provide a global platform for their breathtaking artistry.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <img src={IMG.lac1} alt="Lac craftsmanship" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-background hidden md:block">
              <img src={IMG.lac3} alt="Intricate gold details" className="w-full h-full object-cover" />
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Philosophy */}
      <div className="bg-[#1C1209] text-white py-32 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <Star size={32} className="text-[#C4974A] mx-auto mb-8 opacity-80" />
            <h2 className="font-['DM_Serif_Display'] text-4xl lg:text-5xl mb-8 leading-tight">
              "We don't just sell jewelry.<br/>We build futures for the hands that craft it."
            </h2>
            <p className="font-[Manrope] text-sm text-white/50 uppercase tracking-widest">— The Founders of Pilani Lac</p>
          </FadeIn>
        </div>
      </div>

      {/* The Process */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-28">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <FadeIn>
              <div className="rounded-3xl overflow-hidden aspect-video shadow-xl">
                <img src={IMG.lac2} alt="Golden lac resin" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2">
            <FadeIn delay={0.2}>
              <p className="font-[Manrope] text-xs uppercase tracking-[0.35em] text-[#C4974A] mb-4">The Material</p>
              <h2 className="font-['DM_Serif_Display'] text-4xl lg:text-5xl text-foreground mb-6">Pure & Natural</h2>
              <p className="font-[Manrope] text-sm text-muted-foreground leading-relaxed mb-8">
                Sourced from the Kerria lacca insect, pure lac resin is heated over an open flame until it reaches the perfect malleability. Our local artisan partners then blend in natural pigments, creating vivid, lasting hues that honor their generations of knowledge. 
              </p>
              <ul className="space-y-4">
                {[
                  "Empowering local communities and sellers",
                  "Fair trade and sustainable business practices",
                  "100% natural and responsibly harvested resin",
                  "A global stage for traditional Indian artisanship"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C4974A] mt-2 flex-none" />
                    <span className="font-[Manrope] text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Page ────────────────────────────────────────────────────────────────
function CartPage({ cart, setCart, setPage }: {
  cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>>; setPage: (p: Page) => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "PILANI10") setDiscount(Math.floor(subtotal * 0.1));
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 lg:px-10 max-w-5xl mx-auto">
      <FadeIn>
        <h1 className="font-['DM_Serif_Display'] text-4xl lg:text-5xl text-foreground mb-12">Your Cart</h1>
      </FadeIn>

      {cart.length === 0 ? (
        <FadeIn>
          <div className="text-center py-24">
            <ShoppingCart size={48} className="text-muted-foreground/30 mx-auto mb-5" />
            <p className="font-['DM_Serif_Display'] text-2xl text-muted-foreground mb-5">Your cart is empty</p>
            <button onClick={() => setPage("collection")} className="bg-[#6B1F1F] text-white font-[Manrope] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#5a1a1a] transition-colors">
              Explore Collection
            </button>
          </div>
        </FadeIn>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <FadeIn key={`${item.id}-${item.size}`}>
                <div className="bg-card rounded-2xl p-5 flex gap-5 items-start">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-none">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-['DM_Serif_Display'] text-base text-foreground">{item.name}</h3>
                    <p className="font-[Manrope] text-xs text-muted-foreground mt-0.5 mb-3">Size {item.size}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCart(c => c.map(i => i.id === item.id && i.size === item.size ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0))}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-[#6B1F1F]/50 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="font-[Manrope] text-sm w-6 text-center">{item.qty}</span>
                        <button onClick={() => setCart(c => c.map(i => i.id === item.id && i.size === item.size ? { ...i, qty: i.qty + 1 } : i))}
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-[#6B1F1F]/50 transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-['DM_Serif_Display'] text-base text-foreground">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                        <button onClick={() => setCart(c => c.filter(i => !(i.id === item.id && i.size === item.size)))}
                          className="text-muted-foreground hover:text-red-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.1}>
            <div className="bg-card rounded-2xl p-6 space-y-5 h-fit">
              <h2 className="font-['DM_Serif_Display'] text-xl text-foreground">Order Summary</h2>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 bg-background border border-border rounded-full px-4 py-2 font-[Manrope] text-xs text-foreground outline-none focus:border-[#C4974A] transition-colors"
                />
                <button onClick={applyCoupon} className="font-[Manrope] text-xs font-semibold px-4 py-2 rounded-full bg-[#6B1F1F]/10 text-[#6B1F1F] hover:bg-[#6B1F1F]/15 transition-colors">
                  Apply
                </button>
              </div>
              <div className="space-y-2 text-sm font-[Manrope]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (PILANI10)</span><span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span><span>Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-foreground">
                  <span className="font-['DM_Serif_Display'] text-base">Total</span>
                  <span className="font-['DM_Serif_Display'] text-xl">₹{(subtotal - discount).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button className="w-full bg-[#6B1F1F] text-white font-[Manrope] font-semibold text-xs uppercase tracking-widest py-4 rounded-full hover:bg-[#5a1a1a] transition-colors">
                Proceed to Checkout
              </button>
              <p className="font-[Manrope] text-xs text-muted-foreground text-center">Free shipping on all orders. 7-day returns.</p>
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [activeProduct, setActiveProduct] = useState<any>(null);

  const handleSelectProduct = (product: any) => {
    setActiveProduct(product);
    navigateTo("product");
  };

  const handleAddToCart = (product: any, size: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size);
      if (existing) return prev.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, size, qty: 1, img: product.img }];
    });
  };

  const handleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const navigateTo = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-background min-h-screen cursor-none" style={{ fontFamily: "Manrope, sans-serif" }}>
      <CustomCursor />

      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <Navbar page={page} setPage={navigateTo} cartCount={cart.reduce((s, i) => s + i.qty, 0)} />

          <AnimatePresence mode="wait">
            <motion.main
              key={page}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {page === "home" && (
                <>
                  <HeroSection setPage={navigateTo} />
                  <CraftsmanshipSection />
                  <DesignYourOwnBanner setPage={navigateTo} />
                  <WhyChooseUs />
                </>
              )}
              {page === "collection" && (
                <CollectionPage onAddToCart={handleAddToCart} wishlist={wishlist} onWishlist={handleWishlist} onSelectProduct={handleSelectProduct} />
              )}
              {page === "product" && activeProduct && (
                <ProductDetailPage 
                  product={activeProduct} 
                  onAddToCart={handleAddToCart} 
                  onWishlist={handleWishlist} 
                  wishlisted={wishlist.includes(activeProduct.id)} 
                  onBack={() => navigateTo("collection")} 
                />
              )}
              {page === "customization" && (
                <CustomizationPage onAddToCart={handleAddToCart} />
              )}
              {page === "about" && <AboutPage />}
              {page === "cart" && <CartPage cart={cart} setCart={setCart} setPage={navigateTo} />}
            </motion.main>
          </AnimatePresence>

          <Footer setPage={navigateTo} />

          {/* Floating mobile cart button */}
          <motion.button
            className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 bg-[#6B1F1F] text-white rounded-full flex items-center justify-center shadow-xl"
            onClick={() => navigateTo("cart")}
            whileTap={{ scale: 0.92 }}
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C4974A] text-white text-[10px] font-semibold flex items-center justify-center">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </motion.button>
        </>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        * { scroll-behavior: smooth; }
        .group:hover .group-hover\\:scale-108 { transform: scale(1.08); }
      `}</style>
    </div>
  );
}
