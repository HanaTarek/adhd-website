/* ================================================================
   ADHDOverview.jsx
   ----------------------------------------------------------------
   📌 PURPOSE:
   The ADHD overview/about page. Matches the site's existing
   design language: light #f5f7fa bg, white cards, blue/pink
   gradient accents, pill buttons, --font-display headings.

   🎨 STYLES: imported from ./ADHDOverview.css
   📦 USED IN: your pages/ folder / router
   ================================================================ */

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Overview.css';

/* ─── DATA ──────────────────────────────────────────────────── */
const coreSymptoms = [
  {
    icon: '🎯',
    title: 'Trouble Paying Attention',
    desc: 'Difficulty sustaining focus on tasks, easily distracted by outside stimuli.',
    accent: 'blue',
  },
  {
    icon: '⚡',
    title: 'Impulsive Behaviours',
    desc: 'Acting without thinking, interrupting others, difficulty waiting their turn.',
    accent: 'pink',
  },
  {
    icon: '🌀',
    title: 'Overly Active',
    desc: 'Constant movement, fidgeting, unable to stay seated for extended periods.',
    accent: 'gradient',
  },
];

const brainEffects = [
  { icon: '🔍', label: 'Struggle to stay focused' },
  { icon: '🌊', label: 'Hard to control emotions' },
  { icon: '😤', label: 'Gets frustrated easily' },
  { icon: '💥', label: 'Acts impulsively' },
  { icon: '🤝', label: 'Difficulty with social interactions' },
];

const timeline = [
  {
    num: '01',
    title: 'Age of Onset',
    desc: 'Symptoms start around age 4 or older, when developmental expectations become clearer.',
  },
  {
    num: '02',
    title: 'Duration',
    desc: 'Behaviours persist for at least 6 months — not just occasional episodes.',
  },
  {
    num: '03',
    title: 'Daily Impact',
    desc: 'Symptoms meaningfully affect daily life at school, home, or in friendships.',
  },
];

/* ─── COMPONENT ─────────────────────────────────────────────── */
export default function ADHDOverview() {
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('ao-visible');
        }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const r = el => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div className="ao-page">

      {/* ── HERO BANNER ──────────────────────────────────────── */}
      <section className="ao-hero">
        <div className="ao-hero__blob ao-hero__blob--pink" />
        <div className="ao-hero__blob ao-hero__blob--blue" />

        <div className="ao-hero__inner container">

          {/* LEFT — text content */}
          <div className="ao-hero__content">
            <h1 className="ao-hero__title">
              Understanding ADHD is the{' '}
              <span className="ao-gradient-text">first step</span>{' '}
              to helping a child <span className="ao-gradient-text">succeed</span>.
            </h1>

            <p className="ao-hero__lead">
              ADHD is one of the most common neurodevelopmental disorders of
              childhood, often continuing into adulthood. Knowledge is the most
              powerful tool parents have.
            </p>

            {/* <div className="ao-hero__ctas">
              <Link to="/quiz" className="btn btn-outline">
                Take the Quiz
              </Link>
              <a href="#ao-what" className="btn btn-outline-gradient">
                Learn More ↓
              </a>
            </div> */}
          </div>

          {/* RIGHT — image */}
          <div className="ao-hero__image-wrap">
            <img
              src="/AD.webp"
              alt="Children playing and learning"
              className="ao-hero__image"
            />
          </div>

        </div>
      </section>

      {/* ── WHAT IS ADHD ─────────────────────────────────────── */}
      <section className="ao-section" id="ao-what">
        <div className="container">
          <p className="ao-label" ref={r}>Definition</p>
          <h2 className="ao-title" ref={r}>
            What is <span className="ao-gradient-text">ADHD?</span>
          </h2>
          <p className="ao-lead" ref={r}>
            ADHD — Attention-Deficit/Hyperactivity Disorder — is characterised
            by three core challenges that shape how a child engages with the
            world every day.
          </p>

          <div className="ao-cards-grid">
            {coreSymptoms.map(({ icon, title, desc, accent }) => (
              <div className={`ao-card ao-card--${accent}`} key={title} ref={r}>
                <span className="ao-card__icon">{icon}</span>
                <h3 className="ao-card__title">{title}</h3>
                <p className="ao-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS IN THE BRAIN ────────────────────────── */}
      <section className="ao-section ao-section--alt" id="ao-brain">
        <div className="container">
          <p className="ao-label" ref={r}>Neuroscience</p>
          <h2 className="ao-title" ref={r}>
            What happens in{' '}
            <span className="ao-gradient-text">the brain?</span>
          </h2>
          <p className="ao-lead" ref={r}>
            ADHD affects how the brain manages everyday tasks like focusing,
            making decisions, and controlling emotions. Because of this,
            children might experience:
          </p>

          {/* white card — same pattern as .quiz-card */}
          <div className="ao-brain-card" ref={r}>
            <div className="ao-effects-grid">
              {brainEffects.map(({ icon, label }, i) => (
                <div className="ao-effect-item" key={label} ref={r}>
                  <span className="ao-effect-item__icon">{icon}</span>
                  <span className="ao-effect-item__label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHEN TO NOTICE IT ────────────────────────────────── */}
      <section className="ao-section" id="ao-notice">
        <div className="container">
          <p className="ao-label" ref={r}>Symptoms</p>
          <h2 className="ao-title" ref={r}>
            When should you{' '}
            <span className="ao-gradient-text">notice it?</span>
          </h2>
          <p className="ao-lead" ref={r}>
            For ADHD to be formally considered, symptoms must meet three key
            criteria — helping families distinguish ADHD from typical childhood
            behaviour.
          </p>

          <div className="ao-timeline" ref={r}>
            {timeline.map(({ num, title, desc }, i) => (
              <div className="ao-tl-item" key={num}>
                {/* connector line between items */}
                {i < timeline.length - 1 && (
                  <div className="ao-tl-item__line" />
                )}
                <div className="ao-tl-item__num">{num}</div>
                <div className="ao-tl-item__body">
                  <h3 className="ao-tl-item__title">{title}</h3>
                  <p className="ao-tl-item__desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="ao-cta-banner">
        <div className="container">
          <div className="ao-cta-banner__inner" ref={r}>

            {/* left decorative quote mark */}
            <div className="ao-cta-banner__quote-mark">"</div>

            <div className="ao-cta-banner__body">
              <p className="ao-cta-banner__lead">
                Sometimes what looks like misbehavior is actually a child
                struggling in ways we don't immediately see. Learning to
                recognize the signs of ADHD can help you better understand
                and support your child.{' '}
                <span className="ao-cta-banner__highlight">
                  Take a moment to explore the symptoms and see what to look for.
                </span>
              </p>

              <div className="ao-cta-banner__divider" />

              <Link to="/symptoms" className="btn btn-outline-blue ao-cta-banner__btn">
                Explore Symptoms →
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}