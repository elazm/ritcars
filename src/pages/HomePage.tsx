import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Car, Shield, Clock, MapPin, ChevronRight, Star, Phone } from 'lucide-react';

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
      title: 'Disponibilité 24/7',
      description: 'Service client disponible à tout moment pour vous assister.',
    },
    {
      icon: Shield,
      title: 'Assurance incluse',
      description: 'Tous nos véhicules sont assurés pour votre tranquillité.',
    },
    {
      icon: MapPin,
      title: 'Kilométrage illimité',
      description: 'Roulez sans souci avec notre offre de kilométrage illimité.',
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

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="hero-content">
              <span className="inline-block bg-ritcars-orange/10 text-ritcars-orange px-4 py-2 rounded-full text-sm font-medium mb-6">
                Location de voitures à Tétouan
              </span>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ritcars-black mb-6 leading-tight">
                Louez une voiture et{' '}
                <span className="text-ritcars-orange">explorez</span> le Royaume
              </h1>

              <p className="text-gray-600 text-lg mb-8 max-w-lg">
                Des véhicules Dacia récents, propres et bien entretenus. Prix fixe à
                350 MAD/jour, sans surprises.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/reservation"
                  className="bg-ritcars-orange text-white px-8 py-4 rounded-xl font-semibold text-center hover:bg-ritcars-orange/90 transition-colors"
                >
                  Réserver maintenant
                </Link>

                <Link
                  to="/flotte"
                  className="border-2 border-ritcars-black text-ritcars-black px-8 py-4 rounded-xl font-semibold text-center hover:bg-ritcars-black hover:text-white transition-colors"
                >
                  Voir nos voitures
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hero-content relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/dacia-stepway-grey.jpg"
                  alt="Dacia Sandero"
                  className="w-full h-auto"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <div className="flex items-center gap-2 text-white">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.9/5</span>
                    <span className="text-white/80">basé sur 200+ avis</span>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-12 -left-4 bg-white shadow-lg rounded-xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-12 h-12 bg-ritcars-orange/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-ritcars-orange" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Appelez-nous</p>
                  <a
                    href="tel:0762253818"
                    className="font-semibold text-ritcars-black hover:text-ritcars-orange transition-colors"
                  >
                    0762253818
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="bg-ritcars-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat-item text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-ritcars-orange mb-2">
                7
              </p>
              <p className="text-gray-400 text-sm">Véhicules</p>
            </div>

            <div className="stat-item text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-ritcars-orange mb-2">
                170+
              </p>
              <p className="text-gray-400 text-sm">Clients satisfaits</p>
            </div>

            <div className="stat-item text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-ritcars-orange mb-2">
                2+
              </p>
              <p className="text-gray-400 text-sm">Années d'expérience</p>
            </div>

            <div className="stat-item text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-ritcars-orange mb-2">
                24/7
              </p>
              <p className="text-gray-400 text-sm">Assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ritcars-orange font-medium text-sm uppercase tracking-wider">
              Pourquoi nous choisir
            </span>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-ritcars-black mt-2">
              Les avantages Ritcars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-ritcars-orange/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-ritcars-orange" />
                </div>

                <h3 className="font-display text-xl font-bold text-ritcars-black mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Section */}
      <section ref={carsRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="text-ritcars-orange font-medium text-sm uppercase tracking-wider">
                Notre flotte
              </span>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-ritcars-black mt-2">
                Choisissez votre voiture
              </h2>
            </div>

            <Link
              to="/flotte"
              className="flex items-center gap-2 text-ritcars-orange font-medium mt-4 md:mt-0 hover:underline"
            >
              Voir toutes les voitures
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <div
                key={index}
                className="car-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-ritcars-black mb-2">
                    {car.name}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Car className="w-4 h-4" /> 5 places
                    </span>
                    <span>Manuelle</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-gray-500 text-sm">À partir de</span>
                      <p className="font-display text-2xl font-bold text-ritcars-orange">
                        {car.price}{' '}
                        <span className="text-sm text-gray-500">MAD/jour</span>
                      </p>
                    </div>

                    <Link
                      to="/reservation"
                      className="bg-ritcars-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-ritcars-orange transition-colors"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-ritcars-orange">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à partir à l'aventure ?
          </h2>

          <p className="text-white/90 text-lg mb-8">
            Réservez votre voiture dès maintenant et découvrez Tétouan et ses
            environs.
          </p>

          <Link
            to="/reservation"
            className="inline-block bg-white text-ritcars-orange px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Réserver maintenant
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;