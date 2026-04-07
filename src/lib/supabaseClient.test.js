// ================================================================
// src/lib/supabaseClient.test.js
// ================================================================
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

// ── Mock @supabase/supabase-js before importing supabaseClient ───
const mockCreateClient = vi.fn(() => ({ _isMock: true }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}))

// ================================================================
// ENV VARIABLE SCENARIOS
// ================================================================
describe('supabaseClient — with valid env vars', () => {
  beforeEach(() => {
    // Provide valid env values via import.meta.env
    vi.stubEnv('VITE_SUPABASE_URL',      'https://test.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key-123')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()   // force a fresh import each test
    mockCreateClient.mockClear()
  })

  test('calls createClient with the URL from env', async () => {
    await import('./supabaseClient')
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      expect.any(String)
    )
  })

  test('calls createClient with the anon key from env', async () => {
    await import('./supabaseClient')
    expect(mockCreateClient).toHaveBeenCalledWith(
      expect.any(String),
      'test-anon-key-123'
    )
  })

  test('exports the supabase client created by createClient', async () => {
    const { supabase } = await import('./supabaseClient')
    expect(supabase).toEqual({ _isMock: true })
  })

  test('createClient is called exactly once on import', async () => {
    await import('./supabaseClient')
    expect(mockCreateClient).toHaveBeenCalledTimes(1)
  })
})

describe('supabaseClient — with missing env vars', () => {
  beforeEach(() => {
    // Omit the env vars entirely
    vi.stubEnv('VITE_SUPABASE_URL',      '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
    mockCreateClient.mockClear()
  })

  test('logs a warning when env vars are missing', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await import('./supabaseClient')
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing environment variables')
    )
    warnSpy.mockRestore()
  })

  test('still calls createClient even when env vars are missing (does not crash)', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    await expect(import('./supabaseClient')).resolves.not.toThrow()
    vi.restoreAllMocks()
  })

  test('exports a supabase object (even if misconfigured)', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { supabase } = await import('./supabaseClient')
    expect(supabase).toBeDefined()
    vi.restoreAllMocks()
  })
})