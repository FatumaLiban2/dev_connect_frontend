import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

export default function HomePage({ onSigninClick, onSignupClick, onForgotPasswordClick }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [testimonialPage, setTestimonialPage] = useState(0);
  const navigate = useNavigate();

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

  const testimonials = [
    {
      quote: 'We have been working with DevConnect for the past year. The milestone tracking and secure payment flow made delivery stress-free.',
      name: 'Aiden Smith',
      role: 'Marketing Manager at XYZ Corp',
    },
    {
      quote: 'Mock-up bidding helped us choose a developer who really understood our brand. Super smooth collaboration.',
      name: 'Jane Doe',
      role: 'Product Lead at Alpha Labs',
    },
    {
      quote: 'The integrated chats and progress updates removed ambiguity. We shipped earlier than planned.',
      name: 'Michael Brown',
      role: 'CTO at ReadSync',
    },
    {
      quote: 'DevConnect let us move from idea to MVP in weeks, not months. The developer vetting saved our team countless hours.',
      name: 'Priya Patel',
      role: 'Founder at LaunchLight',
    },
    {
      quote: 'Milestones and escrow gave our board confidence. Communication was clear, and deliverables were exactly what we needed.',
      name: 'Carlos Ramirez',
      role: 'COO at BrightWave Logistics',
    },
    {
      quote: 'Our remote collaboration felt in-office. Integrated chat threads and file sharing kept everyone aligned.',
      name: 'Lena Fischer',
      role: 'Product Manager at Skyline Fintech',
    },
    {
      quote: 'The team matched us with specialists for each milestone. Results were polished, and QA passed first try.',
      name: 'Omar Khalid',
      role: 'CTO at Horizon Health',
    },
    {
      quote: 'DevConnect’s dashboards made stakeholder updates painless. We always knew what was shipping next.',
      name: 'Emily Chen',
      role: 'Program Director at Northstar Media',
    },
  ];

  const TESTIMONIALS_PER_PAGE = 3;
  const totalTestimonialPages = Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE);
  const testimonialPageStart = testimonialPage * TESTIMONIALS_PER_PAGE;
  const visibleTestimonials = testimonials.slice(
    testimonialPageStart,
    testimonialPageStart + TESTIMONIALS_PER_PAGE
  );

  const goToTestimonialPage = (index) => {
    if (!totalTestimonialPages) return;
    const normalized = (index + totalTestimonialPages) % totalTestimonialPages;
    setTestimonialPage(normalized);
  };

  const handlePrevTestimonials = () => goToTestimonialPage(testimonialPage - 1);
  const handleNextTestimonials = () => goToTestimonialPage(testimonialPage + 1);

  useEffect(() => {
    if (testimonialPage >= totalTestimonialPages && totalTestimonialPages > 0) {
      setTestimonialPage(0);
    }
  }, [testimonialPage, totalTestimonialPages]);

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
            <p
              className="subtitle"
              style={{ marginTop: '0.9rem', fontSize: '1.12em', color: '#6f75a3' }}
            >
              Whether you need a web app, mobile solution, or custom software, DevConnect matches you with 
              vetted professionals ready to transform your concept into a polished product. Start collaborating 
              today and turn innovation into impact.
            </p>

            <div className="hero-cta">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (onSignupClick) {
                    onSignupClick();
                  } else {
                    window.location.href = '/continue';
                  }
                }}
              >
                Get Started
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn more
              </button>
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (onSignupClick) {
                  onSignupClick();
                } else {
                  window.location.href = '/continue';
                }
              }}
            >
              Get your free proposal
            </button>
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
      <section className="section process" id="procedure" data-reveal>
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
            {visibleTestimonials.map((testimonial) => (
              <article className="t-card" key={testimonial.name}>
                <p className="quote">"{testimonial.quote}"</p>
                <div className="author">
                  <span className="name">{testimonial.name}</span>
                  <span className="role">{testimonial.role}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="t-nav" aria-hidden={totalTestimonialPages <= 1}>
            <button
              type="button"
              className="nav prev"
              aria-label="Previous testimonials"
              onClick={handlePrevTestimonials}
              disabled={totalTestimonialPages <= 1}
            >
              {'<'}
            </button>
            <div className="dots" role="tablist" aria-label="Testimonial pages">
              {Array.from({ length: totalTestimonialPages }).map((_, idx) => (
                <button
                  key={`testimonial-dot-${idx}`}
                  type="button"
                  className={`dot ${idx === testimonialPage ? 'active' : ''}`}
                  aria-label={`Go to testimonial set ${idx + 1}`}
                  aria-pressed={idx === testimonialPage}
                  onClick={() => goToTestimonialPage(idx)}
                ></button>
              ))}
            </div>
            <button
              type="button"
              className="nav next"
              aria-label="Next testimonials"
              onClick={handleNextTestimonials}
              disabled={totalTestimonialPages <= 1}
            >
              {'>'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}














