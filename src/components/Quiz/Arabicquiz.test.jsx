// ================================================================
// Arabicquiz.test.jsx
// ================================================================
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'

// ── FIX 1: vi.hoisted MUST come before vi.mock ──────────────────
// vi.mock() is hoisted to the top of the file by Vitest, so any
// variables it references must also be hoisted via vi.hoisted().
// Defining them here first guarantees they exist when vi.mock runs.
const {
  MOCK_QUESTIONS,
  MOCK_SYMPTOM_OPTIONS,
  MOCK_PERFORMANCE_OPTIONS,
  MOCK_SCORE_RESULT,
} = vi.hoisted(() => {
  const MOCK_QUESTIONS = [
    { id: 'q1', group: 'A', type: 'symptom',     text: 'نص السؤال الأول'   },
    { id: 'q2', group: 'B', type: 'symptom',     text: 'نص السؤال الثاني'  },
    { id: 'q3', group: 'F', type: 'performance', text: 'نص السؤال الثالث'  },
  ]
  const MOCK_SYMPTOM_OPTIONS = [
    { value: 0, label: 'أبداً'       },
    { value: 1, label: 'أحياناً'     },
    { value: 2, label: 'كثيراً'      },
    { value: 3, label: 'كثيراً جداً' },
  ]
  const MOCK_PERFORMANCE_OPTIONS = [
    { value: 1, label: 'ممتاز'          },
    { value: 2, label: 'فوق المتوسط'   },
    { value: 3, label: 'متوسط'          },
    { value: 4, label: 'مشكلة نوعاً ما' },
    { value: 5, label: 'مشكلة'          },
  ]
  const MOCK_SCORE_RESULT = {
    groupAPositives:          3,
    groupBPositives:          2,
    hasPerformanceImpairment: false,
    isCombined:               false,
    isInattentive:            true,
    isHyperactive:            false,
  }
  return { MOCK_QUESTIONS, MOCK_SYMPTOM_OPTIONS, MOCK_PERFORMANCE_OPTIONS, MOCK_SCORE_RESULT }
})

// ── Now vi.mock() can safely reference the hoisted constants ─────
vi.mock('./Arabicquiz.css', () => ({}))

vi.mock('../../lib/saveQuizResult', () => ({
  // FIX 2: component imports saveQuizResultArabic, not saveQuizResult
  saveQuizResultArabic: vi.fn(),
}))

vi.mock('../../data/ArabicDataQuiz.js', () => ({
  QUESTIONS:           MOCK_QUESTIONS,
  SYMPTOM_OPTIONS:     MOCK_SYMPTOM_OPTIONS,
  PERFORMANCE_OPTIONS: MOCK_PERFORMANCE_OPTIONS,
  scoreQuiz:           vi.fn(() => MOCK_SCORE_RESULT),
}))

import Arabicquiz from './Arabicquiz'

// ── Render helper ────────────────────────────────────────────────
const renderArabicQuiz = () =>
  render(
    <MemoryRouter>
      <Arabicquiz />
    </MemoryRouter>
  )

// ── FIX 3: fillIntakeAndStart uses actual UI elements ────────────
// The component renders pill BUTTONS (not <select> or radio inputs).
// Age buttons show Arabic numeral labels like '٨ سنوات'.
// Gender buttons show 'ولد' / 'بنت'.
// Suspect buttons show 'نعم' / 'لا' / 'لم أفكر في الأمر بجدية من قبل'.
// Start button text is '← ابدأ الاختبار' when valid.
const fillIntakeAndStart = () => {
  // Click the age button for 8 years (label: '٨ سنوات')
  fireEvent.click(screen.getByText('٨ سنوات'))

  // Click the gender button for boy
  fireEvent.click(screen.getByText('ولد'))

  // Click the suspect button for yes
  fireEvent.click(screen.getByText('نعم'))

  // Click start
  fireEvent.click(screen.getByText('← ابدأ الاختبار'))
}

