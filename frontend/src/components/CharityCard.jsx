import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const CharityCard = ({ charity, onSelect }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass rounded-3xl overflow-hidden group border-white/5 hover:border-emerald-500/40 relative shadow-2xl shadow-black/50"
    >
      <div className="h-48 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />
        {!imgError ? (
           <img 
              src={charity.image_url} 
              alt={charity.name} 
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
           />
        ) : (
           <div className="w-full h-full bg-gradient-to-br from-black to-emerald-950/20 flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform duration-700 ease-out">
               <Heart size={40} className="text-white/10" />
           </div>
        )}
        <div className="absolute top-4 right-4 z-20 glass px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-emerald-300 rounded-full border border-emerald-500/20">
           {charity.category || 'Cause'}
        </div>
        <h3 className="absolute bottom-4 left-5 z-20 text-2xl font-bold tracking-tight drop-shadow-lg">{charity.name}</h3>
      </div>
      
      <div className="p-6 flex flex-col justify-between h-[180px] bg-gradient-to-b from-[#050505] to-transparent relative z-20">
        <p className="text-sm text-white/60 leading-relaxed font-light">
          {charity.description}
        </p>
        
        <button 
           onClick={() => onSelect(charity)}
           className="w-full mt-auto py-3.5 rounded-2xl glass hover:bg-emerald-500 hover:border-emerald-400 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <Heart size={18} className="group-hover/btn:fill-white transition-colors" />
          <span>Support Impact</span>
        </button>
      </div>
    </motion.div>
  );
};

export default CharityCard;
