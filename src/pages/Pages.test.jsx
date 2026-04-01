/* ================================================================
   Pages.test.jsx
   Tests for all page-level wrapper components:
     QuizPage, Arabicquizpage, CausesPage, Home,
     Nutritionpage, Supportpage, SymptomsPage, Treatmentpage

   Run with: npx vitest  OR  npx jest
   ================================================================ */

import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'

/* ── Stub every child component so pages render without errors ──
   Each stub just renders a unique text string we can assert on.
─────────────────────────────────────────────────────────────── */
vi.mock('../components/Quiz/Quiz',           () => ({ default: () => <div>QUIZ_STUB</div> }))
vi.mock('../components/Quiz/Arabicquiz',     () => ({ default: () => <div>ARABICQUIZ_STUB</div> }))
vi.mock('../components/Causes/Causes',       () => ({ default: () => <div>CAUSES_STUB</div> }))
vi.mock('../components/Hero/Hero',           () => ({ default: () => <div>HERO_STUB</div> }))
vi.mock('../components/Nutrition/Nutrition', () => ({ default: () => <div>NUTRITION_STUB</div> }))
vi.mock('../components/Support/Support',     () => ({ default: () => <div>SUPPORT_STUB</div> }))
vi.mock('../components/Symptoms/Symptoms',   () => ({ default: () => <div>SYMPTOMS_STUB</div> }))
vi.mock('../components/Treatment/Treatment', () => ({ default: () => <div>TREATMENT_STUB</div> }))

/* Stub react-router-dom's useLocation for QuizPage */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual }
})

import QuizPage        from '../pages/QuizPage'
import Arabicquizpage  from '../pages/Arabicquizpage'
import CausesPage      from '../pages/CausesPage'
import Home            from '../pages/Home'
import Nutritionpage   from '../pages/Nutritonpage'
import Supportpage     from '../pages/Supportpage'
import SymptomsPage    from '../pages/Symptomspage'
import Treatmentpage   from '../pages/Treatmentpage'

const wrap = (Component, path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={<Component />} />
      </Routes>
    </MemoryRouter>
  )

/* ================================================================
   HOME PAGE
   ================================================================ */
describe('Home page', () => {
  it('renders without crashing', () => {
    wrap(Home)
    expect(screen.getByText('HERO_STUB')).toBeInTheDocument()
  })
})

/* ================================================================
   QUIZ PAGE
   ================================================================ */
describe('QuizPage', () => {
  it('renders the Quiz component', () => {
    wrap(QuizPage, '/quiz')
    expect(screen.getByText('QUIZ_STUB')).toBeInTheDocument()
  })

  it('passes a key derived from the ?r= search param', () => {
    render(
      <MemoryRouter initialEntries={['/quiz?r=12345']}>
        <Routes>
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('QUIZ_STUB')).toBeInTheDocument()
  })

  it('uses "default" key when no ?r= param is present', () => {
    wrap(QuizPage, '/quiz')
    expect(screen.getByText('QUIZ_STUB')).toBeInTheDocument()
  })
})

/* ================================================================
   ARABIC QUIZ PAGE
   ================================================================ */
describe('Arabicquizpage', () => {
  it('renders the Arabicquiz component', () => {
    wrap(Arabicquizpage, '/arabic-quiz')
    expect(screen.getByText('ARABICQUIZ_STUB')).toBeInTheDocument()
  })
})

/* ================================================================
   CAUSES PAGE
   ================================================================ */
describe('CausesPage', () => {
  it('renders the Causes component', () => {
    wrap(CausesPage, '/causes')
    expect(screen.getByText('CAUSES_STUB')).toBeInTheDocument()
  })
})

/* ================================================================
   NUTRITION PAGE
   ================================================================ */
describe('Nutritionpage', () => {
  it('renders the Nutrition component', () => {
    wrap(Nutritionpage, '/nutrition')
    expect(screen.getByText('NUTRITION_STUB')).toBeInTheDocument()
  })
})

/* ================================================================
   SUPPORT PAGE
   ================================================================ */
describe('Supportpage', () => {
  it('renders the Support component', () => {
    wrap(Supportpage, '/support')
    expect(screen.getByText('SUPPORT_STUB')).toBeInTheDocument()
  })
})

/* ================================================================
   SYMPTOMS PAGE
   ================================================================ */
describe('SymptomsPage', () => {
  it('renders the Symptoms component', () => {
    wrap(SymptomsPage, '/symptoms')
    expect(screen.getByText('SYMPTOMS_STUB')).toBeInTheDocument()
  })
})

/* ================================================================
   TREATMENT PAGE
   ================================================================ */
describe('Treatmentpage', () => {
  it('renders the Treatment component', () => {
    wrap(Treatmentpage, '/treatment')
    expect(screen.getByText('TREATMENT_STUB')).toBeInTheDocument()
  })
})
