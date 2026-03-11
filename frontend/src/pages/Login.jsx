import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, ShoppingBag, CheckCircle2 } from "lucide-react";

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
            window.location.reload(); // Ensure context updates
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
            {/* Left Side: Form */}
            <div className="flex items-center justify-center p-8 md:p-16 lg:p-24">
                <div className="w-full max-w-md space-y-10">
                    <div>
                        <Link to="/" className="text-2xl font-black tracking-tighter text-primary flex items-center gap-2 mb-12">
                            INSTA<span className="text-text-main">ORDERS</span>
                        </Link>
                        <h1 className="text-4xl font-black text-text-main tracking-tight mb-3">Welcome back</h1>
                        <p className="text-text-muted font-medium">Please enter your details to sign in to your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                                <CheckCircle2 className="rotate-180" size={18} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        className="input-premium pl-12"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-black text-text-muted uppercase tracking-widest">Password</label>
                                    <a href="#" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input-premium pl-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg mt-8"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign in to Dashboard</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm font-medium text-text-muted pt-4">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary font-bold hover:underline">
                            Create an account for free
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side: Visual/Branding */}
            <div className="hidden lg:flex bg-bg-main items-center justify-center p-24 relative overflow-hidden">
                <div className="absolute top-0 right-0  bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="absolute bottom-0 left-0  bg-primary/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

                <div className="relative z-10 w-full max-w-lg">
                    <div className="card-premium p-12 bg-white/80 backdrop-blur-xl border-white shadow-2xl shadow-primary/10 rotate-2">
                        <div className="w-16 h-16  bg-primary text-white flex items-center justify-center mb-8 shadow-xl shadow-primary/30">
                            <ShoppingBag size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-text-main leading-tight mb-6">
                            The most powerful <br />
                            <span className="text-primary">order management</span> <br />
                            for your business.
                        </h2>

                        <div className="space-y-4 pt-4">
                            {[
                                "Real-time inventory tracking",
                                "Professional invoice generation",
                                "Customer relationship management"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <span className="text-sm font-bold text-text-muted">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent rounded-[3rem] -z-10 rotate-12"></div>
                </div>
            </div>
        </div>
    );
}