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
import { useLocation } from 'react-router-dom'
import Quiz from '../components/Quiz/Quiz.jsx'

function QuizPage() {
  const location = useLocation();
  const key = new URLSearchParams(location.search).get('r') || 'default';
  return <Quiz key={key} />;
}
export default QuizPage;