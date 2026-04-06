/* ================================================================
   Arabicquiz.jsx
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

import { saveQuizResult } from '../../lib/saveQuizResult'

const SECTION_LABELS = {
  A: 'تشتت الانتباه',
  B: 'فرط الحركة والاندفاعية',
  F: 'الأداء والوظائف اليومية',
}

/* Ages 1–70 */
const Arabic_AGE_OPTIONS = [
  '٤ سنوات', '٥ سنوات', '٦ سنوات', '٧ سنوات',
  '٨ سنوات', '٩ سنوات', '١٠ سنوات', '١١ سنة',
  '١٢ سنة', '١٣ سنة', '١٤ سنة', '١٥ سنة',
  '١٦ سنة', '١٧ سنة', '١٨ سنة',
];

/*
  Arabic ordinal suffix helper — returns the correct Arabic suffix
  for an age number (used in the results subtitle).
  For simplicity we use "عاماً" (year/years) for all.
*/
const ageLabel = (n) => `${n} ${n === 1 ? 'عام' : 'عاماً'}`

const ARABIC_SUSPECT_OPTIONS = [
  { value: 'yes',         label: 'نعم' },
  { value: 'no',          label: 'لا' },
  { value: 'not_thought', label: 'لم أفكر في الأمر بجدية من قبل' },
]

