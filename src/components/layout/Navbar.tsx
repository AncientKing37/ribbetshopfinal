import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const [credits, setCredits] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) {
        setCredits(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching credits:', error);
          return;
        }

        setCredits(data?.credits ?? 0);
      } catch (error) {
        console.error('Error in fetchCredits:', error);
      }
    };

    fetchCredits();
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error signing out',
        description: error.message || 'An error occurred while signing out.',
        variant: 'destructive',
      });
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user || !user.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-cyber-purple/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1">
            <img
              src="/uploads/logo.png"
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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/item-shop" className="text-white hover:text-cyber-purple transition-colors">
              Item Shop
            </Link>
            <Link to="/credits" className="text-white hover:text-cyber-purple transition-colors">
              Credits
            </Link>
            <Link to="/fn-crew" className="text-white hover:text-cyber-purple transition-colors">
              FN Crew
            </Link>
            <Link to="/contact" className="text-white hover:text-cyber-purple transition-colors">
              Contact Us
            </Link>
          </div>
          
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {credits !== null && (
                  <div className="px-3 py-1 rounded bg-cyber-blue border border-cyber-purple/30 cyber-glow">
                    <span className="text-sm text-gray-300">💰 </span>
                    <span className="text-cyber-purple-light font-bold">{credits.toLocaleString()} Credits</span>
                  </div>
                )}

                <button
                  className="relative flex items-center justify-center w-8 h-8 bg-[#181823] rounded-[12px] border border-[#232334] hover:shadow-lg transition-shadow"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="h-5 w-5 text-white" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center border-2 border-[#181823] shadow-lg">
                      {itemCount}
                    </span>
                  )}
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="cyber-button flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-cyber-purple/30">
                        <AvatarFallback className="bg-cyber-purple/20 text-cyber-purple-light text-xs">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="cyber-card">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-cyber-purple-light">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate('/profile')}
                    >
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate('/orders')}
                    >
                      Order History
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-500"
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" className="cyber-button" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="cyber-button bg-cyber-purple/80 hover:bg-cyber-purple" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-cyber-blue"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              to="/item-shop" 
              className="block py-2 px-4 text-white hover:bg-cyber-blue rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Item Shop
            </Link>
            <Link 
              to="/credits" 
              className="block py-2 px-4 text-white hover:bg-cyber-blue rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Credits
            </Link>
            <Link 
              to="/fn-crew" 
              className="block py-2 px-4 text-white hover:bg-cyber-blue rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              FN Crew
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 px-4 text-white hover:bg-cyber-blue rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            {user && (
              <>
                <Link 
                  to="/cart" 
                  className="block py-2 px-4 text-white hover:bg-cyber-blue rounded-md flex items-center gap-2 relative"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="relative flex items-center justify-center w-6 h-6 bg-[#181823] rounded-[12px] border border-[#232334]">
                    <ShoppingCart className="h-4 w-4 text-white" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[16px] text-center border-2 border-[#181823] shadow-lg">
                        {itemCount}
                      </span>
                    )}
                  </div>
                  <span className="ml-2">Cart</span>
                </Link>
                {credits !== null && (
                  <div className="px-4 py-2 rounded bg-cyber-blue border border-cyber-purple/30 cyber-glow">
                    <span className="text-sm text-gray-300">💰 </span>
                    <span className="text-cyber-purple-light font-bold">{credits.toLocaleString()} Credits</span>
                  </div>
                )}
              </>
            )}
            
            <div className="pt-4 border-t border-cyber-purple/20 space-y-3">
              {user ? (
                <>
                  <div className="px-4 py-2 rounded bg-cyber-blue border border-cyber-purple/30">
                    <p className="text-sm font-medium text-cyber-purple-light">{user.email}</p>
                  </div>
                  <Link 
                    to="/profile"
                    className="block py-2 px-4 text-white hover:bg-cyber-blue rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link 
                    to="/orders"
                    className="block py-2 px-4 text-white hover:bg-cyber-blue rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Order History
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full cyber-button flex items-center justify-center text-red-500"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full cyber-button" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button className="w-full cyber-button bg-cyber-purple/80 hover:bg-cyber-purple" asChild>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
