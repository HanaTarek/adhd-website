// ================================================================
// STEP 3 — supabaseClient.js
// ================================================================
// WHERE TO PUT THIS FILE:
//   src/lib/supabaseClient.js
//   (create the "lib" folder inside src if it doesn't exist)
// ================================================================

// Import createClient from the Supabase library we installed
import { createClient } from '@supabase/supabase-js'

// Read the values from your .env file
// import.meta.env is how Vite reads environment variables
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

// Warn in the console if the env vars are missing
// This helps you debug — it will never crash your app
if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Missing environment variables. ' +
    'Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are in your .env file.'
  )
}

// Create and export the Supabase client
// This is the object we use everywhere to talk to our database
export const supabase = createClient(supabaseUrl, supabaseKey)
