// ================================================================
// netlify/functions/weekly-report.js
// ================================================================
// FIX SUMMARY:
//
// The "Cannot find module '@supabase/supabase-js'" error happened
// because Netlify Functions run in an isolated Node.js environment
// that does NOT share your React app's node_modules.
//
// SOLUTION:
//   1. Added netlify/functions/package.json with the dependencies
//      Netlify sees this and installs them just for the functions.
//
//   2. This file creates its OWN Supabase client using process.env
//      (no VITE_ prefix — VITE_ variables only exist in the browser).
//
//   3. DO NOT import from supabaseClient.js here — that file uses
//      import.meta.env which is a browser/Vite feature and crashes
//      in Node.js (Netlify Functions environment).
//
// ENV VARIABLES needed in Netlify dashboard (Site settings → Env vars):
//   SUPABASE_URL          → your Supabase project URL (no VITE_ prefix)
//   SUPABASE_SERVICE_KEY  → service role key (NOT anon key)
//   RESEND_API_KEY        → your Resend API key
//   REPORT_TO_EMAIL       → first recipient email
//   REPORT_TO_EMAIL_2     → second recipient email (optional)
//   REPORT_FROM_EMAIL     → onboarding@resend.dev (or your domain)
// ================================================================

import { createClient } from '@supabase/supabase-js'
import XLSX             from 'xlsx'

// ── Create Supabase client directly here ─────────────────────────
// process.env works in Node.js (Netlify Functions).
// Never use import.meta.env here — that's Vite/browser only.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ================================================================
// MAIN HANDLER
// ================================================================
export const handler = async () => {
  try {
    // Log which env vars are present (values hidden for security)
    console.log('[weekly-report] Env check:')
    console.log('  SUPABASE_URL set:',         !!process.env.SUPABASE_URL)
    console.log('  SUPABASE_SERVICE_KEY set:',  !!process.env.SUPABASE_SERVICE_KEY)
    console.log('  RESEND_API_KEY set:',        !!process.env.RESEND_API_KEY)
    console.log('  REPORT_FROM_EMAIL:',         process.env.REPORT_FROM_EMAIL)
    console.log('  REPORT_TO_EMAIL:',           process.env.REPORT_TO_EMAIL)
    console.log('  REPORT_TO_EMAIL_2:',         process.env.REPORT_TO_EMAIL_2 || '(not set)')

    const rows        = await fetchData()
    console.log(`[weekly-report] Fetched ${rows.length} rows from Supabase`)

    const analytics   = calculateAnalytics(rows)
    const excelBuffer = generateExcel(rows)
    await sendWeeklyEmail(analytics, excelBuffer)

    return { statusCode: 200, body: 'Report sent successfully.' }

  } catch (err) {
    console.error('[weekly-report] Fatal error:', err)
    return { statusCode: 500, body: `Error: ${err.message}` }
  }
}

// ================================================================
// FETCH all rows from Supabase
// ================================================================
async function fetchData() {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .order('taken_at', { ascending: false })

  if (error) throw new Error(`Supabase fetch failed: ${error.message}`)
  return data || []
}

