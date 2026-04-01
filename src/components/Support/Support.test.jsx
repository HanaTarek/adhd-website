/**
 * Support.test.jsx
 * Tests: hero, all 8 accommodation items, strategy accordion open/close,
 * all 6 communication cards, routine cards with images.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Support from './Support.jsx'

const renderSupport = () =>
  render(
    <MemoryRouter>
      <Support />
    </MemoryRouter>
  )

describe('Support page', () => {
  /* ── Hero ─────────────────────────────────────────────── */
  test('renders hero title', () => {
    renderSupport()
    expect(screen.getByText(/They Don't Need to/i)).toBeInTheDocument()
  })

  test('renders hero lead text', () => {
    renderSupport()
    expect(screen.getByText(/children with adhd thrive when/i)).toBeInTheDocument()
  })

  /* ── Accommodations ─────────────────────────────────────── */
  test('renders school accommodations heading', () => {
    renderSupport()
    expect(screen.getByText(/Schools Can Offer/i)).toBeInTheDocument()
  })

  test('renders all 8 accommodation items', () => {
    renderSupport()
    expect(screen.getByText(/extra time on tests/i)).toBeInTheDocument()
    expect(screen.getByText(/instructions tailored/i)).toBeInTheDocument()
    expect(screen.getByText(/immediate feedback/i)).toBeInTheDocument()
    expect(screen.getByText(/technology tools/i)).toBeInTheDocument()
    expect(screen.getByText(/scheduled breaks/i)).toBeInTheDocument()
    expect(screen.getByText(/reduced distractions/i)).toBeInTheDocument()
    expect(screen.getByText(/organisation and planning/i)).toBeInTheDocument()
    expect(screen.getByText(/written copies of verbal/i)).toBeInTheDocument()
  })

  /* ── Teaching strategies accordion ─────────────────────── */
  test('renders 8 strategies heading section', () => {
    renderSupport()
    expect(screen.getByText(/8 strategies that/i)).toBeInTheDocument()
  })

  test('all 8 strategy titles render', () => {
    renderSupport()
    const strategies = [
      'Give Transition Warnings',
      'Give Feedback with Respectful Redirection',
      'Break Directions Into Chunks',
      'Set a Timer',
      'Use Checklists and Schedules',
      'Take Brain Breaks',
      'Use Wait Time',
      'Teach with Empathy',
    ]
    strategies.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument()
    })
  })

  test('strategy accordion opens on click', () => {
    renderSupport()
    const firstStrategy = screen.getByText('Give Transition Warnings').closest('button')
    fireEvent.click(firstStrategy)
    expect(screen.getByText(/transition from one activity to another/i)).toBeInTheDocument()
  })

  test('strategy accordion closes on second click', () => {
    renderSupport()
    const firstStrategy = screen.getByText('Give Transition Warnings').closest('button')
    fireEvent.click(firstStrategy)
    fireEvent.click(firstStrategy)
    expect(screen.queryByText(/adhd can make switching between activities/i)).toBeNull()
  })

  test('multiple strategies can open independently', () => {
    renderSupport()
    fireEvent.click(screen.getByText('Give Transition Warnings').closest('button'))
    fireEvent.click(screen.getByText('Use Wait Time').closest('button'))
    expect(screen.getByText(/make it hard for students/i)).toBeInTheDocument()
    expect(screen.getByText(/Take Brain Breaks/i)).toBeInTheDocument()
  })

  /* ── Communication cards ────────────────────────────────── */
  test('renders communication strategies section', () => {
    renderSupport()
    expect(screen.getByText(/Parent communication/i)).toBeInTheDocument()
  })

  test('renders all 6 communication cards', () => {
    renderSupport()
    expect(screen.getByText('Get Their Attention First')).toBeInTheDocument()
    expect(screen.getByText('Keep Instructions Simple')).toBeInTheDocument()
    expect(screen.getByText('Stay Calm and Flexible')).toBeInTheDocument()
    expect(screen.getByText('Prioritise Positive Reinforcement')).toBeInTheDocument()
    expect(screen.getByText('Focus on Strengths')).toBeInTheDocument()
    expect(screen.getByText('Supportive Discipline')).toBeInTheDocument()
  })

  /* ── Routine cards ──────────────────────────────────────── */
  test('renders three pillars section', () => {
    renderSupport()
    expect(screen.getByText(/three pillars of/i)).toBeInTheDocument()
  })

  test('renders Sleep, Diet, and Exercise routine cards', () => {
    renderSupport()
    expect(screen.getByText('Sleep')).toBeInTheDocument()
    expect(screen.getByText('Balanced Diet')).toBeInTheDocument()
    expect(screen.getByText('Daily Exercise')).toBeInTheDocument()
  })

  /* ── CTA ────────────────────────────────────────────────── */
  test('CTA links to quiz', () => {
    renderSupport()
    const link = screen.getByRole('link', { name: /Explore Healthy Habits/i })
    expect(link).toHaveAttribute('href', '/nutrition')
  })
})