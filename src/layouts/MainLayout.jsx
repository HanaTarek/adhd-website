/* ================================================================
   MainLayout.jsx
   ----------------------------------------------------------------
   📌 PURPOSE:
   The shared page wrapper used by EVERY page in the app.
   Automatically adds the Navbar at the top and Footer at the bottom
   so individual pages only define their own unique content.

   📌 HOW IT WORKS:
   App.jsx wraps all <Routes> inside <MainLayout>.
   The current page component is passed as {children} and rendered
   inside the <main> element between Navbar and Footer.

   📐 RENDERED STRUCTURE:
     <div class="layout">         ← full-height flex column
       <Navbar />                 ← fixed pill at top of screen
       <main class="main">        ← page content area
         {children}               ← e.g. <Home />, <About />, <Tips />
       </main>
       <Footer />                 ← pink section at the bottom
     </div>

   ✅ TO ADD A NEW PAGE:
   Just create a page in /pages — you get Navbar + Footer for free.
   You don't need to import or use MainLayout in the page itself.

   🎨 STYLES: .layout and .main are defined in global.css
   ================================================================ */

import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

const MainLayout = ({ children }) => {
  return (

    /*
      .layout — a flex column that fills min-height: 100vh.
      This ensures the footer is always pushed to the bottom,
      even on pages that don't have much content.
    */
    <div className="layout">

      {/* Fixed floating pill — stays visible while scrolling */}
      <Navbar />

      {/*
        .main — the content area between Navbar and Footer.
        flex: 1 → stretches to fill all available vertical space,
        which keeps the footer pinned to the bottom of short pages.

        {children} = whichever page component React Router matched.
        Example: visiting "/" renders <Home /> here.
      */}
      <main className="main">
        {children}
      </main>

      {/* Pink footer — always at the bottom of every page */}
      <Footer />

    </div>
  )
}

export default MainLayout