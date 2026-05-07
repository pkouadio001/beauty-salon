import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
// Import the list component we created earlier
import { AppointmentList } from "../components/AppointmentList"; 

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    // Track which section the admin is currently viewing
    const [activeSection, setActiveSection] = useState<"ACCOUNT" | "APPOINTMENT" | "REVIEWS">("APPOINTMENT");

    const handleLogoutClick = () => {
        setSidebarOpen(false);
        navigate("/");
    };

    const handleNavClick = (section: "ACCOUNT" | "APPOINTMENT" | "REVIEWS") => {
        setActiveSection(section);
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col font-sans relative bg-gradient-to-b from-[#833ab4] via-[#f60606]/70 to-[#f60606]/40 text-[#00000b]">

            {/* 1. SIDEBAR NAVIGATION */}
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
                                <li onClick={() => handleNavClick("ACCOUNT")} 
                                    className={`cursor-pointer transition-colors ${activeSection === "ACCOUNT" ? "text-[#f60606]" : "hover:text-[#f60606]"}`}>
                                    ACCOUNT
                                </li>
                                <li onClick={() => handleNavClick("APPOINTMENT")} 
                                    className={`cursor-pointer transition-colors ${activeSection === "APPOINTMENT" ? "text-[#f60606]" : "hover:text-[#f60606]"}`}>
                                    APPOINTMENT
                                </li>
                                <li onClick={() => handleNavClick("REVIEWS")} 
                                    className={`cursor-pointer transition-colors ${activeSection === "REVIEWS" ? "text-[#f60606]" : "hover:text-[#f60606]"}`}>
                                    Reviews
                                </li>
                                <li onClick={handleLogoutClick} className="cursor-pointer hover:text-[#f60606] transition-colors">
                                    LOGOUT
                                </li>
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
            <main className="flex-grow p-4 md:p-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-inner border border-white/20"
                    >
                        <header className="mb-8 flex justify-between items-end px-4">
                            <div>
                                <h2 className="text-white text-3xl font-black uppercase tracking-tighter">Admin Control Panel</h2>
                                <p className="text-white/70 text-sm italic">Managing {activeSection.toLowerCase()}s for Beauty's Salon</p>
                            </div>
                            <div className="text-right text-white/50 text-xs font-bold uppercase tracking-widest">
                                Location: Fort Meade, MD
                            </div>
                        </header>

                        {/* Conditional Rendering based on sidebar selection */}
                        {activeSection === "APPOINTMENT" && <AppointmentList />}
                        
                        {activeSection === "ACCOUNT" && (
                            <div className="h-64 flex items-center justify-center text-white italic">Account Settings Coming Soon...</div>
                        )}
                        
                        {activeSection === "REVIEWS" && (
                            <div className="h-64 flex items-center justify-center text-white italic">Reviews Management Coming Soon...</div>
                        )}
                    </motion.div>
                </div>
            </main>

            {/* 4. FOOTER */}
            <footer className="bg-black py-12 px-6 mt-auto">
                <div className="max-w-5xl mx-auto bg-white/95 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl border border-[#707070]">
                    <div className="flex items-center gap-4 text-sm font-bold">
                        <div className="w-10 h-10 bg-[#f60606] rounded-full flex items-center justify-center shadow-lg">📍</div>
                        <address className="not-italic leading-tight">
                            300 Cat street, Nowhere,<br />
                            <span className="text-[#833ab4]">Maryland (Fort Meade) 20755</span>
                        </address>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-bold">
                        <div className="w-10 h-10 bg-[#833ab4] rounded-full flex items-center justify-center shadow-lg text-white">📞</div>
                        <span className="tracking-widest">+1 (240) 000-0000</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-bold">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg text-white">✉️</div>
                        <span className="lowercase hover:underline cursor-pointer">BeautySalon@services.com</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;