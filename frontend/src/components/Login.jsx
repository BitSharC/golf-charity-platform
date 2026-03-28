import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e) => {
       e.preventDefault();
       setIsSubmitting(true);
       setErrorMsg('');
       
       try {
           // Establish live session over the Supabase JSON RPC Protocol
           const { data, error } = await supabase.auth.signInWithPassword({
               email,
               password
           });
           
           if (error) throw error;
           
           // Query the public DB to securely grab authorization roles natively
           // (AuthContext will also pick this up instantly, but we do it here strictly to resolve the router redirect instantly)
           const { data: roleData } = await supabase
             .from('users')
             .select('role')
             .eq('id', data.user.id)
             .single();
             
           const userRole = roleData?.role || 'subscriber';
           
           if (userRole === 'admin') {
               navigate('/admin');
           } else {
               navigate('/dashboard');
           }
           
       } catch (error) {
           console.error('Authentication Check Failed:', error);
           setErrorMsg(error.message || 'Login attempt failed.');
       } finally {
           setIsSubmitting(false);
       }
    };

    return (
        <div className="min-h-screen bg-[#050505] relative w-full px-4 flex flex-col items-center justify-center font-sans overflow-hidden">
             
             {/* Zero Gravity Ambient Motion Orbs */}
             <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div 
                   animate={{ y: [0, -40, 0], scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                   transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute top-0 right-[10%] w-[500px] h-[500px] rounded-full bg-emerald-800/20 blur-[150px]"
                />
                <motion.div 
                   animate={{ x: [0, 40, 0], scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                   transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute bottom-0 left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[150px]"
                />
             </div>

             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 glass-heavy p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/10"
             >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#0f172a] to-emerald-950 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/20">
                        <ShieldCheck size={32} className="text-emerald-400" />
                    </div>
                </div>

                <div className="text-center mb-8">
                   <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Secure Access</h2>
                   <p className="text-white/50 text-sm font-light">Authenticate into the global network to track your impact subscriptions and manage your draws.</p>
                </div>

                {errorMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3"
                    >
                        <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-200">{errorMsg}</p>
                    </motion.div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-4">
                   <div className="relative">
                       <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                           <Mail size={18} className="text-white/40" />
                       </div>
                       <input 
                           type="email" 
                           placeholder="Administrator or Subscriber Email" 
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                       />
                   </div>

                   <div className="relative">
                       <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                           <Lock size={18} className="text-white/40" />
                       </div>
                       <input 
                           type="password" 
                           placeholder="Secure Token Password" 
                           required
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                       />
                   </div>

                   <button 
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full flex items-center justify-center py-4 rounded-2xl bg-white text-black font-bold tracking-wide hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all mt-4 disabled:opacity-75"
                   >
                      {isSubmitting ? (
                         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full" />
                      ) : (
                         'Initiate Handshake'
                      )}
                   </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                    <Link to="/" className="inline-flex items-center justify-center w-full gap-2 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white font-medium transition-colors text-sm">
                        <ArrowLeft size={16} /> Cancel Login
                    </Link>
                </div>

             </motion.div>
        </div>
    );
};

export default Login;
