import React from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

const Navbar = () => {
  const { openSubscription } = useSubscription();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 px-4 md:px-6 py-4"
    >
      <div className="flex items-center gap-4">
  <Link 
    to="/login" 
    className="text-gray-400 hover:text-white transition-colors"
  >
    Login
  </Link>
  
  <Link 
    to="/signup" 
    className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition-all"
  >
    Join the Network
  </Link>
</div>
      <div className="max-w-7xl mx-auto glass rounded-full px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo - abstract geometric replacing golf ball */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-600 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center">
             <Share2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide hidden sm:block">Ascend</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#concept" className="hover:text-white transition-colors duration-300">Concept</a>
          <Link to="/charities" className="hover:text-white transition-colors duration-300">Charities</Link>
          <Link to="/dashboard" className="hover:text-white transition-colors duration-300">Dashboard</Link>
          <Link to="/admin" className="hover:text-white transition-colors duration-300">Admin</Link>
        </div>
        
        <button 
          onClick={() => openSubscription()}
          className="px-5 py-2 rounded-full glass hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Subscribe
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
