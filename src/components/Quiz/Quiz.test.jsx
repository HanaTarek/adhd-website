/**
 * Quiz.test.jsx
 * Tests: initial render, answer selection, back/next navigation,
 * cannot advance without answering, progress bar, submit flow,
 * all result types (combined, inattentive, hyperactive, no signs),
 * retake resets state.
 *
 * Strategy: mock QUESTIONS with 3 questions so tests are fast.
 * The real scoreQuiz() from dataQuiz.js is tested separately.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

/* ── Mock the data module so tests don't depend on 55 real questions ── */
vi.mock('../../data/dataQuiz.js', () => ({
  QUESTIONS: [
    { id: 1, group: 'A', text: 'Question one text',   type: 'symptom' },
    { id: 2, group: 'B', text: 'Question two text',   type: 'symptom' },
    { id: 3, group: 'F', text: 'Question three text', type: 'performance' },
  ],
  SYMPTOM_OPTIONS: [
    { label: 'Never',      value: 0 },
    { label: 'Occasionally', value: 1 },
    { label: 'Often',      value: 2 },
    { label: 'Very Often', value: 3 },
  ],
  PERFORMANCE_OPTIONS: [
    { label: 'Excellent',     value: 0 },
    { label: 'Average',       value: 1 },
    { label: 'Below Average', value: 2 },
    { label: 'Problematic',   value: 3 },
  ],
  scoreQuiz: vi.fn(() => ({
    groupAPositives: 6,
    groupBPositives: 6,
    hasPerformanceImpairment: true,
    isCombined: true,
    isInattentive: false,
    isHyperactive: false,
    noSignificantSigns: false,
  })),
}))

/*
  Import AFTER vi.mock so we get the mocked version.
  vi.mocked() gives us a properly typed mock with .mockReturnValueOnce etc.
*/
import { scoreQuiz } from '../../data/dataQuiz.js'
import Quiz from './Quiz.jsx'

const renderQuiz = () =>
  render(
    <MemoryRouter>
      <Quiz />
    </MemoryRouter>
  )

describe('Quiz component', () => {
  /* ── Initial render ─────────────────────────────────────── */
  test('renders quiz title', () => {
    renderQuiz()
    expect(screen.getByText(/does my child show signs of adhd/i)).toBeInTheDocument()
  })

  test('renders first question', () => {
    renderQuiz()
    expect(screen.getByText('Question one text')).toBeInTheDocument()
  })

  test('renders symptom answer options for group A question', () => {
    renderQuiz()
    expect(screen.getByText('Never')).toBeInTheDocument()
    expect(screen.getByText('Occasionally')).toBeInTheDocument()
    expect(screen.getByText('Often')).toBeInTheDocument()
    expect(screen.getByText('Very Often')).toBeInTheDocument()
  })

  test('shows question 1 of 3 counter', () => {
    renderQuiz()
    expect(screen.getByText(/Question\s*1\s*of\s*3/)).toBeInTheDocument()
  })

  test('Next button is disabled before answering', () => {
    renderQuiz()
    const nextBtn = screen.getByRole('button', { name: /next/i })
    expect(nextBtn).toBeDisabled()
  })

  test('Back button is disabled on first question', () => {
    renderQuiz()
    const backBtn = screen.getByRole('button', { name: /back/i })
    expect(backBtn).toBeDisabled()
  })

  /* ── Answer selection ───────────────────────────────────── */
  test('selecting an answer enables the Next button', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    const nextBtn = screen.getByRole('button', { name: /next/i })
    expect(nextBtn).not.toBeDisabled()
  })

  test('selected answer gets active styling', () => {
    renderQuiz()
    const option = screen.getByText('Often').closest('.quiz-option')
    fireEvent.click(option)
    expect(option).toHaveClass('selected')
  })

  /* ── Navigation ─────────────────────────────────────────── */
  test('clicking Next advances to question 2', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('Question two text')).toBeInTheDocument()
  })

  test('shows question 2 of 3 after advancing', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText(/Question\s*2\s*of\s*3/)).toBeInTheDocument()
  })

  test('Back button enabled on question 2', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByRole('button', { name: /back/i })).not.toBeDisabled()
  })

  test('clicking Back from question 2 returns to question 1', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByText('Question one text')).toBeInTheDocument()
  })

  test('previous answer is still selected after going back', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    const option = screen.getByText('Often').closest('.quiz-option')
    expect(option).toHaveClass('selected')
  })

  /* ── Last question ──────────────────────────────────────── */
  test('last question shows Submit button instead of Next', () => {
    renderQuiz()
    // Q1
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    // Q2
    fireEvent.click(screen.getByText('Very Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    // Q3 — last question
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^next$/i })).toBeNull()
  })

  test('last question shows performance options', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Very Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('Excellent')).toBeInTheDocument()
    expect(screen.getByText('Below Average')).toBeInTheDocument()
  })

  /* ── Submit & results ───────────────────────────────────── */
  test('submitting shows results screen', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Very Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Below Average'))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText(/your results/i)).toBeInTheDocument()
  })

  test('results screen shows score breakdown', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Very Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Below Average'))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    const score = screen.getAllByText(/6\s*\/\s*9/)[0]
    expect(score).toBeInTheDocument()
    expect(screen.getByText(/inattentive positives/i)).toBeInTheDocument()
    expect(screen.getByText(/hyperactive positives/i)).toBeInTheDocument()
  })

  test('results screen shows Combined ADHD diagnosis', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Very Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Below Average'))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText(/combined inattentive & hyperactive/i)).toBeInTheDocument()
  })

  /* ── Retake ─────────────────────────────────────────────── */
  test('retake button resets quiz to first question', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Very Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Below Average'))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    fireEvent.click(screen.getByRole('button', { name: /retake/i }))
    expect(screen.getByText('Question one text')).toBeInTheDocument()

    /*
      FIX 1: The counter renders as:
        <p class="quiz-counter">Question 1 of 3</p>
      with text nodes split by JSX expressions: "Question " + {1} + " of " + {3}.
      The regex /1\s*\/\s*3/ looks for "1/3" with optional whitespace around the
      slash — but the component uses the word "of", not a literal slash.
      Fix: match the actual rendered text "Question 1 of 3".
    */
    expect(screen.getByText(/Question\s*1\s*of\s*3/)).toBeInTheDocument()
  })

  test('after retake, Next button is disabled again', () => {
    renderQuiz()
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Very Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Below Average'))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    fireEvent.click(screen.getByRole('button', { name: /retake/i }))
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })
})

