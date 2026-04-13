import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DiscoverSectionProps {
  className?: string;
}

const DiscoverSection = ({ className = '' }: DiscoverSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLHeadingElement>(null);
  const microcopyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          bgRef.current,
          { scale: 1.10, opacity: 0.6 },
          { scale: 1, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          giantTextRef.current,
          { x: '-60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          microcopyRef.current,
          { y: '6vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.10
        );

      // SETTLE (30% - 70%) - hold

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(
          bgRef.current,
          { scale: 1, x: 0 },
          { scale: 1.06, x: '-2vw', ease: 'none' },
          0.7
        )
        .fromTo(
          giantTextRef.current,
          { x: 0, opacity: 1 },
          { x: '-20vw', opacity: 0.2, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          microcopyRef.current,
          { y: 0, opacity: 1 },
          { y: '8vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="discover"
      className={`section-pinned ${className}`}
    >
      {/* Background image */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <img
          src="/images/discover-coastal.jpg"
          alt="Coastal road"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ritcars-black/40" />
      </div>

      {/* Giant "DISCOVER" text */}
      <h2
        ref={giantTextRef}
        className="absolute left-[6vw] top-[12vh] font-display font-bold text-ritcars-white"
        style={{
          fontSize: 'clamp(48px, 12vw, 200px)',
          lineHeight: 0.85,
          letterSpacing: '-0.02em',
          opacity: 0,
        }}
      >
        DISCOVER
      </h2>

      {/* Microcopy */}
      <div
        ref={microcopyRef}
        className="absolute left-[6vw] bottom-[12vh] md:bottom-[18vh] max-w-md"
        style={{ opacity: 0 }}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-ritcars-orange mb-2">
          Exploration
        </p>
        <p className="text-ritcars-white/90 text-lg md:text-xl leading-relaxed">
          Take the scenic route. Stop when it feels right.
        </p>
      </div>
    </section>
  );
};

export default DiscoverSection;
