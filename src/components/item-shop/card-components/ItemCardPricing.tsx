import React from 'react';

interface ItemCardPricingProps {
  regularPrice: number;
  platformPrice: number;
}

export const ItemCardPricing = ({ regularPrice }: ItemCardPricingProps) => {
  return (
    <div className="flex items-center">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/9/96/VBucks_currency.png" 
        alt="V-Bucks" 
        className="w-4 h-4 mr-1" 
      />
      <span className="text-white text-sm font-bold">{regularPrice}</span>
    </div>
  );
};
