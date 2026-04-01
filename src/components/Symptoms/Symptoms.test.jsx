/**
 * Symptoms.test.jsx
 * Tests: hero, sign cards, type cards, when-to-seek cards, CTA link.
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Symptoms from './Symptoms.jsx'

const renderSymptoms = () =>
  render(
    <MemoryRouter>
      <Symptoms />
    </MemoryRouter>
  )

describe('Symptoms page', () => {
  test('renders hero heading', () => {
    renderSymptoms()
    expect(screen.getByText(/Understanding What/i)).toBeInTheDocument()
  })

  test('renders hero subtitle quote', () => {
    renderSymptoms()
    expect(screen.getByText(/behind every repeated struggle/i)).toBeInTheDocument()
  })

  test('renders Signs & Symptoms section label', () => {
    renderSymptoms()
    expect(screen.getByText(/signs & symptoms/i)).toBeInTheDocument()
  })

  test('renders all 3 sign cards', () => {
    renderSymptoms()
    expect(screen.getByText('Easily Distracted')).toBeInTheDocument()
    expect(screen.getByText('Impulsive Actions')).toBeInTheDocument()
    expect(screen.getByText('Constant Movement')).toBeInTheDocument()
  })

  test('renders Presentations section', () => {
    renderSymptoms()
    expect(screen.getByText(/How ADHD looks/i)).toBeInTheDocument()
  })

  test('renders all 3 ADHD type cards', () => {
    renderSymptoms()
    expect(screen.getByText('Predominantly Inattentive')).toBeInTheDocument()
    expect(screen.getByText('Hyperactive-Impulsive')).toBeInTheDocument()
    expect(screen.getByText('Combined Presentation')).toBeInTheDocument()
  })

  test('renders Professional Guidance section', () => {
    renderSymptoms()
    expect(screen.getByText(/professional guidance/i)).toBeInTheDocument()
    expect(screen.getByText(/when to seek/i)).toBeInTheDocument()
  })

  test('renders all 4 when-to-seek cards', () => {
    renderSymptoms()
    expect(screen.getByText("Patterns That Don’t Fade")).toBeInTheDocument()
    expect(screen.getByText('More Than One Setting')).toBeInTheDocument()
    expect(screen.getByText('Daily Life Is Affected')).toBeInTheDocument()
    expect(screen.getByText('Emotional Concerns Too')).toBeInTheDocument()
  })

  test('renders CTA banner with correct quiz link', () => {
    renderSymptoms()
    const link = screen.getByRole('link', { name: /take the quiz/i })
    expect(link).toHaveAttribute('href', '/quiz')
  })

  test('renders both section images', () => {
    renderSymptoms()
    expect(screen.getByAltText(/adhd symptoms/i)).toBeInTheDocument()
    expect(screen.getByAltText(/adhd types/i)).toBeInTheDocument()
  })
})