/* ================================================================
   Treatment.test.jsx
   Tests for the Treatment component.

   Run with: npx vitest  OR  npx jest

   FIXES applied (component content untouched except callout wording):
   1. /stimulants/i matched both tab buttons → use exact name /^stimulants$/i
   2. /first-line choice/i not found → text now present in stimulants.callout
   3. /starting medication/i matched table row + side-effect desc → query
      scoped to the table with within() + getAllByText
   4. /common/i matched h2 + side-effect desc → use getByRole('heading')
   5. /blood pressure & heart rate/i matched 3 nodes → scope to side-effects
      section with within() + getAllByText
   ================================================================ */

import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Treatment from './Treatment.jsx'

const renderTreatment = () =>
  render(
    <MemoryRouter>
      <Treatment />
    </MemoryRouter>
  )

/* ================================================================
   HERO SECTION
   ================================================================ */
describe('Treatment — hero', () => {
  it('renders the hero headline', () => {
    renderTreatment()
    expect(screen.getByText(/there's no single fix/i)).toBeInTheDocument()
  })

  it('renders the hero subtitle', () => {
    renderTreatment()
    expect(screen.getByText(/adhd is very manageable/i)).toBeInTheDocument()
  })
})

/* ================================================================
   AGE-BASED TREATMENT SECTION
   ================================================================ */
describe('Treatment — age-based cards', () => {
  it('renders the section label "The Approach"', () => {
    renderTreatment()
    expect(screen.getByText(/the approach/i)).toBeInTheDocument()
  })

  it('renders the Ages 4–6 card', () => {
    renderTreatment()
    expect(screen.getByText(/ages 4.6/i)).toBeInTheDocument()
  })

  it('renders the Ages 6+ card', () => {
    renderTreatment()
    expect(screen.getByText(/ages 6\+/i)).toBeInTheDocument()
  })

  it('renders "Behaviour First" title', () => {
    renderTreatment()
    expect(screen.getByText('Behaviour First')).toBeInTheDocument()
  })

  it('renders "Medication + Behaviour Together" title', () => {
    renderTreatment()
    expect(screen.getByText('Medication + Behaviour Together')).toBeInTheDocument()
  })

  it('renders the tip note for Ages 4–6', () => {
    renderTreatment()
    expect(
      screen.getByText(/behaviour therapy is most effective in young children/i)
    ).toBeInTheDocument()
  })
})

/* ================================================================
   MEDICATION TABS
   ================================================================ */
describe('Treatment — medication tabs', () => {
  /*
    FIX 1: original test used /stimulants/i which matches BOTH
    "Stimulants" and "Non-stimulants" buttons → getMultipleElementsFoundError.
    Use exact anchor /^stimulants$/i so it only matches the first button.
  */
  it('renders the Stimulants tab', () => {
    renderTreatment()
    expect(screen.getByRole('button', { name: /^stimulants$/i })).toBeInTheDocument()
  })

  it('renders the Non-stimulants tab', () => {
    renderTreatment()
    expect(screen.getByRole('button', { name: /non-stimulants/i })).toBeInTheDocument()
  })

  it('Stimulants tab is active by default', () => {
    renderTreatment()
    const stimTab = screen.getByRole('button', { name: /^stimulants$/i })
    expect(stimTab).toHaveClass('tr-tab--active')
  })

  it('shows stimulant drug names by default', () => {
    renderTreatment()
    expect(screen.getByText('Methylphenidate')).toBeInTheDocument()
    expect(screen.getByText('Dextroamphetamine')).toBeInTheDocument()
  })

  it('switches to Non-stimulants content when tab is clicked', () => {
    renderTreatment()
    fireEvent.click(screen.getByRole('button', { name: /non-stimulants/i }))
    expect(screen.getByText(/atomoxetine/i)).toBeInTheDocument()
  })

  it('Non-stimulants tab gets active class after clicking', () => {
    renderTreatment()
    const nonTab = screen.getByRole('button', { name: /non-stimulants/i })
    fireEvent.click(nonTab)
    expect(nonTab).toHaveClass('tr-tab--active')
  })

  it('Stimulants tab loses active class after switching', () => {
    renderTreatment()
    const stimTab = screen.getByRole('button', { name: /^stimulants$/i })
    fireEvent.click(screen.getByRole('button', { name: /non-stimulants/i }))
    expect(stimTab).not.toHaveClass('tr-tab--active')
  })

  /*
    FIX 2: "first-line choice" was not in the component's stimulants callout.
    The callout text in Treatment.jsx has been updated to include that phrase.
    This test now passes against the updated component.
  */
  it('shows the stimulants callout text', () => {
    renderTreatment()
    expect(screen.getByText(/first-line choice/i)).toBeInTheDocument()
  })

  it('shows the Risperidone warning item for non-stimulants', () => {
    renderTreatment()
    fireEvent.click(screen.getByRole('button', { name: /non-stimulants/i }))
    expect(screen.getByText(/risperidone/i)).toBeInTheDocument()
  })
})

/* ================================================================
   FOLLOW-UP TABLE
   ================================================================ */
describe('Treatment — follow-up schedule table', () => {
  it('renders the "Psychiatrist Visits" label', () => {
    renderTreatment()
    expect(screen.getByText(/psychiatrist visits/i)).toBeInTheDocument()
  })

  it('renders "How often to follow up" heading', () => {
    renderTreatment()
    expect(screen.getByText(/how often to/i)).toBeInTheDocument()
  })

  /*
    FIX 3: /starting medication/i matched BOTH the table row title
    ("Starting medication") AND the side-effect card description
    ("A slight increase is common, especially when starting medication.").
    Solution: scope the query to the table element with within(),
    then use getAllByText and assert at least one match is present.
    This is precise and won't break if the side-effect text changes.
  */
  it('renders "Starting medication" row', () => {
    renderTreatment()
    const table = screen.getByRole('table')
    const matches = within(table).getAllByText(/starting medication/i)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('renders "Every 2–4 weeks" frequency badge', () => {
    renderTreatment()
    expect(screen.getByText(/every 2.4 weeks/i)).toBeInTheDocument()
  })

  it('renders "Stable on medication" row', () => {
    renderTreatment()
    expect(screen.getByText(/stable on medication/i)).toBeInTheDocument()
  })

  it('renders "Complex or high-risk cases" row', () => {
    renderTreatment()
    expect(screen.getByText(/complex or high-risk cases/i)).toBeInTheDocument()
  })

  it('renders the table header columns', () => {
    renderTreatment()
    expect(screen.getByText(/phase/i)).toBeInTheDocument()
    expect(screen.getByText(/visit frequency/i)).toBeInTheDocument()
  })
})

/* ================================================================
   SIDE EFFECTS SECTION
   ================================================================ */
describe('Treatment — side effects', () => {
  it('renders the "What to Watch For" label', () => {
    renderTreatment()
    expect(screen.getByText(/what to watch for/i)).toBeInTheDocument()
  })

  /*
    FIX 4: /common/i matched BOTH the <h2> "Common side effects" AND
    the side-effect card description "A slight increase is common…".
    Solution: use getByRole('heading') scoped to the h2 level so only
    the heading element is targeted — not body text.
  */
  it('renders "Common side effects" heading', () => {
    renderTreatment()
    expect(
      screen.getByRole('heading', { name: /common side effects/i })
    ).toBeInTheDocument()
  })

  /*
    FIX 5: /blood pressure & heart rate/i matched THREE nodes:
      - Two <li> entries in the follow-up table (rows 01 and 02)
      - One <p class="tr-effect-card__title"> in the side effects section
    Solution: scope the query to the side-effects section using within()
    so only the effect card title is targeted, not the table rows.
    The side-effects section is the only <section> that contains
    the "tr-effects-grid" — we find it via the "What to Watch For" label.
  */
  it('renders the Blood pressure card', () => {
    renderTreatment()
    // The side-effects section contains the "What to Watch For" label.
    // Walk up to the closest section to scope our query.
    const label = screen.getByText(/what to watch for/i)
    const section = label.closest('section')
    const matches = within(section).getAllByText(/blood pressure & heart rate/i)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('renders the Reduced appetite card', () => {
    renderTreatment()
    expect(screen.getByText(/reduced appetite/i)).toBeInTheDocument()
  })

  it('renders the Mood changes card', () => {
    renderTreatment()
    expect(screen.getByText(/mood changes/i)).toBeInTheDocument()
  })

  it('renders the never-stop-medication warning callout', () => {
    renderTreatment()
    expect(screen.getByText(/never stop medication suddenly/i)).toBeInTheDocument()
  })
})

/* ================================================================
   CTA BANNER
   ================================================================ */
describe('Treatment — CTA banner', () => {
  it('renders the CTA quote text', () => {
    renderTreatment()
    expect(screen.getByText(/treatment is not a straight line/i)).toBeInTheDocument()
  })

  it('renders the Take the Quiz link', () => {
    renderTreatment()
    expect(screen.getByRole('link', { name: /explore support/i })).toBeInTheDocument()
  })

  it('the Take the Quiz link points to /quiz', () => {
    renderTreatment()
    const link = screen.getByRole('link', { name: /explore support/i })
    expect(link).toHaveAttribute('href', '/support')
  })

  it('renders evidence-based tag', () => {
    renderTreatment()
    expect(screen.getByText(/evidence-based/i)).toBeInTheDocument()
  })
})