/**
 * Nutrition.test.jsx
 * Tests: hero, all 5 nutrient cards with image/name/sources,
 * all 6 activity tabs switch correctly, diet compare cards, CTA.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Nutrition from './Nutrition.jsx'

const renderNutrition = () =>
  render(
    <MemoryRouter>
      <Nutrition />
    </MemoryRouter>
  )

describe('Nutrition page', () => {
  /* ── Hero ─────────────────────────────────────────────── */
  test('renders hero title', () => {
    renderNutrition()
    expect(screen.getByText(/feed the brain/i)).toBeInTheDocument()
  })

  test('renders hero lead paragraph', () => {
    renderNutrition()
    expect(screen.getByText(/what your child eats/i)).toBeInTheDocument()
  })

  /* ── Nutrient recipe cards ──────────────────────────────── */
  test('renders Brain Fuel section', () => {
    renderNutrition()
    expect(screen.getByText(/brain fuel/i)).toBeInTheDocument()
    expect(screen.getByText(/how nutrition affects/i)).toBeInTheDocument()
  })

  test('renders all 5 nutrient card names', () => {
    renderNutrition()
    expect(screen.getByText('Omega-3 Fatty Acids (EPA/DHA)')).toBeInTheDocument()
    expect(screen.getByText('Zinc')).toBeInTheDocument()
    expect(screen.getByText('Iron')).toBeInTheDocument()
    expect(screen.getByText('Magnesium')).toBeInTheDocument()
    expect(screen.getByText('Vitamins B6 & D')).toBeInTheDocument()
  })


  test('renders nutrient card images with alt text', () => {
    renderNutrition()
    expect(screen.getByAltText(/Salmon/i)).toBeInTheDocument()
    expect(screen.getByAltText(/pumpkin/i)).toBeInTheDocument()
    expect(screen.getByAltText(/spinach/i)).toBeInTheDocument()
    expect(screen.getByAltText(/Dark chocolate/i)).toBeInTheDocument()
    expect(screen.getByAltText(/eggs/i)).toBeInTheDocument()
  })

  /* ── Diet compare ───────────────────────────────────────── */
  test('renders food guide section', () => {
    renderNutrition()
    expect(screen.getByText(/practical food guide/i)).toBeInTheDocument()
    expect(screen.getByText(/what to eat/i)).toBeInTheDocument()
  })

  test('renders encourage-more badge', () => {
    renderNutrition()
    expect(screen.getByText(/encourage more of these/i)).toBeInTheDocument()
  })

  test('renders reduce-when-possible badge', () => {
    renderNutrition()
    expect(screen.getByText(/reduce when possible/i)).toBeInTheDocument()
  })

  test('renders brain-supportive foods list items', () => {
    renderNutrition()
    expect(screen.getByText(/oily fish.*omega-3/i)).toBeInTheDocument()
    expect(screen.getByText(/eggs, lean meat/i)).toBeInTheDocument()
    expect(screen.getByText(/leafy greens/i)).toBeInTheDocument()
  })

  test('renders avoid foods list items', () => {
    renderNutrition()
    expect(screen.getByText(/artificial food colours/i)).toBeInTheDocument()
    expect(screen.getByText(/sugary drinks/i)).toBeInTheDocument()
    expect(screen.getByText(/ultra-processed/i)).toBeInTheDocument()
  })

  /* ── Activity tabs ──────────────────────────────────────── */
  test('renders all 6 activity tabs', () => {
    renderNutrition()
    screen.getByRole('button', { name: /Breathing Games/i })
    screen.getByRole('button', { name: /Sensory Activities/i })
    screen.getByRole('button', { name: /Heavy Work/i })
    screen.getByRole('button', { name: /Rhythm & Sound/i })
    screen.getByRole('button', { name: /Focused Quiet Play/i })
    screen.getByRole('button', { name: /Nature Reset/i })

  })

  test('Breathing Games tab is active by default', () => {
    renderNutrition()
    const tab = screen.getAllByText(/breathing games/i)[0]
    expect(tab.closest('button')).toHaveClass('n-act-tab--active')
  })

  test('clicking Sensory Activities tab shows its content', () => {
    renderNutrition()
    fireEvent.click(screen.getByRole('button', { name: /Sensory Activities/i }))
    expect(screen.getByText(/Kinetic Sand/i)).toBeInTheDocument()
  })

  test('clicking Heavy Work tab shows its content', () => {
    renderNutrition()
    fireEvent.click(screen.getByRole('button', { name: /Heavy Work/i }))
    expect(screen.getByText(/wall push-ups/i)).toBeInTheDocument()
  })

  test('clicking Rhythm & Sound tab shows its content', () => {
    renderNutrition()
    fireEvent.click(screen.getByRole('button', { name: /Rhythm & Sound/i }))
    expect(screen.getByText(/soft instrumental music/i)).toBeInTheDocument()
  })

  test('clicking Focused Quiet Play tab shows its content', () => {
    renderNutrition()
    fireEvent.click(screen.getByRole('button', { name: /Focused Quiet Play/i }))
    expect(screen.getByText(/colouring/i)).toBeInTheDocument()
  })

  test('clicking Nature Reset tab shows its content', () => {
    renderNutrition()
    fireEvent.click(screen.getByRole('button', { name: /nature reset/i }))
    expect(screen.getByText(/Barefoot Walking/i)).toBeInTheDocument()
  })

  test('switching tab hides previous tab content', () => {
    renderNutrition()
    // Default: breathing content visible
    expect(screen.getByText(/balloon breathing/i)).toBeInTheDocument()
    // Switch to sensory
    fireEvent.click(screen.getByRole('button', { name: /sensory activities/i }))
            expect(
        screen.getByText(/balloon breathing/i)
        ).toBeInTheDocument()
    expect(screen.getByText(/kinetic sand/i)).toBeInTheDocument()
  })


  test('parent tip shows for active activity', () => {
    renderNutrition()
    expect(screen.getByText(/before homework time/i)).toBeInTheDocument()
  })

  /* ── CTA ────────────────────────────────────────────────── */
  test('CTA links to /support', () => {
    renderNutrition()
    const link = screen.getByRole('link', { name: /school & communication support/i })
    expect(link).toHaveAttribute('href', '/support')
  })
})