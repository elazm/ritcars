import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FaArrowRight as ArrowRight,
  FaBluetooth as Bluetooth,
  FaDoorOpen as DoorOpen,
  FaGaugeHigh as Gauge,
  FaSnowflake as Snowflake,
  FaUsers as Users,
} from 'react-icons/fa6';

gsap.registerPlugin(ScrollTrigger);

interface FleetSectionProps {
  className?: string;
}

const fleetCars = [
  {
    id: 1,
    name: 'Dacia Sandero',
    image: '/images/dacia-sandero.jpg',
    seats: 5,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    features: ['A/C', 'USB', 'Bluetooth'],
    price: 280,
  },
  {
    id: 2,
    name: 'Dacia Sandero Stepway',
    image: '/images/dacia-stepway.jpg',
    seats: 5,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    features: ['A/C', 'USB', 'Bluetooth', 'Roof Rails'],
    price: 320,
  },
  {
    id: 3,
    name: 'Dacia Logan',
    image: '/images/dacia-logan.jpg',
    seats: 5,
    doors: 4,
    transmission: 'Manuelle',
    fuel: 'Essence',
    features: ['A/C', 'USB', 'Bluetooth', 'Grand Coffre'],
    price: 300,
  },
  {
    id: 4,
    name: 'Dacia Duster',
    image: '/images/Daciaduster1.png',
    seats: 5,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Diesel',
    features: ['A/C', 'USB', 'Bluetooth', '4x4'],
    price: 400,
  },
  {
    id: 5,
    name: 'Dacia Jogger',
    image: '/images/Daciajogger1.png',
    seats: 7,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Diesel',
    features: ['A/C', 'USB', 'Bluetooth', '7 Places'],
    price: 400,
  },
  {
    id: 6,
    name: 'Peugeot 208',
    image: '/images/peugeot2081.png',
    seats: 5,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    features: ['A/C', 'USB', 'Bluetooth', 'Caméra'],
    price: 300,
  },
  {
    id: 7,
    name: 'Peugeot 2008',
    image: '/images/peugeot20081.png',
    seats: 5,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    features: ['A/C', 'USB', 'Bluetooth', 'SUV'],
    price: 500,
  },
  {
    id: 8,
    name: 'Renault Clio 5',
    image: '/images/Clio51.png',
    seats: 5,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    features: ['A/C', 'USB', 'Bluetooth', 'Écran tactile'],
    price: 300,
  },
  {
    id: 9,
    name: 'Renault Clio 5',
    image: '/images/Clio51.png',
    seats: 5,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Diesel',
    features: ['A/C', 'USB', 'Bluetooth', 'Écran tactile'],
    price: 250,
  },
  {
    id: 10,
    name: 'Seat Ibiza',
    image: '/images/Seatibiza1.png',
    seats: 5,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    features: ['A/C', 'USB', 'Bluetooth', 'Sport'],
    price: 400,
  },
  {
    id: 11,
    name: 'Citroën C3 Aircross',
    image: '/images/Citroenc3aircross.png',
    seats: 5,
    doors: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    features: ['A/C', 'USB', 'Bluetooth', 'SUV'],
    price: 450,
  },
];

const FleetSection = ({ className = '' }: FleetSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.fleet-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: '10vh', opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="fleet"
      className={`relative bg-ritcars-black py-20 md:py-32 ${className}`}
    >
      <div className="px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-ritcars-orange mb-4 block">
            Our Fleet
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ritcars-white mb-4">
            11 Véhicules
          </h2>
          <p className="text-ritcars-gray text-lg max-w-2xl">
            Essence & Diesel · Climatisation · USB · Bluetooth
          </p>
        </div>

        {/* Fleet Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {fleetCars.map((car) => (
            <div
              key={car.id}
              className="fleet-card group bg-ritcars-black border border-white/10 rounded-xl overflow-hidden hover:border-ritcars-orange/50 transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ritcars-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="font-display text-xl font-bold text-ritcars-white mb-3">
                  {car.name}
                </h3>

                {/* Specs */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1.5 text-ritcars-gray text-sm">
                    <Users className="w-4 h-4" />
                    <span>{car.seats} seats</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-ritcars-gray text-sm">
                    <DoorOpen className="w-4 h-4" />
                    <span>{car.doors} doors</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-ritcars-gray text-sm">
                    <Gauge className="w-4 h-4" />
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-ritcars-gray text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${car.fuel === 'Diesel' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                      {car.fuel}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {car.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-full text-xs text-ritcars-gray"
                    >
                      {feature === 'A/C' && <Snowflake className="w-3 h-3" />}
                      {feature === 'Bluetooth' && <Bluetooth className="w-3 h-3" />}
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="font-mono text-xs text-ritcars-gray uppercase tracking-wider">
                      from
                    </span>
                    <p className="font-display text-2xl font-bold text-ritcars-white">
                      {car.price}{' '}
                      <span className="text-sm font-normal text-ritcars-gray">
                        MAD/day
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={scrollToContact}
                    className="flex items-center gap-2 bg-ritcars-orange text-white px-4 py-2.5 rounded-lg font-medium hover:bg-ritcars-orange/90 transition-colors group/btn"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-10 text-center text-ritcars-gray text-sm">
          Prices vary by season. Request a quote for long-term rates.
        </p>
      </div>
    </section>
  );
};

export default FleetSection;
