/**
 * Causes.test.jsx
 * Tests: hero, flip cards (front/back toggle), myths accordion,
 * stigma cards, stats pills, CTA link to /treatment.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Causes from './Causes.jsx'

const renderCauses = () =>
  render(
    <MemoryRouter>
      <Causes />
    </MemoryRouter>
  )

describe('Causes page', () => {
  /* ── Hero ───────────────────────────────────────────────── */
  test('renders hero title', () => {
    renderCauses()
    expect(screen.getByText(/not a flaw/i)).toBeInTheDocument()
  })

  // FIX 1: the lead text is split across JSX line breaks, so getByText
  // can't match it as a single string. Use the paragraph element directly.
  test('renders hero lead paragraph', () => {
    renderCauses()
    const lead = document.querySelector('.c-hero__lead')
    expect(lead).not.toBeNull()
    expect(lead.textContent).toMatch(/You didn’t cause this/i)
  })

  /* ── Flip cards ─────────────────────────────────────────── */
  // FIX 2: each flip card renders the title on BOTH front (.c-flip__title)
  // and back (.c-flip__back-title), so getByText finds multiple elements.
  // Target only the front-face titles via their class.
  test('renders all 3 flip card fronts', () => {
    renderCauses()
    const frontTitles = document.querySelectorAll('.c-flip__title')
    const texts = Array.from(frontTitles).map(el => el.textContent.trim())
    expect(texts).toContain('Genetic Factors')
    expect(texts).toContain('Neurobiological Factors')
    expect(texts.some(t => /environmental/i.test(t))).toBe(true)
  })

  test('flip card shows back content when clicked', () => {
    renderCauses()
    const geneticCard = screen.getByRole('button', { name: /genetic factors/i })
    fireEvent.click(geneticCard)
    expect(screen.getByText(/70–80% of cases have a genetic component/i)).toBeInTheDocument()
  })

  test('flip card toggles back to front on second click', () => {
    renderCauses()
    const geneticCard = screen.getByRole('button', { name: /genetic factors/i })
    fireEvent.click(geneticCard) // flip to back
    fireEvent.click(geneticCard) // flip back to front
    expect(document.querySelector('.c-flip--flipped')).toBeNull()
  })

  /* ── Stats ──────────────────────────────────────────────── */
  test('renders epidemiology section heading', () => {
    renderCauses()
    expect(screen.getByText(/how common/i)).toBeInTheDocument()
  })

  test('renders all 4 stat pills', () => {
    renderCauses()
    expect(screen.getByText('50%–65%')).toBeInTheDocument()
    expect(screen.getByText('~5%–7%')).toBeInTheDocument()
    expect(screen.getByText('~2–3:1')).toBeInTheDocument()
    expect(screen.getByText('~1.5:1')).toBeInTheDocument()
  })

  /* ── Myths accordion ────────────────────────────────────── */
  // FIX 3: /myths/i also matches the lead paragraph text "These myths
  // delay diagnosis...". Target specifically the <h2> heading element.
  test('renders myths section heading', () => {
    renderCauses()
    const heading = screen.getByRole('heading', { name: /myths/i })
    expect(heading).toBeInTheDocument()
  })

  test('renders all 10 myth triggers', () => {
    renderCauses()
    expect(screen.getByText(/caused by poor parenting/i)).toBeInTheDocument()
    expect(screen.getByText(/not a real disorder/i)).toBeInTheDocument()
    expect(screen.getByText(/can't have adhd if you're not hyperactive/i)).toBeInTheDocument()
    expect(screen.getByText(/lazy or undisciplined/i)).toBeInTheDocument()
    expect(screen.getByText(/only boys have adhd/i)).toBeInTheDocument()
    expect(screen.getByText(/cannot focus on anything/i)).toBeInTheDocument()
    expect(screen.getByText(/sugar causes adhd/i)).toBeInTheDocument()
    expect(screen.getByText(/outgrow adhd/i)).toBeInTheDocument()
    expect(screen.getByText(/medications are unsafe or addictive/i)).toBeInTheDocument()
    expect(screen.getByText(/learning disability/i)).toBeInTheDocument()
  })

  // FIX 4: getAllByText(/myth/i)[0] returns the <span class="c-myth__label">
  // whose direct parent is NOT the button — the button is the grandparent.
  // Query the first myth button directly via its class instead.
  test('myth accordion opens and shows fact on click', () => {
    renderCauses()
    const firstMythBtn = document.querySelectorAll('.c-myth__trigger')[0]
    fireEvent.click(firstMythBtn)
    expect(screen.getByText('Fact')).toBeInTheDocument()
    expect(screen.getByText(/neurobiological disorder/i)).toBeInTheDocument()
  })

  // FIX 5: getByRole('button', { name: /myth/i }) finds all 10 myth buttons
  // because every button contains the word "Myth" in its accessible name.
  // Use getAllByRole and pick index [0] to target just the first one.
  test('myth accordion closes on second click', () => {
    renderCauses()
    const firstMythBtn = screen.getAllByRole('button', { name: /myth/i })[0]
    fireEvent.click(firstMythBtn) // open
    fireEvent.click(firstMythBtn) // close
    expect(screen.queryByText('Fact')).toBeNull()
  })

  /* ── Stigma cards ───────────────────────────────────────── */
  test('renders all 4 stigma cards', () => {
    renderCauses()
    expect(screen.getByText('Social Stigma')).toBeInTheDocument()
    expect(screen.getByText('Family Stigma')).toBeInTheDocument()
    expect(screen.getByText('Academic Stigma')).toBeInTheDocument()
    expect(screen.getByText('Self-Stigma')).toBeInTheDocument()
  })

  /* ── CTA ────────────────────────────────────────────────── */
  test('CTA banner links to /treatment', () => {
    renderCauses()
    const link = screen.getByRole('link', { name: /explore treatment/i })
    expect(link).toHaveAttribute('href', '/treatment')
  })
})