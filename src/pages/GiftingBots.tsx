import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, ListChecks } from 'lucide-react';
import './GiftingBots.css'; // We'll add custom CSS for the rotating border

const GiftingBots = () => {
  return (
    <Layout title="Gifting Bots">
      <div className="min-h-screen bg-cyber-blue-dark py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl mx-auto"
        >
          {/* Rotating border wrapper */}
          <div className="rotating-border rounded-2xl">
            <div className="bg-[#181823] rounded-2xl shadow-xl border border-cyber-purple/30 p-8 md:p-12 flex flex-col items-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">Fortnite Bot Accounts</h1>
              <p className="text-gray-300 mb-8 text-center max-w-xl">Enhance your gaming experience with bot accounts. What would you like to do?</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
                {/* View Linked Accounts Box */}
                <div className="rounded-xl border-2 border-green-500 bg-[#141618] p-6 flex flex-col items-center justify-between shadow-lg h-full">
                  <div className="flex flex-col items-center flex-1 w-full">
                    <div className="bg-green-600/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <ListChecks className="text-green-400 w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2 text-center">View Linked Accounts</h2>
                    <ul className="text-green-200 text-sm mb-6 space-y-2">
                      <li className="flex items-start"><span className="mt-1 mr-2 text-green-400">●</span>See all your linked bot accounts</li>
                      <li className="flex items-start"><span className="mt-1 mr-2 text-green-400">●</span>Check account status and connection details</li>
                      <li className="flex items-start"><span className="mt-1 mr-2 text-green-400">●</span>Manage existing bot connections</li>
                      <li className="flex items-start"><span className="mt-1 mr-2 text-green-400">●</span>Remove bot accounts if needed</li>
                    </ul>
                  </div>
                  <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition mt-auto">
                    <Link to="#">View My Accounts</Link>
                  </Button>
                </div>

                {/* Add New Accounts Box */}
                <div className="rounded-xl border-2 border-cyber-purple bg-[#141018] p-6 flex flex-col items-center justify-between shadow-lg h-full">
                  <div className="flex flex-col items-center flex-1 w-full">
                    <div className="bg-cyber-purple/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <PlusCircle className="text-cyber-purple w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2 text-center">Add New Accounts</h2>
                    <ul className="text-cyber-purple-light text-sm mb-6 space-y-2">
                      <li className="flex items-start"><span className="mt-1 mr-2 text-cyber-purple">●</span>Connect new bot accounts to your game</li>
                      <li className="flex items-start"><span className="mt-1 mr-2 text-cyber-purple">●</span>Choose between manual or automated setup</li>
                      <li className="flex items-start"><span className="mt-1 mr-2 text-cyber-purple">●</span>Follow step-by-step guided process</li>
                      <li className="flex items-start"><span className="mt-1 mr-2 text-cyber-purple">●</span>Get more bots to enhance your gameplay</li>
                    </ul>
                  </div>
                  <Button asChild className="w-full bg-cyber-purple hover:bg-cyber-purple/90 text-white font-semibold py-2 rounded-lg transition mt-auto">
                    <Link to="#">Add New Bots</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default GiftingBots; 