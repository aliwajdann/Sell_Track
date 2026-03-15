import React from 'react';
import { Package, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-tight text-primary flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <span className="text-text-main font-sora">SellTrack</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Empowering small businesses with smart inventory and order management solutions.
              Track, manage, and grow your business with ease.
            </p>
            {/* <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-bg-main text-text-secondary hover:text-primary rounded-lg transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-bg-main text-text-secondary hover:text-primary rounded-lg transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 bg-bg-main text-text-secondary hover:text-primary rounded-lg transition-colors">
                <Linkedin size={18} />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-text-main uppercase tracking-wider mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-sm text-text-secondary hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/orders" className="text-sm text-text-secondary hover:text-primary transition-colors">Order Tracking</Link></li>
              {/* <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Inventory</a></li> */}
              {/* <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Pricing</a></li> */}
            </ul>
          </div>

          {/* Company */}
          {/* <div>
            <h4 className="text-sm font-bold text-text-main uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div> */}

          {/* Support */}
          {/* <div>
            <h4 className="text-sm font-bold text-text-main uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Community</a></li>
              <li><a href="mailto:support@selltrack.com" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
                <Mail size={14} /> Contact Us
              </a></li>
            </ul>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-secondary font-medium">
            © {new Date().getFullYear()} SellTrack. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
