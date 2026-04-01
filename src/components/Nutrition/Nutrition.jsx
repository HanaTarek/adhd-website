import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Nutrition.css";

/* ─── DATA ──────────────────────────────────────────────────── */

const nutrients = [
  {
    icon: "🐟",
    img: "./salmon.webp",
    name: "Omega-3 Fatty Acids (EPA/DHA)",
    foodLabel: "Fresh salmon fillet",
    desc: "Support dopamine signalling and reduce inflammation. Supplementation has shown improvements in ADHD symptom measures, especially in children with documented deficiencies.",
    sources: "Salmon · Sardines · Walnuts · Flaxseed · Chia seeds",
    color: "blue",
  },
  {
    icon: "⚡",
    img: "./pumkin.webp",
    name: "Zinc",
    foodLabel: "Pumpkin seeds",
    desc: "Involved in dopamine metabolism. Low zinc is linked to more severe ADHD symptoms and poorer response to stimulant medication.",
    sources: "Pumpkin seeds · Beef · Chickpeas · Cashews · Lentils",
    color: "purple",
  },
  {
    icon: "🔩",
    img: "./spinach.webp",
    name: "Iron",
    foodLabel: "Leafy spinach",
    desc: "Essential for neurotransmitter production. Deficiency can worsen attention, impulsivity, and cognitive performance in children.",
    sources: "Red meat · Spinach · Lentils · Tofu · Fortified cereals",
    color: "orange",
  },
  {
    icon: "🌿",
    img: "./dark.webp",
    name: "Magnesium",
    foodLabel: "Dark chocolate & nuts",
    desc: "Supports nervous system regulation. May help reduce hyperactivity and improve sleep quality in children with ADHD.",
    sources: "Dark chocolate · Almonds · Spinach · Avocado · Banana",
    color: "green",
  },
  {
    icon: "🌟",
    img: "./eggs.webp",
    name: "Vitamins B6 & D",
    foodLabel: "Eggs",
    desc: "Involved in serotonin and dopamine synthesis. Both vitamins are commonly low in children with ADHD and affect mood and focus.",
    sources: "Eggs · Fortified milk · Sunlight (Vit D) · Tuna · Chicken",
    color: "pink",
  },
];
 
/*
  ── RESEARCH FINDINGS ──
  4 cards covering points a, b, c, d from your paragraph.
  Point e (sugar) is preserved in the s-callout below the diet section.
*/
const researchFindings = [
  {
    letter: "a",
    color: "blue",
    title: "Dietary Patterns & ADHD Symptoms",
    body: "Children with ADHD tend to eat more simple sugars and ready-made meals, and fewer micronutrients like iron, zinc, and vitamins, compared to peers without ADHD. These patterns are linked to higher symptom severity and higher BMI.",
  },
  {
    letter: "b",
    color: "green",
    title: "Nutrient Deficiencies & the Brain",
    body: "Certain micronutrients are essential for neurotransmitter synthesis. Research links omega-3 fatty acids, zinc, iron, and magnesium to improvements in ADHD symptoms — particularly in children with documented deficiencies.",
  },
  {
    letter: "c",
    color: "purple",
    title: "Diet Modification Effects",
    body: "Clinical studies show that structured diet programs — reducing artificial colours and additives, balancing macronutrients — improve ADHD symptoms, hyperactivity, and learning problems. Benefits come from both direct nutrient effects and BMI reduction.",
  },
  {
    letter: "d",
    color: "orange",
    title: "Whole-Diet Approaches",
    body: "Lower adherence to the Mediterranean diet and higher adherence to 'Western' eating patterns (high processed food, low fruit and vegetables) are associated with greater ADHD prevalence and worse symptom outcomes.",
  },
];
 
const goodFoods = [
  "Oily fish (salmon, sardines, tuna) — omega-3 rich",
  "Eggs, lean meat, legumes — protein stabilises energy",
  "Leafy greens, nuts, seeds — magnesium & zinc",
  "Berries, apples, vegetables — antioxidants",
  "Whole grains — steady blood sugar, better focus",
  "Water — even mild dehydration affects attention",
];
 
