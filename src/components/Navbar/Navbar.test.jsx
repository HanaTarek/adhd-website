/**
 * Navbar.test.jsx
 * Tests: brand name, all nav links render, mobile menu toggle,
 * "Take The Quiz" button, active link styling.
 *
 * FIX: The Navbar imports `logo from '/adhdlogo.png'` — a Vite
 * public-folder asset path. Vitest's jsdom environment passes this
 * through Node's module resolver, which receives 'file:///adhdlogo.png'
 * and throws:
 *   TypeError: The argument 'filename' must be a file URL object,
 *   file URL string, or absolute path string. Received 'file:///adhdlogo.png'
 *
 * Solution: mock the asset so Vitest never tries to resolve it as a
 * real file. We use vi.mock with the exact path the component imports.
 * The mock returns a plain string — enough for the <img src> and alt
 * checks to work.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

/*
  Mock the logo asset BEFORE importing Navbar.
  vi.mock is hoisted to the top of the file by Vitest automatically,
  so the import order here is just for readability clarity.
  The path must exactly match what Navbar.jsx imports: '/adhdlogo.png'
*/
vi.mock('/adhdlogo.png', () => ({ default: 'adhdlogo.png' }))

import Navbar from './Navbar.jsx'

const renderNavbar = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  )

describe('Navbar', () => {
  test('renders brand logo and name', () => {
    renderNavbar()
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument()
    expect(screen.getByText(/listen to their minds/i)).toBeInTheDocument()
  })

  test('renders all desktop nav links', () => {
    renderNavbar()
    const links = ['HOME', 'ABOUT', 'SYMPTOMS', 'CAUSES', 'TREATMENT', 'SUPPORT', 'HEALTHY HABITS']
    links.forEach(label => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    })
  })

  test('renders Take The Quiz button', () => {
    renderNavbar()
    expect(screen.getAllByText(/take the quiz/i).length).toBeGreaterThan(0)
  })

  test('mobile menu is hidden by default', () => {
    renderNavbar()
    const mobileMenu = document.querySelector('.nav-mobile-menu')
    expect(mobileMenu).not.toHaveClass('open')
  })

  test('mobile menu opens when hamburger is clicked', () => {
    renderNavbar()
    const hamburger = screen.getByLabelText(/toggle navigation menu/i)
    fireEvent.click(hamburger)
    const mobileMenu = document.querySelector('.nav-mobile-menu')
    expect(mobileMenu).toHaveClass('open')
  })

  test('mobile menu closes when a link is clicked', () => {
    renderNavbar()
    const hamburger = screen.getByLabelText(/toggle navigation menu/i)
    fireEvent.click(hamburger) // open
    const homeLink = screen.getAllByText('HOME')[1] // mobile version
    fireEvent.click(homeLink)
    const mobileMenu = document.querySelector('.nav-mobile-menu')
    expect(mobileMenu).not.toHaveClass('open')
  })

  test('applies navbar--light class on home route', () => {
    renderNavbar('/')
    expect(document.querySelector('.nav')).toHaveClass('navbar--light')
  })

  test('applies navbar--dark class on non-home routes', () => {
    renderNavbar('/about')
    expect(document.querySelector('.nav')).toHaveClass('navbar--dark')
  })
})