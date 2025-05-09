import { Link } from 'react-router-dom';
import { Twitter } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-cyber-purple/20 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <OptimizedImage
                src="/uploads/logo.webp"
                alt="Logo"
                className="h-12 w-auto"
                style={{ minWidth: '3rem' }}
              />
              <span
                className="text-xl font-bold font-sans bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
                style={{ letterSpacing: '0.01em' }}
              >
                RIBBETSHOP
              </span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              The safest and most trusted Fortnite gifting service available. Get any item from the shop without waiting!
            </p>
          </div>
          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/item-shop" className="text-gray-400 hover:text-white transition-colors">Daily Item Shop</Link></li>
              <li><Link to="/credits" className="text-gray-400 hover:text-white transition-colors">Gift Credits</Link></li>
              <li><Link to="/fn-crew" className="text-gray-400 hover:text-white transition-colors">FN Crew</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          {/* Social Links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://x.com/ConfusedRibbet" target="_blank" rel="noopener noreferrer" 
                 className="bg-cyber-blue p-2 rounded-full hover:bg-cyber-purple/30 transition-colors">
                <Twitter size={20} className="text-white" />
              </a>
              <a href="https://discord.gg/ribbetshop" target="_blank" rel="noopener noreferrer"
                 className="bg-cyber-blue p-2 rounded-full hover:bg-cyber-purple/30 transition-colors">
                <svg className="h-5 w-5 text-white" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107a13.94 13.94 0 0 0 1.226 1.993a.076.076 0 0 0 .084.029c1.961-.607 3.95-1.522 6.001-3.03a.077.077 0 0 0 .032-.057c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
                </svg>
              </a>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Join our Discord community for instant support and updates.
            </p>
          </div>
        </div>
        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-cyber-purple/20 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} RIBBETSHOP. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Not affiliated with Epic Games, Inc. All Fortnite images and assets belong to Epic Games.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
