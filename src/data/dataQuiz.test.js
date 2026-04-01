/* ================================================================
   dataQuiz.test.js
   Unit tests for the NICHQ Vanderbilt scoring logic in dataQuiz.js.
   These tests cover scoreQuiz() directly — no React, no rendering.

   Run with: npx vitest  OR  npx jest
   ================================================================ */

import { describe, it, expect } from 'vitest'
import { scoreQuiz, QUESTIONS, SYMPTOM_OPTIONS, PERFORMANCE_OPTIONS } from './dataQuiz.js'

/* ── Helper: build an answers object ────────────────────────────
   Sets every question in the given id list to the given score.
   All other questions default to 0.
─────────────────────────────────────────────────────────────── */
function buildAnswers(overrides = {}) {
  const base = {}
  QUESTIONS.forEach(q => { base[q.id] = 0 })
  return { ...base, ...overrides }
}

/* ── Helper: set a whole group to a score ────────────────────── */
function setGroup(group, score) {
  const overrides = {}
  QUESTIONS.filter(q => q.group === group).forEach(q => {
    overrides[q.id] = score
  })
  return overrides
}

/* ── Helper: set N questions in a group to a score ─────────── */
function setNInGroup(group, n, score) {
  const overrides = {}
  QUESTIONS.filter(q => q.group === group).slice(0, n).forEach(q => {
    overrides[q.id] = score
  })
  return overrides
}

/* ── Helper: set at least one Group F question to score 4+ ──── */
function withPerformanceImpairment() {
  return { 48: 4 }
}

/* ================================================================
   EXPORTED CONSTANTS
   ================================================================ */
describe('dataQuiz — constants', () => {
  it('QUESTIONS contains exactly 26 questions', () => {
    expect(QUESTIONS).toHaveLength(26)
  })

  it('Group A contains exactly 9 questions (Q1–9)', () => {
    expect(QUESTIONS.filter(q => q.group === 'A')).toHaveLength(9)
  })

  it('Group B contains exactly 9 questions (Q10–18)', () => {
    expect(QUESTIONS.filter(q => q.group === 'B')).toHaveLength(9)
  })

  it('Group F contains exactly 8 questions (Q48–55)', () => {
    expect(QUESTIONS.filter(q => q.group === 'F')).toHaveLength(8)
  })

  it('all Group A questions have type "symptom"', () => {
    QUESTIONS.filter(q => q.group === 'A').forEach(q => {
      expect(q.type).toBe('symptom')
    })
  })

  it('all Group F questions have type "performance"', () => {
    QUESTIONS.filter(q => q.group === 'F').forEach(q => {
      expect(q.type).toBe('performance')
    })
  })

  it('SYMPTOM_OPTIONS has 4 options (0–3)', () => {
    expect(SYMPTOM_OPTIONS).toHaveLength(4)
    expect(SYMPTOM_OPTIONS.map(o => o.value)).toEqual([0, 1, 2, 3])
  })

  it('PERFORMANCE_OPTIONS has 5 options (1–5)', () => {
    expect(PERFORMANCE_OPTIONS).toHaveLength(5)
    expect(PERFORMANCE_OPTIONS.map(o => o.value)).toEqual([1, 2, 3, 4, 5])
  })

  it('every question has id, text, type, and group', () => {
    QUESTIONS.forEach(q => {
      expect(q).toHaveProperty('id')
      expect(q).toHaveProperty('text')
      expect(q).toHaveProperty('type')
      expect(q).toHaveProperty('group')
    })
  })


})

/* ================================================================
   SCORING — NORMAL / NO ADHD
   ================================================================ */
describe('scoreQuiz — no ADHD indicators', () => {
  it('returns all false flags when all answers are 0', () => {
    const result = scoreQuiz(buildAnswers())
    expect(result.isInattentive).toBe(false)
    expect(result.isHyperactive).toBe(false)
    expect(result.isCombined).toBe(false)
    expect(result.hasPerformanceImpairment).toBe(false)
  })

  it('groupAPositives is 0 when all Group A answers are 0', () => {
    expect(scoreQuiz(buildAnswers()).groupAPositives).toBe(0)
  })

  it('groupBPositives is 0 when all Group B answers are 0', () => {
    expect(scoreQuiz(buildAnswers()).groupBPositives).toBe(0)
  })

  it('is not inattentive when only 5 Group A questions score 2', () => {
    const answers = buildAnswers({
      ...setNInGroup('A', 5, 2),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).isInattentive).toBe(false)
  })

  it('is not hyperactive when only 5 Group B questions score 2', () => {
    const answers = buildAnswers({
      ...setNInGroup('B', 5, 2),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).isHyperactive).toBe(false)
  })

  it('is not inattentive when Group A has 6 positives but NO performance impairment', () => {
    const answers = buildAnswers(setNInGroup('A', 6, 2))
    // No Group F score of 4 or 5 → performance impairment is false
    expect(scoreQuiz(answers).isInattentive).toBe(false)
  })
})

/* ================================================================
   SCORING — INATTENTIVE SUBTYPE
   ================================================================ */
describe('scoreQuiz — Predominantly Inattentive', () => {
  it('is inattentive when ≥6 Group A positives AND performance impairment', () => {
    const answers = buildAnswers({
      ...setNInGroup('A', 6, 2),
      ...withPerformanceImpairment(),
    })
    const result = scoreQuiz(answers)
    expect(result.isInattentive).toBe(true)
    expect(result.isHyperactive).toBe(false)
    expect(result.isCombined).toBe(false)
  })

  it('is inattentive when all 9 Group A positives score 3', () => {
    const answers = buildAnswers({
      ...setGroup('A', 3),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).isInattentive).toBe(true)
  })

  it('groupAPositives counts correctly (6 positives)', () => {
    const answers = buildAnswers({
      ...setNInGroup('A', 6, 2),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).groupAPositives).toBe(6)
  })

  it('groupAPositives counts correctly (9 positives)', () => {
    const answers = buildAnswers({
      ...setGroup('A', 3),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).groupAPositives).toBe(9)
  })

  it('score of 1 (Occasionally) is NOT a positive symptom', () => {
    // All 9 Group A at score 1 → 0 positives → not inattentive
    const answers = buildAnswers({
      ...setGroup('A', 1),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).isInattentive).toBe(false)
    expect(scoreQuiz(answers).groupAPositives).toBe(0)
  })
})

