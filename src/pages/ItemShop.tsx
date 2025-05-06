import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import ItemShopGrid from '@/components/item-shop/ItemShopGrid';
import ItemShopFilters from '@/components/item-shop/ItemShopFilters';
import { Loader2, RefreshCw, AlertTriangle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { getEnvVariable } from '@/integrations/supabase/env';

const fetchFortniteShop = async () => {
  const apiKey = await getEnvVariable('FORTNITE_API_KEY');
  if (!apiKey) {
    throw new Error('Fortnite API key not found in Supabase environment variables');
  }

  try {
    const response = await fetch('https://fortniteapi.io/v2/shop?lang=en', {
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch Fortnite shop data: ${errorData.error || response.statusText || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    if (data && data.shop && data.shop.length > 0) {
      console.log('Sample shop item:', data.shop[0]);
    }
    
    if (!data || !data.shop) {
      throw new Error('Invalid response format from Fortnite API');
    }
    
    // Transform the API response to match our expected format
    return {
      data: {
        featured: {
          entries: data.shop
            .filter((item: any) => item.featured)
            .map((item: any) => ({
              offerId: item.mainId,
              items: [{
                name: item.displayName || item.name,
                description: item.displayDescription || item.description,
                type: item.displayType || item.type,
                rarity: item.rarity,
                images: {
                  icon: Array.isArray(item.displayAssets) && item.displayAssets[0]?.url
                    ? item.displayAssets[0].url
                    : undefined
                }
              }],
              regularPrice: item.price?.regularPrice || item.price,
              finalPrice: item.price?.finalPrice || item.finalPrice || item.price,
              bundle: item.bundle ? {
                name: item.displayName,
                info: item.displayDescription || item.description,
                image: Array.isArray(item.displayAssets) && item.displayAssets[0]?.url
                  ? item.displayAssets[0].url
                  : undefined
              } : undefined
            }))
        },
        daily: {
          entries: data.shop
            .filter((item: any) => !item.featured)
            .map((item: any) => ({
              offerId: item.offerId || item.id || item.mainId,
              items: [{
                name: item.displayName || item.name,
                description: item.displayDescription || item.description,
                type: item.displayType || item.type,
                rarity: item.rarity,
                images: {
                  icon: Array.isArray(item.displayAssets) && item.displayAssets[0]?.url
                    ? item.displayAssets[0].url
                    : undefined
                }
              }],
              regularPrice: item.price?.regularPrice || item.price,
              finalPrice: item.price?.finalPrice || item.finalPrice || item.price,
              bundle: item.bundle ? {
                name: item.displayName,
                info: item.displayDescription || item.description,
                image: Array.isArray(item.displayAssets) && item.displayAssets[0]?.url
                  ? item.displayAssets[0].url
                  : undefined
              } : undefined
            }))
        }
      }
    };
  } catch (error) {
    console.error('Error fetching Fortnite shop data:', error);
    throw error;
  }
};

const ItemShop = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeUntilRefresh, setTimeUntilRefresh] = useState('');
  const { toast } = useToast();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['fortniteShop'],
    queryFn: fetchFortniteShop,
    retry: 3,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: true // This ensures the query runs when the component mounts
  });

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextRefresh = new Date();
      // Fortnite shop updates at 00:00 UTC
      nextRefresh.setUTCHours(24, 0, 0, 0);
      if (now >= nextRefresh) {
        nextRefresh.setDate(nextRefresh.getDate() + 1);
      }
      
      const timeLeft = formatDistanceToNow(nextRefresh, { addSuffix: true });
      setTimeUntilRefresh(timeLeft);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error('API Error:', error);
      toast({
        title: "Error connecting to API",
        description: "Could not connect to Fortnite API. Please check your connection or try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (data) {
      const now = new Date();
      setLastUpdated(
        `Last updated: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`
      );
      
      toast({
        title: "Shop Updated",
        description: "Item shop data has been refreshed successfully!",
      });
    }
  }, [data, toast]);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Layout title="Item Shop">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Fortnite </span>
            <span className="text-cyber-purple">Item Shop</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Browse today's Fortnite Item Shop. Get instant delivery to your Fortnite account
            with secure checkout at the best prices.
          </p>
          
          {/* Refresh and last updated info */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Button 
              onClick={handleRefresh} 
              variant="secondary"
              className="text-sm flex items-center gap-2 bg-cyber-purple/20 hover:bg-cyber-purple/30"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Shop
            </Button>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              <span>Next refresh: {timeUntilRefresh}</span>
            </div>
            <span className="text-xs text-gray-400">{lastUpdated}</span>
          </div>
        </motion.div>
        
        <ItemShopFilters 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
        />
        
        {error ? (
          <Alert variant="destructive" className="bg-red-900/40 border-red-700 my-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-red-200">
              Error connecting to Fortnite API. Please check your connection or try again later.
            </AlertDescription>
          </Alert>
        ) : (
        <ItemShopGrid 
          data={data} 
          isLoading={isLoading} 
          error={error} 
          activeFilter={activeFilter}
        />
        )}
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Shop updates daily at 00:00 UTC. All items are subject to availability.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ItemShop;
