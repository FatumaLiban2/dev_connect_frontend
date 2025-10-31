import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

export default function HomePage() {
  const [openIndex, setOpenIndex] = useState(0);

  // Subtle parallax refs
  const heroParallaxRef = useRef(null);
  const ctaParallaxRef = useRef(null);

  // Reveal-on-scroll animations
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Lightweight parallax
  useEffect(() => {
    const onScroll = () => {
      if (heroParallaxRef.current) {
        const r = heroParallaxRef.current.getBoundingClientRect();
        const delta = Math.max(-24, Math.min(24, -r.top * 0.06));
        heroParallaxRef.current.style.transform = `translateY(${delta}px)`;
      }
      if (ctaParallaxRef.current) {
        const r2 = ctaParallaxRef.current.getBoundingClientRect();
        const delta2 = Math.max(-18, Math.min(18, -r2.top * 0.05));
        ctaParallaxRef.current.style.transform = `translateY(${delta2}px)`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Working process steps
  const steps = [
    { title: 'Post Your Project', content: 'Describe your idea, scope, timeline, and budget. Share any mockups or references. We will broadcast it to vetted developers.' },
    { title: 'Find the right developer', content: 'Review profiles, proposals, and sample mock-ups. Shortlist and chat to ensure the right fit.' },
    { title: 'Secure the Agreement', content: 'Confirm milestones, delivery dates, and payments. Everything is transparent and tracked.' },
    { title: 'Development in Progress', content: 'Follow along with progress updates, commits, and milestone submissions—no guesswork.' },
    { title: 'Review and Approve', content: 'Request changes, test deliverables, and give final approval once satisfied.' },
    { title: 'Delivery and Payment release', content: 'Receive final assets and release payment safely. Leave feedback to help others.' },
  ];

  // Services
  const services = [
    { key: 'milestone', title: 'Milestone Tracker', desc: 'Break work into milestones to track delivery and unlock payments.', theme: 'light' },
    { key: 'mockup', title: 'Mock-up Bidding', desc: 'Developers can pitch with quick mock-ups so you can visualize the fit.', theme: 'primary' },
    { key: 'progress', title: 'Progress Tracking', desc: 'Stay clear, progress with updates, milestones and deadline tracking.', theme: 'dark' },
    { key: 'payment', title: 'Securing Payment', desc: 'Escrow-based safety: funds release only on approval.', theme: 'light' },
    { key: 'chats', title: 'Integrated Chats', desc: 'Centralized communication, files, and decisions—no context lost.', theme: 'primary' },
    { key: 'hashing', title: 'Hashing', desc: 'Integrity checks for shared files and deliverables.', theme: 'dark' },
  ];

  // Map service key -> illustration filename in public/illustrations
  const illustrationMap = {
    milestone: 'milestonetracker.png',
    mockup: 'mockupbidding.png',
    progress: 'progresstracking.png',
    // Use same visual for securing payment as progress tracking per request
    payment: 'progresstracking.png',
    chats: 'integratedchats.png',
    hashing: 'hashing.png',
  };

  // Brand logos from public/brands
  const brands = [
    { base: '/brands/amazon',   alt: 'Amazon' },
    { base: '/brands/dribbble', alt: 'Dribbble' },
    { base: '/brands/hubspot',  alt: 'HubSpot' },
    { base: '/brands/notion',   alt: 'Notion' },
    { base: '/brands/netflix',  alt: 'NETFLIX' },
    // { base: '/brands/zoom',  alt: 'Zoom' },
  ];

  const toggleStep = (idx) => setOpenIndex((prev) => (prev === idx ? -1 : idx));

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="section hero" data-reveal>
        <div className="container hero-grid">
          {/* Left: Text + CTA + Moving brand line under CTA */}
          <div className="hero-content">
            <h1>Your Vision, Our Developers</h1>
            <p className="subtitle">
              Connect with skilled developers who bring your ideas to life. Post your project, set a budget,
              and watch your dreams become a reality.
            </p>

            <div className="hero-cta">
              <Link to="/continue" className="btn btn-primary">Get Started</Link>
              <a href="#process" className="btn btn-secondary">Learn more</a>
            </div>

            {/* Brand row under CTA – moving marquee with spacing */}
            <div className="brand-marquee hero-inline" aria-label="Trusted by">
              <div className="marquee">
                <div className="marquee-group">
                  {brands.map((b) => (
                    <div className="brand-slot" key={b.alt}>
                      <img
                        src={`${b.base}.png`}
                        alt={b.alt}
                        className="brand-logo"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
                {/* Duplicate once for seamless loop */}
                <div className="marquee-group" aria-hidden="true">
                  {brands.map((b) => (
                    <div className="brand-slot" key={`${b.alt}-dupe`}>
                      <img
                        src={`${b.base}.png`}
                        alt=""
                        className="brand-logo"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: large megaphone next to the text */}
          <div className="hero-visual" ref={heroParallaxRef} aria-hidden="true">
            <img
              src="/brands/megaphone.png"
              alt=""
              className="hero-megaphone"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section services" id="services" data-reveal>
        <div className="container">
          <div className="section-head">
            <span className="badge">Services</span>
            <h2>Our Services</h2>
            <p className="section-sub">Everything you need to go from idea to shipped product.</p>
          </div>

          <div className="services-grid">
            {services.map((card) => (
              <article key={card.key} className={`card card-${card.theme}`} tabIndex={0}>
                <div className="card-diagram" aria-hidden="true">
                  <span className="d d1"></span>
                  <span className="d d2"></span>
                  <span className="d d3"></span>
                </div>
                <div className="card-inner">
                  <div className="card-text">
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>

                  <div className="card-illustration" aria-hidden="true">
                    <img
                      src={`/illustrations/${illustrationMap[card.key] ?? ''}`}
                      alt={card.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA MID */}
      <section className="section cta-mid" data-reveal>
        <div className="container cta-mid-inner">
          <div className="cta-text">
            <h2>Let's make things happen</h2>
            <p>
              Submit your project idea. We will recommend a path, match you with developers,
              and help you launch faster.
            </p>
            <Link to="/continue" className="btn btn-primary">Get your free proposal</Link>
          </div>

          <div className="cta-illustration" aria-hidden="true" ref={ctaParallaxRef}>
            {/* Large illustration added to right side (file added to public/illustrations) */}
            <img
              src="/illustrations/getyourfreeproposal.png"
              alt="Get your free proposal"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section process" id="process" data-reveal>
        <div className="container">
          <div className="process-head">
            <span className="badge">Our Working Process</span>
            <h3>Step-by-Step Guide to Achieving Your Business Goals</h3>
          </div>

          <div className="accordion">
            {steps.map((s, idx) => (
              <div key={s.title} className={`acc-item ${openIndex === idx ? 'open' : ''}`}>
                <button
                  type="button"
                  className="acc-trigger"
                  onClick={() => toggleStep(idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`panel-${idx}`}
                  id={`control-${idx}`}
                >
                  <span className="number">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="title">{s.title}</span>
                  <span className="plus">{openIndex === idx ? '-' : '+'}</span>
                </button>
                <div className="acc-panel" id={`panel-${idx}`} role="region" aria-labelledby={`control-${idx}`}>
                  <p>{s.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials" id="testimonials" data-reveal>
        <div className="container">
          <div className="t-head">
            <span className="badge">testimonials</span>
            <p>Hear from Our Satisfied Clients: Read Our Testimonials to Learn More about Our Services</p>
          </div>

          <div className="t-cards">
            <article className="t-card">
              <p className="quote">
                "We have been working with DevConnect for the past year. The milestone tracking and secure payment flow made delivery stress-free."
              </p>
              <div className="author">
                <span className="name">Aiden Smith</span>
                <span className="role">Marketing Manager at XYZ Corp</span>
              </div>
            </article>

            <article className="t-card">
              <p className="quote">
                "Mock-up bidding helped us choose a developer who really understood our brand. Super smooth collaboration."
              </p>
              <div className="author">
                <span className="name">Jane Doe</span>
                <span className="role">Product Lead at Alpha Labs</span>
              </div>
            </article>

            <article className="t-card">
              <p className="quote">
                "The integrated chats and progress updates removed ambiguity. We shipped earlier than planned."
              </p>
              <div className="author">
                <span className="name">Michael Brown</span>
                <span className="role">CTO at ReadSync</span>
              </div>
            </article>
          </div>

          <div className="t-nav" aria-hidden="true">
            <button type="button" className="nav prev" aria-label="Previous">{'<'}</button>
            <div className="dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <button type="button" className="nav next" aria-label="Next">{'>'}</button>
          </div>
        </div>
      </section>
    </div>
  );
}














