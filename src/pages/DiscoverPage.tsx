import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  MapPin,
  Camera,
  Mountain,
  Palmtree,
  Building2,
  Plane,
  Clock,
  ArrowRight,
  Route,
  Landmark,
  Waves,
  Ship,
  Crown,
  Building,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const DiscoverPage = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const attractionsRef = useRef<HTMLDivElement>(null);
  const routesRef = useRef<HTMLDivElement>(null);
  const airportsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.attraction-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: attractionsRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.route-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: routesRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.airport-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: airportsRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const attractions = [
    {
      name: 'Médina de Tétouan',
      description: 'Classée UNESCO, ruelles andalouses et souks authentiques.',
      icon: Building2,
      highlight: 'Culture & Patrimoine',
      image: '/images/medina-tetouan.png',
    },
    {
      name: 'Palais Royal (Dar El Makhzen)',
      description: 'Belle façade mauresque sur la Place Hassan II.',
      icon: Crown,
      highlight: 'Architecture royale',
      image: '/images/palais-royal-tetouan.png',
    },
    {
      name: 'Place Feddan (Feddan Park)',
      description: 'Place animée à l’entrée de la médina avec fontaines et palmiers.',
      icon: Mountain,
      highlight: 'Place & Vie locale',
      image: '/images/place-feddan.png',
    },
    {
      name: "Musée d'Art Moderne",
      description:
        "Installé dans un ancien palais, il abrite une collection d'art marocain contemporain.",
      icon: Camera,
      highlight: 'Art & Culture',
      image: '/images/musee-art-moderne-tetouan.png',
    },
    {
      name: 'Plage de Martil',
      description: 'Plage la plus proche, longue et animée.',
      icon: Waves,
      highlight: 'Plage & Animée',
      image: '/images/plage-martil.png',
    },
    {
      name: 'Plage de M’Diq',
      description: 'Belle plage, port et promenade.',
      icon: Palmtree,
      highlight: 'Plage & Détente',
      image: '/images/plage-mdiq.png',
    },
    {
      name: 'Cabo Negro',
      description: 'Station balnéaire chic avec plage et golfs.',
      icon: MapPin,
      highlight: 'Plage & Luxe',
      image: '/images/cabo-negro.png',
    },
    {
      name: 'Marina Smir',
      description: 'Port de plaisance moderne avec restaurants et yachts.',
      icon: Ship,
      highlight: 'Marina & Loisirs',
      image: '/images/marina-smir.png',
    },
  ];

  const routes = [
    {
      destination: 'Tanger',
      distance: '60 km',
      duration: '1h',
      description:
        'Ville cosmopolite au détroit de Gibraltar. Visitez la médina, la Kasbah et la nouvelle marina.',
      image: '/images/Tangier.png',
      icon: MapPin,
    },
    {
      destination: 'Chefchaouen',
      distance: '65 km',
      duration: '1h 15min',
      description:
        'La ville bleue perchée dans les montagnes du Rif. Un site incontournable pour les photographes.',
      image: '/images/Chefchaouen.png',
      icon: Mountain,
    },
    {
      destination: 'Al Hoceïma',
      distance: '180 km',
      duration: '2h 30min',
      description:
        "Belle ville côtière avec des plages magnifiques et le parc national d'Al Hoceïma.",
      image: '/images/AlHoceima.png',
      icon: Waves,
    },
    {
      destination: 'Asilah',
      distance: '90 km',
      duration: '1h 15min',
      description:
        'Petite ville fortifiée connue pour ses fresques murales et son festival des arts.',
      image: '/images/Asilah.png',
      icon: Building2,
    },
    {
      destination: 'Larache',
      distance: '110 km',
      duration: '1h 30min',
      description:
        'Ville côtière avec une riche histoire phénicienne, romaine et arabe.',
      image: '/images/Larach.png',
      icon: Landmark,
    },
    {
      destination: 'Rabat Capital',
      distance: '275 km',
      duration: '3h 30min',
      description:
        'Capitale du Maroc, entre patrimoine historique, institutions et front de mer élégant.',
      image: '/images/Rabatcapital.png',
      icon: Building,
    },
    {
      destination: 'Casablanca',
      distance: '360 km',
      duration: '4h 15min',
      description:
        'Métropole moderne du Maroc, célèbre pour sa corniche, son énergie urbaine et Hassan II.',
      image: '/images/Casablanca.png',
      icon: Building2,
    },
    {
      destination: 'Marrakech',
      distance: '590 km',
      duration: '6h 30min',
      description:
        'Ville impériale vibrante, connue pour ses souks, palais, jardins et atmosphère unique.',
      image: '/images/Marrakech.png',
      icon: Crown,
    },
  ];

  const airports = [
    {
      name: 'Aéroport de Tétouan',
      code: 'TTU',
      distance: '5 km du centre',
      duration: '10 min',
      description:
        'Aéroport le plus proche, vols domestiques et internationaux limités.',
      icon: Plane,
    },
    {
      name: 'Aéroport de Tanger',
      code: 'TNG',
      distance: '65 km',
      duration: '1h',
      description:
        'Aéroport international principal de la région avec de nombreuses destinations.',
      icon: Plane,
    },
    {
      name: 'Aéroport Mohamed 5, Casablanca',
      code: 'CMN',
      distance: '380 km',
      duration: '4h 20min',
      description:
        'Principal hub aérien du Maroc avec un large réseau international.',
      icon: Plane,
    },
    {
      name: 'Aéroport Marrakech, Ménara',
      code: 'RAK',
      distance: '600 km',
      duration: '6h 40min',
      description:
        'Aéroport international majeur, pratique pour les liaisons touristiques.',
      icon: Plane,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="relative pt-28 pb-16 bg-ritcars-black overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/images/carwhite.png"
            alt="Tétouan"
            className="w-full h-full object-cover"
          />
        </div>

        <div
          ref={headerRef}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <span className="inline-block bg-ritcars-orange/20 text-ritcars-orange px-4 py-2 rounded-full text-sm font-medium mb-4">
            Guide de voyage
          </span>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Découvrir <span className="text-ritcars-orange">Tétouan</span>
          </h1>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            La perle du nord du Maroc, entre médina andalouse et montagnes du Rif.
          </p>
        </div>
      </section>

      <section ref={attractionsRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ritcars-orange font-medium text-sm uppercase tracking-wider">
              À voir
            </span>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-ritcars-black mt-2">
              Les incontournables de Tétouan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {attractions.map((attraction, index) => (
              <div
                key={index}
                className="attraction-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 bg-ritcars-orange/10 rounded-lg flex items-center justify-center shrink-0">
                      <attraction.icon className="w-5 h-5 text-ritcars-orange" />
                    </div>

                    <span className="text-[11px] font-medium text-ritcars-orange bg-ritcars-orange/10 px-3 py-1 rounded-full text-right">
                      {attraction.highlight}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-ritcars-black leading-tight mb-2">
                    {attraction.name}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {attraction.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={routesRef} className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-11">
            <span className="text-ritcars-orange font-medium text-sm uppercase tracking-wider">
              Excursions
            </span>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-ritcars-black mt-2">
              Routes depuis Tétouan
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Avec votre voiture de location, explorez les magnifiques destinations des environs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {routes.map((route, index) => (
              <div
                key={index}
                className="route-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={route.image}
                    alt={route.destination}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-ritcars-orange/10 rounded-lg flex items-center justify-center shrink-0">
                      <route.icon className="w-5 h-5 text-ritcars-orange" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-ritcars-black leading-tight">
                        {route.destination}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Route className="w-4 h-4" />
                          {route.distance}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {route.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {route.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={airportsRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-ritcars-orange font-medium text-sm uppercase tracking-wider">
              Accès
            </span>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-ritcars-black mt-2">
              Aéroports à proximité
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Nous pouvons vous livrer votre voiture directement à l'aéroport.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {airports.map((airport, index) => (
              <div
                key={index}
                className="airport-card bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-ritcars-orange/10 rounded-xl flex items-center justify-center shrink-0">
                    <airport.icon className="w-6 h-6 text-ritcars-orange" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold text-ritcars-black leading-tight">
                      {airport.name}
                    </h3>

                    <span className="text-ritcars-orange text-sm font-mono font-bold">
                      {airport.code}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-gray-400 shrink-0" />
                    {airport.distance}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    {airport.duration} en voiture
                  </p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {airport.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-ritcars-orange">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Prêt à explorer Tétouan ?
          </h2>

          <p className="text-white/90 text-lg mb-8">
            Réservez votre voiture dès maintenant et commencez votre aventure.
          </p>

          <a
            href="/reservation"
            className="inline-flex items-center gap-2 bg-white text-ritcars-orange px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Réserver maintenant
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DiscoverPage;