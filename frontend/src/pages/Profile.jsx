import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
    User,
    Mail,
    Lock,
    Save,
    AlertCircle,
    CheckCircle2,
    Shield,
    BadgeCheck
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
    const { user, setUser, checkAuth } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProfileMessage({ type: "", text: "" });
        try {
            const res = await api.put("/auth/updateprofile", { name, email });
            setUser(res.data.user);
            setProfileMessage({ type: "success", text: "Profile updated successfully!" });
            await checkAuth();
        } catch (err) {
            setProfileMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to update profile"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: "error", text: "New passwords do not match" });
            return;
        }
        setLoading(true);
        setPasswordMessage({ type: "", text: "" });
        try {
            await api.put("/auth/password", { currentPassword, newPassword });
            setPasswordMessage({ type: "success", text: "Password updated successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to update password"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main font-inter flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-5xl mx-auto pt-24 pb-20 px-6 w-full">
                <div className="mb-10 animate-fade-in">
                    <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                        <User className="text-primary" size={28} />
                        Profile Settings
                    </h1>
                    <p className="text-text-secondary mt-1">Manage your account information and security.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        {/* Profile Section */}
                        <div className="card animate-fade-in">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <BadgeCheck size={20} className="text-primary" />
                                Personal Information
                            </h2>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                {profileMessage.text && (
                                    <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium animate-fade-in ${
                                        profileMessage.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                                    }`}>
                                        {profileMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        {profileMessage.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="input pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="input pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Save size={18} /> Save Changes
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Password Section */}
                        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-primary" />
                                Security & Password
                            </h2>

                            <form onSubmit={handleUpdatePassword} className="space-y-6">
                                {passwordMessage.text && (
                                    <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium animate-fade-in ${
                                        passwordMessage.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                                    }`}>
                                        {passwordMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        {passwordMessage.text}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="input pl-10"
                                                placeholder="••••••••"
                                                required={newPassword.length > 0}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="input pl-10"
                                                    placeholder="••••••••"
                                                    required={currentPassword.length > 0}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Confirm New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="input pl-10"
                                                    placeholder="••••••••"
                                                    required={newPassword.length > 0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !newPassword}
                                    className="btn-primary"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="card bg-primary text-white border-none shadow-lg shadow-primary/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                                <User size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Public Profile</h3>
                            <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                                This information will be visible to other members of your organization.
                            </p>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-70">User ID</span>
                                    <span className="font-mono font-bold">#{user?.id?.toString().slice(-6)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-70">Username</span>
                                    <span className="font-bold">{user?.username}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-70">Joined</span>
                                    <span className="font-bold">Mar 2026</span>
                                </div>
                            </div>
                        </div>

                        <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Account Status</h3>
                            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700">
                                <BadgeCheck size={20} />
                                <span className="text-sm font-bold uppercase tracking-tight">Verified Account</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
