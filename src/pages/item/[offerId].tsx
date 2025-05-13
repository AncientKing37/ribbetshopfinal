import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { getEnv } from '@/integrations/supabase/env';
import { createItemshopOrder, processItemshopOrder } from '@/services/itemshopOrderService';

// FortniteAPI.io API key
const API_KEY = 'e0372996-579b848c-da237dbb-3c57cb66';

interface ItemDetails {
  name: string;
  description: string;
  type: string;
  rarity: string;
  images: {
    icon: string;
    featured: string;
  };
  price: number;
}

const ItemPage = () => {
  const { offerId } = useParams();
  const decodedOfferId = offerId ? decodeURIComponent(offerId) : '';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [epicUsername, setEpicUsername] = useState('');
  const [credits, setCredits] = useState<number>(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCredits = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile) {
        setCredits(profile.credits || 0);
      }
    };

    fetchCredits();
  }, [user, navigate]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      const apiKey = getEnv('FORTNITE_API_KEY');
      if (!apiKey) {
        toast({
          title: "Configuration Error",
          description: "Fortnite API key not found in environment variables",
          variant: "destructive",
        });
        return;
      }

      try {
        const response = await fetch(`https://fortniteapi.io/v2/shop?lang=en`, {
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch item details');
        }
        
        const data = await response.json();
        console.log('URL offerId:', offerId);
        console.log('Shop offerIds:', data.shop.map((item: any) => item.offerId));
        const shopItem = data.shop.find((item: any) =>
          item.offerId === decodedOfferId || item.id === decodedOfferId || item.mainId === decodedOfferId
        );
        
        if (shopItem) {
          setItem({
            name: shopItem.displayName || shopItem.name,
            description: shopItem.displayDescription || shopItem.description || '',
            type: shopItem.type?.name || shopItem.type || 'Unknown',
            rarity: shopItem.rarity?.name || shopItem.rarity || 'Unknown',
            images: {
              icon: Array.isArray(shopItem.displayAssets) && shopItem.displayAssets[0]?.url
                ? shopItem.displayAssets[0].url
                : shopItem.icon,
              featured: Array.isArray(shopItem.displayAssets) && shopItem.displayAssets[0]?.url
                ? shopItem.displayAssets[0].url
                : shopItem.full_background
            },
            price: shopItem.price?.finalPrice || shopItem.price || 0
          });
        } else {
          toast({
            title: "Item not found",
            description: "The requested item could not be found in the shop.",
            variant: "destructive",
          });
          navigate('/shop');
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch item details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (offerId) {
      fetchItemDetails();
    }
  }, [offerId, navigate, toast]);

  const handlePurchase = async () => {
    if (!user || !item) return;

    if (credits < item.price) {
      toast({
        title: "Insufficient Credits",
        description: "You don't have enough credits to buy this item.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      // Create order
      const order = await createItemshopOrder(
        user.id,
        {
          item_id: parseInt(decodedOfferId),
          offer_id: decodedOfferId,
          item_name: item.name,
          item_type: item.type,
          final_price: item.price,
          epic_username: epicUsername
        },
        `${window.location.origin}/api/webhooks/itemshop`
      );

      // Process order
      await processItemshopOrder(order.id);

      // Update user credits
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: credits - item.price })
        .eq('id', user.id);
      if (updateError) throw updateError;

      toast({
        title: "Purchase Successful",
        description: "Your item has been purchased and will be delivered to your Epic Games account shortly.",
      });

      setShowModal(false);
      navigate('/orders');
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : JSON.stringify(error),
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-purple" />
        </div>
      </Layout>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-900">
              <img
                src={item.images.featured}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{item.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded text-sm bg-gray-800 text-gray-300">
                    {item.type}
                  </span>
                  <span className="px-2 py-1 rounded text-sm bg-gray-800 text-gray-300">
                    {item.rarity}
                  </span>
                </div>
                <p className="text-gray-300 mb-6">{item.description}</p>
                
                <div className="text-2xl font-bold text-cyber-purple mb-6">
                  {item.price} V-Bucks
                </div>
              </div>

              <Button
                onClick={() => setShowModal(true)}
                className="w-full bg-cyber-purple hover:bg-cyber-purple/90"
                disabled={credits < item.price}
              >
                Buy Now
              </Button>

              <div className="text-sm text-gray-400">
                Your current balance: {credits} V-Bucks
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="cyber-card">
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Epic Games Username</label>
              <Input
                value={epicUsername}
                onChange={(e) => setEpicUsername(e.target.value)}
                placeholder="Enter your Epic Games username"
                className="mt-1"
              />
            </div>
            
            <div className="text-sm text-gray-400">
              <p>Item: {item.name}</p>
              <p>Price: {item.price} V-Bucks</p>
              <p>Your balance: {credits} V-Bucks</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              className="bg-cyber-purple hover:bg-cyber-purple/90"
              disabled={!epicUsername || processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Purchase'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ItemPage; 