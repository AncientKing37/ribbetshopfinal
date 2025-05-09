import React from 'react';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main 
        className="flex-grow flex items-center justify-center relative"
        style={{
          backgroundImage: 'url("/common-bg.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay for better text readability */}
        
        <div className="relative z-10 text-center px-4 py-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Need Help? Contact Us on Discord
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Join our official Discord server to get support, ask questions, or just chat with the team.
          </p>
          
          <Button
            asChild
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-6 text-lg rounded-lg transition-colors"
          >
            <a 
              href="https://discord.gg/yourserver" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Join Discord Server
            </a>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact; 