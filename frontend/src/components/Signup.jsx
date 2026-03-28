import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Adjust path if needed
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('subscriber'); // Default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up the user in Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (user) {
      // 2. Insert the extra profile data into your PUBLIC 'users' table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          { 
            id: user.id, 
            email: email, 
            full_name: fullName, 
            role: role 
          },
        ]);

      if (profileError) {
        setError("Auth successful, but profile creation failed: " + profileError.message);
      } else {
        // 3. Success! Redirect based on role
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Join the Network</h2>
        <p className="text-gray-400 text-center mb-8">Select your access tier to begin.</p>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm">{error}</div>}
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2 ml-1">Full Name</label>
            <input 
              type="text" required placeholder="John Doe"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2 ml-1">Email Address</label>
            <input 
              type="email" required placeholder="name@company.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2 ml-1">Password</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Role Toggle Switch */}
          <div className="bg-black/40 p-1 rounded-2xl flex border border-white/5">
            <button
              type="button"
              onClick={() => setRole('subscriber')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${role === 'subscriber' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Subscriber
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${role === 'admin' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Admin Access
            </button>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Already have an account? <Link to="/login" className="text-white hover:underline ml-1">Secure Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;