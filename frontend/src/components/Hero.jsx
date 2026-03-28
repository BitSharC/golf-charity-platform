import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

const Hero = () => {
  const { openSubscription } = useSubscription();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 px-4 md:px-6">
      {/* Background Animated Orbs / Geometry */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft emerald glow */}
        <motion.div 
          animate={{
            y: [0, -40, 0],
            rotate: [0, 45, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[10%] w-[30rem] h-[30rem] md:w-[40rem] md:h-[40rem] rounded-full bg-gradient-to-tr from-emerald-500/10 to-transparent blur-3xl opacity-50"
        />
        
        {/* Soft deep blue glow */}
        <motion.div 
          animate={{
            y: [0, 50, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[0%] left-[5%] w-[35rem] h-[35rem] md:w-[45rem] md:h-[45rem] rounded-full bg-gradient-to-br from-blue-600/10 to-transparent blur-3xl opacity-40"
        />

        {/* Floating Abstract Geo Ring */}
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/4 left-1/4 w-[500px] h-[500px] md:w-[800px] md:h-[800px] border border-white/5 rounded-full"
        />
        <motion.div
           animate={{ rotate: -360 }}
           transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
           className="absolute top-[15%] left-[20%] w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] border border-emerald-500/5 rounded-full border-dashed"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full glass-heavy text-xs md:text-sm font-semibold tracking-wider uppercase mb-8 text-emerald-300">
            Elevate Your Impact
          </span>
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight drop-shadow-2xl"
        >
          Impact Without <br />
          <span className="text-gradient drop-shadow-lg">Gravity.</span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl font-light leading-relaxed px-4"
        >
          Join a new dimension of giving. Subscribe to track your performance, automatically enter monthly prize draws, and seamlessly fund the causes you believe in.
        </motion.p>
        
        {/* CTA Buttons */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className="flex flex-col sm:flex-row gap-5"
        >
          <button 
            onClick={() => openSubscription()}
            className="px-8 py-3.5 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Subscribe Now
          </button>
          <button className="px-8 py-3.5 rounded-full glass hover:bg-white/10 text-white font-medium transition-colors duration-300">
            How It Works
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