const Arabicquiz = () => {

  /* ── Stage: 'intake' → 'quiz' → 'results' ─────────────────── */
  const [stage,        setStage]        = useState('intake')

  /* ── Intake form state ─────────────────────────────────────── */
  const [parentName,   setParentName]   = useState('')
  const [childAge,     setChildAge]     = useState('')
  const [childGender,  setChildGender]  = useState('')
  const [isAnonymous,  setIsAnonymous]  = useState(false)

  /* ── Quiz state ────────────────────────────────────────────── */
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers,      setAnswers]      = useState({})
  const [result,       setResult]       = useState(null)

  const [suspectAdhd,  setSuspectAdhd]  = useState('')
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
      setResult(scoreQuiz(answers))
      setStage('results')

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
    setChildAge('')
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
     STAGE 1 — INTAKE SCREEN (Arabic)
  ================================================================ */
  if (stage === 'intake') {
    return (
      <div className="aquiz-page">
        <div className="aquiz-header-row">
          <h1 className="aquiz-title">
            هل تظهر على طفلي علامات اضطراب فرط الحركة ونقص الانتباه؟
          </h1>
          <Link to="/quiz" className="aquiz-arabic-btn">English</Link>
        </div>

        <p className="aquiz-desc">
          عند إكمال هذا النموذج، يُرجى التفكير في سلوكيات طفلك خلال الأشهر الستة الماضية.
          <span className="ascreening-graph"> هذه أداة فحص فقط — وليست تشخيصًا.</span>
        </p>

        <div className="aquiz-card aquiz-intake-card">

          {/* Header */}
          <div className="aqi-header">
            <span className="aqi-step-badge">الخطوة ١ من ٢</span>
            <h2 className="aqi-title">قبل أن نبدأ</h2>
            <p className="aqi-subtitle">
              بعض التفاصيل السريعة تساعد على تفسير نتائجك بشكل أفضل.
              لا يتم تخزين أي من هذه المعلومات أو مشاركتها.
            </p>
          </div>

          {/* ── Parent name ──────────────────────────────────── */}
          <div className="aqi-field">
            <div className="aqi-label-row">
              <label className="aqi-label" htmlFor="aParentName">
                  أسم طفلك
              </label>
              <span className="aqi-optional-tag">اختياري</span>
            </div>

            <div className="aqi-anon-toggle">
              <input
                type="text"
                id="aParentName"
                className={`aqi-input ${isAnonymous ? 'aqi-input--disabled' : ''}`}
                placeholder="مثلاً: سارة"
                value={isAnonymous ? '' : parentName}
                onChange={e => setParentName(e.target.value)}
                disabled={isAnonymous}
                maxLength={40}
              />
              <button
                type="button"
                className={`aqi-anon-btn ${isAnonymous ? 'aqi-anon-btn--active' : ''}`}
                onClick={() => {
                  setIsAnonymous(!isAnonymous)
                  if (!isAnonymous) setParentName('')
                }}
              >
                {isAnonymous ? '🙈 مجهول' : '👤 البقاء مجهولاً'}
              </button>
            </div>

            {isAnonymous && (
              <p className="aqi-anon-note">
                لا بأس — ستظل نتائجك مخصصة بالكامل.
              </p>
            )}
          </div>

          {/* ── Child age ────────────────────────────────────── */}



          <div className="qi-field">
            <div className="qi-label-row">
              <label className="qi-label" htmlFor="childAge">
                كم عمر طفلك؟
              </label>
              <span className="qi-required-tag">مطلوب</span>
            </div>
 
            <div className="qi-age-grid">
              {Arabic_AGE_OPTIONS.map(age => (
                <button
                  key={age}
                  type="button"
                  className={`qi-age-btn ${childAge === age ? 'qi-age-btn--selected' : ''}`}
                  onClick={() => setChildAge(age)}
                >
                  {age.replace(' years old', '')}
                  <span className="qi-age-unit">سنه</span>
                </button>
              ))}
            </div>
          </div>



          {/* ── Child gender ─────────────────────────────────── */}
          <div className="aqi-field">
            <div className="aqi-label-row">
              <label className="aqi-label">
                ما جنس طفلك؟
              </label>
              <span className="aqi-required-tag">مطلوب</span>
            </div>

            <div className="aqi-gender-row">
              {[
                { value: 'boy',  label: 'ولد',  emoji: '🧢' },
                { value: 'girl', label: 'بنت', emoji: '🎀' },
              ].map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  className={`aqi-gender-btn ${childGender === value ? 'aqi-gender-btn--selected' : ''}`}
                  onClick={() => setChildGender(value)}
                >
                  <span className="aqi-gender-emoji">{emoji}</span>
                  <span className="aqi-gender-label">{label}</span>
                </button>
              ))}
            </div>
          </div>

                    {/* ✏️ ADDED ── Arabic Suspect ADHD question ────────── */}
          <div className="aqi-field">
            <div className="aqi-label-row">
              {/* Arabic question label */}
              <label className="aqi-label">
                هل تشك في أن طفلك يعاني من اضطراب فرط الحركة ونقص الانتباه؟
              </label>
              <span className="aqi-required-tag">مطلوب</span>
            </div>

            {/* Three answer buttons in Arabic */}
            <div className="aqi-suspect-row">
              {ARABIC_SUSPECT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`aqi-suspect-btn ${suspectAdhd === value ? 'aqi-suspect-btn--selected' : ''}`}
                  onClick={() => setSuspectAdhd(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {/* ── End of new Arabic question ────────────────────── */}

          {/* ── Start button ─────────────────────────────────── */}
          <button
            className="aqi-start-btn"
            onClick={handleStartQuiz}
            disabled={!intakeValid}
          >
            {intakeValid
              ? '← ابدأ الاختبار'
              : 'يرجى ملء الحقول المطلوبة أعلاه'}
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
      <div className="aquiz-page">
        <div className="aquiz-header-row">
          <h1 className="aquiz-title">
            هل تظهر على طفلي علامات اضطراب فرط الحركة ونقص الانتباه؟
          </h1>
        </div>

        <div className="aquiz-result-card">

          {displayName && (
            <p className="aquiz-result-greeting">مرحباً {displayName} 👋</p>
          )}

          <p className="aquiz-result-title">نتيجة الاختبار</p>
          <p className="aquiz-result-subtitle">
            بناءً على إجاباتك — {childAge && ageLabel(Number(childAge))}
            {childGender === 'boy' ? '، ولد' : childGender === 'girl' ? '، بنت' : ''}
          </p>

          {/* ── Score summary boxes ── */}
          <div className="aquiz-result-scores">
            <div className="aquiz-result-score-item">
              <div className="aquiz-result-score-number">{result.groupAPositives}/9</div>
              <div className="aquiz-result-score-label">نتائج إيجابية بسبب تشتت الانتباه</div>
            </div>
            <div className="aquiz-result-score-item">
              <div className="aquiz-result-score-number">{result.groupBPositives}/9</div>
              <div className="aquiz-result-score-label">نتائج فرط الحركة والاندفاعية</div>
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
                اضطراب نقص الانتباه وفرط النشاط — النوع المشترك
              </p>
              <p className="aquiz-result-diagnosis-desc">
                تشير الإجابات إلى وجود علامات لكل من نوع تشتت الانتباه ونوع فرط الحركة/الاندفاعية،
                مع وجود بعض التأثير على الأداء اليومي. قد يكون هذا النمط متوافقًا مع اضطراب فرط
                الحركة وتشتت الانتباه من النوع المشترك. يرجى استشارة مختص في الرعاية الصحية لإجراء
                تقييم كامل.
              </p>
            </div>
          )}

          {!result.isCombined && result.isInattentive && (
            <div className="aquiz-result-diagnosis inattentive">
              <p className="aquiz-result-diagnosis-type">
                النوع الذي يغلب عليه تشتت الانتباه
              </p>
              <p className="aquiz-result-diagnosis-desc">
                تشير الإجابات إلى وجود علامات لأعراض تشتت الانتباه مع تأثير على الأداء اليومي.
                قد يكون هذا النمط متوافقًا مع النوع الذي يغلب عليه تشتت الانتباه من اضطراب فرط
                الحركة وتشتت الانتباه. يرجى استشارة مختص في الرعاية الصحية لإجراء تقييم كامل.
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
                من اضطراب فرط الحركة وتشتت الانتباه. يرجى استشارة مختص في الرعاية الصحية لإجراء
                تقييم كامل.
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
                لاضطراب فرط الحركة وتشتت الانتباه. ومع ذلك، إذا كانت لديك مخاوف بشأن سلوك طفلك،
                يُرجى استشارة مختص مؤهل في الرعاية الصحية.
              </p>
            </div>
          )}

          <p className="aquiz-result-disclaimer">
            ⚠️ هذا الاختبار يعتمد على مقياس تقييم نيشق فاندر بيلت وهو لأغراض الفحص التعليمي فقط.
            لا يُعد تشخيصًا طبيًا. يُرجى دائمًا استشارة متخصص صحي مؤهل للتقييم والتشخيص.
          </p>

          <button className="aquiz-result-retake" onClick={handleRetake}>
            إعادة الاختبار
          </button>
        </div>
      </div>
    )
  }

  /* ================================================================
     STAGE 2 — QUESTION SCREEN
  ================================================================ */
  return (
    <div className="aquiz-page">
      <div>
        <div className="aquiz-header-row">
          <h1 className="aquiz-title">
            هل تظهر على طفلي علامات اضطراب فرط الحركة ونقص الانتباه؟
          </h1>
          <Link to="/quiz" className="aquiz-arabic-btn">English</Link>
        </div>

        <p className="aquiz-desc">
          عند إكمال هذا النموذج، يُرجى التفكير في سلوكيات طفلك خلال الأشهر الستة الماضية.
          <span className="ascreening-graph"> هذه أداة فحص فقط — وليست تشخيصًا.</span>
        </p>
      </div>

      <div className="aquiz-card">
        <div className="aquiz-progress-bar">
          <div className="aquiz-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="aquestion-counter-category">
          <p className="aquiz-counter">
            السؤال {currentIndex + 1} من {totalQuestions}
          </p>
          <span className={`aquiz-section-badge group-${currentQuestion.group}`}>
            {SECTION_LABELS[currentQuestion.group]}
          </span>
        </div>

        <p className="aquiz-question">{currentQuestion.text}</p>

        <div className="aquiz-options">
          {options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.value
            return (
              <button
                key={option.value}
                className={`aquiz-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <span className="aquiz-option-radio" />
                <span className="aquiz-option-label">{option.label}</span>
              </button>
            )
          })}
        </div>

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
            disabled={!hasAnswered}
          >
            {isLastQuestion ? 'ارسال' : 'التالي'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Arabicquiz