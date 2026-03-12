import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, AtSign, ArrowRight, Package, CheckCircle2, AlertCircle } from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/register", { name, username, email, password });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main p-6">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Package size={24} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-text-main">InstaOrder</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight">Create an account</h1>
                    <p className="text-text-secondary mt-2">Join us and start managing your orders</p>
                </div>

                <div className="card shadow-xl shadow-text-main/5 border-border/50">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
                                <CheckCircle2 size={16} />
                                Account created! Redirecting...
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                <input
                                    placeholder="John Doe"
                                    className="input pl-10"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Username</label>
                            <div className="relative">
                                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                <input
                                    placeholder="johndoe123"
                                    className="input pl-10"
                                    onChange={(e) => setUsername(e.target.value)}
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
                                    placeholder="john@company.com"
                                    className="input pl-10"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input pl-10"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn-primary w-full py-3 mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Create account <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-text-secondary mt-8">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary font-bold hover:text-primary/80 transition-colors">
                        Log in instead
                    </Link>
                </p>
            </div>
        </div>
    );
}