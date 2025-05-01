
interface ItemCardBadgeProps {
  type: 'rarity' | 'badge';
  value: string;
}

export const ItemCardBadge = ({ type, value }: ItemCardBadgeProps) => {
  // Map rarity to color class
  const rarityColorMap: Record<string, string> = {
    common: 'bg-gray-400',
    uncommon: 'bg-green-500',
    rare: 'bg-blue-500',
    epic: 'bg-purple-500',
    legendary: 'bg-orange-500',
    mythic: 'bg-yellow-400',
    marvel: 'bg-red-500',
    dc: 'bg-blue-600',
    icon: 'bg-cyan-400',
    gaming: 'bg-green-400',
    default: 'bg-cyber-blue-dark'
  };
  
  if (type === 'rarity') {
    const bgColor = rarityColorMap[value.toLowerCase()] || rarityColorMap.default;
    return (
      <div className={`absolute top-2 left-2 ${bgColor} px-2 py-1 rounded text-xs capitalize text-white shadow-lg`}>
        {value}
      </div>
    );
  }
  
  // For featured/bundle badges
  return (
    <div className="absolute top-2 right-2 bg-cyber-purple px-2 py-1 rounded text-xs font-medium text-white shadow-lg">
      {value}
    </div>
  );
};
