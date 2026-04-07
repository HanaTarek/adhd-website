// ================================================================
// src/lib/supabaseClient.js  —  React app only
// ================================================================
// This file is used ONLY by your React components (Quiz.jsx etc).
// It runs in the browser, so it uses import.meta.env (Vite syntax).
//
// The weekly-report.js Netlify function has its OWN Supabase client
// using process.env — it does NOT import this file.
//
// REQUIRED in your .env file:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=your_anon_key_here
// ================================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Missing env vars. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)