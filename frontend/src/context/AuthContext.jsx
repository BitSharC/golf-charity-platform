import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'subscriber' or 'admin'
  const [loading, setLoading] = useState(true);

  // Helper method fetching role
  const fetchRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        setRole(data.role); 
      } else {
        setRole('subscriber'); // default
      }
    } catch (err) {
      console.error('Error fetching user RBAC profile:', err);
      setRole('subscriber');
    }
  };

  useEffect(() => {
    // 1. Recover Session from localStorage automatically on boot
    const setupSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchRole(session.user.id);
        }
      } catch (err) {
        console.error('Session boot error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    setupSession();

    // 2. Real-time Subscription to Token Lifecycle
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
  // 1. Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
    setLoading(false);
  });

  // 2. Listen for changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
    setLoading(false);
  });

  // 3. THIS IS THE CRUCIAL PART TO PREVENT LOCK ERRORS
  return () => {
    subscription.unsubscribe();
  };
}, []);

  const value = {
    user,
    role,
    loading,
    isAuthenticated: !!user,
  };

  // Wait for session check to complete before mounting children
  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
        </div>
      )}
    </AuthContext.Provider>
  );
};
