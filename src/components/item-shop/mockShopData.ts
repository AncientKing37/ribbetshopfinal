// Mock data to use as a fallback when API is not available
export const mockShopData = {
  featured: [
    {
      offerId: 'featured-1',
      regularPrice: 1500,
      finalPrice: 1500,
      items: [
        {
          name: 'Cyber Infiltrator',
          description: 'Hack the system.',
          type: { value: 'outfit' },
          rarity: { value: 'epic' },
          images: {
            icon: 'https://via.placeholder.com/300/9b87f5/ffffff?text=Cyber+Infiltrator',
            featured: 'https://via.placeholder.com/300/9b87f5/ffffff?text=Cyber+Infiltrator',
            smallIcon: 'https://via.placeholder.com/300/9b87f5/ffffff?text=Cyber+Infiltrator',
          }
        }
      ]
    },
    {
      offerId: 'featured-2',
      regularPrice: 2000,
      finalPrice: 1800,
      bundle: {
        name: 'Neon Bundle',
        info: 'Bundle'
      },
      items: [
        {
          name: 'Neon Striker',
          description: 'Light up the battlefield.',
          type: { value: 'outfit' },
          rarity: { value: 'legendary' },
          images: {
            icon: 'https://via.placeholder.com/300/ff8c00/ffffff?text=Neon+Striker',
            featured: 'https://via.placeholder.com/300/ff8c00/ffffff?text=Neon+Striker',
            smallIcon: 'https://via.placeholder.com/300/ff8c00/ffffff?text=Neon+Striker',
          }
        },
        {
          name: 'Neon Axe',
          description: 'Slice with style.',
          type: { value: 'pickaxe' },
          rarity: { value: 'rare' },
          images: {
            icon: 'https://via.placeholder.com/300/0088ff/ffffff?text=Neon+Axe',
            featured: 'https://via.placeholder.com/300/0088ff/ffffff?text=Neon+Axe',
            smallIcon: 'https://via.placeholder.com/300/0088ff/ffffff?text=Neon+Axe',
          }
        }
      ]
    },
    {
      offerId: 'featured-3',
      regularPrice: 800,
      finalPrice: 800,
      items: [
        {
          name: 'Digital Dash',
          description: 'Run the virtual mile.',
          type: { value: 'emote' },
          rarity: { value: 'rare' },
          images: {
            icon: 'https://via.placeholder.com/300/0088ff/ffffff?text=Digital+Dash',
            featured: 'https://via.placeholder.com/300/0088ff/ffffff?text=Digital+Dash',
            smallIcon: 'https://via.placeholder.com/300/0088ff/ffffff?text=Digital+Dash',
          }
        }
      ]
    },
    {
      offerId: 'featured-4',
      regularPrice: 1200,
      finalPrice: 1200,
      items: [
        {
          name: 'Pixel Pounder',
          description: 'Flatten your foes with retro style.',
          type: { value: 'pickaxe' },
          rarity: { value: 'epic' },
          images: {
            icon: 'https://via.placeholder.com/300/9b87f5/ffffff?text=Pixel+Pounder',
            featured: 'https://via.placeholder.com/300/9b87f5/ffffff?text=Pixel+Pounder',
            smallIcon: 'https://via.placeholder.com/300/9b87f5/ffffff?text=Pixel+Pounder',
          }
        }
      ]
    }
  ],
  daily: [
    {
      offerId: 'daily-1',
      regularPrice: 800,
      finalPrice: 800,
      items: [
        {
          name: 'Circuit Breaker',
          description: 'Short circuit your enemies.',
          type: { value: 'outfit' },
          rarity: { value: 'uncommon' },
          images: {
            icon: 'https://via.placeholder.com/300/00cc44/ffffff?text=Circuit+Breaker',
            featured: 'https://via.placeholder.com/300/00cc44/ffffff?text=Circuit+Breaker',
            smallIcon: 'https://via.placeholder.com/300/00cc44/ffffff?text=Circuit+Breaker',
          }
        }
      ]
    },
    {
      offerId: 'daily-2',
      regularPrice: 500,
      finalPrice: 500,
      items: [
        {
          name: 'Binary Dance',
          description: '0101001101000001.',
          type: { value: 'emote' },
          rarity: { value: 'uncommon' },
          images: {
            icon: 'https://via.placeholder.com/300/00cc44/ffffff?text=Binary+Dance',
            featured: 'https://via.placeholder.com/300/00cc44/ffffff?text=Binary+Dance',
            smallIcon: 'https://via.placeholder.com/300/00cc44/ffffff?text=Binary+Dance',
          }
        }
      ]
    },
    {
      offerId: 'daily-3',
      regularPrice: 800,
      finalPrice: 800,
      items: [
        {
          name: 'Wireframe Wrap',
          description: 'Wrap your weapons in digital style.',
          type: { value: 'wrap' },
          rarity: { value: 'rare' },
          images: {
            icon: 'https://via.placeholder.com/300/0088ff/ffffff?text=Wireframe+Wrap',
            featured: 'https://via.placeholder.com/300/0088ff/ffffff?text=Wireframe+Wrap',
            smallIcon: 'https://via.placeholder.com/300/0088ff/ffffff?text=Wireframe+Wrap',
          }
        }
      ]
    },
    {
      offerId: 'daily-4',
      regularPrice: 300,
      finalPrice: 300,
      items: [
        {
          name: 'Debug Spray',
          description: 'Mark your territory with code.',
          type: { value: 'spray' },
          rarity: { value: 'uncommon' },
          images: {
            icon: 'https://via.placeholder.com/300/00cc44/ffffff?text=Debug+Spray',
            featured: 'https://via.placeholder.com/300/00cc44/ffffff?text=Debug+Spray',
            smallIcon: 'https://via.placeholder.com/300/00cc44/ffffff?text=Debug+Spray',
          }
        }
      ]
    }
  ]
};
