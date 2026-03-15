import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ArrowRight, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  ShieldCheck, 
  Zap,
  Globe
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 animate-fade-in">
              <Zap size={14} />
              <span>The Next Generation of Order Management</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-8 leading-[1.1]">
              Manage your <span className="text-primary">Orders</span> with speed and precision.
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed">
              SellTrack provides a powerful, intuitive platform for small to medium businesses 
              to track inventory, process orders, and analyze growth—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary w-full sm:w-auto px-8 py-4 text-base">
                Get Started for Free <ArrowRight size={18} className="ml-2" />
              </Link>
              <a href="#features" className="btn-secondary w-full sm:w-auto px-8 py-4 text-base">
                View Features
              </a>
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50">
              <div className="flex items-center gap-2 font-bold text-xl"><Globe size={24}/> Global</div>
              <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck size={24}/> Secure</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Zap size={24}/> Fast</div>
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -z-0"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Everything you need to scale</h2>
            <p className="text-text-secondary">
              Powerful tools designed to simplify your workflow and give you back your time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Inventory Tracking</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Real-time tracking of your stock levels with automatic alerts when items are running low.
              </p>
            </div>

            <div className="card group">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                <ShoppingCart size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Order Management</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Seamlessly process orders from creation to delivery. Keep your customers informed at every step.
              </p>
            </div>

            <div className="card group">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Insightful Analytics</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Deep dive into your sales data. Understand trends, identify top products, and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-primary rounded-[2rem] p-8 md:p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to streamline your business?</h2>
              <p className="text-white/80 mb-10 max-w-xl mx-auto">
                Join hundreds of businesses that use SellTrack to manage their daily operations.
              </p>
              <Link to="/register" className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-xl font-bold transition-all inline-flex items-center">
                Start Your Journey <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
