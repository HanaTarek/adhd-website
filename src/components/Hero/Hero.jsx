//import bg from "../../assets/indoor-children-activities.jpg";
//import bg from "../../assets/f.jpg";
//import bg from "../../assets/sd.jpg";
//import bg from "../../assets/AD.jpg";
      
/* ================================================================
   Hero.jsx
   ----------------------------------------------------------------
   📌 PURPOSE:
   The full-screen landing section — the first thing visitors see.

   📌 STRUCTURE:
     <section .hero>
       <div .hero-bg>          ← background layer (z-index: 0)
         <img .hero-bg-img />  ← your background photo
         <div .hero-overlay /> ← dark tint for readability
       </div>
       <div .hero-content>     ← foreground content (z-index: 1)
         <h1 .hero-heading />  ← main headline
         <div .hero-buttons>   ← CTA buttons wrapper
           <a .btn .btn-primary>Take the quiz</a>
           <a .btn .btn-outline>Learn More</a>
         </div>
       </div>
     </section>

   🖼️ HOW TO ADD YOUR BACKGROUND IMAGE:
     1. Drop your image into the /public folder at the project root
        Example: /public/hero-bg.jpg
     2. Update the src below to match your file name:
        src="/hero-bg.jpg"

   🎨 STYLES: imported from ./Hero.css
   📦 USED IN: pages/Home.jsx
   ================================================================ */

import './Hero.css'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (

    /*
      .hero — full-screen outer container.
      position:relative contains the absolute background children.
    */
    <section className="hero">

      {/* ── Background Layer (sits behind content) ────────────
          z-index:0 — below the foreground .hero-content.
          Contains the image + the dark overlay on top of it.
      ──────────────────────────────────────────────────────── */}
      <div className="hero-bg" >

        

        {/*
          Your background photo.
          ──────────────────────────────────────────────────────
          🖼️ TO CHANGE THE IMAGE:
            1. Add your file to /public  (e.g. /public/family.jpg)
            2. Change src below to:  src="/family.jpg"
            The image will automatically fill and cover the section.
        */}
        <img
          src="/indoor-children-activities.jpg"
          alt="Background"
          className="hero-bg-img"
        />

        {/*
          Dark overlay on top of the image.
          Makes the white text readable against any background.
          Darkness is set by --color-hero-overlay in variables.css
          Default: rgba(0, 0, 0, 0.55)
        */}
        <div className="hero-overlay" />
      </div>

      {/* ── Foreground Content ────────────────────────────────
          position:relative + z-index:1 → floats above the background.
      ──────────────────────────────────────────────────────── */}
      <div className="hero-content">

        {/* ── Main Headline ────────────────────────────────────
            Fluid font size defined by --fs-hero in variables.css.
            Colored keywords use global utility classes:
              .text-blue → "energy"
              .text-pink → "ADHD"
            {' '} adds a space between inline elements.
        ──────────────────────────────────────────────────────── */}
        <h1 className="hero-heading">
          Wondering if it's{' '}
          <span className="text-blue">energy</span> or
          {/* <br /> */}
          <span className="text-pink"> ADHD</span>?
        </h1>
        <p>Every child's brain is unique. Learn about ADHD, recognize the signs early, and discover how to best support your child on their journey.</p>

        {/* ── CTA Buttons ──────────────────────────────────────
            .btn         → base button styles (from global.css)
            .btn-primary → white background + blue text
            .btn-outline → transparent + white border

            Update href="#quiz" to your actual quiz route when ready.
        ──────────────────────────────────────────────────────── */}
        <div className="hero-buttons">
          <Link to="/quiz" className="btn btn-primary">
            Take The Quiz
          </Link>
          <Link to="/about" className="btn btn-outline">Learn More</Link>
        </div>

      </div>
    </section>
  )
}

export default Hero