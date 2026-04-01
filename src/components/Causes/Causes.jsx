import { useState } from "react";
import { Link } from "react-router-dom";
import "./Causes.css";

/* ─── DATA ──────────────────────────────────────────────────── */

const causeCards = [
  {
    icon: "🧬",
    front: "Genetic Factors",
    frontSub: "It often runs in the family",
    back: [
      "ADHD is highly heritable — 70–80% of cases have a genetic component.",
      "First-degree relatives have a 2–8× increased risk.",
      "Key genes involve dopamine regulation (DAT1, DRD4).",
    ],
    accent: "blue",
  },
  {
    icon: "🧠",
    front: "Neurobiological Factors",
    frontSub: "Differences in brain structure & chemistry",
    back: [
      "Structural differences in the prefrontal cortex, basal ganglia, and cerebellum.",
      "Dysregulation of dopamine and norepinephrine pathways.",
      "Cortical maturation may be delayed by 2–3 years in some children.",
    ],
    accent: "pink",
  },
  {
    icon: "🌍",
    front: "Environmental & Prenatal Factors",
    frontSub: "What happened before birth matters too",
    back: [
      "Prenatal exposure to tobacco, alcohol, or lead increases risk.",
      "Prematurity, low birth weight, and maternal stress are also factors.",
      "In rare cases, traumatic brain injury may be a cause.",
    ],
    accent: "gradient",
  },
];

const myths = [
  {
    myth: "ADHD is caused by poor parenting",
    fact: "Scientific evidence confirms ADHD is a neurobiological disorder. The National Institute of Mental Health confirms ADHD is not caused by parenting style.",
  },
  {
    myth: "ADHD is not a real disorder",
    fact: "ADHD is a recognized medical condition in the DSM-5, diagnosed using standardized criteria established by the American Psychiatric Association.",
  },
  {
    myth: "You can't have ADHD if you're not hyperactive",
    fact: "ADHD can occur without hyperactivity — the predominantly inattentive presentation includes poor concentration, forgetfulness, and disorganization.",
  },
  {
    myth: "Children with ADHD are lazy or undisciplined",
    fact: "Children with ADHD have executive function impairments affecting attention, planning, and impulse control. These are neurological — not behavioral choices.",
  },
  {
    myth: "Only boys have ADHD",
    fact: "ADHD affects both boys and girls. However, boys are more likely to be diagnosed because they often display hyperactive and disruptive symptoms. Girls are more likely to present with inattentive symptoms, which may be less noticeable and therefore underdiagnosed.",
  },
  {
    myth: "Children with ADHD cannot focus on anything",
    fact: "Children with ADHD can focus intensely on activities they find interesting or stimulating, a phenomenon known as hyperfocus. The difficulty lies in regulating attention, not the inability to pay attention entirely.",
  },
  {
    myth: "Sugar causes ADHD",
    fact: "While a poor diet can affect energy, double-blind studies found no causal relationship between sugar intake and ADHD. ADHD is caused by neurodevelopmental factors.",
  },
  {
    myth: "Children outgrow ADHD",
    fact: "ADHD often persists into adolescence and adulthood, although symptoms may improve.",
  },
  {
    myth: "ADHD medications are unsafe or addictive",
    fact: "When prescribed and monitored appropriately, ADHD medications are safe and effective.",
  },
  {
    myth: "ADHD is a learning disability",
    fact: "ADHD isn’t a learning disability. ADHD symptoms can get in the way of learning, but they don’t cause difficulty in specific skills like reading, writing, and math. ",
  },
];

