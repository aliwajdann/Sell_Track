import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
    User,
    Mail,
    Lock,
    Save,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import Navbar from "../components/Navbar";

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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-28 pb-12 px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account Settings</h1>
                        <p className="text-gray-500 mt-2 font-medium">Manage your personal information and security.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Profile Information */}
                        <div className="md:col-span-2 space-y-6">
                            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <User size={20} className="text-indigo-600" />
                                        Profile Information
                                    </h2>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                                    {profileMessage.text && (
                                        <div className={`p-4 rounded-2xl flex items-center gap-3 ${profileMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                            }`}>
                                            {profileMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                            <p className="text-sm font-semibold">{profileMessage.text}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition font-medium"
                                                    placeholder="Your name"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition font-medium"
                                                    placeholder="email@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                                        >
                                            <Save size={18} />
                                            Save Profile
                                        </button>
                                    </div>
                                </form>
                            </section>

                            {/* Password Security */}
                            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Lock size={20} className="text-indigo-600" />
                                        Change Password
                                    </h2>
                                </div>

                                <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                                    {passwordMessage.text && (
                                        <div className={`p-4 rounded-2xl flex items-center gap-3 ${passwordMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                            }`}>
                                            {passwordMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                            <p className="text-sm font-semibold">{passwordMessage.text}</p>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition font-medium"
                                                    placeholder="••••••••"
                                                    required={newPassword.length > 0}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition font-medium"
                                                        placeholder="••••••••"
                                                        required={currentPassword.length > 0}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition font-medium"
                                                        placeholder="••••••••"
                                                        required={newPassword.length > 0}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={loading || !newPassword}
                                            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-black hover:shadow-lg transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            <Save size={18} />
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </div>

                        {/* Sidebar / Info */}
                        <div className="space-y-6">
                            <section className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                                    <User size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                                <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6">
                                    If you're having trouble updating your account or have security concerns, please contact our support team.
                                </p>
                                <button className="w-full bg-white text-indigo-600 py-3.5 rounded-2xl text-sm font-bold hover:bg-indigo-50 transition active:scale-95">
                                    Contact Support
                                </button>
                            </section>

                            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Account Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm font-bold">Status</span>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Active</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm font-bold">User ID</span>
                                        <span className="text-gray-900 text-sm font-mono">#{user?.id?.toString().slice(-6)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm font-bold">User Name</span>
                                        <span className="text-gray-900 text-sm font-mono">{user?.username}</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}