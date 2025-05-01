import { useState } from 'react';
import { motion } from 'framer-motion';

// Mock testimonial data
const testimonials = [
  {
    id: 1,
    name: "Alex K.",
    username: "FortniteKing92",
    avatar: "https://i.pravatar.cc/150?img=1",
    message: "I've been looking for Galaxy Scout for months! Ribbet Shop made it super easy to get. The process was smooth and I had my skin in just 2 days!",
    rating: 5,
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Sarah L.",
    username: "SweepyBuilderPro",
    avatar: "https://i.pravatar.cc/150?img=5",
    message: "Got the Haze skin through Ribbet Shop after missing it in the shop rotation. Super fast delivery and great communication throughout.",
    rating: 5,
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Mike T.",
    username: "MythicSniper",
    avatar: "https://i.pravatar.cc/150?img=3",
    message: "I was skeptical at first but Ribbet Shop is legit! Got the Dark Bomber skin without any issues. Will definitely use again.",
    rating: 4,
    date: "3 weeks ago"
  },
  {
    id: 4,
    name: "Jamie R.",
    username: "CrankedBuilds",
    avatar: "https://i.pravatar.cc/150?img=4",
    message: "The credit system is so convenient. I bought in bulk and got bonus credits, then used them for multiple items throughout the month.",
    rating: 5,
    date: "2 days ago"
  },
  {
    id: 5,
    name: "Ella P.",
    username: "ShotgunMeta",
    avatar: "https://i.pravatar.cc/150?img=9",
    message: "Their support team is amazing! Had a question about my purchase and got an immediate response through the live chat.",
    rating: 5,
    date: "1 week ago"
  },
  {
    id: 6,
    name: "Carlos M.",
    username: "BoxFightChamp",
    avatar: "https://i.pravatar.cc/150?img=7",
    message: "Using Ribbet Shop was much easier than I expected. Their bot added me right away and gifted my Drift skin exactly when promised.",
    rating: 5,
    date: "4 days ago"
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 3 < testimonials.length ? prevIndex + 3 : 0));
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 3 >= 0 ? prevIndex - 3 : Math.max(0, testimonials.length - 3)));
  };
  
  // Visible testimonials (3 at a time)
  const visibleTestimonials = testimonials.slice(activeIndex, activeIndex + 3);
  
  return (
    <section className="py-16 bg-cyber-blue">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 cyber-neon-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            What Our Customers Say
          </motion.h2>
          <motion.p 
            className="text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Don't just take our word for it - hear from thousands of satisfied Fortnite players.
          </motion.p>
        </div>
        
        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="cyber-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyber-purple/50"
                />
                <div className="ml-3">
                  <h3 className="text-white font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">@{testimonial.username}</p>
                </div>
              </div>
              
              <p className="text-gray-300 italic mb-4">"{testimonial.message}"</p>
              
              <div className="flex items-center justify-between">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-cyber-magenta' : 'text-gray-600'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-400">{testimonial.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Navigation controls */}
        {testimonials.length > 3 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={prevTestimonial} 
              className="cyber-button p-2"
              disabled={activeIndex === 0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextTestimonial} 
              className="cyber-button p-2"
              disabled={activeIndex + 3 >= testimonials.length}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a href="/reviews" className="text-cyber-purple hover:underline inline-flex items-center">
            See All Reviews
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
