import { supabase } from '../models/supabaseClient.js';

/**
 * requireAdmin ensures the req.user is an 'admin' role. 
 * MUST be placed AFTER requireAuth in the middleware chain.
 */
export const requireAdmin = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized: User authentication required before evaluating role permission.' });
  }

  try {
    // Lookup user's strict role designation from public user profile
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(403).json({ error: 'Forbidden: Error mapping user to existing role assignments.' });
    }

    // Role-Based Validation Check
    if (data.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Administrator privileges are rigorously required for this operation.' });
    }

    // Pass the confirmed role into downstream functions if needed.
    req.user.role = data.role;
    next();
  } catch (err) {
    console.error('requireAdmin verification error:', err);
    return res.status(500).json({ error: 'Internal server error confirming RBAC clearance logic.' });
  }
};
