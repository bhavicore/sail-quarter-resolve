// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qqbkumflvtveigidwlii.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYmt1bWZsdnR2ZWlnaWR3bGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzI5MDgsImV4cCI6MjA2NTcwODkwOH0.2fhPbeXJT19evy2qpQVY03kRksaDwmmxOPoT6QEfXOQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);