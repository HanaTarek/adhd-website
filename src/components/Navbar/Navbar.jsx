/* ================================================================
   Navbar.jsx
   ----------------------------------------------------------------
   📌 PURPOSE:
   The top navigation bar — fixed, floating pill shape.

   📌 FEATURES:
   - Glassmorphism pill: 30% opacity dark + backdrop blur
   - Desktop: logo on the left + "overview / tips / nutrition" on the right
   - Mobile:  text links hide → hamburger appears → click opens dropdown
   - Hamburger click uses React useState to toggle the "open" class

   🎨 STYLES: imported from ./Navbar.css
   📦 USED IN: layouts/MainLayout.jsx
   ================================================================ */

import { useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import './Navbar.css'
import logo from '/adhdlogo.png';

const Navbar = () => {

  /* ── State ───────────────────────────────────────────────────
     menuOpen: controls whether the mobile dropdown is visible.
       false → menu hidden  (default)
       true  → menu visible (user clicked hamburger)
  ─────────────────────────────────────────────────────────── */
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    /*
      .nav → the floating pill container.
      The glass effect comes from variables set in variables.css:
        --color-nav-bg:  rgba(30, 30, 30, 0.30)  ← 30% opacity
        --blur-glass:    blur(14px)
    */
    <nav className={`nav ${isHome ? "navbar--light" : "navbar--dark"}`}>

      {/* ── Logo ──────────────────────────────────────────────
          Three color segments using global utility classes:
            .text-white  → "Listen to "
            .text-blue   → "Their "
            .text-pink   → "Minds"
      ──────────────────────────────────────────────────────── */}
      <div className="logo-logo">
      <img src={logo} alt="Logo" className="logo"></img>
      <Link to={"/"} className="nav-logo">
        
        Listen to Their Minds
      </Link>
      </div>

      {/* ── Right Side: Links + Hamburger ─────────────────────
          .nav-link   → visible on desktop, hidden on mobile (CSS)
          .nav-menu-btn → hidden on desktop, visible on mobile (CSS)
      ──────────────────────────────────────────────────────── */}
      <div className="nav-links">
        <Link to={"/about"}  className="nav-link">ABOUT</Link>
        <Link to={"/symptoms"} className="nav-link">SYMPTOMS</Link>
        <a href="#tips"      className="nav-link">TIPS</a>
        <a href="#nutrition" className="nav-link">NUTRITION</a>

        {/*
          Hamburger button — only shows on mobile.
          onClick: flips menuOpen between true ↔ false.
          aria-label: describes the button for screen readers.
        */}
        <button
          className="nav-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span> {/* line 1 */}
          <span></span> {/* line 2 */}
          <span></span> {/* line 3 */}
        </button>
      </div>

      {/* ── Mobile Dropdown ───────────────────────────────────
          Template literal adds "open" class when menuOpen is true.
          CSS rule: .nav-mobile-menu.open { display: flex }
          Clicking any link also closes the menu.
      ──────────────────────────────────────────────────────── */}
      <div className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/about" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
          ABOUT
        </Link>
        <Link to="/symptoms" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
          SYMPTOMS
        </Link>
      </div>

    </nav>
  )
}

export default Navbar