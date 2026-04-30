import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  FaCarSide as Car,
  FaChevronRight as ChevronRight,
  FaClock as Clock,
  FaLocationDot as MapPin,
  FaShieldHalved as Shield,
  FaStar as Star,
} from 'react-icons/fa6';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const carsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        '.car-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: carsRef.current,
            start: 'top 75%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Clock,
      title: 'Disponibilite 24/7',
      description: 'Service client disponible a tout moment pour vous assister.',
    },
    {
      icon: Shield,
      title: 'Assurance incluse',
      description: 'Tous nos vehicules sont assures pour votre tranquillite.',
    },
    {
      icon: MapPin,
      title: 'Kilometrage illimite',
      description: 'Roulez sans souci avec notre offre de kilometrage illimite.',
    },
  ];

  const cars = [
    { name: 'Dacia Sandero', image: '/images/dacia-sandero.jpg', price: 350 },
    { name: 'Dacia Sandero Stepway', image: '/images/dacia-stepway-grey.jpg', price: 350 },
    { name: 'Dacia Logan', image: '/images/dacia-logan.jpg', price: 350 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section
        ref={heroRef}
        className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="hero-content">
              <span className="mb-6 inline-block rounded-full bg-ritcars-orange/10 px-4 py-2 text-sm font-medium text-ritcars-orange">
                Location de voitures a Tetouan
              </span>

              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-ritcars-black md:text-5xl lg:text-6xl">
                Louez une voiture et <span className="text-ritcars-orange">explorez</span> le
                Royaume
              </h1>

              <p className="mb-8 max-w-lg text-lg text-gray-600">
                Des vehicules Dacia recents, propres et bien entretenus. Prix fixe a
                350 MAD/jour, sans surprises.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/reservation"
                  className="rounded-xl bg-ritcars-orange px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-ritcars-orange/90"
                >
                  Reserver maintenant
                </Link>

                <Link
                  to="/flotte"
                  className="rounded-xl border-2 border-ritcars-black px-8 py-4 text-center font-semibold text-ritcars-black transition-colors hover:bg-ritcars-black hover:text-white"
                >
                  Voir nos voitures
                </Link>
              </div>
            </div>

            <div className="hero-content relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/images/dacia-stepway-grey.jpg"
                  alt="Dacia Sandero Stepway"
                  className="w-full h-auto"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <div className="flex items-center gap-2 text-white">
                    <Star className="size-5 shrink-0 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.9/5</span>
                    <span className="text-white/80">base sur 200+ avis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="bg-ritcars-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="stat-item text-center">
              <p className="mb-2 font-display text-4xl font-bold text-ritcars-orange md:text-5xl">
                7
              </p>
              <p className="text-sm text-gray-400">Vehicules</p>
            </div>

            <div className="stat-item text-center">
              <p className="mb-2 font-display text-4xl font-bold text-ritcars-orange md:text-5xl">
                170+
              </p>
              <p className="text-sm text-gray-400">Clients satisfaits</p>
            </div>

            <div className="stat-item text-center">
              <p className="mb-2 font-display text-4xl font-bold text-ritcars-orange md:text-5xl">
                2+
              </p>
              <p className="text-sm text-gray-400">Annees d'experience</p>
            </div>

            <div className="stat-item text-center">
              <p className="mb-2 font-display text-4xl font-bold text-ritcars-orange md:text-5xl">
                24/7
              </p>
              <p className="text-sm text-gray-400">Assistance</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">
              Pourquoi nous choisir
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold text-ritcars-black md:text-4xl">
              Les avantages Ritcars
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="feature-card rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-ritcars-orange/10">
                  <feature.icon className="size-7 shrink-0 text-ritcars-orange" />
                </div>

                <h3 className="mb-3 font-display text-xl font-bold text-ritcars-black">
                  {feature.title}
                </h3>

                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={carsRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">
                Notre flotte
              </span>

              <h2 className="mt-2 font-display text-3xl font-bold text-ritcars-black md:text-4xl">
                Choisissez votre voiture
              </h2>
            </div>

            <Link
              to="/flotte"
              className="mt-4 flex items-center gap-2 font-medium text-ritcars-orange hover:underline md:mt-0"
            >
              Voir toutes les voitures
              <ChevronRight className="size-5 shrink-0" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car.name}
                className="car-card overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="mb-2 font-display text-xl font-bold text-ritcars-black">
                    {car.name}
                  </h3>

                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Car className="size-4 shrink-0" /> 5 places
                    </span>
                    <span>Manuelle</span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="font-display text-2xl font-bold text-ritcars-orange">
                        {car.price} <span className="text-sm text-gray-500">MAD/jour</span>
                      </p>
                    </div>

                    <Link
                      to="/reservation"
                      className="rounded-lg bg-ritcars-black px-5 py-2.5 font-medium text-white transition-colors hover:bg-ritcars-orange"
                    >
                      Reserver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ritcars-orange py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
            Pret a partir a l'aventure ?
          </h2>

          <p className="mb-8 text-lg text-white/90">
            Reservez votre voiture des maintenant et decouvrez Tetouan et ses environs.
          </p>

          <Link
            to="/reservation"
            className="inline-block rounded-xl bg-white px-10 py-4 font-semibold text-ritcars-orange transition-colors hover:bg-gray-100"
          >
            Reserver maintenant
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
