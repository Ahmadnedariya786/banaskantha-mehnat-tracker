import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://azzopiddikntmblvkqxc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6em9waWRkaWtudG1ibHZrcXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4OTQ1NzYsImV4cCI6MjEwNDQ3MDU3Nn0.JR4BMv3LxL8IaGJ9ZsP82pEusmTCn0Z4UB23Aqg3LrQ';

// public anon key + url fallback; security enforced by Supabase RLS policies
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
