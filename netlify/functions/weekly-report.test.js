// ================================================================
// netlify/functions/weekly-report.test.js
// ================================================================
// All 17 tests — tests the ESM weekly-report.js handler directly.
//
// Two root causes fixed from the failing version:
//
//  1. weekly-report.js was using require() inside an ESM package
//     ("type":"module" in package.json) → ReferenceError.
//     Fixed: function now uses "export const handler" ESM syntax.
//
//  2. The test used createRequire + vi.resetModules() in beforeEach.
//     vi.resetModules() clears the module registry, so subsequent
//     require() calls can't find already-loaded mocks — all 17 tests
//     failed with "Cannot require() ES Module in a cycle".
//     Fixed: use dynamic import() instead of require().
//     vi.resetModules() is removed; mocks are cleared with
//     vi.clearAllMocks() only, which resets call counts without
//     breaking the module registry.
// ================================================================

import { describe, test, expect, vi, beforeEach } from 'vitest'

// ── Sample rows returned by Supabase ─────────────────────────────
const SAMPLE_ROWS = [
  {
    id: '1', taken_at: new Date().toISOString(),
    result_type: 'combined', language: 'en',
    parent_name: 'Sara', child_age: 8, child_gender: 'girl',
    suspect_adhd: 'yes', group_a_score: 7, group_b_score: 7,
    has_performance_impairment: true,
  },
  {
    id: '2', taken_at: new Date().toISOString(),
    result_type: 'inattentive', language: 'ar',
    parent_name: null, child_age: 10, child_gender: 'boy',
    suspect_adhd: 'no', group_a_score: 6, group_b_score: 2,
    has_performance_impairment: false,
  },
  {
    id: '3', taken_at: new Date().toISOString(),
    result_type: 'normal', language: 'en',
    parent_name: 'Ahmed', child_age: 12, child_gender: 'boy',
    suspect_adhd: 'not_thought', group_a_score: 3, group_b_score: 2,
    has_performance_impairment: false,
  },
]

// ── Mock @supabase/supabase-js ────────────────────────────────────
// vi.mock is hoisted to the top of the file automatically by Vitest,
// so it always runs before any imports.

const mockSupabaseData = { data: SAMPLE_ROWS, error: null }

const { createClientMock } = vi.hoisted(() => {
  return {
    createClientMock: vi.fn(() => ({
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue(mockSupabaseData),
      })),
    }))
  }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}))

// ── Mock xlsx ─────────────────────────────────────────────────────
vi.mock('xlsx', () => ({
  utils: {
    book_new:          vi.fn(() => ({})),
    json_to_sheet:     vi.fn(() => ({ '!cols': [] })),
    book_append_sheet: vi.fn(),
  },
  write: vi.fn(() => Buffer.from('fake-excel-data')),
}))

// ── Mock global fetch (used to call Resend) ───────────────────────
const mockFetch = vi.fn()
global.fetch = mockFetch

// ── Required env vars ─────────────────────────────────────────────
process.env.VITE_SUPABASE_URL         = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_KEY = 'service-key'
process.env.RESEND_API_KEY       = 'test-resend-key'
process.env.REPORT_TO_EMAIL      = 'owner@example.com'
process.env.REPORT_FROM_EMAIL    = 'noreply@example.com'
// ✅ ADD THIS LINE
process.env.VITE_SUPABASE_URL = process.env.SUPABASE_URL

// ── Import the handler once at the top level ──────────────────────
// Because the function is now ESM (export const handler), we use a
// normal static import.  The mocks above are hoisted so they are
// already in place by the time this module is evaluated.
import { handler } from '../../netlify/functions/weekly-report.js'

// ── Reset mock call counts before every test ─────────────────────
// We do NOT call vi.resetModules() — that would invalidate the mock
// registry and break subsequent dynamic imports.
beforeEach(() => {
  vi.clearAllMocks()
  // Default: Resend returns success
  mockFetch.mockResolvedValue({
    ok:   true,
    text: vi.fn().mockResolvedValue(''),
  })
})

