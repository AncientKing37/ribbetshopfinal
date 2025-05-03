import type { NextApiRequest, NextApiResponse } from 'next';

// This is where you would update your cache, database, or trigger a revalidation
async function handleShopUpdate(shopData: any) {
  // Example: Log the data
  console.log('Received Fortnite shop update:', shopData);

  // TODO: Add your logic here (e.g., update DB, revalidate cache, send notifications, etc.)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // FortniteAPI.io sends JSON
      const shopData = req.body;

      // Handle the shop update
      await handleShopUpdate(shopData);

      // Respond to FortniteAPI.io
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
} 