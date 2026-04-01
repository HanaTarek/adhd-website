/**
 * Overview.test.jsx
 * Tests: all section headings render, core symptom cards,
 * brain effects grid, timeline items, CTA banner, links.
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ADHDOverview from './Overview.jsx'

// IntersectionObserver not available in jsdom — mock it
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  }
})

const renderOverview = () =>
  render(
    <MemoryRouter>
      <ADHDOverview />
    </MemoryRouter>
  )

describe('ADHDOverview page', () => {
  test('renders hero title', () => {
    renderOverview()
    expect(screen.getByText(/understanding adhd is the/i)).toBeInTheDocument()
  })

  test('renders hero lead paragraph', () => {
    renderOverview()
    expect(screen.getByText(/most common neurodevelopmental disorders/i)).toBeInTheDocument()
  })

  test('renders What is ADHD section heading', () => {
    renderOverview()
    expect(screen.getByText(/what is/i)).toBeInTheDocument()
  })

  test('renders all 3 core symptom cards', () => {
    renderOverview()
    expect(screen.getByText('Trouble Paying Attention')).toBeInTheDocument()
    expect(screen.getByText('Impulsive Behaviours')).toBeInTheDocument()
    expect(screen.getByText('Overly Active')).toBeInTheDocument()
  })

  test('renders brain effects section heading', () => {
    renderOverview()
    expect(screen.getByText(/what happens in/i)).toBeInTheDocument()
  })

  test('renders all 5 brain effect items', () => {
    renderOverview()
    expect(screen.getByText('Struggle to stay focused')).toBeInTheDocument()
    expect(screen.getByText('Hard to control emotions')).toBeInTheDocument()
    expect(screen.getByText('Gets frustrated easily')).toBeInTheDocument()
    expect(screen.getByText('Acts impulsively')).toBeInTheDocument()
    expect(screen.getByText('Difficulty with social interactions')).toBeInTheDocument()
  })

  test('renders When to notice it section', () => {
    renderOverview()
    expect(screen.getByText(/when should you/i)).toBeInTheDocument()
  })

  test('renders all 3 timeline items', () => {
    renderOverview()
    expect(screen.getByText('Age of Onset')).toBeInTheDocument()
    expect(screen.getByText('Duration')).toBeInTheDocument()
    expect(screen.getByText('Daily Impact')).toBeInTheDocument()
  })

  test('renders CTA banner with Explore Symptoms link', () => {
    renderOverview()
    expect(screen.getByText(/explore symptoms/i)).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /explore symptoms/i })
    expect(link).toHaveAttribute('href', '/symptoms')
  })

  test('renders hero image', () => {
    renderOverview()
    expect(screen.getByAltText(/children playing and learning/i)).toBeInTheDocument()
  })
})