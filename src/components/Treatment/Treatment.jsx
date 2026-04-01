import { useState } from "react";
import { Link } from "react-router-dom";
import "./Treatment.css";

/* ─── DATA ──────────────────────────────────────────────────── */

const ageGroups = [
  {
    age: "Ages 4–6",
    title: "Behaviour First",
    accent: "blue",
    steps: [
      "Parent training in behaviour management",
      "Behavioural classroom interventions (if available)",
      "Methylphenidate (a stimulant medication also known as Ritalin) may be used in children 4-6 years of age if behavioral interventions do not provide significant improvement and the child continues to have serious problems",
    ],
    note: "Behaviour therapy is most effective in young children when delivered by parents.",
  },
  {
    age: "Ages 6+",
    title: "Medication + Behaviour Together",
    accent: "pink",
    steps: [
      "FDA-approved medication",
      "Parent training in behaviour management",
      "Behavioural classroom interventions(if available)",
      "Educational and school-based supports",
    ],
    note: "Treatments work best when used together. School is always a necessary part of the plan.",
  },
];

const stimulants = {
  intro: "Fast-acting medications which increase dopamine and norepinephrine levels in the brain.— effects can be felt within an hour. Stimulants are a controlled substance.",
  howList: [
    "In ADHD, the pathways in the frontal lobe — the part of the brain involved in attention — aren't working the way they should.",
    "Stimulants increase dopamine, a brain chemical that helps these pathways become more active.",
    "This increase in dopamine helps improve attention and decrease hyperactivity and impulsivity.",
  ],
  drugs: [
    { name: "Methylphenidate", detail: "Ritalin · Biphentin · Concerta", accent: "blue" },
    { name: "Dextroamphetamine", detail: "Dexedrine · Dexedrine Spansule · Vyvanse", accent: "blue" },
    { name: "Mixed Amphetamine Salts (MAS)", detail: "Adderall XR", accent: "blue" },
  ],
  callout: "Stimulants are the first-line choice for ADHD medication. Usually prescribed for a trial period of ~3 weeks to see if they're right for your child. They are not addictive and can be stopped if they are not helpful.",
};
 
const nonStimulants = {
  intro: "These take longer to start working — your child may need to take them for longer to feel the effects. They must be taken every day.",
  howList: [
    "Recommended if stimulants do not work, cause significant side effects, or are not suitable for your child.",
    "Take longer to show results — sometimes weeks to two months before the full effect is felt.",
    "Each person's body is different — it's very common to try different medications at different doses.",
  ],
  drugs: [
    { name: "Atomoxetine (Strattera)", detail: "Long-acting, works throughout the day. Needs to be taken for up to two months to assess effectiveness.", accent: "pink" },
    { name: "Clonidine (Dixarit, Catapres) & Guanfacine (Intuniv XR)", detail: "Alpha-agonist medications. Good choices for children with tics, severe impulsivity, or impulsive aggression.", accent: "pink" },
    { name: "Risperidone (Risperdal)", detail: "NOT recommended for uncomplicated ADHD as it doesn't significantly help attention. May be used for serious disruptive behaviour and aggression — requires medical monitoring.", warning: true },
  ],
  callout: "Every child's body is different. It's very common to try different medications at different doses to find which one is best for your child.",
};

const followUpRows = [
  {
    num: "01",
    badge: "blue",
    title: "Starting medication",
    freq: "Every 2–4 weeks",
    when: "During dose titration",
    desc: "Visits are frequent at first while finding the right dose. Continue until symptoms are under control and your child is stable.",
    monitoring: ["Appetite loss", "Sleep issues", "Blood pressure & heart rate"],
  },
  {
    num: "02",
    badge: "pink",
    title: "Stable on medication",
    freq: "Every 3–6 months",
    when: "Once the right dose is found",
    desc: "Every 3 months in the first year, then every 3–6 months as long as your child remains stable.",
    monitoring: ["Growth (height & weight)", "Blood pressure & heart rate", "School performance", "Emotional wellbeing", "Medication adherence"],
  },
  {
    num: "03",
    badge: "purple",
    title: "Behaviour therapy only",
    freq: "Every 3–6 months",
    when: "No medication involved",
    desc: "Visits can be scheduled sooner if symptoms worsen or new concerns arise between appointments.",
    monitoring: ["Functional impairment at home & school", "School feedback", "Family stress level"],
  },
  {
    num: "04",
    badge: "red",
    title: "Complex or high-risk cases",
    freq: "Monthly or more often",
    when: "When serious concerns are present",
    desc: "More frequent visits are needed when significant risk factors or multiple conditions are present at the same time.",
    monitoring: ["Severe aggression", "Mood instability", "Suicidal thoughts", "Multiple psychiatric conditions", "Major medication changes"],
  },
];