/* ================================================================
   SCORING — HYPERACTIVE / IMPULSIVE SUBTYPE
   ================================================================ */
describe('scoreQuiz — Predominantly Hyperactive/Impulsive', () => {
  it('is hyperactive when ≥6 Group B positives AND performance impairment', () => {
    const answers = buildAnswers({
      ...setNInGroup('B', 6, 2),
      ...withPerformanceImpairment(),
    })
    const result = scoreQuiz(answers)
    expect(result.isHyperactive).toBe(true)
    expect(result.isInattentive).toBe(false)
    expect(result.isCombined).toBe(false)
  })

  it('is hyperactive when all 9 Group B questions score 2', () => {
    const answers = buildAnswers({
      ...setGroup('B', 2),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).isHyperactive).toBe(true)
  })

  it('groupBPositives counts correctly (6 positives)', () => {
    const answers = buildAnswers({
      ...setNInGroup('B', 6, 2),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).groupBPositives).toBe(6)
  })

  it('is not hyperactive when Group B has 6 positives but no performance impairment', () => {
    const answers = buildAnswers(setNInGroup('B', 6, 2))
    expect(scoreQuiz(answers).isHyperactive).toBe(false)
  })
})

/* ================================================================
   SCORING — COMBINED SUBTYPE
   ================================================================ */
describe('scoreQuiz — Combined ADHD', () => {
  it('is combined when both Group A and Group B have ≥6 positives with impairment', () => {
    const answers = buildAnswers({
      ...setNInGroup('A', 6, 2),
      ...setNInGroup('B', 6, 2),
      ...withPerformanceImpairment(),
    })
    const result = scoreQuiz(answers)
    expect(result.isCombined).toBe(true)
    expect(result.isInattentive).toBe(true)
    expect(result.isHyperactive).toBe(true)
  })

  it('is combined when all Group A and B score 3', () => {
    const answers = buildAnswers({
      ...setGroup('A', 3),
      ...setGroup('B', 3),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).isCombined).toBe(true)
  })

  it('is NOT combined when only Group A meets threshold', () => {
    const answers = buildAnswers({
      ...setNInGroup('A', 6, 2),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).isCombined).toBe(false)
  })

  it('is NOT combined when only Group B meets threshold', () => {
    const answers = buildAnswers({
      ...setNInGroup('B', 6, 2),
      ...withPerformanceImpairment(),
    })
    expect(scoreQuiz(answers).isCombined).toBe(false)
  })
})

/* ================================================================
   SCORING — PERFORMANCE IMPAIRMENT
   ================================================================ */
describe('scoreQuiz — performance impairment', () => {
  it('hasPerformanceImpairment is false when all Group F answers are 3 or below', () => {
    const answers = buildAnswers(setGroup('F', 3))
    expect(scoreQuiz(answers).hasPerformanceImpairment).toBe(false)
  })

  it('hasPerformanceImpairment is true when any Group F answer is 4', () => {
    const answers = buildAnswers({ 48: 4 })
    expect(scoreQuiz(answers).hasPerformanceImpairment).toBe(true)
  })

  it('hasPerformanceImpairment is true when any Group F answer is 5', () => {
    const answers = buildAnswers({ 55: 5 })
    expect(scoreQuiz(answers).hasPerformanceImpairment).toBe(true)
  })

  it('hasPerformanceImpairment is true when multiple Group F answers are 4 or 5', () => {
    const answers = buildAnswers({ 48: 4, 49: 5, 51: 4 })
    expect(scoreQuiz(answers).hasPerformanceImpairment).toBe(true)
  })

  it('score of 3 (Average) in Group F is NOT a performance impairment', () => {
    const answers = buildAnswers({ ...setGroup('F', 3) })
    expect(scoreQuiz(answers).hasPerformanceImpairment).toBe(false)
  })
})

/* ================================================================
   SCORING — RETURN SHAPE
   ================================================================ */
describe('scoreQuiz — return object shape', () => {
  it('returns all required fields', () => {
    const result = scoreQuiz(buildAnswers())
    expect(result).toHaveProperty('groupAPositives')
    expect(result).toHaveProperty('groupBPositives')
    expect(result).toHaveProperty('hasPerformanceImpairment')
    expect(result).toHaveProperty('isInattentive')
    expect(result).toHaveProperty('isHyperactive')
    expect(result).toHaveProperty('isCombined')
  })

  it('groupAPositives is a number', () => {
    expect(typeof scoreQuiz(buildAnswers()).groupAPositives).toBe('number')
  })

  it('all boolean fields are booleans', () => {
    const result = scoreQuiz(buildAnswers())
    expect(typeof result.isInattentive).toBe('boolean')
    expect(typeof result.isHyperactive).toBe('boolean')
    expect(typeof result.isCombined).toBe('boolean')
    expect(typeof result.hasPerformanceImpairment).toBe('boolean')
  })

  it('handles empty answers object gracefully (defaults to 0)', () => {
    expect(() => scoreQuiz({})).not.toThrow()
    const result = scoreQuiz({})
    expect(result.groupAPositives).toBe(0)
    expect(result.isCombined).toBe(false)
  })
})
