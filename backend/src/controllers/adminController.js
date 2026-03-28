import { supabase } from '../models/supabaseClient.js';

export const runDraw = async (req, res) => {
  try {
     // Mathematics for picking 5 unique numbers (1-45)
     const pool = Array.from({ length: 45 }, (_, i) => i + 1);
     const winningNumbers = [];
     
     for(let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        winningNumbers.push(pool[randomIndex]);
        pool.splice(randomIndex, 1);
     }
     
     // Example Prize Pool calculation
     // In a production system, this would sum all active subscription values for the month
     const mockTotalSubRevenue = 50000; 
     const charityAllocation = mockTotalSubRevenue * 0.50; // 50% charity (simplified avg)
     const prizePool = mockTotalSubRevenue * 0.50; // 50% to prize pool
     
     // 40% (5-match), 35% (4-match), and 25% (3-match) prize pool splits
     const splits = {
        match5: prizePool * 0.40, // 40%
        match4: prizePool * 0.35, // 35%
        match3: prizePool * 0.25  // 25%
     };

     // Note: we could persist to Supabase here:
     // await supabase.from('draws').insert({ month: new Date().toLocaleString('default', { month: 'long' }), winning_numbers: winningNumbers.sort((a,b) => a-b), status: 'completed' });

     return res.status(200).json({
        data: {
           winningNumbers: winningNumbers.sort((a, b) => a - b),
           prizePoolTotal: prizePool,
           charityTotal: charityAllocation,
           splits
        }
     });

  } catch (err) {
      console.error('Error running draw:', err);
      return res.status(500).json({ error: 'Internal server error while running draw' });
  }
};