/* ─── Results variants ────────────────────────────────────────
   FIX 2/3/4: The original describe block did:
     const { scoreQuiz } = require('../../data/dataQuiz.js')
   In Vitest with ESM, require() bypasses vi.mock and returns the
   real module, so scoreQuiz is not a mock function and
   .mockReturnValueOnce is not defined on it.

   Fix: import scoreQuiz at the top of the file (already done above).
   vi.mocked() wraps it with proper mock typing.
   Use vi.mocked(scoreQuiz).mockReturnValueOnce(...) inside each test.

   The "No Significant Signs" test also had a stray nested vi.mock()
   call for a different path (utils/scoreQuiz.js) that was wrong and
   would be hoisted — removed entirely.
──────────────────────────────────────────────────────────────── */
describe('Quiz result variants', () => {
  /*
    Helper: navigate through all 3 mocked questions and submit.
    scoreQuiz is already mocked at the module level; we override its
    return value once per test with mockReturnValueOnce before calling
    submitQuiz(), so the component sees the desired result.
  */
  const submitQuiz = () => {
    render(<MemoryRouter><Quiz /></MemoryRouter>)
    fireEvent.click(screen.getByText('Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Very Often'))
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.click(screen.getByText('Below Average'))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  }

  test('shows Predominantly Inattentive result', () => {
    vi.mocked(scoreQuiz).mockReturnValueOnce({
      groupAPositives: 6, groupBPositives: 2,
      hasPerformanceImpairment: true,
      isCombined: false, isInattentive: true,
      isHyperactive: false, noSignificantSigns: false,
    })
    submitQuiz()
    expect(screen.getByText(/predominantly inattentive/i)).toBeInTheDocument()
  })

  test('shows Predominantly Hyperactive result', () => {
    vi.mocked(scoreQuiz).mockReturnValueOnce({
      groupAPositives: 2, groupBPositives: 6,
      hasPerformanceImpairment: true,
      isCombined: false, isInattentive: false,
      isHyperactive: true, noSignificantSigns: false,
    })
    submitQuiz()
    expect(
  screen.getByText(/predominantly hyperactive\/impulsive subtype/i)).toBeInTheDocument()
  })

  test('shows No Significant Signs result', () => {
    vi.mocked(scoreQuiz).mockReturnValueOnce({
      groupAPositives: 1, groupBPositives: 1,
      hasPerformanceImpairment: false,
      isCombined: false, isInattentive: false,
      isHyperactive: false, noSignificantSigns: true,
    })
    submitQuiz()
    expect(screen.getByText(/no significant signs|no strong adhd pattern/i)).toBeInTheDocument()
  })
})