// ================================================================
// CALCULATE analytics from the rows array
// ================================================================
function calculateAnalytics(rows) {
  const total = rows.length

  // Helper: format a count as a percentage string
  const pct = (count) =>
    total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '—'

  const byResult    = { combined: 0, inattentive: 0, hyperactive: 0, normal: 0 }
  const bySuspect   = { yes: 0, no: 0, not_thought: 0, null: 0 }
  const crossAnalysis = {
    yes_adhd: 0, yes_normal: 0,
    no_adhd: 0,  no_normal: 0,
    not_thought_adhd: 0, not_thought_normal: 0,
  }
  const byLanguage = { en: 0, ar: 0 }
  const byGender   = { boy: 0, girl: 0, null: 0 }
  const ageBuckets = { '4-6': 0, '7-9': 0, '10-12': 0, '13-15': 0, '16-18': 0 }

  let totalGroupA = 0
  let totalGroupB = 0
  let impairmentCount = 0

  rows.forEach(row => {
    const resultType = row.result_type || 'normal'
    const suspect    = row.suspect_adhd || 'null'
    const isAdhd     = resultType !== 'normal'

    // Count result types
    if (byResult[resultType] !== undefined) byResult[resultType]++

    // Count suspect answers
    if (bySuspect[suspect] !== undefined) bySuspect[suspect]++
    else bySuspect.null++

    // Cross-analysis: what did parents suspect vs what the result was
    if (suspect === 'yes'         && isAdhd)  crossAnalysis.yes_adhd++
    if (suspect === 'yes'         && !isAdhd) crossAnalysis.yes_normal++
    if (suspect === 'no'          && isAdhd)  crossAnalysis.no_adhd++
    if (suspect === 'no'          && !isAdhd) crossAnalysis.no_normal++
    if (suspect === 'not_thought' && isAdhd)  crossAnalysis.not_thought_adhd++
    if (suspect === 'not_thought' && !isAdhd) crossAnalysis.not_thought_normal++

    // Language
    if (row.language === 'en' || row.language === 'eng') byLanguage.en++
    else if (row.language === 'ar') byLanguage.ar++

    // Gender
    if (row.child_gender === 'boy') byGender.boy++
    else if (row.child_gender === 'girl') byGender.girl++
    else byGender.null++

    // Scores
    totalGroupA += row.group_a_score || 0
    totalGroupB += row.group_b_score || 0
    if (row.has_performance_impairment) impairmentCount++

    // Age buckets — child_age is stored as a number
    if (row.child_age) {
      const ageNum = parseInt(row.child_age)
      if (!isNaN(ageNum)) {
        if (ageNum <= 6)       ageBuckets['4-6']++
        else if (ageNum <= 9)  ageBuckets['7-9']++
        else if (ageNum <= 12) ageBuckets['10-12']++
        else if (ageNum <= 15) ageBuckets['13-15']++
        else                   ageBuckets['16-18']++
      }
    }
  })

  const now = new Date()

  return {
    total,
    totalAdhd:     byResult.combined + byResult.inattentive + byResult.hyperactive,
    byResult,
    bySuspect,
    crossAnalysis,
    byLanguage,
    byGender,
    ageBuckets,
    avgGroupA:     total > 0 ? (totalGroupA / total).toFixed(1) : '—',
    avgGroupB:     total > 0 ? (totalGroupB / total).toFixed(1) : '—',
    impairmentRate: pct(impairmentCount),
    pct,
    datePart: now.toISOString().split('T')[0],
    timePart: now.toUTCString().split(' ')[4] + ' UTC',
  }
}

