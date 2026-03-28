/* ================================================================
   Quiz.jsx
   ----------------------------------------------------------------
   📌 PURPOSE:
   The interactive ADHD quiz component.
   Goes through all 55 questions one at a time and shows a
   detailed results screen at the end.

   📌 HOW IT WORKS (step by step):
   1. User sees one question at a time (controlled by currentIndex)
   2. They click an answer → it's saved in the `answers` state object
   3. They click NEXT → currentIndex advances to the next question
   4. They click BACK → currentIndex goes to the previous question
   5. On the last question, NEXT becomes SUBMIT
   6. After submit → scoreQuiz() calculates the result
   7. The result screen is shown with the diagnosis

   📌 STATE:
   - currentIndex {number}  → which question is shown (0-based)
   - answers {object}       → { questionId: selectedValue, ... }
   - submitted {boolean}    → true = show results screen
   - result {object|null}   → returned by scoreQuiz()

   🎨 STYLES: imported from ./Quiz.css
   📦 DATA:   imported from ../../data/quizData.js
   📦 USED IN: pages/QuizPage.jsx
   ================================================================ */

import { useState } from 'react'
import './Arabicquiz.css'
import { Link } from 'react-router-dom'
import {
  QUESTIONS,
  SYMPTOM_OPTIONS,
  PERFORMANCE_OPTIONS,
  scoreQuiz,
} from '../../data/ArabicDataQuiz.js'

/* ── Section label map ─────────────────────────────────────────
   Maps each group letter to a human-readable section label.
   Displayed as a colored badge above the question.
─────────────────────────────────────────────────────────────── */
const SECTION_LABELS = {
  A: 'تشتت الانتباه',
  B: 'فرط الحركة والاندفاعية',
  F: 'الأداء والوظائف اليومية',
}

