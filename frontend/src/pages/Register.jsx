import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, AtSign, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

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
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-inter">
            {/* Left Side: Form */}
            <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 order-2 lg:order-1">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <Link to="/" className="text-2xl font-black tracking-tighter text-primary flex items-center gap-2 mb-8 lg:mb-12">
                            INSTA<span className="text-text-main">ORDERS</span>
                        </Link>
                        <h1 className="text-4xl font-black text-text-main tracking-tight mb-3">Create an account</h1>
                        <p className="text-text-muted font-medium">Join 10,000+ businesses scaling their sales with ease.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in">
                                <ShieldCheck className="rotate-180" size={18} />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in">
                                <CheckCircle2 size={18} />
                                Account created! Redirecting to login...
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        placeholder="John Doe"
                                        className="input-premium pl-12"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Username</label>
                                <div className="relative">
                                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        placeholder="johndoe123"
                                        className="input-premium pl-12"
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="email"
                                        placeholder="john@company.com"
                                        className="input-premium pl-12"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input-premium pl-12"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg mt-4"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Get Started Now</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm font-medium text-text-muted">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            Log in instead
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side: Visual/Branding */}
            <div className="hidden lg:flex bg-bg-main items-center justify-center p-24 relative overflow-hidden order-1 lg:order-2">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full -ml-48 -mt-48 blur-3xl"></div>
                
                <div className="relative z-10 w-full max-w-lg">
                    <div className="card-premium p-12 bg-white/80 backdrop-blur-xl border-white shadow-2xl shadow-primary/10 -rotate-2">
                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center mb-8 shadow-xl shadow-indigo-600/30">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-text-main leading-tight mb-6 font-sora">
                            Secure, Reliable <br />
                            <span className="text-indigo-600">Infrastructure</span> <br />
                            for Enterprise.
                        </h2>
                        
                        <div className="space-y-6 pt-4">
                            {[
                                { title: "End-to-end Encryption", desc: "Your data is always private and protected." },
                                { title: "Automated Workflows", desc: "Save up to 20 hours a week on manual tasks." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mt-1">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-text-main uppercase tracking-widest leading-none mb-1.5">{item.title}</p>
                                        <p className="text-sm text-text-muted font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Decorative element */}
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-accent rounded-[3rem] -z-10 -rotate-12"></div>
                </div>
            </div>
        </div>
    );
}