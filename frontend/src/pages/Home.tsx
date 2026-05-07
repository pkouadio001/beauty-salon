import React, {useState, useRef, useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {fetchServices} from "../api.ts";
import { useNavigate } from "react-router-dom";

// --- Types & Interfaces ---
interface ServiceItem {
  id: number;
  category: "Hairstyles" | "Nails" | "Massage";
  name: string;
  duration: string;
  price: string;
  image: string;
  description: string;
}


const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"Hairstyles" | "Nails" | "Massage">("Hairstyles");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleLoginClick = () => {
    setSidebarOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const getServices = async () => {
      try {
        const data = await fetchServices();
        console.log("Services received in Home:", data);
        setAllServices(data);
      } finally {
        setLoading(false);
      }
    };
    getServices().catch((error) => {
      console.error("Failed to load services:", error);
    });
  }, []);

// Filter based on fetched data
  const filteredServices = allServices.filter(item => item.category === activeCategory);

  console.log("Active category:", activeCategory);
  console.log("All services:", allServices);
  console.log("Filtered services:", filteredServices);

  if (loading) return <div className="text-white text-center mt-20">Loading Services...</div>;

  // --- Scroll Logic ---
  const handleManualScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const amount = clientWidth * 0.7; // Scroll 70% of view
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - amount : scrollLeft + amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative bg-gradient-to-b from-[#833ab4] via-[#f60606]/70 to-[#f60606]/40 text-[#00000b]">

      {/* 1. SIDEBAR NAVIGATION (As per navbar.png) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-black text-white p-10 flex flex-col items-center z-[70] shadow-2xl"
            >
              <button onClick={() => setSidebarOpen(false)} className="self-end text-white/50 hover:text-white text-3xl mb-8">&times;</button>
              <div className="w-24 h-24 bg-white rounded-full mb-12 border-4 border-white/20" />
              <ul className="space-y-10 text-center uppercase tracking-[0.2em] text-sm font-bold w-full">
                <li
                    onClick={handleLoginClick}
                    className="cursor-pointer hover:text-[#f60606] transition-colors"
                >
                  Login
                </li>
                <li className="cursor-pointer hover:text-[#f60606] transition-colors">Register</li>
                <li className="cursor-pointer hover:text-[#f60606] transition-colors">Reviews</li>
              </ul>
              <button className="mt-auto mb-12 bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-tighter hover:bg-[#f60606] hover:text-white transition-all transform hover:scale-105">
                Book a Visit!
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. TOP NAVBAR */}
      <nav className="w-full flex justify-between items-center px-8 py-6 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex-1 text-center">
          <h1 className="text-white text-4xl font-extralight tracking-[0.3em] uppercase">Beauty's Salon</h1>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="text-white p-2 hover:bg-white/10 rounded-full transition-all">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </nav>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-grow overflow-x-hidden">
        <header className="py-16 flex flex-col items-center">
          <div className="bg-white/95 px-16 py-4 rounded-sm mb-8 border border-[#707070] shadow-md">
            <h2 className="text-[#00000b] text-2xl font-semibold tracking-[0.1em] uppercase">Services</h2>
          </div>

          {/* Category Toggle Buttons */}
          <div className="flex gap-6">
            {(["Hairstyles", "Nails", "Massage"] as const).map((cat, idx) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-2 rounded-full text-sm font-bold border border-[#707070] transition-all duration-300 shadow-lg ${
                  activeCategory === cat ? 'bg-[#833ab4] text-white scale-110' : 'bg-white/95 text-black hover:bg-[#833ab4]/20'
                }`}
              >
                Service {idx + 1} ({cat})
              </button>
            ))}
          </div>
        </header>

        {/* --- CAROUSEL SECTION --- */}
        <main className="container mx-auto px-6 pb-24 relative group">

          {/* Left Arrow */}
          <button
            onClick={() => handleManualScroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#f60606] transition-all opacity-0 group-hover:opacity-100 shadow-xl"
          >
            &#10094;
          </button>

          {/* Scrolling Container */}
          <div
            ref={scrollRef}
            className="flex flex-nowrap gap-8 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <AnimatePresence mode="wait">
              {filteredServices.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-none w-[300px] md:w-[350px] snap-center bg-white/90 border border-[#707070] p-1.5 flex flex-col shadow-2xl h-[520px]"
                >
                  {/* Card Header (Duration, Name, Price) */}
                  <div className="flex justify-between items-center bg-white border-b border-[#707070] px-3 py-2 text-[11px] font-black uppercase tracking-tighter">
                    <span className="border border-[#707070] px-2 py-0.5">{item.duration}</span>
                    <span className="text-sm font-bold truncate max-w-[150px]">{item.name}</span>
                    <span className="border border-[#707070] px-2 py-0.5">{'$' + item.price}</span>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 flex flex-col flex-grow bg-white/50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 object-cover mb-4 border border-[#707070] shadow-sm pointer-events-none"
                    />
                    <div className="border border-[#707070] p-4 bg-white flex-grow overflow-y-auto">
                      <p className="text-[12px] leading-relaxed font-medium text-black/80 italic">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => handleManualScroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#f60606] transition-all opacity-0 group-hover:opacity-100 shadow-xl"
          >
            &#10095;
          </button>
        </main>
      </div>

      {/* 4. FOOTER (As per landing page.png) */}
      <footer className="bg-black py-12 px-6 mt-auto">
        <div className="max-w-5xl mx-auto bg-white/95 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl border border-[#707070]">
          {/* Location */}
          <div className="flex items-center gap-4 text-sm font-bold">
            <div className="w-10 h-10 bg-[#f60606] rounded-full flex items-center justify-center shadow-lg">📍</div>
            <address className="not-italic leading-tight">
              300 Cat street, Nowhere,<br />
              <span className="text-[#833ab4]">Maryland (Fort Meade) 20755</span>
            </address>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4 text-sm font-bold">
            <div className="w-10 h-10 bg-[#833ab4] rounded-full flex items-center justify-center shadow-lg text-white">📞</div>
            <span className="tracking-widest">+1 (240) 000-0000</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 text-sm font-bold">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg text-white">✉️</div>
            <span className="lowercase hover:underline cursor-pointer">BeautySalon@services.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;