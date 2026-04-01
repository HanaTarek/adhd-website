import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Support.css";

/* ─── DATA ──────────────────────────────────────────────────── */

const accommodations = [
  { icon: "⏱️", text: "Extra time on tests and assignments" },
  { icon: "📋", text: "Instructions tailored to the child's level" },
  { icon: "🌟", text: "Positive reinforcement and immediate feedback" },
  { icon: "💻", text: "Technology tools to assist with tasks" },
  { icon: "🏃", text: "Scheduled breaks or time to move around" },
  { icon: "🔇", text: "Reduced distractions in the environment" },
  { icon: "📂", text: "Extra help with organisation and planning" },
  { icon: "📝", text: "Written copies of verbal instructions" },
];

const strategies = [
  {
    title: "Give Transition Warnings",
    body: "ADHD can make it hard for students to transition from one activity to another. Giving advance notice helps students switch gears and be prepared for what’s next. One effective method is using nonverbal signals. For example, you can tap on a student’s desk as a sign that you’ll call on them next.",
  },
  {
    title: "Give Feedback with Respectful Redirection",
    body: "Since students with ADHD may have difficulty managing emotions, feedback should be immediate, calm, and concise. Respectful redirection is a positive behavior strategy that allows you to give in-the-moment feedback without making a big issue of it. Address the issue quickly and as privately as possible.",
  },
  {
    title: "Break Directions Into Chunks",
    body: "Students with ADHD can struggle with multi-step directions, so breaking tasks into manageable chunks is essential. Although it may take more time initially, it prevents confusion and frustration later. For example, when working on an art project: first explain the purpose, then review the materials and allow students time to prepare them, and finally give clear instructions on how to proceed.",
  },
  {
    title: "Set a Timer",
    body: "Knowing how long an activity will last helps students with ADHD stay engaged. You can use a timer to show time remaining or signal when a break or transition is coming. Try projecting a timer in class or using a free online classroom timer. However, be aware that timers may cause anxiety for some students, so alternative strategies may be needed.",
  },
  {
    title: "Use Checklists and Schedules",
    body: "Time management and organization can be challenging for students with ADHD. They may struggle to arrive on time, complete tasks, or keep track of materials. Using schedules and checklists helps students stay organized. Sharing these tools with families can also support organization at home.",
  },
  {
    title: "Take Brain Breaks",
    body: "Sitting still for long periods can be difficult for students with ADHD. Brain breaks are short, structured pauses that include movement, mindfulness, or sensory activities. Physical breaks like stretching help students release energy, while calming activities like deep breathing help them reset and refocus.",
  },
  {
    title: "Use Wait Time",
    body: "Students with ADHD may rush to answer questions without fully thinking. Wait time, or 'think time,' involves asking a question and pausing for 3–7 seconds before taking responses. This allows students to process information and respond more thoughtfully. When used consistently, students feel less pressure to answer immediately.",
  },
  {
    title: "Teach with Empathy",
    body: "Students with ADHD are not intentionally misbehaving; they are often trying their best to stay focused and organized. Understanding this and responding with empathy helps them feel supported and understood, which improves engagement and behavior.",
  },
];
const commTabs = [
  {
    id: "communication",
    label: "Effective Communication",
    icon: "💬",
    intro:
      "Children with ADHD have impaired executive functioning, affecting attention, information processing, and emotional regulation. Children process information differently — here is how you can bridge that gap.",
    tip: "Always secure attention before giving information. Eye contact and calm tone are more powerful than repetition.",
    cards: [
      {
        icon: "👁️",
        title: "Get Their Attention First",
        desc: "Before speaking, minimise distractions and call the child's name. Ensure you have eye contact and speak slowly and calmly to improve their understanding.",
        accent: "blue",
      },
      {
        icon: "📢",
        title: "Keep Instructions Simple",
        desc: "Give one clear, specific instruction at a time to avoid brain overload. Deliver directions quietly to reduce overstimulation, and show them how to do the task if needed.",
        accent: "pink",
      },
      {
        icon: "🧘",
        title: "Stay Calm and Flexible",
        desc: "Remain supportive even during difficult moments. Yelling or harsh criticism can worsen emotional distress. Adjust your expectations to match their developmental level rather than their actual age.",
        accent: "gradient",
      },
    ],
  },
  {
    id: "selfesteem",
    label: "Building Self-Esteem",
    icon: "⭐",
    intro:
      "Children with ADHD often struggle with low confidence due to repeated criticism and academic difficulties. Consistent encouragement and a focus on what they do well builds the emotional resilience they need.",
    tip: "Catch them doing something right every day — even something small. Over time, this shifts the dynamic from correction to connection.",
    cards: [
      {
        icon: "⭐",
        title: "Prioritise Positive Reinforcement",
        desc: "Focus on praising effort and small successes through verbal good jobs, smiles, or a pat on the shoulder. Consistent encouragement builds the emotional resilience needed to handle challenges.",
        accent: "blue",
      },
      {
        icon: "🏆",
        title: "Focus on Strengths",
        desc: "Help the child find activities they enjoy like art, music, or sports. Success in these areas boosts their confidence and provides a healthy outlet for their energy.",
        accent: "purple",
      },
      {
        icon: "🤝",
        title: "Supportive Discipline",
        desc: "Use consistent, structured discipline that focuses on teaching rather than punishing. Brief, calm timeouts can be used to help the child regain control when they are overwhelmed.",
        accent: "green",
      },
    ],
  },
  {
    id: "structure",
    label: "Structure & Routine",
    icon: "📅",
    intro:
      "ADHD brains thrive on predictability. Visual structure and consistent daily rhythms reduce decision fatigue, lower anxiety, and free up mental energy for learning and connection.",
    tip: "If a schedule change is coming, explain it in advance. Even a quick heads-up gives the child time to mentally prepare and reduces meltdowns.",
    cards: [
      {
        icon: "🗓️",
        title: "Create a Predictable World",
        desc: "Use visual aids like charts, calendars, and written schedules to organise the day. Keep a quiet, distraction-free space for homework and label where toys and school supplies go to reduce daily frustration.",
        accent: "blue",
      },
      {
        icon: "🔁",
        title: "Establish Steady Routines",
        desc: "Consistent times for meals, homework, and sleep reduce anxiety. If a change in the schedule is coming, explain it in advance so the child has time to adjust.",
        accent: "pink",
      },
      {
        icon: "🌿",
        title: "Encourage Healthy Lifestyles",
        desc: "Regular physical activity, good sleep hygiene, and balanced nutrition all directly support attention, emotional regulation, and behaviour — alongside any other treatment.",
        accent: "gradient",
      },
    ],
  },
  {
    id: "social",
    label: "Social Skills",
    icon: "🤝",
    intro:
      "Children with ADHD often find social situations harder to navigate — not because they don't care, but because impulsivity, emotional sensitivity, and attention difficulties get in the way. With support, these skills can be built.",
    tip: "Model the social behaviour you want to see. Children with ADHD learn best by watching — narrate what you're doing and why as you interact with others.",
    cards: [
      {
        icon: "🌟",
        title: "Social Success",
        desc: "Help the child learn how to interact with others by modelling good communication yourself. Recognise and praise their positive interactions to help reduce social isolation.",
        accent: "blue",
      },
    ],
  },
];
 
