/* ================================================================
   QuizPage.jsx  (page)
   ----------------------------------------------------------------
   📌 PURPOSE:
   The page wrapper for the quiz.
   Rendered by React Router when user visits "/quiz".

   📌 WHY THIS FILE EXISTS:
   Keeping the page and the component separate is a best practice.
   - QuizPage.jsx = handles routing, meta info, page-level concerns
   - Quiz.jsx     = handles all the quiz logic and UI

   This means if you want to add a page title, loading state,
   or analytics tracking when the quiz page loads, you do it here
   without touching the Quiz component itself.

   📦 USED IN: App.jsx → <Route path="/quiz" element={<QuizPage />} />
   ================================================================ */

import Quiz from '../components/Quiz/Quiz'

const QuizPage = () => {
  return (
    /*
      Quiz component handles everything:
      - question rendering
      - progress bar
      - answer collection
      - scoring
      - results display
    */
    <Quiz />
  )
}

export default QuizPage