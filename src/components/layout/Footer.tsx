
import { Link } from 'react-router-dom';
import { Twitter, Instagram, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cyber-blue-dark border-t border-cyber-purple/20 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold cyber-neon-text">RIBBET<span className="text-cyber-magenta">SHOP</span></div>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              The safest and most trusted Fortnite gifting service available. Get any item from the shop without waiting!
            </p>
          </div>
          
          {/* Links */}
          <div className="col-span-1">
            <h3 className="text-cyber-purple font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/credits" className="text-gray-400 hover:text-white transition-colors">Credits</Link></li>
              <li><Link to="/reviews" className="text-gray-400 hover:text-white transition-colors">Reviews</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-cyber-purple font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="col-span-1">
            <h3 className="text-cyber-purple font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-cyber-blue p-2 rounded-full hover:bg-cyber-purple/30 transition-colors">
                <Twitter size={20} className="text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="bg-cyber-blue p-2 rounded-full hover:bg-cyber-purple/30 transition-colors">
                <Instagram size={20} className="text-white" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer"
                 className="bg-cyber-blue p-2 rounded-full hover:bg-cyber-purple/30 transition-colors">
                <MessageSquare size={20} className="text-white" />
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
