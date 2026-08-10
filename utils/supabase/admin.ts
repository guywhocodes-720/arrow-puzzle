import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !publishableKey) {
  console.warn("Missing Supabase URL or Publishable Key in environment variables.");
}

export const supabaseAdmin = createClient(supabaseUrl!, publishableKey!);
