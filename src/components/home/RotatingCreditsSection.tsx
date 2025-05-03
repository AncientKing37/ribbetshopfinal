import React, { useRef } from 'react';
import { creditPackages } from '@/pages/Credits';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const RotatingCreditsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const swiperRef = useRef(null);

  const handleAddToCart = async (pkg: typeof creditPackages[0]) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add to cart",
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase.from('cart').insert({
      user_id: user.id,
      item_id: String(pkg.credits),
      item_name: pkg.name,
      item_image: `/uploads/credits/${pkg.credits}.png`,
      price: pkg.price,
      quantity: 1,
    });
    if (error) {
      toast({ title: "Error", description: "Could not add to cart", variant: "destructive" });
    } else {
      toast({ title: "Added to Cart", description: `${pkg.credits} credits added to your cart!` });
    }
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
    toast({
      title: "Coming Soon",
      description: "Payment functionality will be implemented soon",
    });
  };

  return (
    <section className="py-16 relative" style={{ background: 'url(/uploads/common-bg.png) center center / cover no-repeat' }}>
      {/* Custom bounce keyframes for left/right */}
      <style>{`
        @keyframes bounce-x-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-12px); }
        }
        @keyframes bounce-x-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(12px); }
        }
        .animate-bounce-x-left {
          animation: bounce-x-left 1s infinite;
        }
        .animate-bounce-x-right {
          animation: bounce-x-right 1s infinite;
        }
      `}</style>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Gift Credits</h2>
          <p className="text-white text-lg max-w-2xl mx-auto">Charge Gift Credits to your account and use on gifting!</p>
        </div>
        <div className="relative">
          {/* Swiper Carousel - custom navigation */}
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            loop={true}
            className="!pb-12"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {creditPackages.map((pkg, index) => (
              <SwiperSlide key={`${pkg.name}-${pkg.credits}`}
                className="flex justify-center"
              >
                <motion.div
                  className="flex flex-col rounded-2xl shadow-xl bg-cyber-blue-dark overflow-hidden"
                  style={{ maxWidth: 320, width: '100%' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Image section */}
                  <div className="relative">
                    <img
                      src={`/uploads/credits/${pkg.credits}.png`}
                      alt={`${pkg.credits} Credits`}
                      className="w-full h-[400px] object-cover rounded-t-2xl bg-black"
                    />
                  </div>
                  {/* Bottom section */}
                  <div className="flex flex-col bg-[#181B23] p-6 rounded-b-2xl">
                    <div>
                      <div className="text-lg font-bold text-white mb-0.5">{pkg.credits.toLocaleString()} Web Credit</div>
                      <div className="text-gray-400 text-sm mb-2">Get Web Credits on our website!</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-white text-lg font-bold">${pkg.price.toFixed(2)} USD</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1 bg-cyber-purple hover:bg-cyber-purple/90 text-white font-semibold rounded-md flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'var(--cyber-purple, #9b87f5)' }}
                        onClick={() => handleAddToCart(pkg)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </Button>
                      <Button
                        className="flex-1 bg-cyber-magenta hover:bg-cyber-magenta/90 text-white font-semibold rounded-md flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'var(--cyber-magenta, #e84cff)' }}
                        onClick={() => handlePurchase(pkg)}
                      >
                        <Zap className="w-5 h-5" />
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom navigation arrows with bounce */}
          <button
            aria-label="Scroll to left"
            className="hidden md:flex items-center justify-center absolute left-[-56px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 transition bg-transparent shadow-none"
            onClick={() => swiperRef.current && swiperRef.current.slidePrev()}
            type="button"
          >
            {/* Right chevron, purple, with bounce-x-right */}
            <svg className="w-8 h-8 animate-bounce-x-right" viewBox="0 0 24 24" fill="none" stroke="#b18cff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 8 12 12 8 8" transform="rotate(90 12 12)" />
            </svg>
          </button>
          <button
            aria-label="Scroll to right"
            className="hidden md:flex items-center justify-center absolute right-[-56px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 transition bg-transparent shadow-none"
            onClick={() => swiperRef.current && swiperRef.current.slideNext()}
            type="button"
          >
            {/* Left chevron, purple, with bounce-x-left */}
            <svg className="w-8 h-8 animate-bounce-x-left" viewBox="0 0 24 24" fill="none" stroke="#b18cff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 8 12 12 8 8" transform="rotate(-90 12 12)" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RotatingCreditsSection; 