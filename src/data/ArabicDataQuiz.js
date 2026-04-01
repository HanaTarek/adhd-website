/* ================================================================
   quizData.js
   ----------------------------------------------------------------
   📌 PURPOSE:
   Contains ALL quiz questions and scoring logic in one place.
   This is the single source of truth for the quiz content.

   📐 STRUCTURE:
   - QUESTIONS array     → all 55 questions with type and group info
   - ANSWER_OPTIONS      → the two answer scales used in the quiz
   - scoreQuiz()         → function that takes answers and returns results

   📋 QUESTION GROUPS (from NICHQ Vanderbilt Assessment):
   - Group A (Q1–9):    Inattentive symptoms
   - Group B (Q10–18):  Hyperactive/Impulsive symptoms
   - Group C (Q19–26):  Oppositional-Defiant symptoms
   - Group D (Q27–40):  Conduct Disorder symptoms
   - Group E (Q41–47):  Anxiety/Depression symptoms
   - Group F (Q48–55):  Performance (scored 1–5, not 0–3)

   🧮 SCORING RULES (from official NICHQ guidelines):
   - Symptom questions (Q1–47): score 0–3 (Never/Occasionally/Often/Very Often)
   - Performance questions (Q48–55): score 1–5 (Excellent → Problematic)
   - "Positive" symptom = score of 2 or 3
   - "Positive" performance = score of 4 or 5

   ✅ DIAGNOSIS CRITERIA:
   Inattentive:         ≥6 positives in Q1–9  AND ≥1 positive in Q48–55
   Hyperactive:         ≥6 positives in Q10–18 AND ≥1 positive in Q48–55
   Combined:            Both above criteria met
   ================================================================ */


/* ────────────────────────────────────────────────────────────────
   ANSWER OPTIONS
   Two scales are used in this quiz:
   - symptomScale: for questions 1–47 (Never → Very Often, 0–3)
   - performanceScale: for questions 48–55 (Excellent → Problematic, 1–5)
──────────────────────────────────────────────────────────────── */
export const SYMPTOM_OPTIONS = [
  { label: 'لا يحدث ابدا',        value: 0 },
  { label: 'أحيانا', value: 1 },
  { label: 'غالبا',        value: 2 },
  { label: 'دائما',   value: 3 },
]

export const PERFORMANCE_OPTIONS = [
  { label: 'ممتاز',     value: 1 },
  { label: 'فوق المتوسط', value: 2 },
  { label: 'متوسط',       value: 3 },
  { label: 'نوعا ما يوجد مشكلة', value: 4 },
  { label: 'توجد مشكله واضحه',   value: 5 },
]


