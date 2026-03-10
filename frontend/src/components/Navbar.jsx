import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { User, LogOut, Settings, Package, LayoutDashboard, ChevronDown } from "lucide-react";

export default function Navbar({ onOpenLogin, onOpenRegister }) {
    const { user, setUser } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            setUser(null);
            setMenuOpen(false);
            navigate("/"); // Redirect to home after logout
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <nav className=" top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-600 flex items-center gap-2">
                    INSTA<span className="text-gray-900">ORDERS</span>
                </Link>

                {/* Navigation Links & Auth */}
                <div className="flex items-center gap-6">
                    {/* Common Links */}
                    <div className="hidden md:flex items-center gap-6 mr-4">
                        <Link to="/orders" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition flex items-center gap-1">
                            <LayoutDashboard size={16} /> Orders
                        </Link>
                        <Link to="/products" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition flex items-center gap-1">
                            <Package size={16} /> Products
                        </Link>
                    </div>

                    {!user ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onOpenLogin}
                                className="text-sm font-bold text-gray-600 hover:text-gray-900 transition"
                            >
                                Login
                            </button>
                            <button
                                onClick={onOpenRegister}
                                className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition active:scale-95"
                            >
                                Get Started
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Profile Trigger */}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-gray-700 hidden sm:block">{user.name}</span>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {menuOpen && (
                                <>
                                    {/* Transparent overlay to close menu when clicking outside */}
                                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}></div>

                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-150">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active Account</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>

                                        <div className="p-1">
                                            <button 
                                                onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
                                            >
                                                <User size={16} /> Profile Info
                                            </button>
                                            <button 
                                                onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 p-3 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition"
                                            >
                                                <Settings size={16} /> Account Settings
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-50 p-1">
                                            <button
                                                onClick={logout}
                                                className="w-full flex items-center gap-3 p-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition font-semibold"
                                            >
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}