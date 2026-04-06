/* ================================================================
   Quiz.jsx
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
import { saveQuizResult } from '../../lib/saveQuizResult'

// ✏️ ADDED — the 3 answer options for the new suspect question
// We store short English keys in state and the database
const SUSPECT_OPTIONS = [
  { value: 'yes',         label: 'Yes' },
  { value: 'no',          label: 'No' },
  { value: 'not_thought', label: 'Never gave it enough thought before' },
]


const SECTION_LABELS = {
  A: 'Inattentive Symptoms',
  B: 'Hyperactive / Impulsive Symptoms',
  C: 'Oppositional-Defiant Symptoms',
  D: 'Conduct Disorder Symptoms',
  E: 'Anxiety / Depression Symptoms',
  F: 'Performance & Daily Functioning',
}

/* Ages 1–70 stored as plain numbers so we can render them however we like */
const AGE_OPTIONS = [
  4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
]
// const AGE_OPTIONS = [
//   '4 years old', '5 years old', '6 years old', '7 years old',
//   '8 years old', '9 years old', '10 years old', '11 years old',
//   '12 years old', '13 years old', '14 years old', '15 years old',
//   '16 years old', '17 years old', '18 years old',
// ]

const Quiz = () => {
  const location = useLocation()

  /* ── Stage: 'intake' → 'quiz' → 'results' ─────────────────── */
  const [stage,        setStage]        = useState('intake')

  /* ── Intake form state ─────────────────────────────────────── */
  const [parentName,   setParentName]   = useState('')
  const [childAge,     setChildAge]     = useState(0)       /* stored as string e.g. "7" */
  const [childGender,  setChildGender]  = useState('')
  const [isAnonymous,  setIsAnonymous]  = useState(false)

  /* ── Quiz state ────────────────────────────────────────────── */
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers,      setAnswers]      = useState({})
  const [result,       setResult]       = useState(null)

  const [suspectAdhd,  setSuspectAdhd]  = useState('')

  useEffect(() => {
    if (location.state?.retake) {
      setStage('intake')
      setParentName('')
      setChildAge('')
      setChildGender('')
      setIsAnonymous(false)
      setCurrentIndex(0)
      setAnswers({})
      setResult(null)
    }
  }, [location.state?.retake])

  /* ── Intake validation ─────────────────────────────────────── */
  const intakeValid = childAge !== '' && childGender !== '' && suspectAdhd !== ''

  const handleStartQuiz = () => {
    if (intakeValid) setStage('quiz')
  }

  /* ── Quiz derived values ───────────────────────────────────── */
  const currentQuestion = QUESTIONS[currentIndex]
  const totalQuestions  = QUESTIONS.length
  const isLastQuestion  = currentIndex === totalQuestions - 1
  const isFirstQuestion = currentIndex === 0
  const hasAnswered     = answers[currentQuestion?.id] !== undefined
  const progressPercent = Math.round((currentIndex / totalQuestions) * 100)
  const options         = currentQuestion?.type === 'performance'
    ? PERFORMANCE_OPTIONS : SYMPTOM_OPTIONS

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      const quizResult = scoreQuiz(answers)
      setResult(quizResult)
      setStage('results')

      // ✏️ ADDED — save all data to Supabase
      // language is 'ar' for the Arabic quiz
      saveQuizResult({
        result:      quizResult,
        language:    'ar',
        parentName:  isAnonymous ? '' : parentName,
        childAge:    childAge,
        childGender: childGender,
        suspectAdhd: suspectAdhd,
      })

    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstQuestion) setCurrentIndex(prev => prev - 1)
  }

  const handleRetake = () => {
    setStage('intake')
    setParentName('')
    setChildAge(0)
    setChildGender('')
    setIsAnonymous(false)
    setCurrentIndex(0)
    setAnswers({})
    setResult(null)
    setSuspectAdhd('')
  }

  /* ── Display name helper ───────────────────────────────────── */
  const displayName = isAnonymous || !parentName.trim()
    ? null
    : parentName.trim()

  /* ================================================================
     STAGE 1 — INTAKE SCREEN
  ================================================================ */
  if (stage === 'intake') {
    return (
      <div className="quiz-page">
        <div className="quiz-header-row">
          <h1 className="quiz-title">DOES MY CHILD SHOW SIGNS OF ADHD?</h1>
          <Link to="/arabic-quiz" className="quiz-arabic-btn">العربيه</Link>
        </div>

        <p className="quiz-desc">
          When completing this form, please think about your child's behaviors in the past 6 months.
          <span className="screening-graph"> This is a screening tool — not a diagnosis.</span>
        </p>

        <div className="quiz-card quiz-intake-card">

          {/* Header */}
          <div className="qi-header">
            <span className="qi-step-badge">Step 1 of 2</span>
            <h2 className="qi-title">Before we begin</h2>
            <p className="qi-subtitle">
              A few quick details help put your results in context.
              Nothing here is stored or shared.
            </p>
          </div>

          {/* ── Parent name ──────────────────────────────────── */}
          <div className="qi-field">
            <div className="qi-label-row">
              <label className="qi-label" htmlFor="parentName">
                Your child name
              </label>
              <span className="qi-optional-tag">Optional</span>
            </div>

            <div className="qi-anon-toggle">
              <input
                type="text"
                id="parentName"
                className={`qi-input ${isAnonymous ? 'qi-input--disabled' : ''}`}
                placeholder="e.g. Sarah"
                value={isAnonymous ? '' : parentName}
                onChange={e => setParentName(e.target.value)}
                disabled={isAnonymous}
                maxLength={40}
              />
              <button
                type="button"
                className={`qi-anon-btn ${isAnonymous ? 'qi-anon-btn--active' : ''}`}
                onClick={() => {
                  setIsAnonymous(!isAnonymous)
                  if (!isAnonymous) setParentName('')
                }}
              >
                {isAnonymous ? '🙈 Anonymous' : '👤 Stay anonymous'}
              </button>
            </div>

            {isAnonymous && (
              <p className="qi-anon-note">
                No problem — your results will still be fully personalised.
              </p>
            )}
          </div>

          {/* ── Child age ────────────────────────────────────── */}
          <div className="qi-field">
            <div className="qi-label-row">
              <label className="qi-label" htmlFor="childAge">
                How old is your child?
              </label>
              <span className="qi-required-tag">Required</span>
            </div>
 
            <div className="qi-age-grid">
              {AGE_OPTIONS.map(age => (
                <button
                  key={age}
                  type="button"
                  className={`qi-age-btn ${childAge === age ? 'qi-age-btn--selected' : ''}`}
                  onClick={() => setChildAge(age)}
                >
                  {/* {age.replace(' years old', '')} */}
                  <span className="qi-age-unit">{age} years</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Child gender ─────────────────────────────────── */}
          <div className="qi-field">
            <div className="qi-label-row">
              <label className="qi-label">
                What is your child's gender?
              </label>
              <span className="qi-required-tag">Required</span>
            </div>

            <div className="qi-gender-row">
              {[
                { value: 'boy',  label: 'Boy',  emoji: '🧢' },
                { value: 'girl', label: 'Girl', emoji: '🎀' },
              ].map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  className={`qi-gender-btn ${childGender === value ? 'qi-gender-btn--selected' : ''}`}
                  onClick={() => setChildGender(value)}
                >
                  <span className="qi-gender-emoji">{emoji}</span>
                  <span className="qi-gender-label">{label}</span>
                </button>
              ))}
            </div>
          </div>
                    {/* ✏️ ADDED ── Suspect ADHD question ───────────────── */}
          {/*
            This is the new question we're adding.
            It uses the same visual style as the gender buttons
            (qi-gender-btn) so it looks consistent.
            We map over SUSPECT_OPTIONS defined at the top.
          */}
          <div className="qi-field">
            <div className="qi-label-row">
              {/* Question label */}
              <label className="qi-label">
                Are you suspecting that your child has ADHD?
              </label>
              {/* Required tag — same as gender/age */}
              <span className="qi-required-tag">Required</span>
            </div>

            {/* Three answer buttons — one per option */}
            <div className="qi-suspect-row">
              {SUSPECT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  // Add 'selected' class if this option is the current answer
                  className={`qi-suspect-btn ${suspectAdhd === value ? 'qi-suspect-btn--selected' : ''}`}
                  // When clicked, save this value in state
                  onClick={() => setSuspectAdhd(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Start button ─────────────────────────────────── */}
          <button
            className="qi-start-btn"
            onClick={handleStartQuiz}
            disabled={!intakeValid}
          >
            {intakeValid
              ? `Start the quiz →`
              : 'Please fill in the required fields above'}
          </button>

        </div>
      </div>
    )
  }

  /* ================================================================
     STAGE 3 — RESULTS SCREEN
  ================================================================ */
  if (stage === 'results' && result) {
    return (
      <div className="quiz-page">
        <div className="quiz-header-row">
          <h1 className="quiz-title">DOES MY CHILD SHOW SIGNS OF ADHD?</h1>
        </div>

        <div className="quiz-result-card">

          {displayName && (
            <p className="quiz-result-greeting">Hi {displayName} 👋</p>
          )}

          <p className="quiz-result-title">Your Results</p>
          <p className="quiz-result-subtitle">
            Based on your responses — {childAge} {Number(childAge) === 1 ? 'year old' : 'years old'}
            {childGender === 'boy' ? ', boy' : childGender === 'girl' ? ', girl' : ''}
          </p>

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

          {result.isCombined && (
            <div className="quiz-result-diagnosis combined">
              <p className="quiz-result-diagnosis-type">
                ADHD — Combined Inattentive &amp; Hyperactive/Impulsive
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
              <p className="quiz-result-diagnosis-type">Predominantly Inattentive Subtype</p>
              <p className="quiz-result-diagnosis-desc">
                Responses indicate signs of inattentive symptoms with impact on daily
                functioning. This pattern may be consistent with the Inattentive subtype
                of ADHD. Please consult a healthcare professional for a full evaluation.
              </p>
            </div>
          )}

          {!result.isCombined && result.isHyperactive && (
            <div className="quiz-result-diagnosis hyperactive">
              <p className="quiz-result-diagnosis-type">Predominantly Hyperactive/Impulsive Subtype</p>
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
              <p className="quiz-result-diagnosis-type">No Strong ADHD Pattern Detected</p>
              <p className="quiz-result-diagnosis-desc">
                Based on the responses provided, the answers did not meet the threshold
                criteria for an ADHD pattern. However, if you have concerns about your
                child's behavior, please consult a qualified healthcare professional.
              </p>
            </div>
          )}

          <p className="quiz-result-disclaimer">
            ⚠️ This quiz is based on the NICHQ Vanderbilt Assessment Scale and is for
            educational screening purposes only. It does not constitute a medical diagnosis.
            Always consult a qualified healthcare professional for evaluation and diagnosis.
          </p>

          <button className="quiz-result-retake" onClick={handleRetake}>
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  /* ================================================================
     STAGE 2 — QUESTION SCREEN
  ================================================================ */
  return (
    <div className="quiz-page">
      <div>
        <div className="quiz-header-row">
          <h1 className="quiz-title">DOES MY CHILD SHOW SIGNS OF ADHD?</h1>
          <Link to="/arabic-quiz" className="quiz-arabic-btn">العربيه</Link>
        </div>
        <p className="quiz-desc">
          When completing this form, please think about your child's behaviors in the past 6 months.
          <span className="screening-graph"> This is a screening tool — not a diagnosis.</span>
        </p>
      </div>

      <div className="quiz-card">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="question-counter-category">
          <p className="quiz-counter">Question {currentIndex + 1} of {totalQuestions}</p>
          <span className={`quiz-section-badge group-${currentQuestion.group}`}>
            {SECTION_LABELS[currentQuestion.group]}
          </span>
        </div>

        <p className="quiz-question">{currentQuestion.text}</p>

        <div className="quiz-options">
          {options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.value
            return (
              <button
                key={option.value}
                className={`quiz-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <span className="quiz-option-radio" />
                <span className="quiz-option-label">{option.label}</span>
              </button>
            )
          })}
        </div>

        <div className="quiz-nav">
          <button className="quiz-btn-back" onClick={handleBack} disabled={isFirstQuestion}>
            Back
          </button>
          <button className="quiz-btn-next" onClick={handleNext} disabled={!hasAnswered}>
            {isLastQuestion ? 'Submit' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz