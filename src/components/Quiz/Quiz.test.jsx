// ================================================================
// Quiz.test.jsx — FIXED VERSION
// ================================================================
// FIXES APPLIED:
//
// 1. HOISTING ERROR — vi.hoisted() wraps all mock data so it's
//    available when vi.mock() factory runs (vi.mock is hoisted
//    to top of file by Vitest, before const declarations).
//
// 2. fillIntakeAndStart() — updated to match actual Quiz.jsx UI:
//    - Age: quiz renders number buttons ("8 years"), not a combobox
//    - Gender: quiz renders plain buttons ("Boy"), not radio inputs
//    - Suspect: quiz renders plain buttons ("Yes"), not radio inputs
//    - Start: quiz button text is "Start the quiz →", not just "start"
//
// 3. saveQuizResult expectation — quiz sends language: 'eng', fixed test.
//
// 4. Back button on Q1 — quiz goes back to intake (not disabled).
//    Test updated to match this real behaviour.
//
// 5. Anonymous button text — quiz says "👤 Stay anonymous", matched.
// ================================================================

import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'

// ── Step 1: Define mock data with vi.hoisted() ──────────────────
// vi.hoisted() runs BEFORE vi.mock() factories, so the variables
// are available when the mock modules are set up.
const {
  MOCK_QUESTIONS,
  MOCK_SYMPTOM_OPTIONS,
  MOCK_PERFORMANCE_OPTIONS,
  MOCK_SCORE_RESULT,
} = vi.hoisted(() => {
  const MOCK_QUESTIONS = [
    { id: 'q1', group: 'A', type: 'symptom',     text: 'Question one text'   },
    { id: 'q2', group: 'B', type: 'symptom',     text: 'Question two text'   },
    { id: 'q3', group: 'F', type: 'performance', text: 'Question three text' },
  ]

  const MOCK_SYMPTOM_OPTIONS = [
    { value: 0, label: 'Never'       },
    { value: 1, label: 'Occasionally' },
    { value: 2, label: 'Often'       },
    { value: 3, label: 'Very Often'  },
  ]

  const MOCK_PERFORMANCE_OPTIONS = [
    { value: 1, label: 'Excellent'            },
    { value: 2, label: 'Above Average'        },
    { value: 3, label: 'Average'              },
    { value: 4, label: 'Somewhat of a Problem' },
    { value: 5, label: 'Problematic'          },
  ]

  const MOCK_SCORE_RESULT = {
    groupAPositives:          3,
    groupBPositives:          2,
    hasPerformanceImpairment: false,
    isCombined:               false,
    isInattentive:            true,
    isHyperactive:            false,
  }

  return {
    MOCK_QUESTIONS,
    MOCK_SYMPTOM_OPTIONS,
    MOCK_PERFORMANCE_OPTIONS,
    MOCK_SCORE_RESULT,
  }
})

// ── Step 2: Mock modules AFTER vi.hoisted() ─────────────────────

// Mock CSS — Vitest can't parse CSS files
vi.mock('./Quiz.css', () => ({}))

// Mock saveQuizResult — no real Supabase calls in tests
vi.mock('../../lib/saveQuizResult', () => ({
  saveQuizResult: vi.fn(),
}))

// Mock the quiz data module — use the hoisted mock data
vi.mock('../../data/dataQuiz.js', () => ({
  scoreQuiz:           vi.fn(() => MOCK_SCORE_RESULT),
  QUESTIONS:           MOCK_QUESTIONS,
  SYMPTOM_OPTIONS:     MOCK_SYMPTOM_OPTIONS,
  PERFORMANCE_OPTIONS: MOCK_PERFORMANCE_OPTIONS,
}))

// ── Step 3: Import Quiz AFTER mocks are set up ──────────────────
import Quiz from './Quiz'

// ── Helper: render inside MemoryRouter ─────────────────────────
const renderQuiz = (locationState = {}) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/quiz', state: locationState }]}>
      <Quiz />
    </MemoryRouter>
  )

// ── Helper: complete the intake form and start the quiz ─────────
// Matches the ACTUAL Quiz.jsx UI:
//   - Age:     number buttons rendered as "8 years"
//   - Gender:  plain button with text "Boy"
//   - Suspect: plain button with text "Yes"
//   - Start:   button text is "Start the quiz →"
const fillIntakeAndStart = () => {
  // Click the age button for "8" (renders as "8 years")
  fireEvent.click(screen.getByRole('button', { name: /^8 years$/i }))

  // Click the gender button "Boy" (plain button, not a radio)
  fireEvent.click(screen.getByRole('button', { name: /^🧢\s*boy$/i }))

  // Click the suspect answer "Yes" (plain button)
  fireEvent.click(screen.getByRole('button', { name: /^yes$/i }))

  // Click the Start button — text is "Start the quiz →"
  fireEvent.click(screen.getByRole('button', { name: /start the quiz/i }))
}


