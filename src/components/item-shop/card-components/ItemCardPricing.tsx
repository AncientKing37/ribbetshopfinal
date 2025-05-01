
import { Coins } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface ItemCardPricingProps {
  regularPrice: number;
  platformPrice: number;
}

export const ItemCardPricing = ({ regularPrice, platformPrice }: ItemCardPricingProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/9/96/VBucks_currency.png" 
          alt="V-Bucks" 
          className="w-4 h-4 mr-1" 
        />
        <span className="text-white text-sm line-through opacity-70">{regularPrice}</span>
      </div>
      
      <HoverCard>
        <HoverCardTrigger>
          <div className="flex items-center bg-cyber-purple/20 px-2 py-0.5 rounded text-cyber-purple-light">
            <Coins className="w-3 h-3 mr-1" />
            <span className="text-sm font-bold">{platformPrice}</span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="bg-cyber-blue-dark border border-cyber-purple w-48">
          <p className="text-xs text-cyber-purple-light">
            Save 20% when purchasing through our platform with credits!
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
