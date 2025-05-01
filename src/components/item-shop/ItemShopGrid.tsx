import { motion } from 'framer-motion';
import ItemShopCard from './ItemShopCard';
import { Loader2, AlertTriangle } from 'lucide-react';
import { mockShopData } from './mockShopData';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ShopEntry {
  offerId: string;
  items: Array<{
    name: string;
    description: string;
    type: {
      value: string;
    };
    rarity: {
      value: string;
    };
    images: {
      icon: string;
      featured: string;
      smallIcon: string;
    };
  }>;
  bundle?: {
    name: string;
    info?: string;
    image?: string;
  };
  regularPrice?: number;
  finalPrice?: number;
  section: 'featured' | 'daily' | 'special';
}

interface ItemShopGridProps {
  data: any;
  isLoading: boolean;
  error: Error | null;
  activeFilter: string;
}

const ItemShopGrid = ({ data, isLoading, error, activeFilter }: ItemShopGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-cyber-purple animate-spin mb-2" />
          <p className="text-cyber-purple">Loading item shop data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-900/40 border-red-700 my-6">
        <AlertTriangle className="h-5 w-5" />
        <AlertDescription className="text-red-200">
          There was an error loading shop data. Using fallback display instead.
        </AlertDescription>
      </Alert>
    );
  }

  // Process items from the API
  let shopEntries: ShopEntry[] = [];
  
  // When we have real API data with no errors
  if (!error && data) {
    // Process v3 API format
    if (data.data) {
      // Featured section
      if (data.data.featured) {
        shopEntries = shopEntries.concat(
          (data.data.featured.entries || []).map((entry: any) => ({
            ...entry,
            section: 'featured' as const
          }))
        );
      }
      
      // Daily section
      if (data.data.daily) {
        shopEntries = shopEntries.concat(
          (data.data.daily.entries || []).map((entry: any) => ({
            ...entry,
            section: 'daily' as const
          }))
        );
      }
      
      // Special sections
      if (data.data.specialFeatured) {
        shopEntries = shopEntries.concat(
          (data.data.specialFeatured.entries || []).map((entry: any) => ({
            ...entry,
            section: 'special' as const
          }))
        );
      }
      
      if (data.data.specialDaily) {
        shopEntries = shopEntries.concat(
          (data.data.specialDaily.entries || []).map((entry: any) => ({
            ...entry,
            section: 'special' as const
          }))
        );
      }
    }
  }

  // If we have no items from the API (even with no error), use mock data as fallback
  if (shopEntries.length === 0) {
    shopEntries = [
      ...mockShopData.featured.map(entry => ({ ...entry, section: 'featured' as const })),
      ...mockShopData.daily.map(entry => ({ ...entry, section: 'daily' as const }))
    ];
  }

  // Filter based on activeFilter
  const filteredItems = shopEntries.filter(entry => {
    if (activeFilter === 'all') return true;
    
    // Check if the entry or items within the bundle match the filter
    if (activeFilter === 'bundles' && entry.bundle) return true;
    
    if (entry.items && entry.items.length > 0) {
      return entry.items.some((item: any) => {
        const type = item.type ? item.type.value ? item.type.value.toLowerCase() : item.type.toLowerCase() : '';
        
        switch (activeFilter) {
          case 'outfits':
            return type.includes('outfit') || type.includes('character');
          case 'emotes':
            return type.includes('emote') || type.includes('dance');
          case 'pickaxes':
            return type.includes('pickaxe');
          case 'gliders':
            return type.includes('glider');
          case 'wraps':
            return type.includes('wrap');
          case 'backblings':
            return type.includes('backpack') || type.includes('backbling');
          default:
            return false;
        }
      });
    }
    
    return false;
  });

  // Sort items by section and price
  const sortedItems = [...filteredItems].sort((a, b) => {
    // First sort by section (featured first, then special, then daily)
    const sectionOrder = { featured: 0, special: 1, daily: 2 };
    const sectionCompare = sectionOrder[a.section] - sectionOrder[b.section];
    if (sectionCompare !== 0) return sectionCompare;
    
    // Then sort by price (highest first)
    const priceA = a.regularPrice || a.finalPrice || 0;
    const priceB = b.regularPrice || b.finalPrice || 0;
    return priceB - priceA;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Group items by section
  const groupedItems = sortedItems.reduce<Record<string, ShopEntry[]>>((acc, item) => {
    const section = item.section || 'daily';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {});

  const sectionTitles = {
    featured: 'Featured Items',
    special: 'Special Items',
    daily: 'Daily Items'
  };

  return (
    <div className="space-y-12">
      {Object.entries(groupedItems).map(([section, items]) => (
        <div key={section}>
          <h2 className="text-2xl font-bold mb-6 text-cyber-purple-light border-b border-cyber-purple/30 pb-2">
            {sectionTitles[section as keyof typeof sectionTitles] || 'Items'}
          </h2>
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {items.map((entry, index) => (
              <ItemShopCard 
                key={entry.offerId || `${section}-${index}`}
                entry={entry}
                isFeatured={section === 'featured' || section === 'special'}
              />
            ))}
          </motion.div>
        </div>
      ))}
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No items found matching this filter.</p>
        </div>
      )}
    </div>
  );
};

export default ItemShopGrid;
