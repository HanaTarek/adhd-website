// ================================================================
// STEP 4 — saveQuizResult.js
// ================================================================
// WHERE TO PUT THIS FILE:
//   src/lib/saveQuizResult.js
// ================================================================
// WHAT THIS DOES:
//   Takes all the data from the quiz (demographics + answers + result)
//   and saves one row into your Supabase quiz_results table.
//   If something goes wrong it logs the error but NEVER crashes the quiz.
// ================================================================

import { supabase } from './supabaseClient'

// ── Helper: turn the scoreQuiz() result into a simple string ────
// scoreQuiz() returns an object with flags like isCombined, isInattentive, etc.
// We convert that into a single readable string for the database.
function getResultType(result) {
  if (result.isCombined)         return 'combined'
  if (result.isInattentive)      return 'inattentive'
  if (result.isHyperactive)      return 'hyperactive'
  return 'normal'  // none of the ADHD patterns matched
}

// ── Main function ────────────────────────────────────────────────
//
// PARAMETERS (everything collected during the quiz):
//   result       → the object returned by scoreQuiz(answers)
//   language     → 'en' or 'ar'
//   parentName   → string or '' (empty = anonymous)
//   childAge     → string like "8 years old" or Arabic equivalent
//   childGender  → 'boy' | 'girl' | ''
//   suspectAdhd  → 'yes' | 'no' | 'not_thought'
//
export async function saveQuizResult({
  result,
  language,
  parentName,
  childAge,
  childGender,
  suspectAdhd,
}) {
  // Safety check — if supabase client wasn't created, do nothing
  if (!supabase) return

  try {
    // Insert one row into the quiz_results table
    // Each key here must match a column name in your Supabase table
    const { error } = await supabase
      .from('quiz_results')   // name of your table
      .insert({
        // ── Quiz outcome ──────────────────────────────────────
        result_type: getResultType(result),
        // 'combined' | 'inattentive' | 'hyperactive' | 'normal'

        group_a_score: result.groupAPositives,
        // Number of inattentive symptoms scored as Often/Very Often (0–9)

        group_b_score: result.groupBPositives,
        // Number of hyperactive symptoms scored as Often/Very Often (0–9)

        has_performance_impairment: result.hasPerformanceImpairment,
        // true or false — whether daily functioning is affected

        language: language,
        // 'en' or 'ar'

        // ── Demographics ──────────────────────────────────────
        parent_name: parentName?.trim() || null,
        // If the parent typed a name, save it. Otherwise save NULL (anonymous).
        // .trim() removes accidental spaces. || null means "if empty, use null"

        child_age: childAge ,
        // The age string exactly as selected, e.g. "8 years old" or "٨ سنوات"

        child_gender: childGender ,
        // 'boy', 'girl', or null if not selected

        // ── New question ──────────────────────────────────────
        suspect_adhd: suspectAdhd,
        // 'yes' | 'no' | 'not_thought' | null if not answered
      })

    // If Supabase returns an error, log it (but don't crash the quiz)
    if (error) {
      console.error('[saveQuizResult] Supabase insert error:', error.message)
    } else {
      console.log('[saveQuizResult] ✅ Quiz result saved successfully')
    }

  } catch (err) {
    // This catches network errors, etc.
    console.error('[saveQuizResult] Unexpected error:', err)
  }
}
export async function saveQuizResultArabic({
  result,
  language,
  parentName,
  childAge,
  childGender,
  suspectAdhd,
}) {
  // Safety check — if supabase client wasn't created, do nothing
  if (!supabase) return

  try {
    // Insert one row into the quiz_results table
    // Each key here must match a column name in your Supabase table
    const { error } = await supabase
      .from('quiz_results')   // name of your table
      .insert({
        // ── Quiz outcome ──────────────────────────────────────
        result_type: getResultType(result),
        // 'combined' | 'inattentive' | 'hyperactive' | 'normal'

        group_a_score: result.groupAPositives,
        // Number of inattentive symptoms scored as Often/Very Often (0–9)

        group_b_score: result.groupBPositives,
        // Number of hyperactive symptoms scored as Often/Very Often (0–9)

        has_performance_impairment: result.hasPerformanceImpairment,
        // true or false — whether daily functioning is affected

        language: language,
        // 'en' or 'ar'

        // ── Demographics ──────────────────────────────────────
        parent_name: parentName?.trim() || null,
        // If the parent typed a name, save it. Otherwise save NULL (anonymous).
        // .trim() removes accidental spaces. || null means "if empty, use null"

        child_age: childAge ,
        // The age string exactly as selected, e.g. "8 years old" or "٨ سنوات"

        child_gender: childGender ,
        // 'boy', 'girl', or null if not selected

        // ── New question ──────────────────────────────────────
        suspect_adhd: suspectAdhd,
        // 'yes' | 'no' | 'not_thought' | null if not answered
      })

    // If Supabase returns an error, log it (but don't crash the quiz)
    if (error) {
      console.error('[saveQuizResult] Supabase insert error:', error.message)
    } else {
      console.log('[saveQuizResult] ✅ Quiz result saved successfully')
    }

  } catch (err) {
    // This catches network errors, etc.
    console.error('[saveQuizResult] Unexpected error:', err)
  }
}

