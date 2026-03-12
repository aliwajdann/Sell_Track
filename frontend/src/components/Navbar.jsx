import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { User, LogOut, Package, LayoutDashboard, ChevronDown, Menu, X as CloseIcon } from "lucide-react";

export default function Navbar() {
    const { user, setUser } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            setUser(null);
            setMenuOpen(false);
            setMobileMenuOpen(false);
            navigate("/");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const closeAllMenus = () => {
        setMenuOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" onClick={closeAllMenus} className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Package size={18} className="text-white" />
                    </div>
                    <span className="text-text-main font-sora">SellTrack</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {user && (
                        <div className="flex items-center gap-6">
                            <Link to="/orders" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
                                <LayoutDashboard size={16} /> Orders
                            </Link>
                            <Link to="/products" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
                                <Package size={16} /> Products
                            </Link>
                        </div>
                    )}

                    {!user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-semibold text-text-secondary hover:text-text-main transition-colors">
                                Sign in
                            </Link>
                            <Link to="/register" className="btn-primary py-2 px-4">
                                Get Started
                            </Link>
                        </div>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-bg-main border border-transparent hover:border-border transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-semibold text-text-main hidden sm:block">{user.name}</span>
                                <ChevronDown size={14} className={`text-text-secondary transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown */}
                            {menuOpen && (
                                <>
                                    {/* Global Backdrop for Dropdown */}
                                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setMenuOpen(false)}></div>
                                    
                                    <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-xl border border-border py-1.5 z-50 overflow-hidden animate-fade-in">
                                        <div className="px-4 py-2.5 border-b border-border mb-1">
                                            <p className="text-sm font-bold text-text-main truncate">{user.name}</p>
                                            <p className="text-xs text-text-secondary truncate">{user.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <button 
                                                onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:bg-bg-main hover:text-primary rounded-lg transition-colors"
                                            >
                                                <User size={16} /> Profile
                                            </button>
                                        </div>
                                        <div className="border-t border-border mt-1 p-1">
                                            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
                                                <LogOut size={16} /> Sign out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <button onClick={toggleMobileMenu} className="p-2 text-text-secondary hover:text-text-main transition-colors">
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <>
                    {/* Darker Overlay with Blur for better separation */}
                    <div className="fixed inset-0 bg-text-main/40 backdrop-blur-md z-[60] transition-opacity animate-fade-in" onClick={() => setMobileMenuOpen(false)}></div>
                    
                    <div className="fixed top-0 right-0 h-full w-72 bg-surface shadow-2xl z-[70] p-6 animate-slide-in-right flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <span className="text-xl font-bold text-primary flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <Package size={18} className="text-white" />
                                </div>
                                SellTrack
                            </span>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-bg-main rounded-lg text-text-secondary">
                                <CloseIcon size={24} />
                            </button>
                        </div>

                        {user ? (
                            <div className="flex-1 flex flex-col">
                                <div className="p-4 bg-bg-main rounded-2xl flex items-center gap-3 mb-8 border border-border">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-text-main truncate">{user.name}</p>
                                        <p className="text-xs text-text-secondary truncate">{user.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Link to="/orders" onClick={closeAllMenus} className="flex items-center gap-3 p-3 text-sm font-medium text-text-secondary hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
                                        <LayoutDashboard size={20} /> Orders Dashboard
                                    </Link>
                                    <Link to="/products" onClick={closeAllMenus} className="flex items-center gap-3 p-3 text-sm font-medium text-text-secondary hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
                                        <Package size={20} /> Product Catalog
                                    </Link>
                                    <Link to="/profile" onClick={closeAllMenus} className="flex items-center gap-3 p-3 text-sm font-medium text-text-secondary hover:bg-primary/10 hover:text-primary rounded-xl transition-colors">
                                        <User size={20} /> Account Profile
                                    </Link>
                                </div>

                                <div className="mt-auto pt-6 border-t border-border">
                                    <button onClick={logout} className="flex items-center gap-3 p-3 w-full text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                        <LogOut size={20} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 pt-4">
                                <Link to="/login" onClick={closeAllMenus} className="btn-secondary w-full py-3">Sign In</Link>
                                <Link to="/register" onClick={closeAllMenus} className="btn-primary w-full py-3">Get Started</Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </nav>
    );
}