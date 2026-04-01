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

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Quiz.css'
import {
  QUESTIONS,
  SYMPTOM_OPTIONS,
  PERFORMANCE_OPTIONS,
  scoreQuiz,
} from '../../data/dataQuiz.js'

/* ── Section label map ─────────────────────────────────────────
   Maps each group letter to a human-readable section label.
   Displayed as a colored badge above the question.
─────────────────────────────────────────────────────────────── */
const SECTION_LABELS = {
  A: 'Inattentive Symptoms',
  B: 'Hyperactive / Impulsive Symptoms',
  C: 'Oppositional-Defiant Symptoms',
  D: 'Conduct Disorder Symptoms',
  E: 'Anxiety / Depression Symptoms',
  F: 'Performance & Daily Functioning',
}

const Quiz = () => {

    const location = useLocation();

useEffect(() => {
  if (location.state?.retake) {
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  }
}, [location.state?.retake]);

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
      <div className="quiz-page">
        {/* Page header */}
        <div className="quiz-header-row">
          <h1 className="quiz-title">DOES MY CHILD SHOW SIGNS OF ADHD?</h1>

        </div>

        <div className="quiz-result-card">

          <p className="quiz-result-title">Your Results</p>
          <p className="quiz-result-subtitle">
            Based on your responses to all 26 questions
          </p>

          {/* ── Score summary boxes ── */}
          <div className="quiz-result-scores">
            <div className="quiz-result-score-item">
              <div className="quiz-result-score-number">{result.groupAPositives}/9</div>
              <div className="quiz-result-score-label">Inattentive Positives</div>
            </div>
            <div className="quiz-result-score-item">
              <div className="quiz-result-score-number">{result.groupBPositives}/9</div>
              <div className="quiz-result-score-label">Hyperactive Positives</div>
            </div>
            <div className="quiz-result-score-item">
              <div className="quiz-result-score-number">
                {result.hasPerformanceImpairment ? 'Yes' : 'No'}
              </div>
              <div className="quiz-result-score-label">Performance Impact</div>
            </div>
          </div>

          {/* ── Diagnosis result ── */}
          {result.isCombined && (
            <div className="quiz-result-diagnosis combined">
              <p className="quiz-result-diagnosis-type">
                ADHD — Combined Inattentive & Hyperactive/Impulsive
              </p>
              <p className="quiz-result-diagnosis-desc">
                Responses indicate signs of both inattentive and hyperactive/impulsive
                subtypes, along with some impact on daily functioning. This pattern may
                be consistent with Combined ADHD. Please consult a healthcare professional
                for a full evaluation.
              </p>
            </div>
          )}

          {!result.isCombined && result.isInattentive && (
            <div className="quiz-result-diagnosis inattentive">
              <p className="quiz-result-diagnosis-type">
                Predominantly Inattentive Subtype
              </p>
              <p className="quiz-result-diagnosis-desc">
                Responses indicate signs of inattentive symptoms with impact on daily
                functioning. This pattern may be consistent with the Inattentive subtype
                of ADHD. Please consult a healthcare professional for a full evaluation.
              </p>
            </div>
          )}

          {!result.isCombined && result.isHyperactive && (
            <div className="quiz-result-diagnosis hyperactive">
              <p className="quiz-result-diagnosis-type">
                Predominantly Hyperactive/Impulsive Subtype
              </p>
              <p className="quiz-result-diagnosis-desc">
                Responses indicate signs of hyperactive and impulsive symptoms with impact
                on daily functioning. This pattern may be consistent with the
                Hyperactive/Impulsive subtype of ADHD. Please consult a healthcare
                professional for a full evaluation.
              </p>
            </div>
          )}

          {!result.isInattentive && !result.isHyperactive && (
            <div className="quiz-result-diagnosis none">
              <p className="quiz-result-diagnosis-type">
                No Strong ADHD Pattern Detected
              </p>
              <p className="quiz-result-diagnosis-desc">
                Based on the responses provided, the answers did not meet the threshold
                criteria for an ADHD pattern. However, if you have concerns about your
                child's behavior, please consult a qualified healthcare professional.
              </p>
            </div>
          )}

          {/* Medical disclaimer */}
          <p className="quiz-result-disclaimer">
            ⚠️ This quiz is based on the NICHQ Vanderbilt Assessment Scale and is for
            educational screening purposes only. It does not constitute a medical diagnosis.
            Always consult a qualified healthcare professional for evaluation and diagnosis.
          </p>

          {/* Retake button */}
          <button className="quiz-result-retake" onClick={handleRetake}>
            Retake Quiz
          </button>

        </div>
      </div>
    )
  }

  /* ── QUESTION SCREEN (default) ───────────────────────────────
     Shown for each of the 55 questions.
  ─────────────────────────────────────────────────────────────── */
  return (
    <div className="quiz-page">

      {/* ── Page title + Arabic button ── */}
      <div>
      <div className="quiz-header-row">
        <h1 className="quiz-title">DOES MY CHILD SHOW SIGNS OF ADHD?</h1>
        <Link to="/arabic-quiz" className="quiz-arabic-btn">
        العربيه
        </Link>

        
      </div>



        <p className="quiz-desc">
            When completing this form, please think about your child’s behaviors in the past 6 months.
            <span className='screening-graph'> This is a screening tool — not a diagnosis.</span>
        </p>
        </div>

      {/* ── Quiz card ── */}
      <div className="quiz-card">

        {/* ── Progress bar ──
            Width is set dynamically: (currentIndex / total) * 100 %
        */}
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

<div className='question-counter-category'>
        {/* ── Question counter ── */}
        <p className="quiz-counter">
          Question {currentIndex + 1} of {totalQuestions}
        </p>

        {/* ── Section badge ──
            Shows which group/section the current question belongs to.
            The group letter comes from quizData.js.
            The CSS class (group-A, group-B, ...) controls the color.
        */}
        <span className={`quiz-section-badge group-${currentQuestion.group}`}>
          {SECTION_LABELS[currentQuestion.group]}
        </span>
</div>
        {/* ── Question text ── */}
        <p className="quiz-question">
          {currentQuestion.text}
        </p>

        {/* ── Answer options ──
            Maps over the correct options array (symptom or performance).
            Clicking calls handleSelect(value) to save the answer.
            The "selected" class is added when this option's value
            matches what's stored in answers[currentQuestion.id].
        */}
        <div className="quiz-options">
          {options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.value
            return (
              <button
                key={option.value}
                className={`quiz-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {/* Radio circle */}
                <span className="quiz-option-radio" />
                {/* Option label */}
                <span className="quiz-option-label">{option.label}</span>
              </button>
            )
          })}
        </div>

        {/* ── Navigation: Back + Next/Submit ──
            BACK: disabled on the first question
            NEXT: disabled until an answer is selected
                  changes label to "Submit" on the last question
        */}
        <div className="quiz-nav">
          <button
            className="quiz-btn-back"
            onClick={handleBack}
            disabled={isFirstQuestion}
          >
            Back
          </button>

          <button
            className="quiz-btn-next"
            onClick={handleNext}
            disabled={!hasAnswered} /* must pick an answer before proceeding */
          >
            {isLastQuestion ? 'Submit' : 'NEXT'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Quiz