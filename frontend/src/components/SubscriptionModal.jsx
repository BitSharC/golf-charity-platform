import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContributionSlider from './ContributionSlider';

const SubscriptionModal = ({ selectedCharity, onClose }) => {
  const [planId, setPlanId] = useState('monthly');
  const [contributionPercentage, setContributionPercentage] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsProcessing(true);
    setServerError(null);

    // This is where React state is bundled to match backend logic requirements.
    const payload = {
       planId,
       charityId: selectedCharity.id,
       charityPercentage: contributionPercentage
    };

    try {
       // Real-world: hitting the Express endpoint mocked by the user requirements
       const response = await fetch('/api/subscriptions/checkout', {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
       });

       const json = await response.json();

       if (!response.ok) {
           throw new Error(json.error || 'Failed to initialize checkout');
       }
       
       // Success! In production this would res.redirect to Stripe Checkout URL
       console.log("Mock Stripe Payload Sent:", json);
       await new Promise(res => setTimeout(res, 800)); // Simulate UI delay
       navigate('/dashboard');

    } catch (err) {
       console.error("Checkout failed", err);
       setServerError(err.message);
    } finally {
       setIsProcessing(false);
    }
  };

  const getPlanPrice = () => planId === 'monthly' ? 19 : 180;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         onClick={onClose}
         className="absolute inset-0 bg-black/60 backdrop-blur-sm"
       />
       
       <motion.div 
         initial={{ scale: 0.95, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         exit={{ scale: 0.95, opacity: 0, y: 20 }}
         className="relative w-full max-w-xl glass-heavy rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
       >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition text-white/50 hover:text-white">
             <X size={20} />
          </button>

          <div className="p-8">
             <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-emerald-400" size={24} />
                <h2 className="text-2xl font-bold">Secure Checkout</h2>
             </div>
             
             <p className="text-white/60 mb-6 font-light">
                Subscribe to direct your philanthropy to <span className="text-white font-medium">{selectedCharity.name}</span>.
             </p>

             {serverError && (
                 <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {serverError}
                 </div>
             )}

             <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => setPlanId('monthly')}
                  className={`p-4 rounded-2xl border text-left transition-all ${planId === 'monthly' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                   <div className="text-sm text-white/50 mb-1">Monthly</div>
                   <div className="text-2xl font-bold">$19<span className="text-sm font-normal text-white/50">/mo</span></div>
                </button>
                <button 
                  onClick={() => setPlanId('yearly')}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${planId === 'yearly' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                   <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">20% DISCOUNT</div>
                   <div className="text-sm text-white/50 mb-1">Yearly</div>
                   <div className="text-2xl font-bold">$180<span className="text-sm font-normal text-white/50">/yr</span></div>
                </button>
             </div>

             <ContributionSlider 
                planPrice={getPlanPrice()} 
                onContributionChange={(val) => setContributionPercentage(val)} 
             />
             
             <button 
                disabled={isProcessing}
                onClick={handleCheckout}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold tracking-wide hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-75"
             >
                {isProcessing ? (
                   <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                   <>
                     Complete {planId === 'monthly' ? '$19' : '$180'} Subscription
                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </>
                )}
             </button>
          </div>
       </motion.div>
    </div>
  );
};

export default SubscriptionModal;