const stigmaCards = [
  {
    icon: "👥",
    title: "Social Stigma",
    desc: "Children may be labeled as disruptive, lazy, or problematic, leading to social isolation and peer rejection.",
    accent: "blue",
  },
  {
    icon: "🏠",
    title: "Family Stigma",
    desc: "Parents may be blamed for poor parenting, which delays medical evaluation and treatment for their child.",
    accent: "pink",
  },
  {
    icon: "📚",
    title: "Academic Stigma",
    desc: "Teachers may misinterpret ADHD symptoms as behavioral misconduct rather than recognising them as neurological differences.",
    accent: "gradient",
  },
  {
    icon: "❤️",
    title: "Self-Stigma",
    desc: "Children may develop low self-esteem, anxiety, and depression due to repeated criticism and academic difficulties.",
    accent: "blue",
  },
];

const stats = [
  { num: "50%–65%", desc: "of individuals with ADHD continue to experience symptoms into adulthood", accent: "blue" },
  { num: "~5%–7%",   desc: "of children worldwide have ADHD",     accent: "pink" },
  { num: "~2–3:1",  desc: "The male-to-female ratio of ADHD in children",               accent: "gradient" },
  { num: "~1.5:1", desc: "The male-to-female ratio of ADHD in adults",             accent: "blue" },
];

/* ─── ACCORDION ITEM ────────────────────────────────────────── */
function MythItem({ myth, fact }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`c-myth ${open ? "c-myth--open" : ""}`}>
      <button className="c-myth__trigger" onClick={() => setOpen(!open)}>
        <span className="c-myth__label">Myth</span>
        <span className="c-myth__text">{myth}</span>
        <span className="c-myth__chevron">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="c-myth__body">
          <span className="c-myth__fact-label">Fact</span>
          <p className="c-myth__fact-text">{fact}</p>
        </div>
      )}
    </div>
  );
}

