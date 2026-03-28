import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Heart, Activity, UploadCloud, PlusCircle, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock API state for the requested modules
  const subscriptionStatus = 'Active';
  const selectedCharity = 'Oceans Initiative';
  const contributionPercentage = 15; // PRD: Default is 10%, user set 15%
  
  const winningsAmount = 8500;
  const paymentStatus = 'Pending';
  
  const [scores, setScores] = useState([]);

  useEffect(() => {
     if (!user) return;
     const fetchScores = async () => {
        try {
           const { data, error } = await supabase
              .from('scores')
              .select('*')
              .eq('user_id', user.id)
              .order('date', { ascending: false })
              .limit(5);
              
           if (error) throw error;
           setScores(data || []);
        } catch (err) {
           console.error('Error fetching scores from DB:', err);
        }
     };
     fetchScores();
  }, [user]);
  
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddScore = async (e) => {
    e.preventDefault();
    const scoreVal = parseInt(newScore, 10);
    
    // Validate constraint: Score restricted to 1-45 and Date is required
    if (!scoreVal || scoreVal < 1 || scoreVal > 45 || !newDate) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
         .from('scores')
         .insert([{ user_id: user.id, score: scoreVal, date: newDate }])
         .select()
         .single();
         
      if (error) throw error;

      setScores(prev => {
        // Crucial Animation Logic: Unshift newest to top, pop oldest
        const updated = [data, ...prev].sort((a,b) => new Date(b.date) - new Date(a.date));
        if (updated.length > 5) {
            updated.pop(); 
        }
        return updated;
      });
      
      setNewScore('');
      setNewDate('');
    } catch (error) {
      console.error('Error recording score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProofUpload = () => {
     // Trigger simulated native file picker
     alert("Opened File Picker for verifying physical scorecard or bank proof.");
  };

  return (
    <div className="min-h-screen bg-bg-deep relative w-full pt-20 px-4 md:px-8 pb-12 overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-100">
      
      {/* Background Animated Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <motion.div 
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-600/10 blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px]"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header / Nav Back */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
           <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={18} />
              <span>Sign Out</span>
           </Link>
           <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/10">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500" />
              <span className="text-sm font-medium">{user?.email || 'Subscriber'}</span>
           </div>
        </div>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 text-white">Your <span className="text-gradient drop-shadow-lg">Dashboard</span></h1>
          <p className="text-white/60 mb-10 max-w-xl font-light">Monitor your philanthropic impact, enter qualifying scores, and manage your prize pool winnings.</p>
        </motion.div>

        {/* PRD Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Module 1: Overview Card */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4, delay: 0.1 }}
             className="glass-heavy rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500 shadow-xl"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={100} />
             </div>
             
             <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Activity size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white/90">Subscription Overview</h3>
             </div>
             
             <div className="grid grid-cols-2 gap-y-6 relative z-10">
                <div>
                   <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Status</p>
                   <div className="text-xl font-bold text-white flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                       {subscriptionStatus}
                   </div>
                </div>
                <div>
                   <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Allocation</p>
                   <div className="text-xl font-bold text-emerald-400">{contributionPercentage}%</div>
                </div>
                <div className="col-span-2 mt-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                   <p className="text-xs text-white/50 mb-1 uppercase tracking-wider flex items-center gap-2">
                      <Heart size={12} className="text-red-400" /> Backing Cause
                   </p>
                   <div className="text-lg font-medium text-white/90">{selectedCharity}</div>
                </div>
             </div>
          </motion.div>

          {/* Module 2: Winnings Card */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4, delay: 0.2 }}
             className="glass-heavy rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-amber-500/30 transition-colors duration-500 shadow-xl"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy size={100} />
             </div>
             
             <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                     <Trophy size={20} />
                   </div>
                   <h3 className="text-lg font-semibold text-white/90">Account Winnings</h3>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest ${paymentStatus === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
                   {paymentStatus}
                </span>
             </div>
             
             <div className="relative z-10">
                <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Total Won</p>
                <div className="text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                   ${winningsAmount.toLocaleString()}
                </div>
                
                <button 
                   onClick={handleProofUpload}
                   className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all duration-300 group/btn"
                >
                   <UploadCloud size={18} className="text-white/60 group-hover/btn:text-white" /> 
                   <span>Upload Proof & Claim</span>
                </button>
                <p className="text-center text-[10px] text-white/40 mt-3 font-light">Draw winnings require scorecard or digital validation.</p>
             </div>
          </motion.div>

          {/* Module 5: Participation Summary */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4, delay: 0.3 }}
             className="glass-heavy rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-500 shadow-xl"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calendar size={100} />
             </div>
             
             <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Calendar size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white/90">Draw Participation</h3>
             </div>
             
             <div className="relative z-10 flex flex-col h-[calc(100%-4rem)]">
                <div className="mb-6">
                   <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Next Upcoming Draw</p>
                   <div className="text-2xl font-bold text-white flex items-center gap-2">
                      <Clock size={16} className="text-indigo-500" /> Oct 31, 2026
                   </div>
                </div>

                <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Historical Entries</p>
                <div className="space-y-2 flex-grow">
                   <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm font-medium text-white/90">September Draw</span>
                      <span className="text-xs text-white/50">Ticket #8492</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm font-medium text-white/90">August Draw</span>
                      <span className="text-xs text-white/50">Ticket #2190</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm font-medium text-white/90">July Draw</span>
                      <span className="text-xs text-emerald-400 font-bold tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Won</span>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Score Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Module 3: Score Entry Interface */}
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.3 }}
             className="lg:col-span-1 h-full"
           >
              <div className="glass-heavy rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between shadow-xl">
                 <div>
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                       <PlusCircle size={20} className="text-emerald-400" />
                       Record Score
                    </h2>
                    <form onSubmit={handleAddScore}>
                       
                       <div className="mb-5">
                          <label className="block text-sm font-medium text-white/60 mb-2 tracking-wide">Stableford Points</label>
                          <input 
                              type="number" 
                              min="1" 
                              max="45"
                              required
                              value={newScore}
                              onChange={(e) => setNewScore(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                              placeholder="Max 45"
                          />
                       </div>

                       <div className="mb-8">
                          <label className="block text-sm font-medium text-white/60 mb-2 tracking-wide">Date Played</label>
                          <input 
                              type="date" 
                              required
                              value={newDate}
                              onChange={(e) => setNewDate(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 [color-scheme:dark]"
                          />
                       </div>

                       <button 
                         type="submit" 
                         disabled={isSubmitting}
                         className="w-full py-4 rounded-2xl bg-white text-black font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center"
                       >
                         {isSubmitting ? (
                           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full" />
                         ) : (
                           'Submit Entry'
                         )}
                       </button>
                    </form>
                 </div>
              </div>
           </motion.div>

           {/* Module 4: Rolling 5-Score Display / Visualizer */}
           <motion.div 
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.4 }}
             className="lg:col-span-2"
           >
              <div className="glass-heavy rounded-3xl p-6 md:p-8 h-[500px] flex flex-col shadow-xl">
                 <div className="flex justify-between items-end mb-6">
                    <div>
                       <h2 className="text-xl font-semibold mb-1">Rolling History</h2>
                       <p className="text-sm text-white/50 font-light">Your active qualification handicap</p>
                    </div>
                    <div className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                       Max 5
                    </div>
                 </div>

                 {/* Container forcing flex layout for Pop/Layout animations */}
                 <div className="flex flex-col flex-grow relative overflow-hidden px-1">
                    <AnimatePresence mode="popLayout">
                       {scores.map((item, idx) => (
                           <motion.div 
                             key={item.id}
                             layout
                             initial={{ opacity: 0, scale: 0.8, y: -40 }}     /* Slides in gracefully from top */
                             animate={{ opacity: 1, scale: 1, y: 0 }}         /* Normalizes exactly into flex grid */
                             exit={{ opacity: 0, scale: 0.5, y: 80 }}         /* Drops VISUALLY down and off-screen */
                             transition={{ 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 30,
                                opacity: { duration: 0.2 }
                             }}
                             className={`p-4 mb-3 rounded-2xl flex items-center justify-between border ${idx === 0 ? 'bg-gradient-to-r from-[#0f172a] to-emerald-900/30 border-emerald-500/50 shadow-lg' : 'bg-black/40 border-white/5'} transition-colors`}
                           >
                             <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${idx === 0 ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'bg-white/5 border border-white/10 text-white/80'}`}>
                                   <span className="text-2xl font-bold">{item.score}</span>
                                </div>
                                <div className="flex flex-col">
                                   <span className="font-semibold text-white/90 tracking-wide">
                                      {idx === 0 ? 'Latest Drive' : 'Historical Entry'}
                                   </span>
                                   <span className="text-xs text-white/50 mt-0.5">
                                      {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                                   </span>
                                </div>
                             </div>
                           </motion.div>
                       ))}
                    </AnimatePresence>
                 </div>
              </div>
           </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
