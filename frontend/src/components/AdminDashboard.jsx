import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Play, Database, Heart, Edit, Trash2, CheckCircle, Plus, X, GitPullRequest } from 'lucide-react';

const AdminDashboard = () => {
   const [activeTab, setActiveTab] = useState('users'); // 'users' | 'charities' | 'winners' | 'simulator'
   
   // Simulator State
   const [drawResults, setDrawResults] = useState(null);
   const [isDrawing, setIsDrawing] = useState(false);
   const [chaosNumbers, setChaosNumbers] = useState(Array.from({length: 45}, (_, i) => i + 1));
   const [drawLogic, setDrawLogic] = useState('random');

   // Modal State
   const [editingScoresUser, setEditingScoresUser] = useState(null);

   // Analytics State
   const analytics = {
      totalUsers: 12450,
      prizePool: 62250,
      charityTotal: 62250
   };

   // Mock Databases
   const mockUsers = [
      { id: '1', name: 'Alex D.', email: 'alex@example.com', subStatus: 'Active' },
      { id: '2', name: 'Sam T.', email: 'sam@example.com', subStatus: 'Active' },
      { id: '3', name: 'Jordan W.', email: 'jordan@example.com', subStatus: 'Inactive' },
   ];

   const mockCharities = [
      { id: 'c-1', name: 'Oceans Initiative', category: 'Environment' },
      { id: 'c-2', name: 'Youth Athletics', category: 'Youth' },
   ];

   const mockWinners = [
      { id: 'w-1', name: 'Sam T.', date: 'Oct 2026', match: '5 Numbers', payout: '$24,900', status: 'Pending Proof' },
      { id: 'w-2', name: 'Casey R.', date: 'Oct 2026', match: '4 Numbers', payout: '$1,500', status: 'Pending Review' },
   ];

   const runDraw = async () => {
      setIsDrawing(true);
      setDrawResults(null);
      setChaosNumbers(Array.from({length: 45}, () => Math.floor(Math.random() * 45) + 1));
      
      try {
         await new Promise(r => setTimeout(r, 4000));
         
         const pool = Array.from({ length: 45 }, (_, i) => i + 1);
         const res = [];
         for(let i=0; i<5; i++){
            const idx = Math.floor(Math.random() * pool.length);
            res.push(pool[idx]);
            pool.splice(idx, 1);
         }
         res.sort((a,b) => a-b);

         setDrawResults({ winningNumbers: res });
      } catch (err) {
         console.error('Draw failed', err);
      } finally {
         setIsDrawing(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#050505] relative w-full pt-20 px-4 md:px-8 pb-12 overflow-hidden selection:bg-purple-500/30 selection:text-purple-100 font-sans">
         
         {/* Background Orbs */}
         <div className="fixed inset-0 pointer-events-none z-0">
            <motion.div 
               animate={{ y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
               transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-40 right-20 w-[600px] h-[600px] rounded-full bg-purple-700/10 blur-[150px]"
            />
            <motion.div 
               animate={{ x: [0, 30, 0], opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-10 -left-20 w-[500px] h-[500px] rounded-full bg-indigo-700/10 blur-[150px]"
            />
         </div>

         <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
               <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                  <ArrowLeft size={18} />
                  <span>Exit Control Center</span>
               </Link>
               <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border-purple-500/20 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                  <Database size={16} className="text-purple-400" />
                  <span className="text-sm font-bold tracking-widest text-purple-300 uppercase">System Admin</span>
               </div>
            </div>

            {/* Top Analytics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-6 border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Users size={60} /></div>
                  <h3 className="text-sm text-white/50 mb-1 uppercase tracking-wider">Total Users</h3>
                  <div className="text-3xl font-bold text-white">{analytics.totalUsers.toLocaleString()}</div>
               </motion.div>
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6 border-amber-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Trophy size={60} /></div>
                  <h3 className="text-sm text-amber-500/80 mb-1 uppercase tracking-wider">Total Prize Pool</h3>
                  <div className="text-3xl font-bold text-amber-400">${analytics.prizePool.toLocaleString()}</div>
               </motion.div>
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-6 border-emerald-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Heart size={60} /></div>
                  <h3 className="text-sm text-emerald-500/80 mb-1 uppercase tracking-wider">Charity Contributions</h3>
                  <div className="text-3xl font-bold text-emerald-400">${analytics.charityTotal.toLocaleString()}</div>
               </motion.div>
            </div>

            {/* Management Tabs */}
            <div className="flex border-b border-white/10 mb-2 overflow-x-auto hide-scrollbar">
               {[
                  { id: 'users', icon: <Users size={16} />, label: 'Users & Scores' },
                  { id: 'charities', icon: <Heart size={16} />, label: 'Charity Directory' },
                  { id: 'winners', icon: <CheckCircle size={16} />, label: 'Winners & Payouts' },
                  { id: 'simulator', icon: <Play size={16} />, label: 'Draw Engine' },
               ].map(tab => (
                  <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'}`}
                  >
                     {tab.icon} {tab.label}
                  </button>
               ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[500px]">
               <AnimatePresence mode="wait">
                  
                  {activeTab === 'users' && (
                     <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-heavy rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-8">
                           <h2 className="text-2xl font-semibold">User Directory</h2>
                           <div className="relative"><input type="text" placeholder="Search subscribers..." className="bg-black/40 border border-white/10 rounded-full py-2 px-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500" /></div>
                        </div>
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="text-white/40 text-sm border-b border-white/10">
                                 <th className="pb-4 px-4 font-medium">Name</th>
                                 <th className="pb-4 px-4 font-medium">Email</th>
                                 <th className="pb-4 px-4 font-medium">Status</th>
                                 <th className="pb-4 px-4 font-medium text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody>
                              {mockUsers.map(u => (
                                 <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-4 px-4 font-medium text-white">{u.name}</td>
                                    <td className="py-4 px-4 text-white/60 text-sm">{u.email}</td>
                                    <td className="py-4 px-4">
                                       <span className={`px-3 py-1 text-[10px] rounded-full uppercase tracking-wider font-bold ${u.subStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/40'}`}>{u.subStatus}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                       <button 
                                          onClick={() => setEditingScoresUser(u)}
                                          className="text-sm font-semibold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-4 py-1.5 rounded-lg border border-purple-500/20"
                                       >
                                          Edit Scores
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </motion.div>
                  )}

                  {activeTab === 'charities' && (
                     <motion.div key="charities" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-heavy rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-8">
                           <h2 className="text-2xl font-semibold">Charity Roster</h2>
                           <button className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-semibold hover:scale-105 transition-transform text-sm"><Plus size={16}/> Add Charity</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {mockCharities.map(c => (
                              <div key={c.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 flex justify-between items-center group hover:border-white/30 transition-colors">
                                 <div>
                                    <div className="font-bold text-lg">{c.name}</div>
                                    <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{c.category}</div>
                                 </div>
                                 <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 rounded-lg bg-white/10 hover:bg-purple-500/20 hover:text-purple-400 transition-colors"><Edit size={16}/></button>
                                    <button className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </motion.div>
                  )}

                  {activeTab === 'winners' && (
                     <motion.div key="winners" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-heavy rounded-3xl p-8">
                        <div className="flex flex-col mb-8">
                           <h2 className="text-2xl font-semibold mb-2">Winners Verification</h2>
                           <p className="text-white/50 text-sm">Review uploaded scorecards matching draw history.</p>
                        </div>
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="text-white/40 text-sm border-b border-white/10">
                                 <th className="pb-4 px-4 font-medium">Winner</th>
                                 <th className="pb-4 px-4 font-medium">Draw Match</th>
                                 <th className="pb-4 px-4 font-medium">Estimated Payout</th>
                                 <th className="pb-4 px-4 font-medium">Status</th>
                                 <th className="pb-4 px-4 font-medium text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody>
                              {mockWinners.map(w => (
                                 <tr key={w.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="py-4 px-4 font-medium text-white">{w.name}</td>
                                    <td className="py-4 px-4 text-white/60 text-sm">{w.match} <span className="text-xs ml-1 opacity-50">({w.date})</span></td>
                                    <td className="py-4 px-4 font-mono text-emerald-400 font-bold">{w.payout}</td>
                                    <td className="py-4 px-4">
                                       <span className={`px-2 py-1 text-[10px] rounded border uppercase tracking-wider font-bold ${w.status.includes('Proof') ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>{w.status}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right flex justify-end gap-2">
                                       <button className="text-xs font-semibold text-white/70 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">View Image</button>
                                       <button className="text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1"><CheckCircle size={12}/> Pay</button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </motion.div>
                  )}

                  {activeTab === 'simulator' && (
                     <motion.div 
                        key="simulator" 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }} 
                        className="glass-heavy rounded-[3rem] p-8 md:p-16 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.1)] border border-purple-500/20"
                     >
                        {/* Chaos Animation Background */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                           {isDrawing && chaosNumbers.map((num, i) => (
                              <motion.div 
                                 key={i}
                                 initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                                 animate={{ 
                                    opacity: [0, 1, 0],
                                    x: [0, Math.random() * 500 - 250, Math.random() * 1000 - 500],
                                    y: [0, Math.random() * 500 - 250, Math.random() * 1000 - 500],
                                    scale: [0.5, 2.5, 0.2],
                                    rotate: [0, Math.random() * 360, Math.random() * 720]
                                 }}
                                 transition={{ duration: Math.random() * 2 + 1.5, repeat: Infinity, ease: "linear" }}
                                 className="absolute top-1/2 left-1/2 text-5xl md:text-8xl font-black text-white/5 mix-blend-overlay flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                              >
                                 {num}
                              </motion.div>
                           ))}
                        </div>

                        <div className="relative z-10 text-center flex flex-col items-center">
                           <h2 className="text-sm uppercase tracking-[0.3em] text-purple-400 font-bold mb-4 flex items-center gap-2">
                              <Play size={14}/> Month-End Draw Protocol
                           </h2>
                           
                           <h1 className={`${isDrawing ? 'animate-pulse text-white/50' : 'text-white'} text-5xl md:text-7xl font-bold tracking-tight mb-16 transition-colors duration-500`}>
                              {isDrawing ? "Calculating Entropy..." : (drawResults ? "Draw Resolved." : "Execute Draw Engine.")}
                           </h1>

                           <div className="h-32 w-full flex items-center justify-center mb-16">
                              <AnimatePresence>
                                 {drawResults && (
                                    <motion.div className="flex gap-4 md:gap-8 justify-center">
                                       {drawResults.winningNumbers.map((num, idx) => (
                                          <motion.div 
                                             key={`win-${num}`}
                                             initial={{ opacity: 0, scale: 0, y: 50 }}
                                             animate={{ opacity: 1, scale: 1, y: 0 }}
                                             transition={{ type: "spring", stiffness: 300, damping: 15, delay: idx * 0.2 }}
                                             className="w-16 h-16 md:w-24 md:h-24 rounded-[2rem] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl md:text-5xl font-black shadow-[0_0_40px_rgba(147,51,234,0.6)] border-2 border-white/20"
                                          >
                                             {num}
                                          </motion.div>
                                       ))}
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>

                           {/* Draw Logic Toggle */}
                           {!isDrawing && !drawResults && (
                              <div className="flex items-center gap-2 mb-8 bg-black/40 border border-white/10 p-1.5 rounded-full shadow-inner">
                                 <button
                                    onClick={() => setDrawLogic('random')}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${drawLogic === 'random' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-white/50 hover:text-white'}`}
                                 >
                                    Random Generation
                                 </button>
                                 <button
                                    onClick={() => setDrawLogic('algorithmic')}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${drawLogic === 'algorithmic' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-white/50 hover:text-white'}`}
                                 >
                                    <GitPullRequest size={16} /> Algorithmic (Weighted)
                                 </button>
                              </div>
                           )}

                           {!isDrawing && !drawResults && (
                              <motion.button 
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                                 onClick={runDraw}
                                 className="px-10 py-4 rounded-full bg-white text-black font-bold tracking-wider uppercase shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                              >
                                 Run Simulation
                              </motion.button>
                           )}

                           {drawResults && (
                              <motion.button 
                                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                                 onClick={() => setDrawResults(null)}
                                 className="px-8 py-3 rounded-full glass hover:bg-white/10 text-white font-medium transition-colors"
                              >
                                 Reset Matrix
                              </motion.button>
                           )}
                        </div>
                     </motion.div>
                  )}

               </AnimatePresence>
            </div>

            {/* Modal for Edit Scores */}
            <AnimatePresence>
               {editingScoresUser && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                     {/* Backdrop */}
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setEditingScoresUser(null)}
                     />
                     
                     {/* Modal Content */}
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg glass-heavy rounded-3xl p-8 border border-white/10 shadow-2xl"
                     >
                        <button onClick={() => setEditingScoresUser(null)} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                           <X size={18} />
                        </button>

                        <h3 className="text-2xl font-bold text-white mb-2">Override Logs</h3>
                        <p className="text-white/50 text-sm mb-6">Manually adjusting handicap stableford array for: <span className="font-bold text-purple-400">{editingScoresUser.name}</span></p>

                        <div className="space-y-3 mb-8">
                           {[1, 2, 3, 4, 5].map((idx) => (
                              <div key={idx} className="flex justify-between items-center bg-black/40 border border-white/10 rounded-xl p-3">
                                 <span className="text-sm font-medium text-white/70">Score Slot #{idx}</span>
                                 <input type="number" min="1" max="45" defaultValue={Math.floor(Math.random() * 20 + 20)} className="w-20 bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-white text-center focus:outline-none focus:border-purple-500" />
                              </div>
                           ))}
                        </div>

                        <button 
                           onClick={() => setEditingScoresUser(null)}
                           className="w-full py-4 rounded-xl bg-purple-500 text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all"
                        >
                           Force Matrix Update
                        </button>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>

         </div>
      </div>
   );
};

export default AdminDashboard;