// ================================================================
// INTAKE SCREEN TESTS
// ================================================================
describe('Quiz — Intake screen', () => {

  test('renders the intake screen by default', () => {
    renderQuiz()
    expect(screen.getByText(/before we begin/i)).toBeInTheDocument()
    expect(screen.getByText(/does my child show signs of adhd/i)).toBeInTheDocument()
  })

  test('renders the screening-tool disclaimer on intake', () => {
    renderQuiz()
    expect(screen.getByText(/screening tool — not a diagnosis/i)).toBeInTheDocument()
  })

  test('Start button is disabled until all required fields are filled', () => {
    renderQuiz()
    // Nothing filled — button should be disabled
    const startBtn = screen.getByRole('button', { name: /please fill in the required fields/i })
    expect(startBtn).toBeDisabled()
  })

  test('Start button enables once age, gender and suspect fields are filled', () => {
    renderQuiz()
    fireEvent.click(screen.getByRole('button', { name: /^8 years$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^🧢\s*boy$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^yes$/i }))
    // Now the button text changes to "Start the quiz →" and is enabled
    expect(screen.getByRole('button', { name: /start the quiz/i })).toBeEnabled()
  })

  test('Name field is disabled when "Stay anonymous" is toggled on', () => {
    renderQuiz()
    // Button text in Quiz.jsx: "👤 Stay anonymous"
    fireEvent.click(screen.getByRole('button', { name: /stay anonymous/i }))
    expect(screen.getByPlaceholderText(/e\.g\./i)).toBeDisabled()
  })

  test('Name field is enabled again after toggling anonymous off', () => {
    renderQuiz()
    // Click once to enable anonymous, click again to disable
    const anonBtn = screen.getByRole('button', { name: /stay anonymous/i })
    fireEvent.click(anonBtn)
    // Button text changes to "🙈 Anonymous" when active
    fireEvent.click(screen.getByRole('button', { name: /anonymous/i }))
    expect(screen.getByPlaceholderText(/e\.g\./i)).not.toBeDisabled()
  })

  test('Link to Arabic quiz is present on intake', () => {
    renderQuiz()
    expect(screen.getByRole('link', { name: /العربيه/i })).toBeInTheDocument()
  })

  test('all 15 age buttons render', () => {
    renderQuiz()
    // Ages 4–18 are rendered as buttons
    ;[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].forEach(age => {
      expect(screen.getByRole('button', { name: new RegExp(`^${age} years$`, 'i') })).toBeInTheDocument()
    })
  })

  test('suspect question renders all 3 answer options', () => {
    renderQuiz()
    expect(screen.getByRole('button', { name: /^yes$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^no$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /never gave it enough thought/i })).toBeInTheDocument()
  })
})


// ================================================================
// QUESTION SCREEN NAVIGATION TESTS
// ================================================================
describe('Quiz — Question screen navigation', () => {

  beforeEach(() => {
    renderQuiz()
    fillIntakeAndStart()
  })

  test('transitions to quiz screen after valid intake submission', () => {
    expect(screen.getByText(/question 1 of/i)).toBeInTheDocument()
  })

  test('shows the first question text', () => {
    expect(screen.getByText('Question one text')).toBeInTheDocument()
  })

  test('Next button is disabled before an answer is selected', () => {
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  test('Next button enables after selecting an answer', () => {
    fireEvent.click(screen.getByText('Never'))
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  })

  test('selected option gets the "selected" CSS class', () => {
    const neverBtn = screen.getByText('Never').closest('button')
    fireEvent.click(neverBtn)
    expect(neverBtn).toHaveClass('selected')
  })

  test('previously selected option loses "selected" class when another is picked', () => {
    const neverBtn = screen.getByText('Never').closest('button')
    const oftenBtn = screen.getByText('Often').closest('button')
    fireEvent.click(neverBtn)
    fireEvent.click(oftenBtn)
    expect(neverBtn).not.toHaveClass('selected')
    expect(oftenBtn).toHaveClass('selected')
  })

  test('clicking Next advances to the next question', () => {
    fireEvent.click(screen.getByText('Never'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText(/question 2 of/i)).toBeInTheDocument()
  })

  test('clicking Back from Q1 returns to the intake screen', () => {
    // In Quiz.jsx, handleBack() calls setStage('intake') when isFirstQuestion
    // So Back on Q1 goes back to intake, not disabled
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }))
    expect(screen.getByText(/before we begin/i)).toBeInTheDocument()
  })

  test('clicking Back from question 2 returns to question 1', () => {
    fireEvent.click(screen.getByText('Never'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }))
    expect(screen.getByText(/question 1 of/i)).toBeInTheDocument()
  })

  test('progress bar width starts at 0%', () => {
    const fill = document.querySelector('.quiz-progress-fill')
    expect(fill).toHaveStyle({ width: '0%' })
  })

  test('progress bar width increases after advancing a question', () => {
    fireEvent.click(screen.getByText('Never'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    const fill = document.querySelector('.quiz-progress-fill')
    // After 1 of 3: Math.round(1/3 * 100) = 33%
    expect(fill).toHaveStyle({ width: '33%' })
  })

  test('shows section badge matching the current question group', () => {
    // Q1 is group A → 'Inattentive Symptoms'
    expect(screen.getByText('Inattentive Symptoms')).toBeInTheDocument()
  })
})


// ================================================================
// PERFORMANCE OPTIONS TEST
// ================================================================
describe('Quiz — Performance question options', () => {

  test('renders PERFORMANCE_OPTIONS for questions with type=performance', () => {
    renderQuiz()
    fillIntakeAndStart()
    // Answer Q1 (symptom)
    fireEvent.click(screen.getByText('Never'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    // Answer Q2 (symptom)
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    // Q3 is performance type
    expect(screen.getByText('Excellent')).toBeInTheDocument()
    expect(screen.getByText('Problematic')).toBeInTheDocument()
  })
})


// ================================================================
// LAST QUESTION & SUBMIT TESTS
// ================================================================
describe('Quiz — Last question & submit', () => {

  const advanceToLastQuestion = () => {
    renderQuiz()
    fillIntakeAndStart()
    fireEvent.click(screen.getByText('Never'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    // Now on Q3 (last, performance type)
  }

  test('last question shows "Submit" instead of "NEXT"', () => {
    advanceToLastQuestion()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^next$/i })).not.toBeInTheDocument()
  })

  test('submitting navigates to results screen', () => {
    advanceToLastQuestion()
    fireEvent.click(screen.getByText('Excellent'))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText(/your results/i)).toBeInTheDocument()
  })

  test('saveQuizResult is called on submit with language "eng"', async () => {
    const { saveQuizResult } = await import('../../lib/saveQuizResult')
    advanceToLastQuestion()
    fireEvent.click(screen.getByText('Excellent'))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    // Quiz.jsx uses language: 'eng' — test matches the actual code
    expect(saveQuizResult).toHaveBeenCalledWith(
      expect.objectContaining({ language: 'eng' })
    )
  })
})


// ================================================================
// RESULTS SCREEN TESTS
// ================================================================
describe('Quiz — Results screen', () => {

  // Helper: go all the way through and reach results
  const submitQuiz = () => {
    renderQuiz()
    fillIntakeAndStart()
    fireEvent.click(screen.getByText('Never'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Excellent'))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  }

  test('renders score boxes with correct values from scoreQuiz', () => {
    submitQuiz()
    expect(screen.getByText('3/9')).toBeInTheDocument()  // groupAPositives
    expect(screen.getByText('2/9')).toBeInTheDocument()  // groupBPositives
    expect(screen.getByText('No')).toBeInTheDocument()   // hasPerformanceImpairment: false
  })

  test('shows Inattentive diagnosis when only isInattentive is true', () => {
    submitQuiz()
    expect(screen.getByText(/predominantly inattentive subtype/i)).toBeInTheDocument()
  })

  test('shows Combined diagnosis when isCombined is true', async () => {
    const { scoreQuiz } = await import('../../data/dataQuiz.js')
    scoreQuiz.mockReturnValueOnce({
      ...MOCK_SCORE_RESULT,
      isCombined:   true,
      isInattentive: true,
      isHyperactive: true,
    })
    submitQuiz()
    expect(screen.getByText(/combined inattentive & hyperactive\/impulsive/i)).toBeInTheDocument()
  })

  test('shows Hyperactive diagnosis when only isHyperactive is true', async () => {
    const { scoreQuiz } = await import('../../data/dataQuiz.js')
    scoreQuiz.mockReturnValueOnce({
      ...MOCK_SCORE_RESULT,
      isCombined:   false,
      isInattentive: false,
      isHyperactive: true,
    })
    submitQuiz()
    expect(screen.getByText(/predominantly hyperactive\/impulsive subtype/i)).toBeInTheDocument()
  })

  test('shows No Pattern diagnosis when both flags are false', async () => {
    const { scoreQuiz } = await import('../../data/dataQuiz.js')
    scoreQuiz.mockReturnValueOnce({
      ...MOCK_SCORE_RESULT,
      isCombined:   false,
      isInattentive: false,
      isHyperactive: false,
    })
    submitQuiz()
    expect(screen.getByText(/no strong adhd pattern detected/i)).toBeInTheDocument()
  })

  test('shows the medical disclaimer on results screen', () => {
    submitQuiz()
    expect(screen.getByText(/nichq vanderbilt/i)).toBeInTheDocument()
  })

  test('"Retake Quiz" button returns to intake screen', () => {
    submitQuiz()
    fireEvent.click(screen.getByRole('button', { name: /retake quiz/i }))
    expect(screen.getByText(/before we begin/i)).toBeInTheDocument()
  })

  test('state is fully reset after retake — Start button is disabled', () => {
    submitQuiz()
    fireEvent.click(screen.getByRole('button', { name: /retake quiz/i }))
    // After retake all fields are cleared, so the disabled-text button appears
    expect(screen.getByRole('button', { name: /please fill in the required fields/i })).toBeDisabled()
  })
})


// ================================================================
// RETAKE VIA LOCATION STATE
// ================================================================
describe('Quiz — retake via location state', () => {

  test('resets to intake when location.state.retake is true', () => {
    renderQuiz({ retake: true })
    expect(screen.getByText(/before we begin/i)).toBeInTheDocument()
  })
})