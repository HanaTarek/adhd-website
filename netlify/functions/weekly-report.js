// ================================================================
// netlify/functions/weekly-report.js
// ================================================================
// WHERE TO PUT THIS:
//   Create a folder: netlify/functions/
//   Put this file inside: netlify/functions/weekly-report.js
//
// WHAT THIS DOES (every Monday at 08:00 UTC automatically):
//   1. Connects to Supabase using the SECRET service key
//   2. Fetches all quiz results from the last 7 days
//   3. Calculates detailed analytics (see Step 9)
//   4. Generates an Excel file with all the raw data
//   5. Sends an email to you via Resend with:
//      - Analytics summary in the email body
//      - Excel file attached
//
// REQUIRED ENV VARIABLES (add in Netlify dashboard → Environment variables):
//   SUPABASE_URL            → your Supabase project URL
//   SUPABASE_SERVICE_KEY    → service role key (NOT the anon key)
//   RESEND_API_KEY          → your Resend API key
//   REPORT_TO_EMAIL         → email address to receive the report
//   REPORT_FROM_EMAIL       → onboarding@resend.dev (or your domain)
// ================================================================

// Node.js "require" style — Netlify functions use CommonJS
const { createClient } = require('@supabase/supabase-js')
const XLSX             = require('xlsx')

// ── 1. Create the Supabase client ─────────────────────────────
// We use the SERVICE KEY here (not anon key)
// Service key can READ all rows — anon key cannot
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ================================================================
// MAIN HANDLER — Netlify calls this automatically on schedule
// ================================================================
exports.handler = async () => {
  try {
    // Step A: Fetch all data from last 7 days
    const rows = await fetchWeeklyData()

    // Step B: Calculate analytics from the rows
    const analytics = calculateAnalytics(rows)

    // Step C: Generate an Excel file from the rows
    const excelBuffer = generateExcel(rows)

    // Step D: Send the email with Excel attached
    await sendWeeklyEmail(analytics, excelBuffer)

    // Return success to Netlify
    return { statusCode: 200, body: 'Weekly report sent successfully.' }

  } catch (err) {
    // If anything fails, log the error and tell Netlify
    console.error('[weekly-report] Error:', err)
    return { statusCode: 500, body: `Error: ${err.message}` }
  }
}

// ================================================================
// STEP A — Fetch data from Supabase
// ================================================================
async function fetchWeeklyData() {
  // Calculate the date 7 days ago
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Query the quiz_results table
  // .select('*') means "get all columns"
  // .gte means "greater than or equal to" (filter by date)
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .gte('taken_at', sevenDaysAgo.toISOString())
    .order('taken_at', { ascending: false })

  if (error) {
    throw new Error(`Supabase fetch failed: ${error.message}`)
  }

  // data is an array of rows — each row is one quiz submission
  return data || []
}

