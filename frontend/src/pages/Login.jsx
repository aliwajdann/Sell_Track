import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Package, CheckCircle2, AlertCircle } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/login", { email, password }, { withCredentials: true });
            navigate("/");
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main p-6">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Package size={24} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-text-main">SellTrack</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight">Welcome back</h1>
                    <p className="text-text-secondary mt-2">Sign in to your account to continue</p>
                </div>

                <div className="card shadow-xl shadow-text-main/5 border-border/50">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="input pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 px-1">
                                <label className="text-xs font-bold text-text-secondary uppercase">Password</label>
                                <a href="#" className="text-[10px] font-bold text-primary uppercase hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input pl-10"
                                    value={password}
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
                                    Sign in <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-text-secondary mt-8">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary font-bold hover:text-primary/80 transition-colors">
                        Create one for free
                    </Link>
                </p>
            </div>
        </div>
    );
}