import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface WhySectionProps {
  className?: string;
}

const WhySection = ({ className = '' }: WhySectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
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
          cardRef.current,
          { x: '60vw', opacity: 0, scale: 0.96 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0
        )
        .fromTo(
          cardContentRef.current?.children || [],
          { y: '4vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.03, ease: 'none' },
          0.05
        )
        .fromTo(
          bgRef.current,
          { scale: 1.08, opacity: 0.7 },
          { scale: 1, opacity: 1, ease: 'none' },
          0
        );

      // SETTLE (30% - 70%) - hold positions

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(
          giantTextRef.current,
          { x: 0, opacity: 1 },
          { x: '-30vw', opacity: 0.25, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          cardRef.current,
          { x: 0, opacity: 1 },
          { x: '20vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          cardContentRef.current?.children || [],
          { y: 0, opacity: 1 },
          { y: '6vh', opacity: 0, ease: 'power2.in' },
          0.7
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

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFleet = () => {
    const element = document.getElementById('fleet');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="why"
      className={`section-pinned ${className}`}
    >
      {/* Background image */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <img
          src="/images/carwhite.png"
          alt="Night street"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ritcars-black/45" />
      </div>

      {/* Giant "WHY" text */}
      <h2
        ref={giantTextRef}
        className="absolute left-[6vw] top-[10vh] font-display font-bold text-stroke"
        style={{
          fontSize: 'clamp(80px, 18vw, 260px)',
          lineHeight: 0.85,
          opacity: 0,
        }}
      >
        WHY
      </h2>

      {/* Feature card */}
      <div
        ref={cardRef}
        className="absolute right-[6vw] top-[12vh] w-[88vw] md:w-[38vw] glass-card rounded-xl p-6 md:p-8"
        style={{ opacity: 0 }}
      >
        {/* Corner accent */}
        <div className="absolute top-0 left-0 w-12 h-1 bg-ritcars-orange rounded-tl-xl" />
        
        <div ref={cardContentRef} className="space-y-4 md:space-y-6">
          {/* Label */}
          <span className="font-mono text-xs uppercase tracking-widest text-ritcars-orange">
            Why Ritcars
          </span>

          {/* Headline */}
          <h3 className="font-display text-2xl md:text-3xl font-bold text-ritcars-white">
            Modern rentals, local know-how.
          </h3>

          {/* Body */}
          <p className="text-ritcars-gray text-sm md:text-base leading-relaxed">
            We're based in Tetouan and built for travelers who want a clean car, 
            fair pricing, and no surprises. Our fleet is maintained to the highest 
            standards, ensuring your journey is smooth from start to finish.
          </p>

          {/* Features */}
          <div className="flex items-center gap-3 text-ritcars-white/80">
            <Shield className="w-5 h-5 text-ritcars-orange" />
            <span className="text-sm">Fully insured · 24/7 assistance</span>
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button onClick={scrollToContact} className="btn-primary flex items-center justify-center gap-2">
              <span>Book now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={scrollToFleet} className="btn-outline">
              How it works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
