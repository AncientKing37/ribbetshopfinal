import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserOrders } from '@/services/orderService';
import { formatDistanceToNow } from 'date-fns';

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      try {
        const userOrders = await getUserOrders(session.user.id);
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
        toast({
          title: 'Error',
          description: 'Failed to load your orders. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'processing':
        return 'text-yellow-500';
      case 'pending':
        return 'text-blue-500';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-purple mx-auto mb-4" />
          <div className="text-gray-400">Loading your orders...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Error Loading Orders</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-cyber-purple hover:bg-cyber-purple/90"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">No Orders Found</h1>
            <p className="text-gray-400 mb-8">You haven't placed any orders yet.</p>
            <Button
              onClick={() => navigate('/credits')}
              className="bg-cyber-purple hover:bg-cyber-purple/90"
            >
              Browse Items
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Order History">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Your Orders</h1>
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-gray-900 rounded-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-gray-400 text-sm">
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-800 rounded">
                    {order.item_image && (
                      <img
                        src={order.item_image}
                        alt={order.item_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{order.item_name}</h4>
                      <p className="text-gray-400 text-sm">
                        Quantity: {order.quantity} • ${order.price.toFixed(2)} each
                      </p>
                      <p className="text-gray-400 text-sm">
                        Epic Username: {order.epic_username}
                      </p>
                    </div>
                    <div className="text-cyber-purple font-bold">
                      ${(order.price * order.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                  <div className="text-gray-400">
                    {order.error_message && (
                      <p className="text-red-500 text-sm">{order.error_message}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-cyber-purple font-bold text-xl">
                      ${order.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Orders; 