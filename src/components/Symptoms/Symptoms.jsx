import "./Symptoms.css";
import { Link } from "react-router-dom";

/* ─── DATA ──────────────────────────────────────────────────── */

const signCards = [
  {
    icon: "🎯",
    title: "Easily Distracted",
    desc: "Loses focus mid-task, misses details, and struggles to follow through on instructions.",
    accent: "blue",
  },
  {
    icon: "⚡",
    title: "Impulsive Actions",
    desc: "Acts without thinking, interrupts conversations, and finds it hard to wait their turn.",
    accent: "pink",
  },
  {
    icon: "🌀",
    title: "Constant Movement",
    desc: "Fidgets, can't stay seated, and always seems to be 'on the go' even in quiet settings.",
    accent: "gradient",
  },
];

const typeCards = [
  {
    icon: "💭",
    title: "Predominantly Inattentive",
    desc: "Mainly struggles to focus and stay organised. Often overlooked — especially in girls.",
    accent: "blue",
  },
  {
    icon: "🌪️",
    title: "Hyperactive-Impulsive",
    desc: "Mainly shows restlessness and impulsive behaviour with fewer attention difficulties.",
    accent: "pink",
  },
  {
    icon: "🔀",
    title: "Combined Presentation",
    desc: "Shows both inattention and hyperactive-impulsive symptoms. The most commonly diagnosed type.",
    accent: "gradient",
  },
];

const whenCards = [
  {
    icon: "⏱️",
    title: "Patterns That Don’t Fade",
    desc: "Symptoms must persist for at least six months — not just a rough patch — and beyond what's expected for their age.",
    accent: "blue",
  },
  {
    icon: "🏠",
    title: "More Than One Setting",
    desc: "Behaviours that appear only at school may be environmental. ADHD shows up at home, school, and in social settings.",
    accent: "pink",
  },
  {
    icon: "📉",
    title: "Daily Life Is Affected",
    desc: "Struggling to keep up with schoolwork, follow instructions, or maintain friendships are signs of real impact.",
    accent: "gradient",
  },
  {
    icon: "❤️",
    title: "Emotional Concerns Too",
    desc: "ADHD isn’t just about focus. It can also show up as frustration, irritability, emotional outbursts, or low self-confidence. Without support, these challenges can grow into anxiety, low mood, or behavioral difficulties.",
    accent: "blue",
  },
];

/* ─── COMPONENT ─────────────────────────────────────────────── */
export default function Symptoms() {
  return (
    <div className="s-page">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="guide-hero">
        <div className="s-hero__blob s-hero__blob--pink" />
        <div className="s-hero__blob s-hero__blob--blue" />
        <h1>
          Understanding What  <br />
          Your Child <span className="s-gradient-text">Might Be <br/>Showing You</span>
        </h1>
        <p className="guide-hero-sub">
          "Behind every repeated struggle is a story. Recognizing the signs early can make all the difference."
        </p>
      </div>

      {/* ── SECTION 1 — text LEFT, image RIGHT ───────────────── */}
      <section className="s-section">
        <div className="s-container s-container--wide">
          <div className="s-split">

            {/* Left — text + cards */}
            <div className="s-split__text">
              <p className="s-label">Signs &amp; Symptoms</p>
              <h2 className="s-title">
                Core <span className="s-gradient-text">signs to look for</span>
              </h2>
              <p className="s-lead">
                Children with ADHD don't simply grow out of these behaviours — they persist,
                can be intense, and show up across school, home, and friendships.
              </p>

              <div className="s-callout">
                Look especially for patterns that show up in{" "}
                <strong>more than one setting</strong>, like both home <em>and</em> school.
              </div>

              <div className="s-cards-grid s-cards-grid--col">
                {signCards.map(({ icon, title, desc, accent }) => (
                  <div className={`s-card s-card--${accent}`} key={title}>
                    <span className="s-card__icon">{icon}</span>
                    <h3 className="s-card__title">{title}</h3>
                    <p className="s-card__desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — image */}
            <div className="s-split__image">
              <div className="s-img-card">
                <img src="/signs-of-adhd.jpg" alt="ADHD Symptoms" />
                <p className="s-img-caption">
                  Common signs parents and caregivers may notice in children with ADHD
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 2 — image LEFT, text RIGHT ───────────────── */}
      <section className="s-section s-section--alt">
        <div className="s-container s-container--wide">
          <div className="s-split s-split--reverse">

            {/* Left — image */}
            <div className="s-split__image">
              <div className="s-img-card">
                <img src="types-of-symptoms.jpg" alt="ADHD Types" />
                <p className="s-img-caption">
                  Every child is unique — understanding the type of symptoms helps provide the right support
                </p>
              </div>
            </div>

            {/* Right — text + cards */}
            <div className="s-split__text">
              <p className="s-label">Presentations</p>
              <h2 className="s-title">
                How ADHD looks{" "}
                <span className="s-gradient-text">different in each child</span>
              </h2>
              <p className="s-lead">
                ADHD isn't one-size-fits-all. There are three presentations — and because every
                child is different, No two children experience ADHD the same way. It can show up differently—and even change as they grow.
              </p>

              <div className="s-cards-grid s-cards-grid--col">
                {typeCards.map(({ icon, title, desc, accent }) => (
                  <div className={`s-card s-card--${accent}`} key={title}>
                    <span className="s-card__icon">{icon}</span>
                    <h3 className="s-card__title">{title}</h3>
                    <p className="s-card__desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 3 — When to seek help (full width, 2×2 grid) */}
      <section className="s-section">
        <div className="s-container s-container--wide">
          <p className="s-label">Professional Guidance</p>
          <h2 className="s-title">
            When to seek{" "}
            <span className="s-gradient-text">professional help</span>
          </h2>
          <p className="s-lead">
            The American Academy of Pediatrics and the Centers for Disease Control and Prevention recommends evaluation for children aged{" "}
            <strong>4 to 18</strong> who show persistent academic or behavioural concerns.
          </p>

          <div className="s-rule-grid">
            {whenCards.map(({ icon, title, desc, accent }) => (
              <div className={`s-rule-card s-rule-card--${accent}`} key={title}>
                <span className="s-rule-icon">{icon}</span>
                <p className="s-rule-title">{title}</p>
                <p className="s-rule-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="s-section s-section--cta">
        <div className="s-container s-container--wide">
          <div className="s-cta-banner">
            <div className="s-cta-banner__quote">"</div>
            <div className="s-cta-banner__body">
              <p className="s-cta-banner__lead">
                Trust your instincts as a parent. Early support makes a real difference.
                If something feels off, a professional evaluation is the best next step —{" "}
                <strong>not a label, but a roadmap for your child.</strong>
              </p>
              <div className="s-cta-banner__divider" />
              <div className="s-tag-row">
                <span className="s-tag">Ages 4–18</span>
                <span className="s-tag">Seek a psychiatrist</span>
                <span className="s-tag">Early support matters</span>
              </div>
              <Link to="/quiz" className="btn btn-outline-blue s-cta-banner__btn">
                Take The Quiz →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}