import { supabase } from '../models/supabaseClient.js';

// Add a score for a user
export const addScore = async (req, res) => {
  const { userId, score } = req.body;

  if (!userId || score === undefined) {
    return res.status(400).json({ error: 'User ID and score are required' });
  }

  // Validate constraint (1-45 constraint)
  if (score < 1 || score > 45) {
    return res.status(400).json({ error: 'Score must be between 1 and 45' });
  }

  try {
    // Note: The SQL Trigger `enforce_score_limit_after_insert` automatically handles
    // the deletion of older scores if the count exceeds 5.
    const { data, error } = await supabase
      .from('scores')
      .insert({ user_id: userId, score })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ 
      message: 'Score added successfully. Rolling limit enforced by DB trigger.', 
      data 
    });
  } catch (error) {
    console.error('Error adding score:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Retrieve scores for a user
export const getUserScores = async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching scores:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