// ================================================================
// INTAKE SCREEN
// ================================================================
describe('Arabicquiz — Intake screen', () => {

  test('renders the intake screen by default', () => {
    renderArabicQuiz()
    expect(screen.getByText('قبل أن نبدأ')).toBeInTheDocument()
  })

  test('renders the Arabic page title', () => {
    renderArabicQuiz()
    expect(
      screen.getAllByText(/هل تظهر على طفلي علامات اضطراب فرط الحركة/i)[0]
    ).toBeInTheDocument()
  })

  test('renders the screening disclaimer in Arabic', () => {
    renderArabicQuiz()
    expect(
      screen.getByText(/هذه أداة فحص فقط — وليست تشخيصًا/i)
    ).toBeInTheDocument()
  })

  test('Start button is disabled before required fields are filled', () => {
    renderArabicQuiz()
    // When not valid the text is the disabled message
    expect(
      screen.getByText('يرجى ملء الحقول المطلوبة أعلاه')
    ).toBeDisabled()
  })

  test('Start button enables when age, gender and suspect are all filled', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('٨ سنوات'))
    fireEvent.click(screen.getByText('ولد'))
    fireEvent.click(screen.getByText('نعم'))
    expect(screen.getByText('← ابدأ الاختبار')).toBeEnabled()
  })

  test('renders all 15 age buttons (4–18)', () => {
    renderArabicQuiz()
    const ageBtns = [
      '٤ سنوات','٥ سنوات','٦ سنوات','٧ سنوات','٨ سنوات',
      '٩ سنوات','١٠ سنوات','١١ سنة','١٢ سنة','١٣ سنة',
      '١٤ سنة','١٥ سنة','١٦ سنة','١٧ سنة','١٨ سنة',
    ]
    ageBtns.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  test('gender buttons for ولد and بنت are rendered', () => {
    renderArabicQuiz()
    expect(screen.getByText('ولد')).toBeInTheDocument()
    expect(screen.getByText('بنت')).toBeInTheDocument()
  })

  test('all three suspect options are rendered', () => {
    renderArabicQuiz()
    expect(screen.getByText('نعم')).toBeInTheDocument()
    expect(screen.getByText('لا')).toBeInTheDocument()
    expect(screen.getByText('لم أفكر في الأمر بجدية من قبل')).toBeInTheDocument()
  })

  test('name input is disabled when anonymous toggle is clicked', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('👤 البقاء مجهولاً'))
    expect(screen.getByPlaceholderText(/مثلاً/i)).toBeDisabled()
  })

  test('name input re-enables after toggling anonymous off', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('👤 البقاء مجهولاً')) // on
    fireEvent.click(screen.getByText('🙈 مجهول'))          // off
    expect(screen.getByPlaceholderText(/مثلاً/i)).not.toBeDisabled()
  })

  test('English link is present on the intake screen', () => {
    renderArabicQuiz()
    expect(screen.getByRole('link', { name: /english/i })).toBeInTheDocument()
  })
})

