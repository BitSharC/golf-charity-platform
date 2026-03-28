import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CharityCard from './CharityCard';
import SubscriptionFlow from './SubscriptionFlow';

const Charities = () => {
   const [charities, setCharities] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedCharity, setSelectedCharity] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [filter, setFilter] = useState('All');

   useEffect(() => {
      const fetchCharities = async () => {
         try {
            // MOCKED fetch call to our Express endpoint
            // const response = await fetch('/api/charities');
            // const { data } = await response.json();
            
            // Simulating network delay and returning fallback data
            await new Promise(res => setTimeout(res, 800));
            const mockData = [
               { id: 'c-1', name: 'Oceans Initiative', description: 'Protecting and restoring marine life habitats across the globe.', category: 'Environment', image_url: 'https://images.unsplash.com/photo-1582967634458-18e3848b8969?auto=format&fit=crop&q=80&w=600' },
               { id: 'c-2', name: 'Global Reforestation', description: 'Planting millions of trees where they are needed most to combat climate change.', category: 'Environment', image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600' },
               { id: 'c-3', name: 'Future Athletics Fund', description: 'Empowering children and creating leaders through youth sports programs.', category: 'Youth', image_url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=600' },
               { id: 'c-4', name: 'Clean Water Project', description: 'Building wells and infrastructure to provide safe drinking water.', category: 'Humanitarian', image_url: 'https://images.unsplash.com/photo-1542330952650-681b476eb34f?auto=format&fit=crop&q=80&w=600' },
               { id: 'c-5', name: 'Wildlife Rescue Ops', description: 'Direct intervention for endangered land animals and habitat preservation.', category: 'Wildlife', image_url: 'https://images.unsplash.com/photo-1516467554988-72439ffc4fb7?auto=format&fit=crop&q=80&w=600' }
            ];
            setCharities(mockData);
         } catch (err) {
            console.error(err);
         } finally {
            setIsLoading(false);
         }
      };
      
      fetchCharities();
   }, []);

   const categories = ['All', 'Environment', 'Youth', 'Humanitarian', 'Wildlife'];

   const filteredCharities = charities.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'All' || c.category === filter;
      return matchesSearch && matchesFilter;
   });

   return (
      <div className="min-h-screen bg-bg-deep relative w-full pt-28 px-4 md:px-8 pb-20 overflow-hidden font-sans">
         {/* Background Styling for immersion */}
         <div className="fixed inset-0 pointer-events-none z-0">
            <motion.div 
               animate={{ y: [0, 50, 0], opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-emerald-700/10 blur-[150px]"
            />
         </div>

         <div className="max-w-7xl mx-auto relative z-10">
            {/* Header Content */}
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
                     Browse and align your impact with a wide array of curated global charities. Your subscription drives their mission forward.
                  </p>
               </motion.div>
               
               {/* Search & Filter tools */}
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

            {/* Filter Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-wrap gap-3 mb-12"
            >
               <div className="flex items-center gap-2 mr-2 text-white/40">
                  <Filter size={16} />
                  <span className="text-sm">Filter:</span>
               </div>
               {categories.map(cat => (
                  <button
                     key={cat}
                     onClick={() => setFilter(cat)}
                     className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'glass hover:bg-white/10 text-white/70 hover:text-white'}`}
                  >
                     {cat}
                  </button>
               ))}
            </motion.div>

            {/* Charity Grid */}
            {isLoading ? (
               <div className="flex justify-center items-center py-32">
                  <div className="w-10 h-10 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
               </div>
            ) : (
               <AnimatePresence mode="popLayout">
                  {filteredCharities.length === 0 ? (
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
                        {filteredCharities.map((charity, i) => (
                           <motion.div
                              layout
                              initial={{ opacity: 0, scale: 0.9, y: 30 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 30 }}
                              transition={{ duration: 0.4, delay: i * 0.05 }}
                              key={charity.id}
                           >
                              <CharityCard charity={charity} onSelect={setSelectedCharity} />
                           </motion.div>
                        ))}
                     </motion.div>
                  )}
               </AnimatePresence>
            )}
         </div>

         {/* Subscription Payment Modal */}
         <AnimatePresence>
            {selectedCharity && (
               <SubscriptionFlow 
                  selectedCharity={selectedCharity} 
                  onClose={() => setSelectedCharity(null)} 
               />
            )}
         </AnimatePresence>
      </div>
   );
};

export default Charities;
