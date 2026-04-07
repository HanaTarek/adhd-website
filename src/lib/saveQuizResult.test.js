// ================================================================
// src/lib/saveQuizResult.test.js
// ================================================================
import { describe, test, expect, vi, beforeEach } from 'vitest'

// ── Mock Supabase client before importing saveQuizResult ─────────
const { mockInsert, mockFrom } = vi.hoisted(() => {
  const mockInsert = vi.fn()
  const mockFrom = vi.fn(() => ({
    insert: mockInsert
  }))
  return { mockInsert, mockFrom }
})

vi.mock('./supabaseClient', () => {
  return {
    supabase: {
      from: mockFrom
    }
  }
})
import { saveQuizResult, saveQuizResultArabic } from './saveQuizResult'

// ── Shared test data ─────────────────────────────────────────────
const NORMAL_RESULT = {
  groupAPositives:          2,
  groupBPositives:          1,
  hasPerformanceImpairment: false,
  isCombined:               false,
  isInattentive:            false,
  isHyperactive:            false,
}

const INATTENTIVE_RESULT = {
  ...NORMAL_RESULT,
  groupAPositives: 7,
  isInattentive:   true,
}

const HYPERACTIVE_RESULT = {
  ...NORMAL_RESULT,
  groupBPositives: 7,
  isHyperactive:   true,
}

const COMBINED_RESULT = {
  groupAPositives:          7,
  groupBPositives:          7,
  hasPerformanceImpairment: true,
  isCombined:               true,
  isInattentive:            true,
  isHyperactive:            true,
}

const BASE_PARAMS = {
  language:    'en',
  parentName:  'Test Parent',
  childAge:    8,
  childGender: 'boy',
  suspectAdhd: 'yes',
}

// ── Reset mocks before each test ─────────────────────────────────
beforeEach(() => {
  mockInsert.mockResolvedValue({ error: null })
  vi.clearAllMocks()
})

// ================================================================
// saveQuizResult
// ================================================================
describe('saveQuizResult — result_type mapping', () => {

  test('maps isCombined=true to result_type "combined"', async () => {
    await saveQuizResult({ result: COMBINED_RESULT, ...BASE_PARAMS })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ result_type: 'combined' })
    )
  })

  test('maps isInattentive=true (not combined) to result_type "inattentive"', async () => {
    await saveQuizResult({ result: INATTENTIVE_RESULT, ...BASE_PARAMS })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ result_type: 'inattentive' })
    )
  })

  test('maps isHyperactive=true (not combined) to result_type "hyperactive"', async () => {
    await saveQuizResult({ result: HYPERACTIVE_RESULT, ...BASE_PARAMS })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ result_type: 'hyperactive' })
    )
  })

  test('maps no flags to result_type "normal"', async () => {
    await saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ result_type: 'normal' })
    )
  })
})

describe('saveQuizResult — inserts correct columns', () => {

  test('inserts group_a_score and group_b_score from result', async () => {
    await saveQuizResult({ result: COMBINED_RESULT, ...BASE_PARAMS })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        group_a_score: 7,
        group_b_score: 7,
      })
    )
  })

  test('inserts has_performance_impairment', async () => {
    await saveQuizResult({ result: COMBINED_RESULT, ...BASE_PARAMS })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ has_performance_impairment: true })
    )
  })

  test('inserts language', async () => {
    await saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS, language: 'en' })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ language: 'en' })
    )
  })

  test('inserts parent_name from parentName', async () => {
    await saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS, parentName: 'Sara' })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ parent_name: 'Sara' })
    )
  })

  test('inserts null for parent_name when parentName is empty string', async () => {
    await saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS, parentName: '' })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ parent_name: null })
    )
  })

  test('inserts null for parent_name when parentName is whitespace only', async () => {
    await saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS, parentName: '   ' })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ parent_name: null })
    )
  })

  test('inserts child_age', async () => {
    await saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS, childAge: 10 })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ child_age: 10 })
    )
  })

  test('inserts child_gender', async () => {
    await saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS, childGender: 'girl' })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ child_gender: 'girl' })
    )
  })

  test('inserts suspect_adhd', async () => {
    await saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS, suspectAdhd: 'not_thought' })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ suspect_adhd: 'not_thought' })
    )
  })

  test('queries the quiz_results table', async () => {
    await saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS })
    expect(mockFrom).toHaveBeenCalledWith('quiz_results')
  })
})

describe('saveQuizResult — error handling', () => {

  test('logs error message when Supabase returns an error', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'insert failed' } })
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    await saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS })
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[saveQuizResult]'),
      'insert failed'
    )
    consoleSpy.mockRestore()
  })

  test('does not throw when Supabase returns an error', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'insert failed' } })
    await expect(
      saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS })
    ).resolves.not.toThrow()
  })

  test('does not throw when a network error occurs', async () => {
    mockInsert.mockRejectedValueOnce(new Error('network error'))
    await expect(
      saveQuizResult({ result: NORMAL_RESULT, ...BASE_PARAMS })
    ).resolves.not.toThrow()
  })
})

// ================================================================
// saveQuizResultArabic — same logic, just verify it works too
// ================================================================
describe('saveQuizResultArabic', () => {

  test('inserts result_type "combined" for combined Arabic result', async () => {
    await saveQuizResultArabic({ result: COMBINED_RESULT, ...BASE_PARAMS, language: 'ar' })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ result_type: 'combined', language: 'ar' })
    )
  })

  test('inserts numeric childAge directly', async () => {
    await saveQuizResultArabic({ result: NORMAL_RESULT, ...BASE_PARAMS, language: 'ar', childAge: 12 })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ child_age: 12 })
    )
  })

  test('does not throw on Supabase error', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'fail' } })
    await expect(
      saveQuizResultArabic({ result: NORMAL_RESULT, ...BASE_PARAMS })
    ).resolves.not.toThrow()
  })
})