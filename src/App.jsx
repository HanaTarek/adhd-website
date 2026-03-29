import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import QuizPage from './pages/QuizPage'
import Arabicquiz from "./components/Quiz/Arabicquiz.jsx";
import About from "./pages/About.jsx";
import SymptomsPage from "./pages/Symptomspage.jsx";

export default function App() {
  return (
    <BrowserRouter>
    <MainLayout>
      <Routes>
          <Route path="/"     element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/arabic-quiz" element={<Arabicquiz/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/symptoms" element={<SymptomsPage/>}/>
          <Route path="*"     element={<Home />} /> {/* catch-all route */}
      </Routes>
    </MainLayout>
    </BrowserRouter>
  );
}