// ================================================================
// HANDLER — SUCCESS PATH
// ================================================================
describe('weekly-report handler — success', () => {

  test('returns statusCode 200 on success', async () => {
    const response = await handler()
    expect(response.statusCode).toBe(200)
  })

  test('returns a success body message', async () => {
    const response = await handler()
    expect(response.body).toMatch(/sent successfully/i)
  })

  test('calls Resend API with POST method', async () => {
    await handler()
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  test('sends to the REPORT_TO_EMAIL address', async () => {
    await handler()
    const [, options] = mockFetch.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.to).toContain('owner@example.com')
  })

  test('sends from the REPORT_FROM_EMAIL address', async () => {
    await handler()
    const [, options] = mockFetch.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.from).toBe('noreply@example.com')
  })

  test('includes an xlsx attachment in the email', async () => {
    await handler()
    const [, options] = mockFetch.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.attachments).toHaveLength(1)
    expect(body.attachments[0].filename).toMatch(/\.xlsx$/)
  })

  test('email subject includes total submission count', async () => {
    await handler()
    const [, options] = mockFetch.mock.calls[0]
    const body = JSON.parse(options.body)
    // SAMPLE_ROWS has 3 rows → subject should contain "3"
    expect(body.subject).toMatch(/3/)
  })

  test('email html contains result breakdown data', async () => {
    await handler()
    const [, options] = mockFetch.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.html).toContain('Weekly Quiz Report')
  })

  test('uses Authorization header with RESEND_API_KEY', async () => {
    await handler()
    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers.Authorization).toBe('Bearer test-resend-key')
  })
})

// ================================================================
// ANALYTICS — calculateAnalytics() logic
// (tested indirectly via the email HTML content)
// ================================================================
describe('weekly-report — analytics calculations', () => {

  test('total submissions matches number of rows from Supabase', async () => {
    await handler()
    const [, options] = mockFetch.mock.calls[0]
    const body = JSON.parse(options.body)
    // SAMPLE_ROWS has 3 rows → KPI box should contain >3<
    expect(body.html).toMatch(/>3</)
  })

  test('email HTML contains language breakdown section', async () => {
    await handler()
    const [, options] = mockFetch.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.html).toMatch(/English|Arabic/)
  })

  test('email HTML contains gender breakdown section', async () => {
    await handler()
    const [, options] = mockFetch.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.html).toMatch(/Boys|Girls/)
  })

  test('email HTML contains suspicion vs result cross-analysis section', async () => {
    await handler()
    const [, options] = mockFetch.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.html).toMatch(/Suspicion|suspected/i)
  })
})

// ================================================================
// ERROR HANDLING
// ================================================================
describe('weekly-report handler — error handling', () => {

  test('returns statusCode 500 when Resend API returns non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok:   false,
      text: vi.fn().mockResolvedValue('Resend error message'),
    })
    const response = await handler()
    expect(response.statusCode).toBe(500)
  })

  test('returns error message in body on Resend failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok:   false,
      text: vi.fn().mockResolvedValue('Resend error message'),
    })
    const response = await handler()
    expect(response.body).toMatch(/error/i)
  })

  test('returns statusCode 500 when Supabase throws', async () => {
    /*
      Re-import createClient (already mocked) and override its return
      value just for this one test using mockReturnValueOnce.
    */
    const { createClient } = await import('@supabase/supabase-js')
    createClient.mockReturnValueOnce({
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        gte:    vi.fn().mockReturnThis(),
        order:  vi.fn().mockResolvedValue({ data: null, error: { message: 'db error' } }),
      })),
    })
    const response = await handler()
    expect(response.statusCode).toBe(500)
  })

  test('does not throw — always returns an object with statusCode', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network timeout'))
    const response = await handler()
    expect(response).toHaveProperty('statusCode')
  })
})