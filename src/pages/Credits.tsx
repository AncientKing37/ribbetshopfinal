import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PlusCircle, BadgeDollarSign } from 'lucide-react';

const creditPackages = [
  {
    name: "Starter",
    credits: 1000,
    price: 4.5,
    popular: false,
    color: "cyber-purple"
  },
  {
    name: "Basic",
    credits: 2800,
    price: 12,
    popular: true,
    color: "cyber-blue"
  },
  {
    name: "Standard",
    credits: 5000,
    price: 19,
    popular: false,
    color: "cyber-green"
  },
  {
    name: "Pro",
    credits: 8000,
    price: 26,
    popular: false,
    color: "cyber-yellow"
  },
  {
    name: "Elite",
    credits: 13500,
    price: 33,
    popular: false,
    color: "cyber-orange"
  },
  {
    name: "Legend",
    credits: 15000,
    price: 40,
    popular: false,
    color: "cyber-red"
  },
  {
    name: "Ultimate",
    credits: 20000,
    price: 55,
    popular: false,
    color: "cyber-magenta"
  }
];

const Credits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const handleSelectPackage = (index: number) => {
    setSelectedPackage(index);
  };

  const handlePurchase = async (pkg: typeof creditPackages[0]) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase credits",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Processing...",
      description: "Your purchase is being processed",
    });
    
    // This will be replaced with actual Stripe implementation later
    console.log(`Purchasing ${pkg.credits} credits for $${pkg.price}`);
    
    // For now, show a placeholder message
    toast({
      title: "Coming Soon",
      description: "Payment functionality will be implemented soon",
    });
  };

  return (
    <Layout title="Purchase Credits">
      <div className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Buy </span>
              <span className="cyber-neon-text">Credits</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Purchase credits to use across our platform. The more credits you buy, the better the value.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {creditPackages.map((pkg, index) => (
              <motion.div
                key={`${pkg.name}-${pkg.credits}`}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <Card className={`h-full cyber-card relative flex flex-col ${
                  pkg.popular ? 'border-cyber-magenta' : ''
                } ${selectedPackage === index ? `ring-2 ring-${pkg.color}` : ''}`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-cyber-magenta text-white px-4 py-1 rounded-full text-sm font-medium z-10">
                      Most Popular
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-bold text-white">
                      {pkg.name} Pack
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Best for casual users
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center flex-grow">
                    <div className="mb-2">
                      <span className={`text-4xl font-bold text-${pkg.color}`}>
                        {pkg.credits.toLocaleString()}
                      </span>
                      <span className="text-gray-400"> Credits</span>
                    </div>
                    
                    <div className="text-2xl font-bold mb-4 text-white">
                      ${pkg.price.toFixed(2)}
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-4">
                      {(pkg.price / pkg.credits * 1000).toFixed(2)}¢ per 1000 credits
                    </div>
                    
                    <div className="flex items-center justify-center mb-2">
                      <BadgeDollarSign className="h-5 w-5 mr-2 text-green-500" />
                      <span className="text-gray-300 text-sm">Best value in its tier</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className={`w-full ${
                        pkg.popular 
                          ? 'bg-cyber-magenta hover:bg-cyber-magenta/80' 
                          : 'cyber-button'
                      }`}
                      onClick={() => handlePurchase(pkg)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="cyber-card p-6">
              <h3 className="text-xl font-bold mb-4 text-center text-cyber-purple-light">Why Purchase Credits?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-cyber-purple mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Credits never expire - purchase once and use anytime.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-cyber-purple mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Larger credit packages include bonus credits at no extra cost.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-cyber-purple mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Purchase multiple items without needing to checkout each time.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-cyber-purple mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure payments via credit card, PayPal, or cryptocurrency.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Credits;