// ================================================================
// STEP B — Calculate all analytics
// ================================================================
function calculateAnalytics(rows) {
  const total = rows.length

  // Helper: percentage string — e.g. pct(14, 47) → "29.8%"
  const pct = (count) =>
    total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '—'

  // ── Count by result type ────────────────────────────────────
  const byResult = { combined: 0, inattentive: 0, hyperactive: 0, normal: 0 }

  // ── Count suspect_adhd answers ─────────────────────────────
  const bySuspect = { yes: 0, no: 0, not_thought: 0, null: 0 }

  // ── Cross-analysis: suspect × result ──────────────────────
  // "Parent suspected ADHD and child result was ADHD"
  // "Parent suspected ADHD but child result was normal"
  // "Parent did NOT suspect ADHD but child result was ADHD"
  // "Parent did NOT suspect ADHD and child result was normal"
  const crossAnalysis = {
    yes_adhd:     0,   // suspected yes → ADHD result
    yes_normal:   0,   // suspected yes → normal result
    no_adhd:      0,   // suspected no  → ADHD result
    no_normal:    0,   // suspected no  → normal result
    not_thought_adhd:   0,
    not_thought_normal: 0,
  }

  // ── By language ───────────────────────────────────────────
  const byLanguage = { en: 0, ar: 0 }

  // ── By gender ─────────────────────────────────────────────
  const byGender = { boy: 0, girl: 0, null: 0 }

  // ── Scores ────────────────────────────────────────────────
  let totalGroupA = 0
  let totalGroupB = 0
  let impairmentCount = 0

  // Age buckets
  const ageBuckets = { '4-6': 0, '7-9': 0, '10-12': 0, '13-15': 0, '16-18': 0 }

  // ── Loop through every row and tally ──────────────────────
  rows.forEach(row => {
    const resultType = row.result_type || 'normal'
    const suspect    = row.suspect_adhd || 'null'
    const isAdhd     = resultType !== 'normal'  // combined, inattentive, hyperactive = ADHD

    // Count result types
    if (byResult[resultType] !== undefined) byResult[resultType]++

    // Count suspect answers
    if (bySuspect[suspect] !== undefined) bySuspect[suspect]++
    else bySuspect.null++

    // Cross-analysis
    if (suspect === 'yes' && isAdhd)        crossAnalysis.yes_adhd++
    if (suspect === 'yes' && !isAdhd)       crossAnalysis.yes_normal++
    if (suspect === 'no'  && isAdhd)        crossAnalysis.no_adhd++
    if (suspect === 'no'  && !isAdhd)       crossAnalysis.no_normal++
    if (suspect === 'not_thought' && isAdhd)  crossAnalysis.not_thought_adhd++
    if (suspect === 'not_thought' && !isAdhd) crossAnalysis.not_thought_normal++

    // Language
    if (row.language === 'en') byLanguage.en++
    else if (row.language === 'ar') byLanguage.ar++

    // Gender
    if (row.child_gender === 'boy') byGender.boy++
    else if (row.child_gender === 'girl') byGender.girl++
    else byGender.null++

    // Scores
    totalGroupA += row.group_a_score || 0
    totalGroupB += row.group_b_score || 0
    if (row.has_performance_impairment) impairmentCount++

    // Age — parse number from string like "8 years old" or "٨ سنوات"
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

  // Total ADHD results (any subtype)
  const totalAdhd = byResult.combined + byResult.inattentive + byResult.hyperactive

  return {
    // Dates for the email subject
    weekStart: (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toDateString() })(),
    weekEnd:   new Date().toDateString(),

    total,
    totalAdhd,

    // Result breakdown
    byResult,

    // Suspect breakdown
    bySuspect,

    // Cross-analysis (THE MOST USEFUL INSIGHT)
    crossAnalysis,

    // Other demographics
    byLanguage,
    byGender,
    ageBuckets,

    // Score averages
    avgGroupA: total > 0 ? (totalGroupA / total).toFixed(1) : '—',
    avgGroupB: total > 0 ? (totalGroupB / total).toFixed(1) : '—',
    impairmentRate: pct(impairmentCount),

    // Percentage helper — expose it so we can use it in the email
    pct,
  }
}

// ================================================================
// STEP C — Generate Excel file from raw data
// ================================================================
function generateExcel(rows) {
  // Create a new workbook (Excel file)
  const workbook = XLSX.utils.book_new()

  // ── Sheet 1: Raw Data ──────────────────────────────────────
  // Convert each row to a flat object with readable column names
  const rawData = rows.map(row => ({
    'Submission ID':          row.id,
    'Date & Time':            row.taken_at ? new Date(row.taken_at).toLocaleString() : '',
    'Language':               row.language === 'ar' ? 'Arabic' : 'English',
    'Child Name':             row.parent_name || 'Anonymous',
    'Child Age':              row.child_age || '',
    'Child Gender':           row.child_gender || '',
    'Suspects ADHD?':         row.suspect_adhd === 'yes' ? 'Yes'
                            : row.suspect_adhd === 'no' ? 'No'
                            : row.suspect_adhd === 'not_thought' ? 'Not thought about it'
                            : '',
    'Result':                 row.result_type || '',
    'Inattentive Score':      row.group_a_score ?? '',
    'Hyperactive Score':      row.group_b_score ?? '',
    'Performance Impairment': row.has_performance_impairment ? 'Yes' : 'No',
  }))

  // Create the sheet from the data array
  const rawSheet = XLSX.utils.json_to_sheet(rawData)

  // Set column widths for readability
  rawSheet['!cols'] = [
    { wch: 15 }, // ID
    { wch: 22 }, // Date
    { wch: 12 }, // Language
    { wch: 18 }, // Name
    { wch: 12 }, // Age
    { wch: 12 }, // Gender
    { wch: 25 }, // Suspects
    { wch: 18 }, // Result
    { wch: 18 }, // Inattentive
    { wch: 18 }, // Hyperactive
    { wch: 22 }, // Impairment
  ]

  // Add the sheet to the workbook
  XLSX.utils.book_append_sheet(workbook, rawSheet, 'Quiz Results')

  // ── Sheet 2: Analytics Summary ─────────────────────────────
  const { total, byResult, bySuspect, crossAnalysis, byLanguage, byGender } = calculateAnalytics(rows)

  const summaryData = [
    { 'Metric': 'Total Submissions',             'Value': total },
    { 'Metric': '',                              'Value': '' },
    { 'Metric': '── Result Breakdown ──',        'Value': '' },
    { 'Metric': 'Combined ADHD',                 'Value': byResult.combined },
    { 'Metric': 'Predominantly Inattentive',     'Value': byResult.inattentive },
    { 'Metric': 'Predominantly Hyperactive',     'Value': byResult.hyperactive },
    { 'Metric': 'No ADHD Signs',                 'Value': byResult.normal },
    { 'Metric': '',                              'Value': '' },
    { 'Metric': '── Suspect ADHD Question ──',   'Value': '' },
    { 'Metric': 'Answered Yes',                  'Value': bySuspect.yes },
    { 'Metric': 'Answered No',                   'Value': bySuspect.no },
    { 'Metric': 'Not thought about it',          'Value': bySuspect.not_thought },
    { 'Metric': '',                              'Value': '' },
    { 'Metric': '── Cross Analysis ──',          'Value': '' },
    { 'Metric': 'Suspected YES → ADHD result',   'Value': crossAnalysis.yes_adhd },
    { 'Metric': 'Suspected YES → Normal result', 'Value': crossAnalysis.yes_normal },
    { 'Metric': 'Suspected NO → ADHD result',    'Value': crossAnalysis.no_adhd },
    { 'Metric': 'Suspected NO → Normal result',  'Value': crossAnalysis.no_normal },
    { 'Metric': '',                              'Value': '' },
    { 'Metric': '── Language ──',               'Value': '' },
    { 'Metric': 'English',                       'Value': byLanguage.en },
    { 'Metric': 'Arabic',                        'Value': byLanguage.ar },
    { 'Metric': '',                              'Value': '' },
    { 'Metric': '── Gender ──',                 'Value': '' },
    { 'Metric': 'Boys',                          'Value': byGender.boy },
    { 'Metric': 'Girls',                         'Value': byGender.girl },
  ]

  const summarySheet = XLSX.utils.json_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 35 }, { wch: 10 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Analytics Summary')

  // Convert the workbook to a binary buffer (we'll attach it to the email)
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  return buffer
}

// ================================================================
// STEP D — Build the HTML email and send via Resend
// ================================================================
async function sendWeeklyEmail(a, excelBuffer) {
  // Convert the Excel buffer to base64 (required for email attachments)
  const base64Excel = Buffer.from(excelBuffer).toString('base64')

  // Build the filename with the date e.g. "quiz-report-2026-01-06.xlsx"
  const dateStr = new Date().toISOString().split('T')[0]
  const filename = `quiz-report-${dateStr}.xlsx`

  // ── Build the HTML email body ──────────────────────────────
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background: #f5f7fa; margin: 0; padding: 20px; color: #1f2937; }
  .card { background: white; border-radius: 12px; padding: 28px; max-width: 620px; margin: 0 auto; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
  .header { background: linear-gradient(135deg, #0f8df5, #f41d88); border-radius: 10px; padding: 24px; color: white; margin-bottom: 24px; }
  .header h1 { margin: 0 0 4px; font-size: 20px; }
  .header p  { margin: 0; opacity: 0.85; font-size: 13px; }
  .kpi-row { display: flex; gap: 12px; margin-bottom: 24px; }
  .kpi { flex: 1; background: #f5f7fa; border-radius: 8px; padding: 14px; border-left: 3px solid #0f8df5; }
  .kpi.pink  { border-left-color: #f41d88; }
  .kpi.green { border-left-color: #10b981; }
  .kpi-num   { font-size: 26px; font-weight: 800; color: #0a2463; }
  .kpi-label { font-size: 12px; color: #6b7280; }
  h2 { font-size: 14px; font-weight: 700; color: #0a2463; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 6px; margin: 20px 0 10px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 6px 10px; background: #f5f7fa; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  td { padding: 8px 10px; border-top: 1px solid #e5e7eb; }
  .highlight { background: #eff6ff; font-weight: 600; }
  .footer { text-align: center; font-size: 11px; color: #9ca3af; margin-top: 20px; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <h1>📊 Weekly Quiz Report</h1>
    <p>Listen to Their Minds · ${a.weekStart} – ${a.weekEnd}</p>
  </div>

  <!-- KPIs -->
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

  <!-- Suspect vs Result cross-analysis -->
  <h2>🔍 Key Insight: Suspicion vs Actual Result</h2>
  <table>
    <tr><th>Parent's Suspicion</th><th>Actual Result</th><th>Count</th></tr>
    <tr class="highlight"><td>Suspected YES</td><td>→ ADHD confirmed</td><td>${a.crossAnalysis.yes_adhd}</td></tr>
    <tr><td>Suspected YES</td><td>→ No ADHD signs</td><td>${a.crossAnalysis.yes_normal}</td></tr>
    <tr class="highlight"><td>Suspected NO</td><td>→ ADHD found anyway</td><td>${a.crossAnalysis.no_adhd}</td></tr>
    <tr><td>Suspected NO</td><td>→ Normal (as expected)</td><td>${a.crossAnalysis.no_normal}</td></tr>
    <tr><td>Not thought about it</td><td>→ ADHD found</td><td>${a.crossAnalysis.not_thought_adhd}</td></tr>
    <tr><td>Not thought about it</td><td>→ Normal</td><td>${a.crossAnalysis.not_thought_normal}</td></tr>
  </table>

  <!-- Symptom scores -->
  <h2>Average Symptom Scores</h2>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Avg Inattentive score (Group A)</td><td>${a.avgGroupA} / 9</td></tr>
    <tr><td>Avg Hyperactive score (Group B)</td><td>${a.avgGroupB} / 9</td></tr>
    <tr><td>Performance impairment rate</td><td>${a.impairmentRate}</td></tr>
  </table>

  <!-- Language + Gender -->
  <h2>Demographics</h2>
  <table>
    <tr><th>Category</th><th>Count</th><th>%</th></tr>
    <tr><td>English quiz</td><td>${a.byLanguage.en}</td><td>${a.pct(a.byLanguage.en)}</td></tr>
    <tr><td>Arabic quiz</td><td>${a.byLanguage.ar}</td><td>${a.pct(a.byLanguage.ar)}</td></tr>
    <tr><td>Boys</td><td>${a.byGender.boy}</td><td>${a.pct(a.byGender.boy)}</td></tr>
    <tr><td>Girls</td><td>${a.byGender.girl}</td><td>${a.pct(a.byGender.girl)}</td></tr>
  </table>

  <p style="font-size:13px;color:#4b5563;margin-top:20px;">
    📎 The full dataset is attached as an Excel file (<strong>${filename}</strong>)
    with raw data and summary sheets.
  </p>

  <div class="footer">
    Sent automatically every Monday · Listen to Their Minds
  </div>
</div>
</body>
</html>`

  // ── Send via Resend API ─────────────────────────────────────
  // Resend accepts attachments as base64-encoded strings
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    process.env.REPORT_FROM_EMAIL,  // onboarding@resend.dev
      to:      [process.env.REPORT_TO_EMAIL],  // your email
      subject: `📊 Weekly Quiz Report — ${a.total} submissions (${a.weekStart})`,
      html:    html,
      attachments: [
        {
          filename: filename,       // e.g. "quiz-report-2026-01-06.xlsx"
          content:  base64Excel,    // base64 string of the Excel file
        }
      ],
    }),
  })

  // Check if the email was sent successfully
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Resend API error: ${errorText}`)
  }

  console.log('[weekly-report] ✅ Email sent successfully')
}
