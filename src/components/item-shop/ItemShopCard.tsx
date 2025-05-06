import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Gift, Zap } from 'lucide-react';
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
  let rarity = 'common';
  if (mainItem.rarity) {
    if (typeof mainItem.rarity === 'string') {
      rarity = mainItem.rarity.toLowerCase();
    } else if (mainItem.rarity.name) {
      rarity = mainItem.rarity.name.toLowerCase();
    } else if (mainItem.rarity.id) {
      rarity = mainItem.rarity.id.toLowerCase();
    }
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
  let imageUrl = entry.bundle?.image;

  // Try all possible image fields for mainItem, prioritizing displayAssets[0].url
  if (!imageUrl) {
    imageUrl =
      (Array.isArray(mainItem.displayAssets) && mainItem.displayAssets[0]?.url) ||
      mainItem.displayAsset?.url ||
      mainItem.images?.icon ||
      mainItem.images?.featured ||
      mainItem.images?.smallIcon ||
      mainItem.images?.background ||
      mainItem.background ||
      mainItem.full_background ||
      mainItem.icon ||
      mainItem.image ||
      null;
  }
  
  // Ensure the image URL is properly formatted
  const getFormattedImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('https://')) return url;
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

  // Get item type - handle both string and object types
  let itemType = '';
  if (typeof mainItem.type === 'string') {
    itemType = mainItem.type.toLowerCase();
  } else if (mainItem.type && typeof mainItem.type.name === 'string') {
    itemType = mainItem.type.name.toLowerCase();
  } else if (mainItem.type && typeof mainItem.type.id === 'string') {
    itemType = mainItem.type.id.toLowerCase();
  }
  const isGiftable = !entry.bundle && itemType.includes('outfit');

  const handleViewDetails = () => {
    console.log('Navigating to item detail:', entry);
    navigate(`/item/${encodeURIComponent(entry.mainId)}`);
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
        {formattedImageUrl && (
          <ItemCardImage 
            imageUrl={formattedImageUrl} 
            name={name} 
            isHovered={isHovered} 
          />
        )}
        
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

          {/* Buy Now Button */}
          <Button
            className="w-full mt-4 bg-cyber-magenta hover:bg-cyber-magenta/90 text-white font-semibold rounded-md flex items-center justify-center gap-2 py-2"
            style={{ backgroundColor: 'var(--cyber-magenta, #e84cff)' }}
            onClick={handleViewDetails}
          >
            <Zap className="w-5 h-5" />
            Buy Now
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default ItemShopCard;
