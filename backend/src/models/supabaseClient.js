import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'mock-anon-key';

// In a real production setup, for backend admin tasks, you might use the SERVICE_ROLE_KEY
// But for now, we'll initialize the standard client.
export const supabase = createClient(supabaseUrl, supabaseKey);
