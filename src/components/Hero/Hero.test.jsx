/**
 * Hero.test.jsx
 * Tests: headline renders, CTA buttons present and link correctly,
 * background image renders.
 */

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from './Hero.jsx'

const renderHero = () =>
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  )

describe('Hero', () => {
  test('renders the main headline', () => {
    renderHero()
    expect(screen.getByText(/wondering if it's/i)).toBeInTheDocument()
  })

  test('renders "energy" and "ADHD" keywords', () => {
    renderHero()
    expect(screen.getByText('energy')).toBeInTheDocument()
    expect(screen.getByText('ADHD')).toBeInTheDocument()
  })

  test('renders the subheading paragraph', () => {
    renderHero()
    expect(screen.getByText(/every child's brain is unique/i)).toBeInTheDocument()
  })

  test('renders Take The Quiz button linking to /quiz', () => {
    renderHero()
    const quizLink = screen.getByRole('link', { name: /take the quiz/i })
    expect(quizLink).toHaveAttribute('href', '/quiz')
  })

  test('renders Learn More button linking to /about', () => {
    renderHero()
    const learnMore = screen.getByRole('link', { name: /learn more/i })
    expect(learnMore).toHaveAttribute('href', '/about')
  })

  test('renders background image', () => {
    renderHero()
    const img = screen.getByAltText(/background/i)
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/indoor-children-activities.jpg')
  })
})