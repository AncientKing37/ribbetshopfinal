
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { ShoppingCart, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ItemDetailsDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  mainItem: any;
  name: string;
  rarity: string;
  imageUrl: string;
  regularPrice: number;
  platformPrice: number;
  entry: any;
}

export const ItemDetailsDialog = ({
  showDialog,
  setShowDialog,
  mainItem,
  name,
  rarity,
  imageUrl,
  regularPrice,
  platformPrice,
  entry
}: ItemDetailsDialogProps) => {
  const { user } = useAuth();
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const { toast } = useToast();
  
  // Format the rarity text for display
  const rarityText = rarity.charAt(0).toUpperCase() + rarity.slice(1);
  
  // Get additional items in the bundle, if any
  const additionalItems = entry.items ? entry.items.slice(1) : [];
  
  const handlePurchase = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or register to purchase items.",
        variant: "destructive"
      });
      return;
    }
    
    setPurchasing(true);
    
    // Simulate a purchase
    setTimeout(() => {
      setPurchasing(false);
      setPurchased(true);
      
      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${name}!`,
      });
      
      // Reset after a few seconds
      setTimeout(() => {
        setPurchased(false);
        setShowDialog(false);
      }, 2000);
    }, 1500);
  };
  
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md bg-cyber-blue-dark border border-cyber-purple">
        <DialogHeader>
          <DialogTitle className="text-cyber-purple-light">{name}</DialogTitle>
          <DialogDescription>
            <Badge variant="outline" className="mt-1">
              {rarityText}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <div className="h-64 overflow-hidden rounded-md bg-gradient-to-b from-cyber-blue to-cyber-blue-dark">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://via.placeholder.com/300/9b87f5/ffffff?text=Item+Image';
              }}
            />
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-1">Description</h3>
            <p className="text-gray-300 text-sm">
              {mainItem.description || "No description available."}
            </p>
          </div>
          
          {additionalItems.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2">Includes</h3>
              <ul className="space-y-2">
                {additionalItems.map((item: any, index: number) => (
                  <li key={index} className="flex items-center text-sm">
                    <div className="h-8 w-8 mr-2 bg-cyber-blue rounded overflow-hidden">
                      <img
                        src={item.images?.icon || item.images?.smallIcon}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <span className="text-gray-300">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-between items-center py-2 border-t border-cyber-purple/30">
            <div>
              <div className="text-sm text-gray-400">Regular Price</div>
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/9/96/VBucks_currency.png" 
                  alt="V-Bucks" 
                  className="w-4 h-4 mr-1" 
                />
                <span className="text-white line-through opacity-70">{regularPrice}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-cyber-purple">Our Price</div>
              <div className="flex items-center justify-end">
                <img 
                  src="/credits.png" 
                  alt="Credits" 
                  className="w-5 h-5 mr-1"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://via.placeholder.com/20/9b87f5/ffffff?text=₢';
                  }} 
                />
                <span className="text-cyber-purple-light font-bold text-lg">{platformPrice}</span>
              </div>
            </div>
          </div>
          
          <Button
            className={`cyber-button w-full ${purchased ? 'bg-green-600 hover:bg-green-700' : ''}`}
            disabled={purchasing || purchased}
            onClick={handlePurchase}
          >
            {purchasing ? (
              <span className="flex items-center justify-center">
                <ShoppingCart className="animate-pulse mr-2 h-4 w-4" />
                Processing...
              </span>
            ) : purchased ? (
              <span className="flex items-center justify-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Purchased!
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Purchase with Credits
              </span>
            )}
          </Button>
          
          <div className="text-xs text-center text-gray-400 italic">
            Items are delivered instantly to your connected Epic Games account
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
