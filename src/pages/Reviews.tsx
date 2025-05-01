import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Mock data for reviews
const allReviews = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `User${i + 1}`,
  username: `Fortnite_Player${i + 1}`,
  avatar: `https://i.pravatar.cc/150?img=${(i % 10) + 1}`,
  message: [
    "Amazing service! Got my skin instantly after the 48hr wait period. Will definitely use again!",
    "Best gifting service I've ever used. Super reliable and fast!",
    "I was skeptical at first but Ribbet Shop delivered exactly as promised. Very happy!",
    "The credits system is so convenient. I bought in bulk and used them throughout the season.",
    "Their support team is top-notch. Had an issue and they resolved it within minutes.",
    "Finally got the rare skin I've been wanting for months. Thanks Ribbet Shop!"
  ][i % 6],
  rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
  date: `${Math.floor(Math.random() * 30) + 1} days ago`,
  verified: Math.random() > 0.2, // 80% chance of being verified
  item: ["Shadow Ops", "Galaxy Scout", "Dark Bomber", "Ravage", "Drift", "Haze", "Shadow Midas", "Dream"][i % 8]
}));

const Reviews = () => {
  const [reviews, setReviews] = useState(allReviews);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 8;
  
  // Get current reviews for pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Filter reviews
  const filterReviews = (filterType: string) => {
    setFilter(filterType);
    setCurrentPage(1); // Reset to first page when filtering
    
    if (filterType === 'all') {
      setReviews(allReviews);
    } else if (filterType === 'verified') {
      setReviews(allReviews.filter(review => review.verified));
    } else if (filterType === '5star') {
      setReviews(allReviews.filter(review => review.rating === 5));
    } else if (filterType === '4star') {
      setReviews(allReviews.filter(review => review.rating === 4));
    }
  };
  
  return (
    <Layout>
      <div className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Customer </span>
              <span className="cyber-neon-text">Reviews</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              See what our customers are saying about their experience with Ribbet Shop.
            </p>
            
            <div className="flex flex-wrap justify-center mt-8 gap-2">
              <Button
                variant="outline"
                className={`px-4 py-2 ${filter === 'all' ? 'bg-cyber-purple text-white' : ''}`}
                onClick={() => filterReviews('all')}
              >
                All Reviews
              </Button>
              <Button
                variant="outline"
                className={`px-4 py-2 ${filter === 'verified' ? 'bg-cyber-purple text-white' : ''}`}
                onClick={() => filterReviews('verified')}
              >
                Verified Purchases
              </Button>
              <Button
                variant="outline"
                className={`px-4 py-2 ${filter === '5star' ? 'bg-cyber-purple text-white' : ''}`}
                onClick={() => filterReviews('5star')}
              >
                5 Star Reviews
              </Button>
              <Button
                variant="outline"
                className={`px-4 py-2 ${filter === '4star' ? 'bg-cyber-purple text-white' : ''}`}
                onClick={() => filterReviews('4star')}
              >
                4 Star Reviews
              </Button>
            </div>
          </motion.div>
          
          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentReviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="cyber-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={review.avatar} 
                    alt={review.name} 
                    className="w-10 h-10 rounded-full mr-3 object-cover" 
                  />
                  <div>
                    <div className="font-semibold text-white">{review.name}</div>
                    <div className="text-xs text-gray-400">@{review.username}</div>
                  </div>
                </div>
                
                {review.verified && (
                  <div className="flex items-center mb-3">
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Purchase
                    </span>
                  </div>
                )}
                
                <div className="text-gray-300 mb-3 text-sm italic">"{review.message}"</div>
                
                {review.item && (
                  <div className="mb-3 text-xs text-gray-400">
                    Item: <span className="text-cyber-purple">{review.item}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-cyber-magenta' : 'text-gray-600'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Pagination */}
          {reviews.length > reviewsPerPage && (
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-1">
                {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`w-10 h-10 rounded ${
                      currentPage === index + 1
                        ? 'bg-cyber-purple text-white'
                        : 'bg-cyber-blue text-white hover:bg-cyber-purple/30'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-gray-400">
              Reviews are from verified purchases only. Want to leave a review? Complete a purchase and login to your account.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;