/* ─── FLIP CARD ─────────────────────────────────────────────── */
function FlipCard({ icon, front, frontSub, back, accent }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`c-flip ${flipped ? "c-flip--flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && setFlipped(!flipped)}
      aria-label={`${front} — click to reveal details`}
    >
      <div className="c-flip__inner">
        <div className={`c-flip__face c-flip__front c-flip__front--${accent}`}>
          <span className="c-flip__icon">{icon}</span>
          <h3 className="c-flip__title">{front}</h3>
          <p className="c-flip__sub">{frontSub}</p>
          <span className="c-flip__hint">Tap to learn more →</span>
        </div>
        <div className={`c-flip__face c-flip__back c-flip__back--${accent}`}>
          <h3 className="c-flip__back-title">{front}</h3>
          <ul className="c-flip__list">
            {back.map((item, i) => (
              <li key={i} className="c-flip__list-item">{item}</li>
            ))}
          </ul>
          <span className="c-flip__hint">Tap to go back ←</span>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────── */
export default function Causes() {
  return (
    <div className="s-page">

      {/* ── HERO — matches ao-hero exactly ───────────────────── */}
      <section className="c-hero">
        <div className="c-hero__blob c-hero__blob--pink" />
        <div className="c-hero__blob c-hero__blob--blue" />

        <div className="c-hero__inner">
          {/* LEFT — text */}
          <div className="c-hero__content">
            <h1 className="c-hero__title">
               Not a Flaw. Not Your Fault.{" "}
              <span className="s-gradient-text">Just ADHD.</span>
            </h1>
            <p className="c-hero__lead">
                You didn’t cause this — and you’re not alone.
                ADHD is a brain-based difference, not bad parenting.

                Understanding it means less blame, less stigma —
                and more support for your child.
            </p>
          </div>

          {/* RIGHT — image */}
          <div className="c-hero__image-wrap">
            <img
              src="/blue-shirt.webp"
              alt="Parent and child together"
              className="c-hero__image"
            />
          </div>
        </div>
      </section>

      {/* ── CAUSES — FLIP CARDS ───────────────────────────────── */}
      <section className="s-section">
        <div className="s-container s-container--wide">
          <p className="s-label">Why does this happen?</p>
          <h2 className="s-title">
            What <span className="s-gradient-text">causes ADHD?</span>
          </h2>
          <p className="s-lead">
            Many factors contribute to ADHD — it's rarely just one thing. Research
            points to a combination of genetics, brain biology, and early environment.
            Tap each card to explore what's behind ADHD.
          </p>

          <div className="c-flip-grid">
            {causeCards.map(card => (
              <FlipCard key={card.front} {...card} />
            ))}
          </div>

          <div className="s-callout" style={{ marginTop: "32px" }}>
            <strong>In simple terms:</strong> some changes in the child's brain
            structure or chemistry may lead to ADHD. It is never the result of
            bad parenting, too much screen time, or lack of discipline.
          </div>
        </div>
      </section>

      {/* ── HOW COMMON — single column: text → stats row → image ─ */}
      <section className="s-section s-section--alt">
        <div className="s-container s-container--wide">
          <p className="s-label">Epidemiology</p>
          <h2 className="s-title">
            How common <span className="s-gradient-text">is it?</span>
          </h2>
          <p className="s-lead">
            ADHD is one of the most common neurodevelopmental disorders worldwide.
            It affects children across every country, culture, and background.
          </p>

          {/* Stats — one row, ao-effects-grid style */}
          <div className="c-stat-row">
            {stats.map(({ num, desc, accent }) => (
              <div className={`c-stat-pill c-stat-pill--${accent}`} key={num}>
                <span className="c-stat-pill__num">{num}</span>
                <span className="c-stat-pill__desc">{desc}</span>
              </div>
            ))}
          </div>

          {/* Image below — smaller */}
          <div className="c-epi-img-wrap">
            <div className="s-img-card">
              <img src="/epid.jpg" alt="How common is ADHD" />
              <p className="s-img-caption">
                ADHD affects children across every country, culture, and background
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MYTHS — ACCORDION ────────────────────────────────── */}
      <section className="s-section">
        <div className="s-container s-container--wide">
          <p className="s-label">Clearing the air</p>
          <h2 className="s-title">
            Myths &amp; <span className="s-gradient-text">Misconceptions</span>
          </h2>
          <p className="s-lead">
            ADHD is one of the most misunderstood conditions in childhood. These myths
            delay diagnosis, increase shame, and hurt families. Let's set the record straight.
          </p>

          <div className="c-myths-list">
            {myths.map((item, i) => (
              <MythItem key={i} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STIGMA ───────────────────────────────────────────── */}
      <section className="s-section s-section--alt">
        <div className="s-container s-container--wide">
          <p className="s-label">Social Impact</p>
          <h2 className="s-title">
            The stigma children{" "}
            <span className="s-gradient-text">still face</span>
          </h2>
          <p className="s-lead">
            Beyond the diagnosis itself, children with ADHD often carry an invisible
            burden — the weight of how others see them. Stigma can delay diagnosis,
            reduce treatment, and worsen outcomes.
          </p>

          <div className="c-stigma-grid">
            {stigmaCards.map(({ icon, title, desc, accent }) => (
              <div className={`c-stigma-card c-stigma-card--${accent}`} key={title}>
                <span className="c-stigma-card__icon">{icon}</span>
                <h3 className="c-stigma-card__title">{title}</h3>
                <p className="c-stigma-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="s-section s-section--cta">
        <div className="s-container s-container--wide">
          <div className="s-cta-banner">
            <div className="s-cta-banner__quote">"</div>
            <div className="s-cta-banner__body">
              <p className="s-cta-banner__lead">
                Understanding why ADHD happens removes blame and replaces it with something far
                 more powerful — the ability to support and guide effectively.
                  You're already taking that step by being here. Now, 
                  let’s move forward to <strong> understanding how ADHD can be managed and treated </strong>.
              </p>
              <div className="s-cta-banner__divider" />
              <div className="s-tag-row">
                <span className="s-tag">Evidence-based</span>
                <span className="s-tag">Parent-friendly</span>
                <span className="s-tag">Not your fault</span>
              </div>
              <Link to="/treatment" className="btn btn-outline-blue s-cta-banner__btn">
                Explore Treatment →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}