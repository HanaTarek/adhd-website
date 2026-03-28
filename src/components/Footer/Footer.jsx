/* ================================================================
   Footer.jsx
   ----------------------------------------------------------------
   📌 PURPOSE:
   The footer section shown at the bottom of every page.
   Rendered automatically by MainLayout.jsx.

   📌 CONTENT:
   - "ADHD Aware" brand name
   - Site tagline
   - Medical disclaimer (required for health content sites)
   - Copyright

   🎨 STYLES: imported from ./Footer.css
   📦 USED IN: layouts/MainLayout.jsx
   ================================================================ */

import './Footer.css'

const Footer = () => {
  return (

    /*
      .footer — the pink background section.
      Background color: --color-footer-bg from variables.css (#f0b8ca).
      To change the footer color → update that variable.
    */
    <footer className="footer">

      {/*
        .footer-inner — constrains content to max-width: 700px
        and centers it horizontally with margin: 0 auto.
      */}
      <div className="footer-inner">

        {/* Brand name — uses Syne display font for visual weight */}
        <p className="footer-brand">Listen To Their Minds</p>

        {/* One-line description of the site */}
        <p className="footer-tagline">
          A resource for families navigating ADHD together.
        </p>

        {/*
          Medical disclaimer.
          Always include this on health/medical information websites.
          It protects visitors and clarifies the site's purpose.
        */}
        <p className="footer-disclaimer">
          This website provides educational information only and does not constitute medical advice.
          <br />
          Always consult a qualified healthcare professional for diagnosis and treatment.
        </p>

        {/* Copyright — update the year as needed */}
        <p className="footer-copy">
          © 2026 Listen to Their Minds. Made with ♥ for families everywhere.
        </p>

      </div>
    </footer>
  )
}

export default Footer