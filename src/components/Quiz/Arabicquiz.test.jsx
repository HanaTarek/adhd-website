/* ================================================================
   Arabicquiz.test.jsx
   Tests for the Arabic Quiz component.

   Run with: npx vitest  OR  npx jest
   ================================================================ */

import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Arabicquiz from './Arabicquiz.jsx'

/* ── Mock the Arabic data module ─────────────────────────────── */
vi.mock('../../data/ArabicDataQuiz.js', () => ({
  QUESTIONS: [
    { id: 1, text: 'السؤال الأول',   type: 'symptom',     group: 'A' },
    { id: 2, text: 'السؤال الثاني',  type: 'symptom',     group: 'B' },
    { id: 3, text: 'السؤال الثالث',  type: 'performance', group: 'F' },
  ],
  SYMPTOM_OPTIONS: [
    { label: 'أبدًا',       value: 0 },
    { label: 'كثيرًا',     value: 2 },
    { label: 'كثيرًا جدًا', value: 3 },
  ],
  PERFORMANCE_OPTIONS: [
    { label: 'ممتاز',     value: 1 },
    { label: 'إشكالي',   value: 5 },
  ],
  scoreQuiz: vi.fn(() => ({
    groupAPositives: 0,
    groupBPositives: 0,
    hasPerformanceImpairment: false,
    isInattentive: false,
    isHyperactive: false,
    isCombined:    false,
  })),
}))

const renderArabicQuiz = () =>
  render(
    <MemoryRouter>
      <Arabicquiz />
    </MemoryRouter>
  )

/* ================================================================
   RENDERING
   ================================================================ */
describe('Arabicquiz — initial render', () => {
  it('renders the Arabic page title', () => {
    renderArabicQuiz()
    expect(
      screen.getByText(/هل تظهر على طفلي علامات اضطراب فرط الحركة/i)
    ).toBeInTheDocument()
  })

  it('renders the first question text in Arabic', () => {
    renderArabicQuiz()
    expect(screen.getByText('السؤال الأول')).toBeInTheDocument()
  })

  it('shows Arabic question counter format', () => {
    renderArabicQuiz()
    expect(screen.getByText(/السؤال 1 من 3/)).toBeInTheDocument()
  })

  it('renders the Arabic symptom options', () => {
    renderArabicQuiz()
    expect(screen.getByText('أبدًا')).toBeInTheDocument()
    expect(screen.getByText('كثيرًا')).toBeInTheDocument()
  })

  it('NEXT button (التالي) is disabled before answering', () => {
    renderArabicQuiz()
    expect(screen.getByRole('button', { name: /التالي/i })).toBeDisabled()
  })

  it('BACK button (رجوع) is disabled on the first question', () => {
    renderArabicQuiz()
    expect(screen.getByRole('button', { name: /رجوع/i })).toBeDisabled()
  })

  it('renders the English link', () => {
    renderArabicQuiz()
    expect(screen.getByRole('link', { name: /english/i })).toBeInTheDocument()
  })

  it('renders the screening disclaimer in Arabic', () => {
    renderArabicQuiz()
    expect(screen.getByText(/هذه أداة فحص فقط/i)).toBeInTheDocument()
  })
})

/* ================================================================
   ANSWERING AND NAVIGATING
   ================================================================ */
describe('Arabicquiz — answering and navigation', () => {
  it('enables التالي after selecting an answer', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('أبدًا'))
    expect(screen.getByRole('button', { name: /التالي/i })).not.toBeDisabled()
  })

  it('advances to question 2 after answering and clicking التالي', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    expect(screen.getByText('السؤال الثاني')).toBeInTheDocument()
    expect(screen.getByText(/السؤال 2 من 3/)).toBeInTheDocument()
  })

  it('enables رجوع after moving past question 1', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    expect(screen.getByRole('button', { name: /رجوع/i })).not.toBeDisabled()
  })

  it('navigates back to question 1 when رجوع is clicked', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    fireEvent.click(screen.getByRole('button', { name: /رجوع/i }))
    expect(screen.getByText('السؤال الأول')).toBeInTheDocument()
  })

  it('shows ارسال (Submit) on the last question', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    expect(screen.getByRole('button', { name: /ارسال/i })).toBeInTheDocument()
  })

  it('shows Arabic performance options on the last question', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    expect(screen.getByText('ممتاز')).toBeInTheDocument()
    expect(screen.getByText('إشكالي')).toBeInTheDocument()
  })
})

/* ================================================================
   RESULTS SCREEN
   ================================================================ */
describe('Arabicquiz — results screen', () => {
  const submitAll = () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    fireEvent.click(screen.getByText('ممتاز'))
    fireEvent.click(screen.getByRole('button', { name: /ارسال/i }))
  }

  it('shows the Arabic results title after submitting', () => {
    submitAll()
    expect(screen.getByText(/نتيجه الامتحان/i)).toBeInTheDocument()
  })

  it('shows Arabic score labels', () => {
    submitAll()
    expect(screen.getByText(/نتائج إيجابية بسبب تشتت الانتباه/i)).toBeInTheDocument()
    expect(screen.getByText(/تأثير الأداء/i)).toBeInTheDocument()
  })

  it('shows the "no pattern detected" result in Arabic', () => {
    submitAll()
    expect(
      screen.getByText(/لم يتم اكتشاف نمط قوي/i)
    ).toBeInTheDocument()
  })

  it('shows the Arabic medical disclaimer', () => {
    submitAll()
    expect(screen.getByText(/هذا الاختبار يعتمد على مقياس تقييم نيشق/i)).toBeInTheDocument()
  })

  it('shows the Arabic retake button', () => {
    submitAll()
    expect(screen.getByRole('button', { name: /إعادة الاختبار/i })).toBeInTheDocument()
  })

  it('resets to question 1 when إعادة الاختبار is clicked', () => {
    submitAll()
    fireEvent.click(screen.getByRole('button', { name: /إعادة الاختبار/i }))
    expect(screen.getByText('السؤال الأول')).toBeInTheDocument()
  })
})

/* ================================================================
   SECTION BADGE (Arabic labels)
   ================================================================ */
describe('Arabicquiz — section badges', () => {
  it('shows Arabic badge for Group A', () => {
    renderArabicQuiz()
    expect(screen.getByText('تشتت الانتباه')).toBeInTheDocument()
  })

  it('shows Arabic badge for Group B on question 2', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    expect(screen.getByText('فرط الحركة والاندفاعية')).toBeInTheDocument()
  })

  it('shows Arabic badge for Group F on question 3', () => {
    renderArabicQuiz()
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    fireEvent.click(screen.getByText('أبدًا'))
    fireEvent.click(screen.getByRole('button', { name: /التالي/i }))
    expect(screen.getByText('الأداء والوظائف اليومية')).toBeInTheDocument()
  })
})
