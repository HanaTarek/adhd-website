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
  { label: 'Never',        value: 0 },
  { label: 'Occasionally', value: 1 },
  { label: 'Often',        value: 2 },
  { label: 'Very Often',   value: 3 },
]

export const PERFORMANCE_OPTIONS = [
  { label: 'Excellent',     value: 1 },
  { label: 'Above Average', value: 2 },
  { label: 'Average',       value: 3 },
  { label: 'Somewhat of a Problem', value: 4 },
  { label: 'Problematic',   value: 5 },
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
    text: 'Does not pay attention to details or makes careless mistakes with, for example, homework',
    type: 'symptom',
    group: 'A', /* Inattentive */
  },
  {
    id: 2,
    text: 'Has difficulty keeping attention to what needs to be done',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 3,
    text: 'Does not seem to listen when spoken to directly',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 4,
    text: 'Does not follow through when given directions and fails to finish activities (not due to refusal or failure to understand)',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 5,
    text: 'Has difficulty organizing tasks and activities',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 6,
    text: 'Avoids, dislikes, or does not want to start tasks that require ongoing mental effort',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 7,
    text: 'Loses things necessary for tasks or activities (toys, assignments, pencils, or books)',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 8,
    text: 'Is easily distracted by noises or other stimuli',
    type: 'symptom',
    group: 'A',
  },
  {
    id: 9,
    text: 'Is forgetful in daily activities',
    type: 'symptom',
    group: 'A',
  },

  /* ── GROUP B: Hyperactive/Impulsive Symptoms (Q10–18) ─────────
     Diagnosis requires ≥6 positives (score 2 or 3) from this group
  ─────────────────────────────────────────────────────────────── */
  {
    id: 10,
    text: 'Fidgets with hands or feet or squirms in seat',
    type: 'symptom',
    group: 'B', /* Hyperactive */
  },
  {
    id: 11,
    text: 'Leaves seat when remaining seated is expected',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 12,
    text: 'Runs about or climbs too much when remaining seated is expected',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 13,
    text: 'Has difficulty playing or beginning quiet play activities',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 14,
    text: 'Is "on the go" or often acts as if "driven by a motor"',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 15,
    text: 'Talks too much',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 16,
    text: 'Blurts out answers before questions have been completed',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 17,
    text: 'Has difficulty waiting his or her turn',
    type: 'symptom',
    group: 'B',
  },
  {
    id: 18,
    text: 'Interrupts or intrudes in on others\' conversations and/or activities',
    type: 'symptom',
    group: 'B',
  },

  /* ── GROUP C: Oppositional-Defiant Symptoms (Q19–26) ──────────
     Screen requires ≥4 positives from this group
  ─────────────────────────────────────────────────────────────── */


  /* ── GROUP F: Performance Questions (Q48–55) ──────────────────
     Scored 1–5 (not 0–3). Score of 4 or 5 = positive.
     At least ONE positive here is required for any ADHD diagnosis.
  ─────────────────────────────────────────────────────────────── */
  {
    id: 48,
    text: 'Overall school performance',
    type: 'performance', /* uses 1–5 scale */
    group: 'F',
  },
  {
    id: 49,
    text: 'Reading',
    type: 'performance',
    group: 'F',
  },
  {
    id: 50,
    text: 'Writing',
    type: 'performance',
    group: 'F',
  },
  {
    id: 51,
    text: 'Mathematics',
    type: 'performance',
    group: 'F',
  },
  {
    id: 52,
    text: 'Relationship with parents',
    type: 'performance',
    group: 'F',
  },
  {
    id: 53,
    text: 'Relationship with siblings',
    type: 'performance',
    group: 'F',
  },
  {
    id: 54,
    text: 'Relationship with peers',
    type: 'performance',
    group: 'F',
  },
  {
    id: 55,
    text: 'Participation in organized activities (e.g., teams)',
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