const avoidFoods = [
  "Artificial food colours & preservatives",
  "Sugary drinks, sweets, and refined carbohydrates",
  "Ultra-processed ready meals and fast food",
  "Excessive caffeine (in older children)",
  "Trans fats & highly processed snack foods",
];
 

/* Each activity has tabs + cards with images */
const activities = [
  {
    id: "breathing",
    icon: "🫧",
    label: "Breathing Games",
    desc: "ADHD brains respond well to visual and playful breathing. Short bursts of 1–3 minutes work best — no need for long sessions.",
    tip: "Try right before homework time or after a frustrating moment. Even 2 minutes can reset their nervous system.",
    cards: [
      {
        emoji: "🎈",
        img: "./ballon.webp",
        name: "Balloon Breathing",
        desc: "Pretend to inflate a big balloon in the belly slowly",
      },
      {
        emoji: "🫧",
        img: "./bubble.webp",
        name: "Bubble Breathing",
        desc: "Blow real or imaginary bubbles very slowly and steadily",
      },
      {
        emoji: "🧸",
        img: "./stuffed.webp",
        name: "Stuffed Animal Breathing",
        desc: "Watch a toy rise and fall on the tummy while lying down",
      },
      {
        emoji: "⭐",
        img: "./star.webp",
        name: "Star Breathing",
        desc: "Trace a star shape while breathing in and out each point",
      },
    ],
  },
  {
    id: "sensory",
    icon: "🤲",
    label: "Sensory Activities",
    desc: "Sensory input helps regulate the nervous system, reducing overwhelm and improving focus without escalating behaviour.",
    tip: "Introduce sensory tools calmly before a child becomes overwhelmed — not as a reaction to meltdowns.",
    cards: [
      {
        emoji: "🏖️",
        img: "./sand.webp",
        name: "Kinetic Sand",
        desc: "Soothing tactile input that keeps hands and attention engaged",
      },
      {
        emoji: "🫱",
        img: "./stress.webp",
        name: "Stress Balls",
        desc: "Squeeze and release to channel tension and nervous energy",
      },
      {
        emoji: "🛋️",
        img: "./blanket.webp",
        name: "Weighted Blanket",
        desc: "Deep pressure input that calms the nervous system naturally",
      },
      {
        emoji: "💧",
        img: "./water.webp",
        name: "Water Play",
        desc: "Naturally regulating and absorbing — works for all ages",
      },
    ],
  },
  {
    id: "movement",
    icon: "🏃",
    label: "Heavy Work",
    desc: '"Heavy work" provides deep pressure to muscles and joints, often calming hyperactivity better than asking a child to sit still.',
    tip: "Schedule heavy work before school, after school, and before homework. Just 5–10 minutes can reset their mood.",
    cards: [
      {
        emoji: "🧱",
        img: "./wall.webp",
        name: "Wall Push-ups",
        desc: "Great in small spaces, no equipment — full body input",
      },
      {
        emoji: "🐻",
        img: "./u.webp",
        name: "Bear Crawls",
        desc: "Crawl across the room on hands and feet — full body reset",
      },
      {
        emoji: "🛒",
        img: "./books.webp",
        name: "Carrying Books",
        desc: "Purposeful heavy lifting gives satisfying muscle feedback",
      },
      {
        emoji: "🧺",
        img: "./bass.webp",
        name: "Push a Basket",
        desc: "Pushing furniture or laundry baskets offers great resistance",
      },
    ],
  },
  {
    id: "rhythm",
    icon: "🎵",
    label: "Rhythm & Sound",
    desc: "Rhythm helps organise an ADHD brain. Predictable sound patterns engage attention systems without overstimulating.",
    tip: "Create a 'homework playlist' of soft instrumental music — the routine itself becomes a focusing signal over time.",
    cards: [
      {
        emoji: "🎹",
        img: "./piano.webp",
        name: "Instrumental Music",
        desc: "Soft music with no lyrics — supports focus without distraction",
      },
      {
        emoji: "🌊",
        img: "./machine.webp",
        name: "White Noise",
        desc: "Masks distracting background sounds during homework or rest",
      },
      {
        emoji: "🎶",
        img: "./hum.webp",
        name: "Humming",
        desc: "Vibration from humming naturally helps self-regulation",
      },
      {
        emoji: "👏",
        img: "./clap.webp",
        name: "Clapping Games",
        desc: "Slow rhythmic clapping games that build attention span",
      },
    ],
  },
  {
    id: "focus",
    icon: "🧩",
    label: "Focused Quiet Play",
    desc: "Short achievable quiet activities build concentration gradually. Success in these leads to willingness to try again.",
    tip: "Use a visual timer so children know how long the activity lasts — knowing the end reduces resistance to starting.",
    cards: [
      {
        emoji: "🎨",
        img: "./color.webp",
        name: "Colouring",
        desc: "Especially mandalas or geometric patterns — deeply absorbing",
      },
      {
        emoji: "🧱",
        img: "./lego.webp",
        name: "LEGO Building",
        desc: "Open-ended and deeply absorbing for most ages",
      },
      {
        emoji: "🧩",
        img: "./puzzle.webp",
        name: "Simple Puzzles",
        desc: "Satisfying completable wins that build confidence",
      },
      {
        emoji: "✏️",
        img: "./trace.webp",
        name: "Tracing",
        desc: "Builds fine motor focus and a sense of calm control",
      },
    ],
  },
  {
    id: "nature",
    icon: "🌿",
    label: "Nature Reset",
    desc: "Even 10–15 minutes outside significantly improves emotional regulation. Nature lowers cortisol and restores attention capacity.",
    tip: "No equipment needed. A short walk, barefoot grass time, or cloud watching all count as a nature reset.",
    cards: [
      {
        emoji: "🦶",
        img: "./bb.webp",
        name: "Barefoot Walking",
        desc: "Grounding through grass or soil — sensory and calming",
      },
      {
        emoji: "☁️",
        img: "./c.webp",
        name: "Cloud Watching",
        desc: "Relaxed open attention that feels effortless and restorative",
      },
      {
        emoji: "🍂",
        img: "./collect.webp",
        name: "Nature Collecting",
        desc: "Mindful collecting of leaves, rocks, or sticks is focusing",
      },
      {
        emoji: "🌳",
        img: "./walkk.webp",
        name: "Park Walks",
        desc: "Movement combined with nature for maximum regulation benefit",
      },
    ],
  },
];

