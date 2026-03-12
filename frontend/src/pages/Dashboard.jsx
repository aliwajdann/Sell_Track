import Navbar from "../components/Navbar";
import { ArrowRight, BarChart3, Shield, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-bg-main font-inter">
            <Navbar />

            <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="text-center mb-24 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        New: v2.0 is now live
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-text-main leading-[1.1] mb-8 tracking-tight max-w-4xl mx-auto">
                        Streamline your operations <br />
                        <span className="text-primary">with precision.</span>
                    </h1>

                    <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                        The modern dashboard built for ambitious teams. Manage products,
                        track orders, and scale your business with ease.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/orders" className="btn-primary w-full sm:w-auto px-8 py-4 text-lg">
                            Go to Dashboard <ArrowRight size={20} className="ml-2" />
                        </Link>
                        <button className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg">
                            View Documentation
                        </button>
                    </div>
                </section>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="card">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Optimized for speed. Your data loads instantly, so you can make decisions without waiting.
                        </p>
                    </div>

                    <div className="card">
                        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Gain deep insights into your sales performance with our comprehensive reporting tools.
                        </p>
                    </div>

                    <div className="card">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Your data is safe with us. We use industry-standard encryption and security protocols.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="card grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-text-main mb-1">10k+</p>
                        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Orders Processed</p>
                    </div>
                    <div className="text-center border-l border-border">
                        <p className="text-3xl font-bold text-text-main mb-1">99.9%</p>
                        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Uptime Reliable</p>
                    </div>
                    <div className="text-center border-l border-border">
                        <p className="text-3xl font-bold text-text-main mb-1">24/7</p>
                        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Expert Support</p>
                    </div>
                    <div className="text-center border-l border-border">
                        <p className="text-3xl font-bold text-text-main mb-1">Free</p>
                        <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">Forever Plan</p>
                    </div>
                </div>
            </main>
        </div>
    );
}