const Arabicquiz = () => {

  /* ── State ───────────────────────────────────────────────────
     currentIndex: which question we're on (0 = first question)
     answers:      stores the user's selected value per question
                   Format: { 1: 2, 2: 0, 3: 3, ... }
                   Key = question ID, Value = selected score
     submitted:    becomes true when user hits Submit on last question
     result:       the object returned by scoreQuiz() after submission
  ─────────────────────────────────────────────────────────────── */
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers]           = useState({})
  const [submitted, setSubmitted]       = useState(false)
  const [result, setResult]             = useState(null)

  /* ── Derived values ──────────────────────────────────────────
     These are calculated from state — no need to store separately.
  ─────────────────────────────────────────────────────────────── */
  const currentQuestion  = QUESTIONS[currentIndex]           /* current question object */
  const totalQuestions   = QUESTIONS.length                  /* 55 */
  const isLastQuestion   = currentIndex === totalQuestions - 1
  const isFirstQuestion  = currentIndex === 0
  const hasAnswered      = answers[currentQuestion.id] !== undefined /* has user picked an option? */
  const progressPercent  = Math.round(((currentIndex) / totalQuestions) * 100)

  /* ── Which answer options to show ────────────────────────────
     Symptom questions  → Never / Occasionally / Often / Very Often
     Performance questions → Excellent / Above Average / Average / ...
  ─────────────────────────────────────────────────────────────── */
  const options = currentQuestion.type === 'performance'
    ? PERFORMANCE_OPTIONS
    : SYMPTOM_OPTIONS

  /* ── Handler: user selects an answer ─────────────────────────
     Saves { questionId: selectedValue } into the answers object.
     Using spread (...prev) keeps all previous answers intact.
  ─────────────────────────────────────────────────────────────── */
  const handleSelect = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  /* ── Handler: NEXT button ────────────────────────────────────
     If on last question → score the quiz and show results.
     Otherwise → advance to the next question.
  ─────────────────────────────────────────────────────────────── */
  const handleNext = () => {
    if (isLastQuestion) {
      /* Calculate results using the scoring function from quizData.js */
      const quizResult = scoreQuiz(answers)
      setResult(quizResult)
      setSubmitted(true)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  /* ── Handler: BACK button ────────────────────────────────────
     Goes to the previous question.
     The first question has BACK disabled so this never runs at 0.
  ─────────────────────────────────────────────────────────────── */
  const handleBack = () => {
    if (!isFirstQuestion) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  /* ── Handler: Retake quiz ─────────────────────────────────────
     Resets ALL state back to defaults — quiz starts fresh.
  ─────────────────────────────────────────────────────────────── */
  const handleRetake = () => {
    setCurrentIndex(0)
    setAnswers({})
    setSubmitted(false)
    setResult(null)
  }

  /* ── RESULTS SCREEN ──────────────────────────────────────────
     Shown when submitted === true.
     Displays the diagnosis type and score breakdown.
  ─────────────────────────────────────────────────────────────── */
  if (submitted && result) {
    return (
      <div className="aquiz-page">
        {/* Page header */}
        <div className="aquiz-header-row">
          <h1 className="aquiz-title">هل تظهر على طفلي علامات اضطراب فرط الحركة ونقص الانتباه؟</h1>

        </div>

        <div className="aquiz-result-card">

          <p className="aquiz-result-title">نتيجه الامتحان</p>
          <p className="aquiz-result-subtitle">
            بناءً على إجاباتك على جميع الأسئلة الـ 26
          </p>

          {/* ── Score summary boxes ── */}
          <div className="aquiz-result-scores">
            <div className="aquiz-result-score-item">
              <div className="aquiz-result-score-number">{result.groupAPositives}/9</div>
              <div className="aquiz-result-score-label">نتائج إيجابية بسبب تشتت الانتباه</div>
            </div>
            <div className="aquiz-result-score-item">
              <div className="aquiz-result-score-number">{result.groupBPositives}/9</div>
              <div className="aquiz-result-score-label">نتائج إيجابية بسبب فرط الحركه و الاندفاعيه</div>
            </div>
            <div className="aquiz-result-score-item">
              <div className="aquiz-result-score-number">
                {result.hasPerformanceImpairment ? 'نعم' : 'لا'}
              </div>
              <div className="aquiz-result-score-label">تأثير الأداء</div>
            </div>
          </div>

          {/* ── Diagnosis result ── */}
          {result.isCombined && (
            <div className="aquiz-result-diagnosis combined">
              <p className="aquiz-result-diagnosis-type">
                اضطراب نقص الانتباه وفرط النشاط - هو حالة نمو عصبي تشمل مزيجاً من أعراض قلة الانتباه، فرط النشاط، والاندفاع معاً. 
              </p>
              <p className="aquiz-result-diagnosis-desc">
                    تشير الإجابات إلى وجود علامات لكل من نوع تشتت الانتباه ونوع فرط الحركة/الاندفاعية، مع 
                    وجود بعض التأثير على الأداء اليومي. قد يكون هذا النمط متوافقًا مع اضطراب فرط الحركة
                    وتشتت الانتباه من النوع المشترك. يرجى استشارة مختص في الرعاية الصحية لإجراء تقييم 
                    كامل
              </p>
            </div>
          )}

          {!result.isCombined && result.isInattentive && (
            <div className="aquiz-result-diagnosis inattentive">
              <p className="aquiz-result-diagnosis-type">
                النوع الذي يغلب عليه تشتت الانتباه
              </p>
              <p className="aquiz-result-diagnosis-desc">
            تشير الإجابات إلى وجود علامات لأعراض تشتت الانتباه مع تأثير على الأداء اليومي. قد يكون
            هذا النمط متوافقًا مع النوع الذي يغلب عليه تشتت الانتباه من اضطراب فرط الحركة وتشتت
            الانتباه. يرجى استشارة مختص في الرعاية الصحية لإجراء تقييم كامل
              </p>
            </div>
          )}

          {!result.isCombined && result.isHyperactive && (
            <div className="aquiz-result-diagnosis hyperactive">
              <p className="aquiz-result-diagnosis-type">
                النوع الذي يغلب عليه فرط الحركة والاندفاعية
              </p>
              <p className="aquiz-result-diagnosis-desc">
                    تشير الإجابات إلى وجود علامات لأعراض فرط الحركة والاندفاعية مع تأثير على الأداء
                    اليومي. قد يكون هذا النمط متوافقًا مع النوع الذي يغلب عليه فرط الحركة والاندفاعية
                    من اضطراب فرط الحركة وتشتت الانتباه. يرجى استشارة مختص في الرعاية الصحية 
                    لإجراء تقييم كامل

              </p>
            </div>
          )}

          {!result.isInattentive && !result.isHyperactive && (
            <div className="aquiz-result-diagnosis none">
              <p className="aquiz-result-diagnosis-type">
                لم يتم اكتشاف نمط قوي لاضطراب فرط الحركة وتشتت الانتباه
              </p>
              <p className="aquiz-result-diagnosis-desc">
                    بناءً على الإجابات المقدمة، لم تصل النتائج إلى الحد المطلوب الذي يشير إلى نمط 
                    لاضطراب فرط الحركة وتشتت الانتباه. ومع ذلك، إذا كانت لديك مخاوف بشأن سلوك 
                    طفلك، يُرجى استشارة مختص مؤهل في الرعاية الصحية
              </p>
            </div>
          )}

          {/* Medical disclaimer */}
          <p className="aquiz-result-disclaimer">
                    هذا الاختبار يعتمد على مقياس تقييم نيشق فاندر بيلت وهو لأغراض الفحص ⚠️
                    التعليمي فقط. لا يُعد تشخيصًا طبيًا. يُرجى دائمًا استشارة متخصص صحي مؤهل 
                    للتقييم والتشخيص         
</p>

          {/* Retake button */}
          <button className="aquiz-result-retake" onClick={handleRetake}>
            إعادة الاختبار
          </button>

        </div>
      </div>
    )
  }

  /* ── QUESTION SCREEN (default) ───────────────────────────────
     Shown for each of the 55 questions.
  ─────────────────────────────────────────────────────────────── */
  return (
    <div className="aquiz-page">

      {/* ── Page title + Arabic button ── */}
      <div>
      <div className="aquiz-header-row">
     <h1 className="aquiz-title">هل تظهر على طفلي علامات اضطراب فرط الحركة ونقص الانتباه؟</h1>

        <Link to="/quiz" className="aquiz-arabic-btn">
        English
        </Link>
        
      </div>



        <p className="aquiz-desc">
             عند إكمال هذا النموذج، يُرجى التفكير في سلوكيات طفلك خلال الأشهر الستة الماضية
            <span className='ascreening-graph'><br/> هذه أداة فحص فقط — وليست تشخيصًا<br/></span>
        </p>
        </div>

      {/* ── Quiz card ── */}
      <div className="aquiz-card">

        {/* ── Progress bar ──
            Width is set dynamically: (currentIndex / total) * 100 %
        */}
        <div className="aquiz-progress-bar">
          <div
            className="aquiz-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

<div className='aquestion-counter-category'>
        {/* ── Question counter ── */}
        <p className="aquiz-counter">
          السؤال {currentIndex + 1} من {totalQuestions}
        </p>

        {/* ── Section badge ──
            Shows which group/section the current question belongs to.
            The group letter comes from quizData.js.
            The CSS class (group-A, group-B, ...) controls the color.
        */}
        <span className={`aquiz-section-badge group-${currentQuestion.group}`}>
          {SECTION_LABELS[currentQuestion.group]}
        </span>
</div>
        {/* ── Question text ── */}
        <p className="aquiz-question">
          {currentQuestion.text}
        </p>

        {/* ── Answer options ──
            Maps over the correct options array (symptom or performance).
            Clicking calls handleSelect(value) to save the answer.
            The "selected" class is added when this option's value
            matches what's stored in answers[currentQuestion.id].
        */}
        <div className="aquiz-options">
          {options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.value
            return (
              <button
                key={option.value}
                className={`aquiz-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {/* Radio circle */}
                <span className="aquiz-option-radio" />
                {/* Option label */}
                <span className="aquiz-option-label">{option.label}</span>
              </button>
            )
          })}
        </div>

        {/* ── Navigation: Back + Next/Submit ──
            BACK: disabled on the first question
            NEXT: disabled until an answer is selected
                  changes label to "Submit" on the last question
        */}
        <div className="aquiz-nav">
          <button
            className="aquiz-btn-back"
            onClick={handleBack}
            disabled={isFirstQuestion}
          >
            رجوع
          </button>

          <button
            className="aquiz-btn-next"
            onClick={handleNext}
            disabled={!hasAnswered} /* must pick an answer before proceeding */
          >
            {isLastQuestion ? 'ارسال' : 'التالي'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Arabicquiz