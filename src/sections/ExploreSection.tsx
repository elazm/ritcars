import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ExploreSectionProps {
  className?: string;
}

const ExploreSection = ({ className = '' }: ExploreSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLHeadingElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

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
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          giantTextRef.current,
          { x: '-60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          cardARef.current,
          { x: '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          cardBRef.current,
          { x: '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.08
        )
        .fromTo(
          bgRef.current,
          { scale: 1.08 },
          { scale: 1, ease: 'none' },
          0
        );

      // SETTLE (30% - 70%) - hold

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(
          giantTextRef.current,
          { x: 0, opacity: 1 },
          { x: '-30vw', opacity: 0.25, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          cardARef.current,
          { x: 0, opacity: 1 },
          { x: '20vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          cardBRef.current,
          { x: 0, opacity: 1 },
          { x: '20vw', opacity: 0, ease: 'power2.in' },
          0.72
        )
        .fromTo(
          bgRef.current,
          { scale: 1, y: 0 },
          { scale: 1.05, y: '-3vh', ease: 'none' },
          0.7
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="explore"
      className={`section-pinned ${className}`}
    >
      {/* Background image */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <img
          src="/images/explore-street.jpg"
          alt="Night street with car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ritcars-black/45" />
      </div>

      {/* Giant "EXPLORE" text */}
      <h2
        ref={giantTextRef}
        className="absolute left-[6vw] top-[10vh] font-display font-bold text-stroke"
        style={{
          fontSize: 'clamp(60px, 14vw, 200px)',
          lineHeight: 0.85,
          opacity: 0,
        }}
      >
        EXPLORE
      </h2>

      {/* Card A - SPACE */}
      <div
        ref={cardARef}
        className="absolute right-[6vw] top-[12vh] w-[88vw] md:w-[38vw] glass-card rounded-xl p-6"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Users className="w-5 h-5 text-ritcars-orange" />
          <span className="font-mono text-xs uppercase tracking-widest text-ritcars-orange">
            Space
          </span>
        </div>
        <h3 className="font-display text-xl md:text-2xl font-bold text-ritcars-white mb-2">
          Room for everyone.
        </h3>
        <p className="text-ritcars-gray text-sm leading-relaxed">
          Plenty of legroom, luggage space, and upright seating for long drives. 
          Our Dacia fleet comfortably seats 5 passengers with ample storage.
        </p>
      </div>

      {/* Card B - COVERAGE */}
      <div
        ref={cardBRef}
        className="absolute right-[6vw] top-auto md:top-[46vh] bottom-[12vh] md:bottom-auto w-[88vw] md:w-[38vw] glass-card rounded-xl p-6"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-ritcars-orange" />
          <span className="font-mono text-xs uppercase tracking-widest text-ritcars-orange">
            Coverage
          </span>
        </div>
        <h3 className="font-display text-xl md:text-2xl font-bold text-ritcars-white mb-2">
          Drive with confidence.
        </h3>
        <p className="text-ritcars-gray text-sm leading-relaxed">
          Clear protection options and 24/7 assistance included. 
          Full insurance coverage with zero excess available.
        </p>
      </div>
    </section>
  );
};

export default ExploreSection;
