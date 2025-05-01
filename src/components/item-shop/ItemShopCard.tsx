import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ItemCardBadge } from './card-components/ItemCardBadge';
import { ItemCardImage } from './card-components/ItemCardImage';
import { ItemCardPricing } from './card-components/ItemCardPricing';
import { ItemDetailsDialog } from './card-components/ItemDetailsDialog';
import { Button } from '@/components/ui/button';

interface ItemShopCardProps {
  entry: any;
  isFeatured?: boolean;
}

const ItemShopCard = ({ entry, isFeatured = false }: ItemShopCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  
  // Get the main item to display
  const mainItem = entry.items && entry.items.length > 0 ? entry.items[0] : null;
  if (!mainItem) return null;
  
  // Determine rarity for border color and styling
  // FortniteAPI.io returns rarity as an object with rarity and name properties
  let rarity = 'common';
  if (typeof mainItem.rarity === 'string') {
    rarity = mainItem.rarity.toLowerCase();
  } else if (mainItem.rarity && typeof mainItem.rarity.name === 'string') {
    rarity = mainItem.rarity.name.toLowerCase();
  }
  
  // Map rarity to color class
  const rarityColorMap: Record<string, string> = {
    common: 'border-gray-400',
    uncommon: 'border-green-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-orange-500',
    mythic: 'border-yellow-400',
    marvel: 'border-red-500',
    dc: 'border-blue-600',
    icon: 'border-cyan-400',
    gaming: 'border-green-400',
    default: 'border-cyber-purple'
  };
  
  const borderColor = rarityColorMap[rarity] || rarityColorMap.default;
  
  // Get the item name and price
  const name = entry.bundle ? entry.bundle.name : mainItem.name;
  
  // Extract price values, ensuring we get numbers
  const regularPrice = typeof entry.regularPrice === 'object' 
    ? entry.regularPrice.regularPrice || entry.regularPrice.finalPrice || 0
    : entry.regularPrice || entry.finalPrice || 0;
  
  // Calculate our platform price (with discount)
  const platformPrice = Math.round(regularPrice * 0.8); // 20% discount
  
  // Get the image URL - fortniteapi.io uses different image properties
  const imageUrl = entry.bundle
    ? entry.bundle.image
    : mainItem.images?.icon || mainItem.images?.featured;
  
  // Ensure the image URL is properly formatted
  const getFormattedImageUrl = (url: string) => {
    if (!url) return 'https://placehold.co/150x150?text=No+Image&bg=2a2133&fg=ada3f0';
    // If the URL is already HTTPS, return it as is
    if (url.startsWith('https://')) return url;
    // If it's HTTP, convert to HTTPS
    if (url.startsWith('http://')) return url.replace('http://', 'https://');
    return url;
  };

  const formattedImageUrl = getFormattedImageUrl(imageUrl);
  
  // Set a badge based on different criteria
  const getBadge = () => {
    if (isFeatured) return "Featured";
    if (entry.bundle) return "Bundle";
    if (entry.items && entry.items.length > 1) return "Set";
    return null;
  };
  
  const badge = getBadge();

  // Get item type - fortniteapi.io returns type as an object with name property
  let itemType = '';
  if (typeof mainItem.type === 'string') {
    itemType = mainItem.type.toLowerCase();
  } else if (mainItem.type && typeof mainItem.type.name === 'string') {
    itemType = mainItem.type.name.toLowerCase();
  }
  const isGiftable = !entry.bundle && itemType.includes('outfit');

  const handleViewDetails = () => {
    navigate(`/item/${entry.offerId}`);
  };

  return (
    <>
      <motion.div
        className={`cyber-card relative border-2 shadow-lg ${borderColor} transform transition-all duration-300`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -5,
          boxShadow: '0 10px 25px rgba(155, 135, 245, 0.3)',
          transition: { duration: 0.2 }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Rarity badge */}
        <ItemCardBadge type="rarity" value={rarity} />
        
        {/* Featured/Bundle badge */}
        {badge && <ItemCardBadge type="badge" value={badge} />}
        
        {/* Item Image */}
        <ItemCardImage 
          imageUrl={formattedImageUrl} 
          name={name} 
          isHovered={isHovered} 
        />
        
        <div className="p-3">
          <h3 className="text-cyber-purple-light font-semibold mb-2 truncate">{name}</h3>
          
          {/* Item Type */}
          <p className="text-xs text-gray-400 mb-2 capitalize">
            {itemType.replace(/_/g, ' ')}
          </p>
          
          {/* Pricing component */}
          <ItemCardPricing 
            regularPrice={regularPrice} 
            platformPrice={platformPrice} 
          />
          
          <div className="flex gap-2 mt-3">
            <Button 
              className="cyber-button flex-1 py-1 text-sm flex items-center justify-center gap-2"
              onClick={handleViewDetails}
            >
              <ShoppingCart className="w-3 h-3" />
              View Details
            </Button>
            
            {isGiftable && (
              <Button 
                variant="outline"
                className="py-1 text-sm flex items-center justify-center gap-2"
                onClick={() => setShowDialog(true)}
              >
                <Gift className="w-3 h-3" />
                Gift
              </Button>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Item Details Dialog */}
      <ItemDetailsDialog 
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        mainItem={mainItem}
        name={name}
        rarity={rarity}
        imageUrl={formattedImageUrl}
        regularPrice={regularPrice}
        platformPrice={platformPrice}
        entry={entry}
      />
    </>
  );
};

export default ItemShopCard;