// ================================================================
// GENERATE Excel file with two sheets
// ================================================================
function generateExcel(rows) {
  const workbook = XLSX.utils.book_new()

  // Sheet 1: Raw data — every column from Supabase
  if (rows.length > 0) {
    const rawData = rows.map(row => ({
      'ID':                     row.id,
      'Date & Time':            row.taken_at ? new Date(row.taken_at).toLocaleString() : '',
      'Language':               row.language === 'ar' ? 'Arabic' : 'English',
      'Child Name':             row.parent_name || 'Anonymous',
      'Child Age':              row.child_age || '',
      'Child Gender':           row.child_gender || '',
      'Suspects ADHD?':         row.suspect_adhd === 'yes'         ? 'Yes'
                              : row.suspect_adhd === 'no'          ? 'No'
                              : row.suspect_adhd === 'not_thought' ? 'Not thought about it'
                              : '',
      'Result':                 row.result_type || '',
      'Inattentive Score (A)':  row.group_a_score ?? '',
      'Hyperactive Score (B)':  row.group_b_score ?? '',
      'Performance Impairment': row.has_performance_impairment ? 'Yes' : 'No',
    }))
    const rawSheet = XLSX.utils.json_to_sheet(rawData)
    rawSheet['!cols'] = [
      { wch: 8 }, { wch: 20 }, { wch: 10 }, { wch: 18 },
      { wch: 10 }, { wch: 12 }, { wch: 24 }, { wch: 16 },
      { wch: 20 }, { wch: 20 }, { wch: 22 },
    ]
    XLSX.utils.book_append_sheet(workbook, rawSheet, 'Raw Data')
  }

  // Sheet 2: Analytics summary
  const a = calculateAnalytics(rows)
  const summaryData = [
    { 'Metric': 'Total Submissions',              'Value': a.total },
    { 'Metric': '',                               'Value': '' },
    { 'Metric': '── Result Breakdown ──',         'Value': '' },
    { 'Metric': 'Combined ADHD',                  'Value': a.byResult.combined },
    { 'Metric': 'Predominantly Inattentive',      'Value': a.byResult.inattentive },
    { 'Metric': 'Predominantly Hyperactive',      'Value': a.byResult.hyperactive },
    { 'Metric': 'No ADHD Signs (Normal)',         'Value': a.byResult.normal },
    { 'Metric': '',                               'Value': '' },
    { 'Metric': '── Suspect ADHD Question ──',    'Value': '' },
    { 'Metric': 'Answered Yes',                   'Value': a.bySuspect.yes },
    { 'Metric': 'Answered No',                    'Value': a.bySuspect.no },
    { 'Metric': 'Never thought about it',         'Value': a.bySuspect.not_thought },
    { 'Metric': '',                               'Value': '' },
    { 'Metric': '── Cross Analysis ──',           'Value': '' },
    { 'Metric': 'Suspected YES → ADHD result',    'Value': a.crossAnalysis.yes_adhd },
    { 'Metric': 'Suspected YES → Normal result',  'Value': a.crossAnalysis.yes_normal },
    { 'Metric': 'Suspected NO → ADHD result',     'Value': a.crossAnalysis.no_adhd },
    { 'Metric': 'Suspected NO → Normal result',   'Value': a.crossAnalysis.no_normal },
    { 'Metric': 'Not thought → ADHD found',       'Value': a.crossAnalysis.not_thought_adhd },
    { 'Metric': 'Not thought → Normal',           'Value': a.crossAnalysis.not_thought_normal },
    { 'Metric': '',                               'Value': '' },
    { 'Metric': '── Score Averages ──',           'Value': '' },
    { 'Metric': 'Avg Inattentive Score (A)',       'Value': a.avgGroupA + ' / 9' },
    { 'Metric': 'Avg Hyperactive Score (B)',       'Value': a.avgGroupB + ' / 9' },
    { 'Metric': 'Performance Impairment Rate',     'Value': a.impairmentRate },
    { 'Metric': '',                               'Value': '' },
    { 'Metric': '── Language ──',                'Value': '' },
    { 'Metric': 'English',                        'Value': a.byLanguage.en },
    { 'Metric': 'Arabic',                         'Value': a.byLanguage.ar },
    { 'Metric': '',                               'Value': '' },
    { 'Metric': '── Gender ──',                  'Value': '' },
    { 'Metric': 'Boys',                           'Value': a.byGender.boy },
    { 'Metric': 'Girls',                          'Value': a.byGender.girl },
    { 'Metric': '',                               'Value': '' },
    { 'Metric': '── Age Distribution ──',         'Value': '' },
    { 'Metric': 'Ages 4–6',                       'Value': a.ageBuckets['4-6'] },
    { 'Metric': 'Ages 7–9',                       'Value': a.ageBuckets['7-9'] },
    { 'Metric': 'Ages 10–12',                     'Value': a.ageBuckets['10-12'] },
    { 'Metric': 'Ages 13–15',                     'Value': a.ageBuckets['13-15'] },
    { 'Metric': 'Ages 16–18',                     'Value': a.ageBuckets['16-18'] },
  ]
  const summarySheet = XLSX.utils.json_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 38 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Analytics Summary')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

// ================================================================
// SEND email via Resend with Excel attached
// ================================================================
async function sendWeeklyEmail(a, excelBuffer) {
  const base64Excel = Buffer.from(excelBuffer).toString('base64')
  const dateStr     = new Date().toISOString().split('T')[0]
  const filename    = `quiz-report-${dateStr}.xlsx`

  // Build the recipient list — always includes REPORT_TO_EMAIL,
  // adds REPORT_TO_EMAIL_2 if it's set
  const toList = [process.env.REPORT_TO_EMAIL]
  if (process.env.REPORT_TO_EMAIL_2) {
    toList.push(process.env.REPORT_TO_EMAIL_2)
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background: #f5f7fa; margin: 0; padding: 20px; color: #1f2937; }
  .card { background: white; border-radius: 12px; padding: 28px; max-width: 640px; margin: 0 auto; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
  .header { background: linear-gradient(135deg, #0f8df5, #f41d88); border-radius: 10px; padding: 24px; color: white; margin-bottom: 24px; }
  .header h1 { margin: 0 0 4px; font-size: 20px; }
  .header p  { margin: 0; opacity: 0.85; font-size: 13px; }
  .kpi-row { display: flex; gap: 12px; margin-bottom: 24px; }
  .kpi { flex: 1; background: #f5f7fa; border-radius: 8px; padding: 14px; border-left: 3px solid #0f8df5; }
  .kpi.pink  { border-left-color: #f41d88; }
  .kpi.green { border-left-color: #10b981; }
  .kpi-num   { font-size: 26px; font-weight: 800; color: #0a2463; }
  .kpi-label { font-size: 12px; color: #6b7280; margin-top: 2px; }
  h2 { font-size: 14px; font-weight: 700; color: #0a2463; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 6px; margin: 20px 0 10px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 6px 10px; background: #f5f7fa; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
  td { padding: 8px 10px; border-top: 1px solid #e5e7eb; }
  .hl { background: #eff6ff; font-weight: 600; }
  .footer { text-align: center; font-size: 11px; color: #9ca3af; margin-top: 24px; }
</style>
</head>
<body>
<div class="card">

  <div class="header">
    <h1>📊 Quiz Analytics Report</h1>
    <p>Listen to Their Minds · ${a.datePart} at ${a.timePart}</p>
  </div>

  <!-- KPI row -->
  <div class="kpi-row">
    <div class="kpi">
      <div class="kpi-num">${a.total}</div>
      <div class="kpi-label">Total quizzes</div>
    </div>
    <div class="kpi pink">
      <div class="kpi-num">${a.totalAdhd}</div>
      <div class="kpi-label">Showed ADHD signs</div>
    </div>
    <div class="kpi green">
      <div class="kpi-num">${a.byResult.normal}</div>
      <div class="kpi-label">No signs detected</div>
    </div>
  </div>

  <!-- Result breakdown -->
  <h2>Result Breakdown</h2>
  <table>
    <tr><th>Result</th><th>Count</th><th>%</th></tr>
    <tr><td>Combined ADHD</td><td>${a.byResult.combined}</td><td>${a.pct(a.byResult.combined)}</td></tr>
    <tr><td>Predominantly Inattentive</td><td>${a.byResult.inattentive}</td><td>${a.pct(a.byResult.inattentive)}</td></tr>
    <tr><td>Predominantly Hyperactive</td><td>${a.byResult.hyperactive}</td><td>${a.pct(a.byResult.hyperactive)}</td></tr>
    <tr><td>No ADHD Signs</td><td>${a.byResult.normal}</td><td>${a.pct(a.byResult.normal)}</td></tr>
  </table>

  <!-- Cross-analysis -->
  <h2>🔍 Key Insight — Suspicion vs Actual Result</h2>
  <table>
    <tr><th>Parent's Suspicion</th><th>Actual Result</th><th>Count</th></tr>
    <tr class="hl"><td>Suspected YES</td><td>→ ADHD confirmed</td><td>${a.crossAnalysis.yes_adhd}</td></tr>
    <tr><td>Suspected YES</td><td>→ No ADHD signs</td><td>${a.crossAnalysis.yes_normal}</td></tr>
    <tr class="hl"><td>Suspected NO</td><td>→ ADHD found anyway</td><td>${a.crossAnalysis.no_adhd}</td></tr>
    <tr><td>Suspected NO</td><td>→ Normal (as expected)</td><td>${a.crossAnalysis.no_normal}</td></tr>
    <tr><td>Never thought about it</td><td>→ ADHD found</td><td>${a.crossAnalysis.not_thought_adhd}</td></tr>
    <tr><td>Never thought about it</td><td>→ Normal</td><td>${a.crossAnalysis.not_thought_normal}</td></tr>
  </table>

  <!-- Scores -->
  <h2>Average Symptom Scores</h2>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Avg Inattentive score (Group A)</td><td>${a.avgGroupA} / 9</td></tr>
    <tr><td>Avg Hyperactive score (Group B)</td><td>${a.avgGroupB} / 9</td></tr>
    <tr><td>Performance impairment rate</td><td>${a.impairmentRate}</td></tr>
  </table>

  <!-- Demographics -->
  <h2>Demographics</h2>
  <table>
    <tr><th>Category</th><th>Count</th><th>%</th></tr>
    <tr><td>English quiz</td><td>${a.byLanguage.en}</td><td>${a.pct(a.byLanguage.en)}</td></tr>
    <tr><td>Arabic quiz</td><td>${a.byLanguage.ar}</td><td>${a.pct(a.byLanguage.ar)}</td></tr>
    <tr><td>Boys</td><td>${a.byGender.boy}</td><td>${a.pct(a.byGender.boy)}</td></tr>
    <tr><td>Girls</td><td>${a.byGender.girl}</td><td>${a.pct(a.byGender.girl)}</td></tr>
  </table>

  <p style="font-size:13px;color:#4b5563;margin-top:20px;">
    📎 Full dataset attached as <strong>${filename}</strong>
    (Raw Data + Analytics Summary sheets)
  </p>

  <div class="footer">
    Listen to Their Minds · Automated report
  </div>
</div>
</body>
</html>`

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:        process.env.REPORT_FROM_EMAIL,
      to:          toList,           // array — supports 1 or 2 recipients
      subject:     `📊 Quiz Report — ${a.total} total submissions (${a.datePart})`,
      html,
      attachments: [{ filename, content: base64Excel }],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend API error: ${errorText}`)
  }

  console.log(`[weekly-report] ✅ Email sent to: ${toList.join(', ')}`)
}