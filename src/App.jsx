import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import QuizPage from './pages/QuizPage'
import Arabicquiz from "./components/Quiz/Arabicquiz.jsx";

export default function App() {
  return (
    <BrowserRouter>
    <MainLayout>
      <Routes>
          <Route path="/"     element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/arabic-quiz" element={<Arabicquiz/>}/>

      </Routes>
    </MainLayout>
    </BrowserRouter>
  );
}