/* ─── SCROLL REVEAL HOOK ────────────────────────────────────── */
function useScrollReveal() {
   const [activeAct, setActiveAct] = useState("breathing");
  const refs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("n-reveal--visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    refs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const r = el => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  };
  return r;
}

/* ─── COMPONENT ─────────────────────────────────────────────── */
export default function Nutrition() {
  const [activeAct, setActiveAct] = useState("breathing");
  const r = useScrollReveal();
  const panel = activities.find(a => a.id === activeAct);

  return (
    <div className="s-page">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="n-hero">
        <div className="n-hero__blob n-hero__blob--green" />
        <div className="n-hero__blob n-hero__blob--blue" />
        <div className="n-hero__inner">
          <div className="n-hero__content">
            <h1 className="n-hero__title">
              Feed the Brain,{" "}
              <span className="s-gradient-text">Calm the Mind.</span>
            </h1>
            <p className="n-hero__lead">
              What your child eats and how they move matters more than you
              might think. Nutrition and daily calming activities don't replace
              treatment — but they powerfully support it. Small, consistent
              changes can make a real difference to focus, mood, and behaviour.
            </p>
          </div>
          <div className="n-hero__image-wrap">
            <img
              src="/healthyeating.webp"
              alt="Child eating a healthy meal"
              className="n-hero__image"
            />
          </div>
        </div>
      </section>

      {/* ── NUTRITION OVERVIEW — text + image side by side ──────── */}


      {/* ── NUTRITION OVERVIEW ───────────────────────────────── */}
      <section className="s-section">
        <div className="s-container s-container--wide">
          <p className="s-label">Brain Fuel</p>
          <h2 className="s-title">
            How nutrition affects{" "}
            <span className="s-gradient-text">ADHD symptoms</span>
          </h2>
          <p className="s-lead">
            Nutrition is not a primary cause of ADHD — but research confirms
            that dietary patterns, nutrient status, and blood sugar stability
            all influence symptom severity, cognitive function, and behavioural
            outcomes in children and adults with ADHD.
          </p>
 
          <div className="s-callout">
            <strong>Key insight:</strong> ADHD affects the brain's dopamine and
            norepinephrine systems. Several micronutrients are directly involved
            in producing and regulating these neurotransmitters — making diet a
            meaningful, evidence-backed part of support.
          </div>
 
          {/* ─── RESEARCH FINDINGS (a · b · c · d) ───────────── */}
          {/*
            These 4 cards surface the research points from your paragraph
            that were previously missing from the component:
            a) eating patterns, b) nutrient deficiencies,
            c) diet modification effects, d) whole-diet approaches.
            Point (e) — sugar — is preserved in the callout below the food guide.
          */}
          <div className="n-research-grid">
            {researchFindings.map(({ letter, color, title, body }) => (
              <div
                className={`n-research-card n-research-card--${color}`}
                key={letter}
              >
                <span className="n-research-card__badge">{letter}</span>
                <div className="n-research-card__content">
                  <p className="n-research-card__title">{title}</p>
                  <p className="n-research-card__body">{body}</p>
                </div>
              </div>
            ))}
          </div>
 
          {/* ─── NUTRIENT IMAGE CARDS ─────────────────────────── */}
          <p className="s-label" style={{ marginBottom: "12px" }}>
            Key nutrients to know
          </p>
          <div className="n-nutrients-cards">
            {nutrients.map(({ icon, img, name, foodLabel, desc, sources, color }) => (
              <div className={`n-nutrient-card n-nutrient-card--${color}`} key={name}>
 
                {/* Photo */}
                <div className="n-nutrient-card__img">
                  <img
                    src={img}
                    alt={foodLabel}
                    onError={e => {
                      e.target.style.display = "none";
                      const fb = e.target.parentNode.querySelector(
                        ".n-nutrient-card__emoji"
                      );
                      if (fb) fb.style.display = "flex";
                    }}
                  />
                  <div className="n-nutrient-card__emoji" style={{ display: "none" }}>
                    {icon}
                  </div>
                </div>
 
                {/* Body */}
                <div className="n-nutrient-card__body">
                  <p className="n-nutrient-card__name">{name}</p>
                  <p className="n-nutrient-card__food">{foodLabel}</p>
                  <p className="n-nutrient-card__desc">{desc}</p>
                  {sources && (
                    <p className="n-nutrient-card__sources">
                      <strong>Sources:</strong> {sources}
                    </p>
                  )}
                </div>
 
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── FOOD GUIDE ───────────────────────────────────────── */}
      <section className="s-section s-section--alt">
        <div className="s-container s-container--wide">
          <p className="s-label">Practical Food Guide</p>
          <h2 className="s-title">
            What to eat{" "}
            <span className="s-gradient-text">more — and less — of</span>
          </h2>
          <p className="s-lead">
            No single food causes or cures ADHD. But patterns matter. A
            Mediterranean-style diet — rich in whole foods, protein, healthy
            fats, and vegetables — is consistently associated with lower ADHD
            symptom severity. Western dietary patterns high in processed food
            and low in fruit and vegetables show the opposite effect.
          </p>
 
          <div className="n-diet-compare">
            <div className="n-diet-card n-diet-card--good">
              <span className="n-diet-card__badge">Encourage more of these</span>
              <h3 className="n-diet-card__title">Brain-supportive foods</h3>
              <ul className="n-diet-list">
                {goodFoods.map((f, i) => (
                  <li key={i} className="n-diet-list__item">{f}</li>
                ))}
              </ul>
            </div>
            <div className="n-diet-card n-diet-card--avoid">
              <span className="n-diet-card__badge">Reduce when possible</span>
              <h3 className="n-diet-card__title">Foods that may worsen symptoms</h3>
              <ul className="n-diet-list">
                {avoidFoods.map((f, i) => (
                  <li key={i} className="n-diet-list__item">{f}</li>
                ))}
              </ul>
            </div>
          </div>
 
          {/*
            Research point (e) — Sugar & ADHD.
            Kept exactly as a callout, now with the full nuance:
            not a cause, but blood sugar instability + dopamine effects.
          */}
          <div className="s-callout" style={{ marginTop: "24px" }}>
            <strong>About sugar (Research point e):</strong> Sugar is{" "}
            <em>not</em> a cause of ADHD. However, diets that are low in
            nutrient quality — often high in sugar and refined carbohydrates
            — can <em>exacerbate</em> symptoms by destabilising blood sugar
            levels and affecting dopamine regulation. It is the overall diet
            quality that matters, not sugar in isolation.
          </div>
        </div>
      </section>






      {/* ── CALMING ACTIVITIES ───────────────────────────────── */}
      <section className="s-section">
        <div className="s-container s-container--wide">
          <p className="s-label n-reveal" ref={r}>Daily Regulation Tools</p>
          <h2 className="s-title n-reveal n-reveal--d1" ref={r}>
            Activities to{" "}
            <span className="s-gradient-text">calm and focus</span>
          </h2>
          <p className="s-lead n-reveal n-reveal--d2" ref={r}>
            Children with ADHD often struggle to self-regulate — not because
            they won't, but because their brains need more support to get
            there. These evidence-informed activities help regulate the nervous
            system, reduce overwhelm, and build the calm needed to focus.
          </p>

          {/* Tab bar */}
          <div className="n-act-tabs n-reveal" ref={r}>
            {activities.map(({ id, icon, label }) => (
              <button
                key={id}
                className={`n-act-tab ${activeAct === id ? "n-act-tab--active" : ""}`}
                onClick={() => setActiveAct(id)}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Activity panels — one per tab */}
          {activities.map(({ id, label, desc, tip, cards }) => (
            <div
              key={id}
              className={`n-act-panel ${activeAct === id ? "n-act-panel--visible" : ""}`}
              role="tabpanel"
            >
              {/* Description + tip above the cards */}
              <div className="n-act-info">
                <p className="n-act-title-sm">{label}</p>
                <p className="n-act-desc">{desc}</p>
                <div className="n-act-info__tip">
                  💡 <strong>Parent tip:</strong> {tip}
                </div>
              </div>

              {/* Cards grid */}
              <div className="n-act-cards-grid">
                {cards.map((card, i) => (
                  <div className="n-act-card" key={i}>
                    <div className="n-act-card__img-wrap">
                      <img
                        src={card.img}
                        alt={card.name}
                        onError={e => {
                          e.target.style.display = "none";
                          e.target.parentNode.querySelector(
                            ".n-act-card__emoji-cover"
                          ).style.display = "flex";
                        }}
                      />
                      <div
                        className="n-act-card__emoji-cover"
                        style={{ display: "none" }}
                      >
                        {card.emoji}
                      </div>
                    </div>
                    <div className="n-act-card__body">
                      <p className="n-act-card__name">{card.name}</p>
                      <p className="n-act-card__desc">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="s-section s-section--cta">
        <div className="s-container s-container--wide">
          <div className="s-cta-banner n-reveal" ref={r}>
            <div className="s-cta-banner__quote">"</div>
            <div className="s-cta-banner__body">
              <p className="s-cta-banner__lead">
                You don't need a perfect diet or a perfect routine. Small,
                consistent changes — more protein at breakfast, ten minutes
                outside, five minutes of breathing before homework —{" "}
                <strong>
                  add up to real support for your child's brain.
                </strong>
              </p>
              <div className="s-cta-banner__divider" />
              <div className="s-tag-row">
                <span className="s-tag">Evidence-based</span>
                <span className="s-tag">Easy to start</span>
                <span className="s-tag">Parent-friendly</span>
                <span className="s-tag">No special equipment</span>
              </div>
              <Link to="/support" className="btn btn-outline-blue s-cta-banner__btn">
                School &amp; Communication Support →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}