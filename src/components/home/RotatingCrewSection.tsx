import { motion } from 'framer-motion';
import { crewPackages } from '@/pages/FNCrew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    number: "01",
    title: "Create an Account",
    description: "Sign up for a free account and get access to our gifting services."
  },
  {
    number: "02",
    title: "Purchase Credits",
    description: "Buy credits using Stripe, PayPal, or Crypto to use in our shop."
  },
  {
    number: "03",
    title: "Choose Items",
    description: "Browse the Fortnite shop and select the items you want."
  },
  {
    number: "04",
    title: "Enter Epic Username",
    description: "Provide your Epic Games username to receive the gift."
  },
  {
    number: "05",
    title: "Accept Friend Request",
    description: "Accept the friend request from our gifting bot."
  },
  {
    number: "06",
    title: "Receive Your Gift",
    description: "After the 48hr waiting period, we'll send your item automatically."
  }
];

const RotatingCrewSection = () => {
  const swiperRef = useRef(null);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleAddToCart = async (pkg) => {
    await addToCart({
      item_id: pkg.name,
      item_name: pkg.name,
      item_image: pkg.image,
      price: pkg.price,
    });
  };

  const handleBuyNow = async (pkg) => {
    await addToCart({
      item_id: pkg.name,
      item_name: pkg.name,
      item_image: pkg.image,
      price: pkg.price,
    });
    toast({ title: 'Redirecting to Cart', description: 'Proceed to checkout your Crew package!' });
    navigate('/cart');
  };

  return (
    <section className="py-16 relative overflow-hidden" style={{ background: 'url(/uploads/green-bg.png) center center / cover no-repeat' }}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'black' }}>Fortnite Crew</h2>
          <p style={{ color: 'black' }}>Fortnite Crew subscription at the best price!</p>
        </div>
        
        {/* Rotating Crew Packages Carousel */}
        <div className="relative">
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
            {crewPackages.map((pkg, index) => (
              <SwiperSlide key={pkg.name} className="flex justify-center">
                <div
                  className="flex flex-col rounded-2xl shadow-xl bg-cyber-blue-dark overflow-hidden"
                  style={{ maxWidth: 320, width: '100%' }}
                >
                  {/* Image section */}
                  <div className="relative">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-[400px] object-cover rounded-t-2xl bg-black"
                    />
                  </div>
                  {/* Bottom section */}
                  <div className="flex flex-col bg-[#181B23] p-6 rounded-b-2xl">
                    <div>
                      <div className="text-lg font-bold text-white mb-0.5">{pkg.name}</div>
                      <div className="text-gray-400 text-sm mb-2">Get your Fortnite Crew subscription at the best price!</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-white text-lg font-bold">${pkg.price.toFixed(2)} USD</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md flex items-center justify-center gap-2 py-2"
                        onClick={() => handleAddToCart(pkg)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 0 0 7.48 19h9.04a2 2 0 0 0 1.83-1.3L21 13M7 13V6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v7" /></svg>
                        Add to Cart
                      </button>
                      <button
                        className="flex-1 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-md flex items-center justify-center gap-2 py-2"
                        onClick={() => handleBuyNow(pkg)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
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
            <svg className="w-8 h-8 animate-bounce-x-right" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 8 12 12 8 8" transform="rotate(90 12 12)" />
            </svg>
          </button>
          <button
            aria-label="Scroll to right"
            className="hidden md:flex items-center justify-center absolute right-[-56px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 transition bg-transparent shadow-none"
            onClick={() => swiperRef.current && swiperRef.current.slideNext()}
            type="button"
          >
            <svg className="w-8 h-8 animate-bounce-x-left" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 8 12 12 8 8" transform="rotate(-90 12 12)" />
            </svg>
          </button>
        </div>
        
        {/* Timeline connector (visible on mobile only) */}
        <div className="md:hidden flex justify-center my-8">
          <div className="w-px h-12 bg-cyber-purple/30"></div>
        </div>
      </div>
    </section>
  );
};

export default RotatingCrewSection;
