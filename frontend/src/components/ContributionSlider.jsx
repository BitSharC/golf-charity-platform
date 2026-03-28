import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ContributionSlider = ({ planPrice, onContributionChange }) => {
  const [percentage, setPercentage] = useState(10); // constraint: min 10%
  
  // Pass state back up to parent form for Express checkout route
  useEffect(() => {
    onContributionChange(percentage);
  }, [percentage, onContributionChange]);

  // Dynamic text element showing exactly how much of their subscription fee goes to charity
  const charityAmount = (planPrice * (percentage / 100)).toFixed(2);

  return (
    <div className="mb-8 bg-white/5 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
       {/* Ambient glowing effect */}
       <div className="absolute top-0 right-1/2 translate-x-1/2 w-[200%] h-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
       
       <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-white/90">Charity Allocation</h3>
          <span className="text-2xl font-bold text-emerald-400 drop-shadow-lg">{percentage}%</span>
       </div>
       
       <input 
         type="range" 
         min="10" 
         max="100" 
         step="5"
         value={percentage}
         onChange={(e) => setPercentage(parseInt(e.target.value))}
         className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"
       />
       
       <div className="flex justify-between text-xs text-white/40 mt-3 mb-6 font-medium tracking-wide">
          <span>MIN: 10%</span>
          <span>MAX: 100%</span>
       </div>

       {/* Dynamic Text Container */}
       <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <span className="text-sm font-medium text-emerald-100/90">Direct Impact per billing</span>
          <motion.div 
             key={charityAmount}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ type: "spring", stiffness: 300, damping: 20 }}
             className="text-2xl font-black text-emerald-400 flex items-center gap-1 drop-shadow-md"
          >
             <span>$</span>{charityAmount}
          </motion.div>
       </div>
    </div>
  );
};

export default ContributionSlider;
