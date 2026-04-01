import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import QuizPage from './pages/QuizPage'
import Arabicquiz from "./components/Quiz/Arabicquiz.jsx";
import About from "./pages/About.jsx";
import SymptomsPage from "./pages/Symptomspage.jsx";
import CausesPage from "./pages/CausesPage.jsx";
import Treatmentpage from "./pages/Treatmentpage.jsx";
import Supportpage from "./pages/Supportpage.jsx";
import Nutritionpage from "./pages/Nutritonpage.jsx";
import ScrollToTop from "./hooks/ScrollToTop.jsx";

export default function App() {
  return (
    <BrowserRouter>
    <MainLayout>
      <ScrollToTop /> 
      <Routes>
          <Route path="/"     element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/arabic-quiz" element={<Arabicquiz/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/symptoms" element={<SymptomsPage/>}/>
          <Route path="/causes" element={<CausesPage/>}/> {/* causes page route */}
          <Route path="/treatment" element={<Treatmentpage/>}/> {/* treatment page route */}
          <Route path="/support" element={<Supportpage/>}/> {/* support page route */}
          <Route path="/nutrition" element={<Nutritionpage/>}/> {/* nutrition page route */}
          <Route path="*"     element={<Home />} /> {/* catch-all route */}

      </Routes>
    </MainLayout>
    </BrowserRouter>
  );
}
