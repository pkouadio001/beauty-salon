import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CustomerAppointmentList } from "../components/CustomerAppointmentList";
import BookingForm from "../components/Booking";

const CustomerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<"ACCOUNT" | "APPOINTMENT" | "REVIEWS" | "BOOKING">("APPOINTMENT");

    const handleLogoutClick = () => {
        // Clear localStorage
        localStorage.removeItem('customerId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        setSidebarOpen(false);
        navigate("/");
    };

    const handleNavClick = (section: "ACCOUNT" | "APPOINTMENT" | "REVIEWS" | "BOOKING") => {
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
                                    REVIEWS
                                </li>
                                <li onClick={() => handleNavClick("BOOKING")} 
                                    className={`cursor-pointer transition-colors ${activeSection === "BOOKING" ? "text-[#f60606]" : "hover:text-[#f60606]"}`}>
                                    BOOKING
                                </li>
                                <li
                                    onClick={handleLogoutClick}
                                    className="cursor-pointer hover:text-[#f60606] transition-colors"
                                >
                                    LOGOUT
                                </li>
                            </ul>
                            <button
                                onClick={() => handleNavClick("BOOKING")}
                                className="mt-auto mb-12 bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-tighter hover:bg-[#f60606] hover:text-white transition-all transform hover:scale-105"
                            >
                                Book a Visit!
                            </button>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* 2. TOP NAVBAR */}
            <nav className="w-full flex justify-between items-center px-8 py-6 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex-1 text-center">
                    <h1 className="text-white text-4xl font-extralight tracking-[0.3em] uppercase">Customer Dashboard</h1>
                </div>
                <button onClick={() => setSidebarOpen(true)} className="text-white p-2 hover:bg-white/10 rounded-full transition-all">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </nav>

            {/* 3. MAIN CONTENT AREA */}
            <div className="flex-grow overflow-x-hidden px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl text-white font-bold tracking-wider uppercase mb-2">
                            {activeSection === "APPOINTMENT" && "Your Appointments"}
                            {activeSection === "ACCOUNT" && "Account Information"}
                            {activeSection === "REVIEWS" && "Your Reviews"}
                            {activeSection === "BOOKING" && "Book An Appointment"}
                        </h2>
                        <div className="h-1 w-24 bg-[#f60606]"></div>
                    </div>

                    {/* Content Based on Active Section */}
                    {activeSection === "APPOINTMENT" && (
                        <CustomerAppointmentList />
                    )}

                    {activeSection === "BOOKING" && (
                        <div className="bg-white/95 rounded-lg p-8 shadow-2xl">
                            <BookingForm />
                        </div>
                    )}

                    {activeSection === "ACCOUNT" && (
                        <div className="bg-white/95 rounded-lg p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold text-black mb-6">Account Settings</h3>
                            <p className="text-gray-600 italic">Account management coming soon...</p>
                        </div>
                    )}

                    {activeSection === "REVIEWS" && (
                        <div className="bg-white/95 rounded-lg p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold text-black mb-6">Your Reviews</h3>
                            <p className="text-gray-600 italic">Review section coming soon...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 4. FOOTER */}
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

export default CustomerDashboard;