/**
 * Footer.test.jsx
 * Tests: brand name, tagline, medical disclaimer, copyright text.
 */

import { render, screen } from '@testing-library/react'
import Footer from './Footer.jsx'

describe('Footer', () => {
  test('renders brand name', () => {
    render(<Footer />)
    expect(screen.getByText(/Listen To Their Minds/i , { selector: '.footer-brand' })).toBeInTheDocument()
  })

  test('renders site tagline', () => {
    render(<Footer />)
    expect(screen.getByText(/a resource for families navigating adhd/i)).toBeInTheDocument()
  })

  test('renders medical disclaimer', () => {
    render(<Footer />)
    expect(screen.getByText(/educational information only/i)).toBeInTheDocument()
    expect(screen.getByText(/always consult a qualified healthcare professional/i)).toBeInTheDocument()
  })

  test('renders copyright notice with current year', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 listen to their minds/i)).toBeInTheDocument()
  })

  test('renders footer element', () => {
    render(<Footer />)
    expect(document.querySelector('footer.footer')).toBeInTheDocument()
  })
})