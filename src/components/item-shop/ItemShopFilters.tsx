import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ItemShopFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

  const filters = [
    { id: 'all', label: 'All Items' },
    { id: 'outfits', label: 'Outfits' },
    { id: 'emotes', label: 'Emotes' },
    { id: 'pickaxes', label: 'Pickaxes' },
  { id: 'gliders', label: 'Gliders' },
  { id: 'wraps', label: 'Wraps' },
  { id: 'backblings', label: 'Back Blings' },
    { id: 'bundles', label: 'Bundles' }
  ];

const ItemShopFilters = ({ activeFilter, setActiveFilter }: ItemShopFiltersProps) => {
  return (
    <motion.div 
      className="flex flex-wrap gap-2 justify-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        {filters.map((filter) => (
        <Button
            key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          className={`text-sm px-4 py-2 rounded-full transition-all duration-200 ${
              activeFilter === filter.id
              ? 'bg-cyber-purple text-white border-cyber-purple' 
              : 'text-gray-300 hover:bg-cyber-purple/20 hover:text-white border-cyber-purple/30'
            }`}
          onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
        </Button>
        ))}
    </motion.div>
  );
};

export default ItemShopFilters;