const routineCards = [
  {
    id: "sleep",
    icon: "😴",
    title: "Sleep",
    desc: "Consistent bedtimes and a calming pre-sleep routine are essential. Poor sleep significantly worsens attention, mood, and impulse control the following day.",
  },
  {
    id: "diet",
    icon: "🥗",
    title: "Balanced Diet",
    desc: "Regular meals with protein, healthy fats, and complex carbohydrates stabilise blood sugar and support the neurotransmitter production ADHD brains need.",
  },
  {
    id: "move",
    icon: "🏃",
    title: "Daily Exercise",
    desc: "Physical activity naturally increases dopamine and norepinephrine — the same neurotransmitters targeted by ADHD medication. Even 20 minutes a day improves focus and emotional control.",
  },
];

/* ─── SCROLL REVEAL HOOK ────────────────────────────────────── */
function useReveal() {
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("sp-reveal--visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    refs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const r = (el, extra = "") => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  const ref = (extraClasses = "") => el => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  };

  return refs;
}

/* ─── STRATEGY ACCORDION ITEM ───────────────────────────────── */
function StrategyItem({ num, title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`sp-strategy ${open ? "sp-strategy--open" : ""}`}>
      <button
        className="sp-strategy__trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="sp-strategy__num">{String(num).padStart(2, "0")}</span>
        <span className="sp-strategy__title">{title}</span>
        <span className="sp-strategy__chevron" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="sp-strategy__body">{body}</div>}
    </div>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────── */
export default function Support() {
  const [activeComm, setActiveComm] = useState("communication");
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("sp-reveal--visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const r = (el, ...classes) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div className="s-page">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="sp-hero">
        <div className="sp-hero__blob sp-hero__blob--purple" />
        <div className="sp-hero__blob sp-hero__blob--blue" />
        <div className="sp-hero__inner">
          <div className="sp-hero__content">
            <h1 className="sp-hero__title">
              They Don't Need to{" "}
              <span className="s-gradient-text">Try Harder.</span>
              <br />They Need Better{" "}
              <span className="s-gradient-text">Support.</span>
            </h1>
            <p className="sp-hero__lead">
              Children with ADHD thrive when the adults around them — parents,
              teachers, and caregivers — understand how to meet their needs.
              This page gives you the practical tools to build that bridge:
              at school, at home, and in every conversation.
            </p>
          </div>
          <div className="sp-hero__image-wrap">
            <img
              src="/htst.webp"
              alt="Teacher helping a child at school"
              className="sp-hero__image"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 1: SCHOOL SUPPORT — text LEFT, image RIGHT ── */}
      <section className="s-section">
        <div className="s-container s-container--wide">
          <div className="sp-split sp-split--img-right">

            {/* LEFT — text content */}
            <div
              className="sp-split__text-col sp-reveal sp-reveal--left"
              ref={el => r(el)}
            >
              <p className="s-label">What Schools Can Offer</p>
              <h2 className="s-title">
                School{" "}
                <span className="s-gradient-text">
                  support &amp; accommodations
                </span>
              </h2>
              <p className="s-lead">
                Schools can provide a range of formal and informal supports for
                children with ADHD. These don't label a child — they level the
                playing field so they can show what they're truly capable of.
              </p>

              <div className="s-callout">
                Schools may offer <strong>ADHD-specific treatments</strong>{" "}
                such as behavioural classroom management,{" "}
                <strong>special education services</strong>, and{" "}
                <strong>accommodations</strong> to reduce the impact of ADHD
                on learning. Ask your child's school what is available.
              </div>

              <div className="sp-accom-grid">
                {accommodations.map(({ icon, text }) => (
                  <div className="sp-accom-item" key={text}>
                    <span className="sp-accom-item__icon">{icon}</span>
                    <span className="sp-accom-item__text">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — image */}
            <div
              className="sp-split__img-col sp-reveal sp-reveal--right sp-reveal--d1"
              ref={el => r(el)}
            >
              <div className="sp-split__glow sp-split__glow--tr" />
              <div className="sp-split__glow sp-split__glow--bl" />
              <div className="sp-split__img-frame">
                <img
                  src="rt.webp"
                  alt="Teacher and student working together in the classroom"
                />
                <div className="sp-split__badge">
                  <span className="sp-split__badge__icon">🏫</span>
                  <span className="sp-split__badge__text">
                    8 school accommodations available
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 2: STRATEGIES — image LEFT, text RIGHT ──────── */}
      <section className="s-section s-section--alt">
        <div className="s-container s-container--wide">
          <div className="sp-split sp-split--img-left">

            {/* LEFT — image (order -1 via CSS) */}
            <div
              className="sp-split__img-col sp-reveal sp-reveal--left sp-reveal--d1"
              ref={el => r(el)}
            >
              <div className="sp-split__glow sp-split__glow--tl" />
              <div className="sp-split__glow sp-split__glow--br" />
              <div className="sp-split__img-frame">
                <img
                  src="./ts.webp"
                  alt="Teacher using visual aids with a student"
                />
                <div className="sp-split__badge sp-split__badge--left">
                  <span className="sp-split__badge__icon">✅</span>
                  <span className="sp-split__badge__text">
                    8 evidence-backed strategies
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT — accordion text */}
            <div
              className="sp-split__text-col sp-reveal sp-reveal--right"
              ref={el => r(el)}
            >
              <p className="s-label">In the Classroom</p>
              <h2 className="s-title">
                8 strategies that{" "}
                <span className="s-gradient-text">actually work</span>
              </h2>
              <p className="s-lead">
                These evidence-backed teaching strategies help children with
                ADHD stay regulated, engaged, and supported throughout the
                school day. Share them with your child's teacher — or use
                them at home.
              </p>

              <div className="sp-strategies-list">
                {strategies.map((s, i) => (
                  <StrategyItem
                    key={i}
                    num={i + 1}
                    title={s.title}
                    body={s.body}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

     {/* ── COMMUNICATION ────────────────────────────────────── */}
      <section className="s-section">
        <div className="s-container s-container--wide">
          <p className="s-label sp-reveal" ref={el => r(el)}>
            Talking to Your Child
          </p>
          <h2 className="s-title sp-reveal sp-reveal--d1" ref={el => r(el)}>
            Communication{" "}
            <span className="s-gradient-text">strategies for parents</span>
          </h2>
          <p className="s-lead sp-reveal sp-reveal--d2" ref={el => r(el)}>
            Children with ADHD have impaired executive functioning, which affects
            how they receive and process information. These strategies help you
            bridge that gap — reducing conflict, building trust, and strengthening
            your relationship.
          </p>
 
          {/* Tab bar */}
          <div className="sp-comm-tabs sp-reveal sp-reveal--d3" ref={el => r(el)}>
            {commTabs.map(({ id, icon, label }) => (
              <button
                key={id}
                className={`sp-comm-tab ${activeComm === id ? "sp-comm-tab--active" : ""}`}
                onClick={() => setActiveComm(id)}
              >
                <span className="sp-comm-tab__icon">{icon}</span>
                {label}
              </button>
            ))}
          </div>
 
          {/* Tab panels */}
          {commTabs.map(({ id, intro, tip, cards }) => (
            <div
              key={id}
              className={`sp-comm-panel ${activeComm === id ? "sp-comm-panel--visible" : ""}`}
              role="tabpanel"
            >
              {/* Intro + tip */}
              <div className="sp-comm-info">
                <p className="sp-comm-info__desc">{intro}</p>
                <div className="sp-comm-info__tip">
                  💡 <strong>Parent tip:</strong> {tip}
                </div>
              </div>
 
              {/* Cards */}
              <div className="sp-comm-grid">
                {cards.map(({ icon, title, desc, accent }, i) => (
                  <div
                    className={`sp-comm-card sp-comm-card--${accent}`}
                    key={title}
                  >
                    <span className="sp-comm-card__icon">{icon}</span>
                    <h3 className="sp-comm-card__title">{title}</h3>
                    <p className="sp-comm-card__desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ── ROUTINE & LIFESTYLE ──────────────────────────────── */}
      <section className="s-section s-section--alt">
        <div className="s-container s-container--wide">
          <p className="s-label sp-reveal" ref={el => r(el)}>
            Healthy Foundations
          </p>
          <h2
            className="s-title sp-reveal sp-reveal--d1"
            ref={el => r(el)}
          >
            The three pillars of{" "}
            <span className="s-gradient-text">daily routine</span>
          </h2>
          <p
            className="s-lead sp-reveal sp-reveal--d2"
            ref={el => r(el)}
          >
            Structure and routine reduce anxiety and impulsivity in children
            with ADHD. Three lifestyle pillars — sleep, diet, and exercise —
            have a direct neurological impact on the symptoms your child
            experiences every day.
          </p>

          <div className="sp-routine-strip">
            {routineCards.map(({ id, icon, title, desc }, i) => (
              <div
                className={`sp-routine-card sp-routine-card--${id} sp-reveal sp-reveal--d${i + 1}`}
                key={id}
                ref={el => r(el)}
              >
                <span className="sp-routine-card__icon">{icon}</span>
                <h3 className="sp-routine-card__title">{title}</h3>
                <p className="sp-routine-card__desc">{desc}</p>
              </div>
            ))}
          </div>

          <div className="s-callout sp-reveal" ref={el => r(el)} style={{ marginTop: "28px" }}>
            <strong>If a schedule change is coming,</strong> explain it to
            your child in advance. Children with ADHD benefit enormously from
            predictability — surprises, even positive ones, can trigger anxiety
            and dysregulation.
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="s-section s-section--cta">
        <div className="s-container s-container--wide">
          <div className="s-cta-banner sp-reveal" ref={el => r(el)}>
            <div className="s-cta-banner__quote">"</div>
            <div className="s-cta-banner__body">
              <p className="s-cta-banner__lead">
                With the right support, children with ADHD can truly thrive.
                 Consistency between home and school lays the foundation — 
                 and healthy habits help sustain that progress. 
                 <strong>You're not just helping them cope with ADHD — you're helping them flourish as they are.</strong>

              </p>
              <div className="s-cta-banner__divider" />
              <div className="s-tag-row">
                <span className="s-tag">School strategies</span>
                <span className="s-tag">Parent communication</span>
                <span className="s-tag">Routine &amp; structure</span>
                <span className="s-tag">Evidence-based</span>
              </div>
              <Link
                to="/nutrition"
                className="btn btn-outline-blue s-cta-banner__btn"
              >
                Explore Healthy Habits →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}