/* ────────────────────────────────────────────────────────────────
   ALL 55 QUESTIONS
   Each question has:
     id:      question number (1–55)
     text:    the question text shown to the user
     type:    "symptom" (0–3) or "performance" (1–5)
     group:   which scoring group this question belongs to
──────────────────────────────────────────────────────────────── */
export const QUESTIONS = [

  /* ── GROUP A: Inattentive Symptoms (Q1–9) ─────────────────────
     Diagnosis requires ≥6 positives (score 2 or 3) from this group
  ─────────────────────────────────────────────────────────────── */
  {
    id: 1,
    text: 'لا يُولي اهتماما كافيًا للتفاصيل أو يرتكب أخطا ًء غير مقصودة بسبب الاهمال، مثل أخطاء في الواجبات المدرسيه',
    type: 'symptom',
    group: 'A', /* Inattentive */
  },
  {
    id: 2,
    text: 'يجد صعوبة في الحفاظ على تركيزه في تنفيذ ما يجب فعله أو ما يجب إنجازه',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 3,
    text: 'يبدو كأنه لايستمع عند التحدث إليه مباشرة',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 4,
    text: 'لا يلتزم بالتعليمات المعطاة ولا يُكمل الأنشطة (و ذلك ليس بسبب الرفض أو عدم الفهم)',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 5,
    text: 'يجد صعوبة في تنظيم المهام والأنشطة',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 6,
    text: 'يتجنب أو يكره أو لا يرغب في بدء المهام التي تتطلب جهًدا ذهنيًا مستمًرا',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 7,
    text: 'يفقد الأشياء الضرورية للمهام أو الأنشطة (مثل الالعاب، الواجبات، الأقلام، أو الكتب',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 8,
    text: 'يتشتت انتباهه بسهولة بسبب الضوضاء أو المؤثرات الخارجية الأخرى',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 9,
    text: 'كثير النسيان في الأنشطة اليومية',
    type: 'symptom',
    group: 'A',
  },

  /* ── GROUP B: Hyperactive/Impulsive Symptoms (Q10–18) ─────────
     Diagnosis requires ≥6 positives (score 2 or 3) from this group
  ─────────────────────────────────────────────────────────────── */
  {
    id: 10,
    text: 'يتململ بيديه أو قدميه أو يتحرك كثيرا في مقعده',
    type: 'symptom',
    group: 'B', /* Hyperactive */
  },
  {
    id: 11,
    text: 'يترك مقعده في المواقف التي يُتوقع منه البقاء جالسا فيه',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 12,
    text: 'يركض أو يتسلق بشكل مفرط في المواقف التي يُتوقع منه البقاء جالسا فيها',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 13,
    text: 'يجد صعوبة في اللعب بهدوء أو في بدء أنشطة لعب هادئة',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 14,
    text: '"يكون دائم الحركة أو يتصرف غالبًا كما لو كان "مدفوعا بمحرك',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 15,
    text: 'يتحدث كثيرا',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 16,
    text: 'يندفع بالاجابة قبل الانتهاء من طرح السؤال',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 17,
    text: 'يجد صعوبة في انتظار دوره',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 18,
    text: 'يقاطع الآخرين أو يتدخل في محادثاتهم و/أو أنشطتهم',
    type: 'symptom',
    group: 'B',
  },

  /* ── GROUP C: Oppositional-Defiant Symptoms (Q19–26) ──────────
     Screen requires ≥4 positives from this group
  ─────────────────────────────────────────────────────────────── */
    /* ── GROUP C: Oppositional-Defiant Symptoms (Q19–26) ──────────
     Screen requires ≥4 positives from this group
  ─────────────────────────────────────────────────────────────── */
 

  /* ── GROUP F: Performance Questions (Q48–55) ──────────────────
     Scored 1–5 (not 0–3). Score of 4 or 5 = positive.
     At least ONE positive here is required for any ADHD diagnosis.
  ─────────────────────────────────────────────────────────────── */
  {
    id: 48,
    text: 'الأداء المدرسي بشكل عام',
    type: 'performance', /* uses 1–5 scale */
    group: 'F',
  },
  {
    id: 49,
    text: 'القراءة',
    type: 'performance',
    group: 'F',
  },
  {
    id: 50,
    text: 'الكتابة',
    type: 'performance',
    group: 'F',
  },
  {
    id: 51,
    text: 'الرياضيات',
    type: 'performance',
    group: 'F',
  },
  {
    id: 52,
    text: 'العلاقة مع الوالدين',
    type: 'performance',
    group: 'F',
  },
  {
    id: 53,
    text: 'العلاقة مع الإخوة',
    type: 'performance',
    group: 'F',
  },
  {
    id: 54,
    text: 'العلاقة مع الأقران (الاطفال في نفس العمر او الزملاء)',
    type: 'performance',
    group: 'F',
  },
  {
    id: 55,
    text: 'المشاركة في الأنشطة المنظمة (مثل الفرق الرياضية)',
    type: 'performance',
    group: 'F',
  },
]


/* ────────────────────────────────────────────────────────────────
   SCORING FUNCTION
   ----------------------------------------------------------------
   Takes the answers object and returns a results object.

   @param {Object} answers  - { questionId: selectedValue, ... }
   @returns {Object}        - scoring results and diagnosis

   HOW IT WORKS:
   1. Count positives in Group A (Q1–9):  positive = score 2 or 3
   2. Count positives in Group B (Q10–18): positive = score 2 or 3
   3. Check Group F (Q48–55): any score of 4 or 5 = performance impairment
   4. Apply diagnosis rules:
      - Inattentive:  groupA >= 6 AND performance impairment exists
      - Hyperactive:  groupB >= 6 AND performance impairment exists
      - Combined:     both above are true
──────────────────────────────────────────────────────────────── */
export const scoreQuiz = (answers) => {

  /* ── Count positive symptom responses per group ──
     A "positive" symptom answer = value of 2 (Often) or 3 (Very Often)
  */
  const groupAPositives = QUESTIONS
    .filter(q => q.group === 'A')
    .filter(q => (answers[q.id] ?? 0) >= 2)
    .length

  const groupBPositives = QUESTIONS
    .filter(q => q.group === 'B')
    .filter(q => (answers[q.id] ?? 0) >= 2)
    .length

  /* ── Check for performance impairment ──
     At least one performance question (Q48–55) must score 4 or 5
     for any ADHD diagnosis to apply.
  */
  const hasPerformanceImpairment = QUESTIONS
    .filter(q => q.group === 'F')
    .some(q => (answers[q.id] ?? 0) >= 4)

  /* ── Apply diagnosis criteria ── */
  const isInattentive  = groupAPositives >= 6 && hasPerformanceImpairment
  const isHyperactive  = groupBPositives >= 6 && hasPerformanceImpairment
  const isCombined     = isInattentive && isHyperactive

  /* ── Build and return the results object ── */
  return {
    groupAPositives,      /* number of inattentive positives (out of 9)    */
    groupBPositives,      /* number of hyperactive positives (out of 9)    */
    hasPerformanceImpairment,
    isInattentive,        /* true = Predominantly Inattentive criteria met  */
    isHyperactive,        /* true = Predominantly Hyperactive criteria met  */
    isCombined,           /* true = Combined ADHD criteria met              */
  }
}