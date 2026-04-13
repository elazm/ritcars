import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className = '' }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const microcopyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Entrance animation (on page load)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.2 }
      )
        .fromTo(
          leftPanelRef.current,
          { x: '-40vw', opacity: 0 },
          { x: 0, opacity: 1, duration: 0.9 },
          0.2
        )
        .fromTo(
          wordmarkRef.current,
          { y: '10vh', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.4
        )
        .fromTo(
          taglineRef.current,
          { y: '6vh', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0.5
        )
        .fromTo(
          ctaRef.current,
          { y: '6vh', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0.6
        )
        .fromTo(
          microcopyRef.current,
          { y: '4vh', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0.7
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements when scrolling back to top
            gsap.set([leftPanelRef.current, wordmarkRef.current, taglineRef.current, ctaRef.current], {
              x: 0,
              y: 0,
              opacity: 1,
            });
            gsap.set(microcopyRef.current, { y: 0, opacity: 1 });
            gsap.set(bgRef.current, { scale: 1, y: 0 });
          },
        },
      });

      // EXIT phase (70% - 100%)
      scrollTl
        .fromTo(
          leftPanelRef.current,
          { x: 0, opacity: 1 },
          { x: '-45vw', opacity: 0.25, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          wordmarkRef.current,
          { x: 0, opacity: 1 },
          { x: '-20vw', opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          [taglineRef.current, ctaRef.current],
          { x: 0, opacity: 1 },
          { x: '-15vw', opacity: 0, ease: 'power2.in' },
          0.75
        )
        .fromTo(
          microcopyRef.current,
          { y: 0, opacity: 1 },
          { y: '12vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          bgRef.current,
          { scale: 1, y: 0 },
          { scale: 1.06, y: '-3vh', ease: 'none' },
          0.7
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToFleet = () => {
    const element = document.getElementById('fleet');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`section-pinned ${className}`}
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src="/images/hero-city.jpg"
          alt="Night city with car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ritcars-black/35" />
      </div>

      {/* Left panel */}
      <div
        ref={leftPanelRef}
        className="absolute left-0 top-0 w-full md:w-[38vw] h-full bg-ritcars-black"
        style={{
          opacity: 0,
          boxShadow: '20px 0 60px rgba(0,0,0,0.5)',
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-[6vw]">
        {/* Wordmark */}
        <h1
          ref={wordmarkRef}
          className="font-display font-bold text-ritcars-white tracking-tight"
          style={{
            fontSize: 'clamp(48px, 7.5vw, 120px)',
            letterSpacing: '-0.03em',
            lineHeight: 0.92,
            opacity: 0,
          }}
        >
          RITCARS
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mt-6 md:mt-8 font-display text-xl md:text-2xl lg:text-3xl text-ritcars-white/90 max-w-md"
          style={{ opacity: 0 }}
        >
          Drive Morocco. Simple. Modern. Yours.
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          onClick={scrollToFleet}
          className="mt-8 md:mt-10 flex items-center gap-3 btn-outline w-fit group"
          style={{ opacity: 0 }}
        >
          <span>View fleet</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Right microcopy */}
      <div
        ref={microcopyRef}
        className="absolute bottom-8 md:bottom-12 right-6 md:right-[6vw] text-right"
        style={{ opacity: 0 }}
      >
        <p className="font-mono text-xs md:text-sm text-ritcars-gray uppercase tracking-widest">
          Airport pickup · Unlimited mileage · 24/7 support
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
