import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CharityCard from './CharityCard';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabaseClient';

const CharitiesPage = () => {
   const [charities, setCharities] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const { openSubscription } = useSubscription();
   const [isLoading, setIsLoading] = useState(true);

   const fetchCharities = async () => {
      setIsLoading(true);
      try {
         let query = supabase.from('charities').select('*');
         
         if (searchQuery) {
            query = query.ilike('name', `%${searchQuery}%`);
         }
         
         const { data, error } = await query;
         
         if (error) throw error;

         setCharities(data || []);
      } catch (err) {
         console.error('Failed to fetch charities directly from Supabase DB:', err);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      const delayFn = setTimeout(() => {
         fetchCharities();
      }, 300);
      return () => clearTimeout(delayFn);
   }, [searchQuery]);

   return (
      <div className="min-h-screen bg-bg-deep relative w-full pt-28 px-4 md:px-8 pb-20 overflow-hidden font-sans">
         {/* Immersive background lighting */}
         <div className="fixed inset-0 pointer-events-none z-0">
            <motion.div 
               animate={{ y: [0, 50, 0], opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-emerald-700/10 blur-[150px]"
            />
         </div>

         <div className="max-w-7xl mx-auto relative z-10">
            {/* Nav Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
               <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                  <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6">
                     <ArrowLeft size={16} />
                     <span>Back</span>
                  </Link>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                     Discover <span className="text-gradient drop-shadow-lg">Causes.</span>
                  </h1>
                  <p className="text-lg text-white/50 max-w-xl font-light">
                     Browse and align your impact. Build your subscription securely and dynamically allocate your contribution.
                  </p>
               </motion.div>
               
               {/* Remote Server-Side Search */}
               <motion.div 
                 initial={{ opacity: 0, x: 30 }} 
                 animate={{ opacity: 1, x: 0 }}
                 className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
               >
                  <div className="relative glass rounded-2xl flex-grow sm:min-w-[300px]">
                     <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-white/40" />
                     </div>
                     <input 
                        type="text" 
                        placeholder="Search charities..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-0 placeholder:text-white/30"
                     />
                  </div>
               </motion.div>
            </div>

            {/* Grid display logic */}
            {isLoading ? (
               <div className="flex justify-center items-center py-32">
                  <div className="w-10 h-10 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
               </div>
            ) : (
               <AnimatePresence mode="popLayout">
                  {charities.length === 0 ? (
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="py-20 text-center text-white/40 glass rounded-3xl"
                     >
                        No charities match your search criteria.
                     </motion.div>
                  ) : (
                     <motion.div 
                       layout
                       className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12"
                     >
                        {charities.map((charity, i) => (
                           <motion.div
                              layout
                              initial={{ opacity: 0, scale: 0.9, y: 30 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 30 }}
                              transition={{ duration: 0.4, delay: i * 0.05 }}
                              key={charity.id}
                           >
                              <CharityCard charity={charity} onSelect={openSubscription} />
                           </motion.div>
                        ))}
                     </motion.div>
                  )}
               </AnimatePresence>
            )}
         </div>

      </div>
   );
};

export default CharitiesPage;
