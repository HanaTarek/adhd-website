/* ================================================================
   Home.jsx  (page)
   ----------------------------------------------------------------
   📌 PURPOSE:
   The main landing page — rendered when the user visits "/".

   📌 CURRENT SECTIONS:
   - <Hero /> — full-screen headline, background image, CTA buttons

   📌 HOW TO ADD MORE SECTIONS:
   As you build new components, import them here and stack them
   below <Hero />. They appear on the page in the order written.

   Example — when you're ready to add more:

     import Overview  from '../components/Overview/Overview'
     import Tips      from '../components/Tips/Tips'
     import Nutrition from '../components/Nutrition/Nutrition'

     return (
       <>
         <Hero />
         <Overview />
         <Tips />
         <Nutrition />
       </>
     )

   📦 USED IN: App.jsx → <Route path="/" element={<Home />} />
   ================================================================ */

import Hero from '../components/Hero/Hero'

const Home = () => {
  return (
    <>
      {/* Full-screen landing section */}
      <Hero />

      {/*
        ── FUTURE SECTIONS ──────────────────────────────────────────
        Add more imported components here as you build the site.
        Each one will stack below the previous in page order.

        <Overview />
        <Tips />
        <Nutrition />
        ──────────────────────────────────────────────────────────── */}
    </>
  )
}

export default Home