// ================================================================
// QUESTION SCREEN
// ================================================================
describe('Arabicquiz — Question screen navigation', () => {
  beforeEach(() => {
    renderArabicQuiz()
    fillIntakeAndStart()
  })

  test('transitions to the quiz screen after valid intake', () => {
    expect(screen.getByText(/السؤال 1 من/i)).toBeInTheDocument()
  })

  test('shows the first question text', () => {
    expect(screen.getByText('نص السؤال الأول')).toBeInTheDocument()
  })

  test('التالي (Next) button is disabled before an answer is chosen', () => {
    expect(screen.getByRole('button', { name: /^التالي$/i })).toBeDisabled()
  })

  test('التالي button enables after selecting an answer', () => {
    fireEvent.click(screen.getByText('أبداً'))
    expect(screen.getByRole('button', { name: /^التالي$/i })).toBeEnabled()
  })

  test('selected option receives the "selected" class', () => {
    const btn = screen.getByText('أبداً').closest('button')
    fireEvent.click(btn)
    expect(btn).toHaveClass('selected')
  })

  test('picking a new option removes "selected" from the previous one', () => {
    const neverBtn = screen.getByText('أبداً').closest('button')
    const oftenBtn = screen.getByText('كثيراً').closest('button')
    fireEvent.click(neverBtn)
    fireEvent.click(oftenBtn)
    expect(neverBtn).not.toHaveClass('selected')
    expect(oftenBtn).toHaveClass('selected')
  })

  test('clicking التالي advances to the second question', () => {
    fireEvent.click(screen.getByText('أبداً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))
    expect(screen.getByText(/السؤال 2 من/i)).toBeInTheDocument()
  })

  // FIX 4: Back on Q1 goes to intake (not disabled) — handleBack sets stage='intake'
  test('clicking رجوع on the first question returns to the intake screen', () => {
    fireEvent.click(screen.getByRole('button', { name: /رجوع/i }))
    expect(screen.getByText('قبل أن نبدأ')).toBeInTheDocument()
  })

  test('clicking رجوع on question 2 returns to question 1', () => {
    fireEvent.click(screen.getByText('أبداً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))
    fireEvent.click(screen.getByRole('button', { name: /رجوع/i }))
    expect(screen.getByText(/السؤال 1 من/i)).toBeInTheDocument()
  })

  test('progress bar starts at 0% on the first question', () => {
    const fill = document.querySelector('.aquiz-progress-fill')
    expect(fill).toHaveStyle({ width: '0%' })
  })

  test('progress bar updates after advancing a question', () => {
    fireEvent.click(screen.getByText('أبداً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))
    const fill = document.querySelector('.aquiz-progress-fill')
    expect(fill).toHaveStyle({ width: '33%' })
  })

  test('section badge shows the correct Arabic label for group A', () => {
    expect(screen.getByText('تشتت الانتباه')).toBeInTheDocument()
  })
})

// ================================================================
// PERFORMANCE OPTIONS
// ================================================================
describe('Arabicquiz — Performance question options', () => {
  test('renders PERFORMANCE_OPTIONS on the last (type=performance) question', () => {
    renderArabicQuiz()
    fillIntakeAndStart()

    fireEvent.click(screen.getByText('أبداً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))
    fireEvent.click(screen.getByText('كثيراً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))

    expect(screen.getByText('ممتاز')).toBeInTheDocument()
    expect(screen.getByText('مشكلة')).toBeInTheDocument()
  })
})

// ================================================================
// SUBMIT
// ================================================================
describe('Arabicquiz — Last question & submit', () => {

  const advanceToLastQuestion = () => {
    renderArabicQuiz()
    fillIntakeAndStart()
    fireEvent.click(screen.getByText('أبداً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))
    fireEvent.click(screen.getByText('كثيراً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))
  }

  test('last question shows "ارسال" instead of "التالي"', () => {
    advanceToLastQuestion()
    expect(screen.getByRole('button', { name: /^ارسال$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^التالي$/i })).not.toBeInTheDocument()
  })

  test('submitting navigates to the results screen', () => {
    advanceToLastQuestion()
    fireEvent.click(screen.getByText('ممتاز'))
    fireEvent.click(screen.getByRole('button', { name: /^ارسال$/i }))
    // FIX 5: actual results title is 'نتيجه الامتحان' (not 'نتيجة الاختبار')
    expect(screen.getByText('نتيجه الامتحان')).toBeInTheDocument()
  })

  test('saveQuizResultArabic is called with language "ar" on submit', async () => {
    advanceToLastQuestion()
    fireEvent.click(screen.getByText('ممتاز'))
    fireEvent.click(screen.getByRole('button', { name: /^ارسال$/i }))

    // FIX 6: import saveQuizResultArabic (not saveQuizResult)
    const { saveQuizResultArabic } = await import('../../lib/saveQuizResult')
    expect(saveQuizResultArabic).toHaveBeenCalledWith(
      expect.objectContaining({ language: 'ar' })
    )
  })

  test('saveQuizResultArabic passes empty parentName when anonymous is on', async () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('👤 البقاء مجهولاً'))
    fireEvent.click(screen.getByText('٨ سنوات'))
    fireEvent.click(screen.getByText('ولد'))
    fireEvent.click(screen.getByText('نعم'))
    fireEvent.click(screen.getByText('← ابدأ الاختبار'))
    fireEvent.click(screen.getByText('أبداً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))
    fireEvent.click(screen.getByText('كثيراً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))
    fireEvent.click(screen.getByText('ممتاز'))
    fireEvent.click(screen.getByRole('button', { name: /^ارسال$/i }))

    const { saveQuizResultArabic } = await import('../../lib/saveQuizResult')
    expect(saveQuizResultArabic).toHaveBeenCalledWith(
      expect.objectContaining({ parentName: '' })
    )
  })

  test('saveQuizResultArabic receives the numeric childAge value', async () => {
    advanceToLastQuestion()
    fireEvent.click(screen.getByText('ممتاز'))
    fireEvent.click(screen.getByRole('button', { name: /^ارسال$/i }))

    const { saveQuizResultArabic } = await import('../../lib/saveQuizResult')
    expect(saveQuizResultArabic).toHaveBeenCalledWith(
      expect.objectContaining({ childAge: 8 })
    )
  })
})

// ================================================================
// RESULTS SCREEN
// ================================================================
describe('Arabicquiz — Results screen', () => {

  const submitQuiz = () => {
    renderArabicQuiz()
    fillIntakeAndStart()
    fireEvent.click(screen.getByText('أبداً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))
    fireEvent.click(screen.getByText('كثيراً'))
    fireEvent.click(screen.getByRole('button', { name: /^التالي$/i }))
    fireEvent.click(screen.getByText('ممتاز'))
    fireEvent.click(screen.getByRole('button', { name: /^ارسال$/i }))
  }

  test('displays score boxes with values from scoreQuiz', () => {
    submitQuiz()
    expect(screen.getByText('3/9')).toBeInTheDocument()
    expect(screen.getByText('2/9')).toBeInTheDocument()
    expect(screen.getByText('لا')).toBeInTheDocument()
  })

  test('shows نعم for performance impact when hasPerformanceImpairment is true', async () => {
    const { scoreQuiz } = await import('../../data/ArabicDataQuiz.js')
    scoreQuiz.mockReturnValueOnce({ ...MOCK_SCORE_RESULT, hasPerformanceImpairment: true })
    submitQuiz()
    expect(screen.getByText('نعم')).toBeInTheDocument()
  })

  test('shows Combined diagnosis when isCombined=true', async () => {
    const { scoreQuiz } = await import('../../data/ArabicDataQuiz.js')
    scoreQuiz.mockReturnValueOnce({
      ...MOCK_SCORE_RESULT,
      isCombined: true, isInattentive: true, isHyperactive: true,
    })
    submitQuiz()
    expect(screen.getByText(/اضطراب نقص الانتباه وفرط النشاط/i)).toBeInTheDocument()
  })

  test('shows Hyperactive diagnosis when only isHyperactive=true', async () => {
    const { scoreQuiz } = await import('../../data/ArabicDataQuiz.js')
    scoreQuiz.mockReturnValueOnce({
      ...MOCK_SCORE_RESULT,
      isCombined: false, isInattentive: false, isHyperactive: true,
    })
    submitQuiz()
    expect(
      screen.getByText(/وجود علامات لأعراض فرط الحركة والاندفاعية/i)
    ).toBeInTheDocument()
  })

  test('shows "No pattern" when both flags are false', async () => {
    const { scoreQuiz } = await import('../../data/ArabicDataQuiz.js')
    scoreQuiz.mockReturnValueOnce({
      ...MOCK_SCORE_RESULT,
      isCombined: false, isInattentive: false, isHyperactive: false,
    })
    submitQuiz()
    expect(
      screen.getByText(/لم يتم اكتشاف نمط قوي لاضطراب فرط الحركة/i)
    ).toBeInTheDocument()
  })

  test('shows the Arabic medical disclaimer', () => {
    submitQuiz()
    expect(screen.getByText(/مقياس تقييم نيشق فاندر بيلت/i)).toBeInTheDocument()
  })

  test('إعادة الاختبار returns to intake screen', () => {
    submitQuiz()
    fireEvent.click(screen.getByRole('button', { name: /إعادة الاختبار/i }))
    expect(screen.getByText('قبل أن نبدأ')).toBeInTheDocument()
  })

  test('all state is reset after retaking (start button is disabled again)', () => {
    submitQuiz()
    fireEvent.click(screen.getByRole('button', { name: /إعادة الاختبار/i }))
    expect(screen.getByText('يرجى ملء الحقول المطلوبة أعلاه')).toBeDisabled()
  })
})