import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubscriptionFlow = ({ selectedCharity, onClose }) => {
  const [plan, setPlan] = useState('monthly');
  const [contribution, setContribution] = useState(10); // default 10%
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate Express backend call for Stripe session
    try {
       // const res = await fetch('/api/checkout/create-session', { ... })
       await new Promise(resolve => setTimeout(resolve, 1500));
       
       // On success in mock, redirect to dashboard
       navigate('/dashboard');
    } catch (err) {
       console.error("Checkout failed");
    } finally {
       setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       {/* Backdrop */}
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         onClick={onClose}
         className="absolute inset-0 bg-black/60 backdrop-blur-sm"
       />
       
       {/* Modal content */}
       <motion.div 
         initial={{ scale: 0.95, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         exit={{ scale: 0.95, opacity: 0, y: 20 }}
         className="relative w-full max-w-xl glass-heavy rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
       >
          <button 
             onClick={onClose}
             className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition text-white/50 hover:text-white"
          >
             <X size={20} />
          </button>

          <div className="p-8">
             <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-emerald-400" size={24} />
                <h2 className="text-2xl font-bold">Secure Checkout</h2>
             </div>
             
             <p className="text-white/60 mb-6 font-light">
                You are setting up a philanthropic subscription directing impact to <span className="text-white font-medium">{selectedCharity.name}</span>.
             </p>

             {/* Plan Selection */}
             <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => setPlan('monthly')}
                  className={`p-4 rounded-2xl border text-left transition-all ${plan === 'monthly' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                   <div className="text-sm text-white/50 mb-1">Monthly Plan</div>
                   <div className="text-2xl font-bold">$19<span className="text-sm font-normal text-white/50">/mo</span></div>
                </button>
                <button 
                  onClick={() => setPlan('yearly')}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${plan === 'yearly' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                   <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">SAVE 20%</div>
                   <div className="text-sm text-white/50 mb-1">Yearly Plan</div>
                   <div className="text-2xl font-bold">$180<span className="text-sm font-normal text-white/50">/yr</span></div>
                </button>
             </div>

             {/* Contribution Slider */}
             <div className="mb-8 bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-medium text-white/90">Charity Allocation</h3>
                   <span className="text-xl font-bold text-emerald-400">{contribution}%</span>
                </div>
                
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="5"
                  value={contribution}
                  onChange={(e) => setContribution(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-white/40 mt-2">
                   <span>10% min</span>
                   <span>100% full</span>
                </div>
             </div>
             
             {/* Mock Checkout Button */}
             <button 
                disabled={isProcessing}
                onClick={handleCheckout}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold tracking-wide hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-75"
             >
                {isProcessing ? (
                   <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                   <>
                     Complete Subscription {plan === 'monthly' ? '$19' : '$180'}
                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </>
                )}
             </button>
             <p className="text-center text-[10px] text-white/30 mt-4 flex items-center justify-center gap-1">
               <ShieldCheck size={12}/> Using mocked Stripe Integration. Connection is securely simulated.
             </p>
          </div>
       </motion.div>
    </div>
  );
};

export default SubscriptionFlow;