const sideEffects = [
  { icon: "❤️", title: "Blood pressure & heart rate", desc: "A slight increase is common, especially when starting medication.", accent: "pink" },
  { icon: "🍽️", title: "Reduced appetite",           desc: "May cause weight loss or slower weight gain. Monitor meal patterns.", accent: "blue" },
  { icon: "😴", title: "Difficulty sleeping",         desc: "Especially if taken later in the day. Adjust timing with your doctor.", accent: "gradient" },
  { icon: "🤕", title: "Headaches & stomach aches",   desc: "Mild and usually improve within the first few weeks.", accent: "pink" },
  { icon: "😤", title: "Mood changes",                desc: "Irritability, anxiety, or low mood. Always report these to your psychiatrist.", accent: "blue" },
];

/* ─── COMPONENT ─────────────────────────────────────────────── */
export default function Treatment() {
  const [activeTab, setActiveTab] = useState("stimulant");
  const med      = activeTab === "stimulant" ? stimulants : nonStimulants;
  const numColor = activeTab === "stimulant" ? "blue" : "pink";

  return (
    <div className="tr-page">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="tr-hero">
        <div className="tr-hero__blob tr-hero__blob--pink" />
        <div className="tr-hero__blob tr-hero__blob--blue" />
        <div className="tr-hero__inner">
          <h1 className="tr-hero__title">
            There's no single fix —{" "}
            <span className="tr-gradient">but there is a path forward.</span>
          </h1>
          <p className="tr-hero__sub">
            ADHD is very manageable with the right support. The best outcomes
            happen when parents, schools, and doctors work as a team.
          </p>
        </div>
      </section>

      {/* ── AGE-BASED TREATMENT ──────────────────────────────── */}
      <section className="tr-section tr-section--alt">
        <div className="tr-container">
          <p className="tr-label">The Approach</p>
          <h2 className="tr-title">
            Treatment depends on{" "}
            <span className="tr-gradient">your child's age</span>
          </h2>
          <p className="tr-lead">
            The right starting point differs based on age — and both approaches
            work best when combined with consistent family involvement.
          </p>

          <div className="tr-age-grid">
            {ageGroups.map(({ age, title, accent, steps, note }) => (
              <div className={`tr-age-card tr-age-card--${accent}`} key={age}>
                <div className="tr-age-card__header">
                  <div>
                    <span className={`tr-age-badge tr-age-badge--${accent}`}>{age}</span>
                    <h3 className="tr-age-card__title">{title}</h3>
                  </div>
                </div>

                <ul className="tr-age-steps">
                  {steps.map((s, i) => (
                    <li key={i} className="tr-age-step">
                      <span className={`tr-age-step__num tr-age-step__num--${accent}`}>
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>

                <div className={`tr-age-note tr-age-note--${accent}`}>
                  <span>💡</span>
                  <span>{note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── MEDICATION ───────────────────────────────────────── */}
      <section className="tr-section">
        <div className="tr-container">
          <p className="tr-label">Medication</p>
          <h2 className="tr-title">
            Types of{" "}
            <span className="tr-gradient">ADHD medication</span>
          </h2>
          <p className="tr-lead">
            Both types of medication reduce hyperactivity and impulsivity and
            help your child concentrate. Stimulants are generally the first
            choice. Non-stimulant medication is recommended if stimulants do not
            work, cause significant side effects, or are not suitable.
          </p>
 
          <div className="tr-tabs">
            <button
              className={`tr-tab ${activeTab === "stimulant" ? "tr-tab--active" : ""}`}
              onClick={() => setActiveTab("stimulant")}
            >
              Stimulants
            </button>
            <button
              className={`tr-tab ${activeTab === "non" ? "tr-tab--active" : ""}`}
              onClick={() => setActiveTab("non")}
            >
              Non-stimulants
            </button>
          </div>
 
          <div className="tr-med-panel">
            {/* Intro sentence at the top of the panel */}
            <p className="tr-med-intro">{med.intro}</p>
 
            <div className="tr-med-grid">
              <div>
                <p className="tr-drugs-label">How it works</p>
                <div className="tr-how-list">
                  {med.howList.map((item, i) => (
                    <div className="tr-how-item" key={i}>
                      <span className={`tr-how-item__num tr-how-item__num--${numColor}`}>{i + 1}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="tr-callout">{med.callout}</div>
              </div>
              <div>
                <p className="tr-drugs-label">
                  {activeTab === "stimulant"
                    ? "The 3 main stimulant medications"
                    : "Non-stimulant options"}
                </p>
                <div className="tr-drug-list">
                  {med.drugs.map(({ name, detail, accent, warning }) => (
                    <div
                      className={`tr-drug-item ${warning ? "tr-drug-item--warning" : `tr-drug-item--${accent}`}`}
                      key={name}
                    >
                      <span className="tr-drug-item__name">{name}</span>
                      <span className="tr-drug-item__detail">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── FOLLOW-UP SCHEDULE ───────────────────────────────── */}
      <section className="tr-section tr-section--alt">
        <div className="tr-container">
          <p className="tr-label">Psychiatrist Visits</p>
          <h2 className="tr-title">
            How often to{" "}
            <span className="tr-gradient">follow up</span>
          </h2>
          <p className="tr-lead">
           Follow-up frequency depends on several factors, including whether medication is being started or adjusted, the severity of symptoms, the presence of comorbidities such as anxiety, depression, oppositional defiant disorder (ODD), or learning disorders, and the overall stability of the treatment plan. Here's what to expect at each stage.
          </p>

          <div className="tr-rich-table-wrap">
            <table className="tr-rich-table">
              <thead>
                <tr>
                  <th className="tr-rich-table__th--phase">Phase</th>
                  <th className="tr-rich-table__th--freq">Visit frequency</th>
                  <th className="tr-rich-table__th--when">When</th>
                  <th className="tr-rich-table__th--monitor">What the doctor monitors</th>
                </tr>
              </thead>
              <tbody>
                {followUpRows.map(({ num, badge, title, freq, when, monitoring }) => (
                  <tr key={num} className={`tr-rich-table__row tr-rich-table__row--${badge}`}>

                    {/* Phase */}
                    <td>
                      <div className="tr-rich-table__phase">
                        <span className="tr-rich-table__title">{title}</span>
                      </div>
                    </td>

                    {/* Frequency badge */}
                    <td>
                      <span className={`tr-freq-badge tr-freq-badge--${badge}`}>
                        {freq}
                      </span>
                    </td>

                    {/* When */}
                    <td className="tr-rich-table__when">{when}</td>

                    {/* Monitor — pill tags */}
                    <td>
                      <ul className="tr-rich-table__monitor-list">
                        {monitoring.map(m => (
                          <li key={m} className="tr-rich-table__monitor-item">{m}</li>
                        ))}
                      </ul>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SIDE EFFECTS ─────────────────────────────────────── */}
      <section className="tr-section">
        <div className="tr-container">
          <div className="tr-split tr-split--center">

            {/* Left — text + callout + image */}
            <div>
              <p className="tr-label">What to Watch For</p>
              <h2 className="tr-title">
                Common{" "}
                <span className="tr-gradient">side effects</span>
              </h2>
              <p className="tr-lead" style={{ marginBottom: 0 }}>
                Most side effects are mild and improve over time. Knowing what to
                look for means you can report them early and adjust the plan.
              </p>
              <div className="tr-callout" style={{ marginTop: 20 }}>
                <strong>If you notice any of these, report them to your psychiatrist.</strong>{" "}
                Never stop medication suddenly without medical advice.
              </div>
              <div className="tr-img-card" style={{ marginTop: 20 }}>
                <img src="/therapy.webp" alt="Parent talking to doctor" />
                <p className="tr-img-caption">
                  Open communication with your psychiatrist makes all the difference
                </p>
              </div>
            </div>

            {/* Right — 2×2 effect cards */}
            <div>
              <div className="tr-effects-grid">
                {sideEffects.map(({ icon, title, desc, accent }) => (
                  <div className={`tr-effect-card tr-effect-card--${accent}`} key={title}>
                    <span className="tr-effect-card__icon">{icon}</span>
                    <p className="tr-effect-card__title">{title}</p>
                    <p className="tr-effect-card__desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="tr-section tr-section--cta">
        <div className="tr-container">
          <div className="tr-cta">
            <div className="tr-cta__quote">"</div>
            <div className="tr-cta__body">
              <p className="tr-cta__lead">
                Treatment is not a straight line — it’s a journey of small adjustments and 
                meaningful progress. The most important thing you can do is stay involved,
                 stay informed, and remember that the right support makes all the difference.
                  Now,<strong/> let’s explore the support available to help you every step of the way.<strong/>

              </p>
              <div className="tr-cta__divider" />
              <div className="tr-tag-row">
                <span className="tr-tag">Ages 4–18</span>
                <span className="tr-tag">Behaviour + Medication</span>
                <span className="tr-tag">School included</span>
                <span className="tr-tag">Evidence-based</span>
              </div>
              <Link to="/support" className="btn btn-outline-blue" style={{ alignSelf: "flex-start", marginTop: 4 }}>
                Explore Support→
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}