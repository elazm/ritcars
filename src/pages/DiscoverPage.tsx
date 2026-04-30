import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  FaArrowRight as ArrowRight,
  FaBuilding as Building,
  FaBuilding as Building2,
  FaCamera as Camera,
  FaClock as Clock,
  FaCrown as Crown,
  FaLandmark as Landmark,
  FaLocationDot as MapPin,
  FaMountain as Mountain,
  FaPlaneDeparture as Plane,
  FaRoute as Route,
  FaShip as Ship,
  FaUmbrellaBeach as Palmtree,
  FaWater as Waves,
} from 'react-icons/fa6';

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
      name: 'Medina de Tetouan',
      description: 'Classee UNESCO, ruelles andalouses et souks authentiques.',
      icon: Building2,
      highlight: 'Culture & Patrimoine',
      image: '/images/medina-tetouan.png',
    },
    {
      name: 'Palais Royal (Dar El Makhzen)',
      description: 'Belle facade mauresque sur la Place Hassan II.',
      icon: Crown,
      highlight: 'Architecture royale',
      image: '/images/palais-royal-tetouan.png',
    },
    {
      name: 'Place Feddan',
      description: "Place animee a l'entree de la medina avec fontaines et palmiers.",
      icon: Mountain,
      highlight: 'Place & Vie locale',
      image: '/images/place-feddan.png',
    },
    {
      name: "Musee d'Art Moderne",
      description:
        "Installe dans un ancien palais, il abrite une collection d'art marocain contemporain.",
      icon: Camera,
      highlight: 'Art & Culture',
      image: '/images/musee-art-moderne-tetouan.png',
    },
    {
      name: 'Plage de Martil',
      description: 'Plage la plus proche, longue et animee.',
      icon: Waves,
      highlight: 'Plage & Animee',
      image: '/images/plage-martil.png',
    },
    {
      name: "Plage de M'Diq",
      description: 'Belle plage, port et promenade.',
      icon: Palmtree,
      highlight: 'Plage & Detente',
      image: '/images/plage-mdiq.png',
    },
    {
      name: 'Cabo Negro',
      description: 'Station balneaire chic avec plage et golfs.',
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
        'Ville cosmopolite au detroit de Gibraltar. Visitez la medina, la Kasbah et la nouvelle marina.',
      image: '/images/Tangier.png',
      icon: MapPin,
    },
    {
      destination: 'Chefchaouen',
      distance: '65 km',
      duration: '1h 15min',
      description:
        'La ville bleue perchee dans les montagnes du Rif. Un site incontournable pour les photographes.',
      image: '/images/Chefchaouen.png',
      icon: Mountain,
    },
    {
      destination: 'Al Hoceima',
      distance: '180 km',
      duration: '2h 30min',
      description:
        "Belle ville cotiere avec des plages magnifiques et le parc national d'Al Hoceima.",
      image: '/images/AlHoceima.png',
      icon: Waves,
    },
    {
      destination: 'Asilah',
      distance: '90 km',
      duration: '1h 15min',
      description:
        'Petite ville fortifiee connue pour ses fresques murales et son festival des arts.',
      image: '/images/Asilah.png',
      icon: Building2,
    },
    {
      destination: 'Larache',
      distance: '110 km',
      duration: '1h 30min',
      description:
        'Ville cotiere avec une riche histoire phenicienne, romaine et arabe.',
      image: '/images/Larach.png',
      icon: Landmark,
    },
    {
      destination: 'Rabat',
      distance: '275 km',
      duration: '3h 30min',
      description:
        'Capitale du Maroc, entre patrimoine historique, institutions et front de mer elegant.',
      image: '/images/Rabatcapital.png',
      icon: Building,
    },
    {
      destination: 'Casablanca',
      distance: '360 km',
      duration: '4h 15min',
      description:
        'Metropole moderne du Maroc, celebre pour sa corniche, son energie urbaine et Hassan II.',
      image: '/images/Casablanca.png',
      icon: Building2,
    },
    {
      destination: 'Marrakech',
      distance: '590 km',
      duration: '6h 30min',
      description:
        'Ville imperiale vibrante, connue pour ses souks, palais, jardins et atmosphere unique.',
      image: '/images/Marrakech.png',
      icon: Crown,
    },
  ];

  const airports = [
    {
      name: 'Aeroport de Tetouan',
      code: 'TTU',
      distance: '5 km du centre',
      duration: '10 min',
      description: 'Aeroport le plus proche, vols domestiques et internationaux limites.',
      icon: Plane,
    },
    {
      name: 'Aeroport de Tanger',
      code: 'TNG',
      distance: '65 km',
      duration: '1h',
      description:
        'Aeroport international principal de la region avec de nombreuses destinations.',
      icon: Plane,
    },
    {
      name: 'Aeroport Mohamed V, Casablanca',
      code: 'CMN',
      distance: '380 km',
      duration: '4h 20min',
      description: 'Principal hub aerien du Maroc avec un large reseau international.',
      icon: Plane,
    },
    {
      name: 'Aeroport Marrakech Menara',
      code: 'RAK',
      distance: '600 km',
      duration: '6h 40min',
      description:
        'Aeroport international majeur, pratique pour les liaisons touristiques.',
      icon: Plane,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="relative overflow-hidden bg-ritcars-black pt-28 pb-16">
        <div className="absolute inset-0 opacity-30">
          <img src="/images/carwhite.png" alt="Tetouan" className="h-full w-full object-cover" />
        </div>

        <div
          ref={headerRef}
          className="relative max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8"
        >
          <span className="mb-4 inline-block rounded-full bg-ritcars-orange/20 px-4 py-2 text-sm font-medium text-ritcars-orange">
            Guide de voyage
          </span>

          <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Decouvrir <span className="text-ritcars-orange">Tetouan</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            La perle du nord du Maroc, entre medina andalouse et montagnes du Rif.
          </p>
        </div>
      </section>

      <section ref={attractionsRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">
              A voir
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold text-ritcars-black md:text-4xl">
              Les incontournables de Tetouan
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {attractions.map((attraction) => (
              <div
                key={attraction.name}
                className="attraction-card overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ritcars-orange/10">
                      <attraction.icon className="h-5 w-5 text-ritcars-orange" />
                    </div>

                    <span className="rounded-full bg-ritcars-orange/10 px-3 py-1 text-right text-[11px] font-medium text-ritcars-orange">
                      {attraction.highlight}
                    </span>
                  </div>

                  <h3 className="mb-2 font-display text-lg font-bold leading-tight text-ritcars-black">
                    {attraction.name}
                  </h3>

                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {attraction.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={routesRef} className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-11 text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">
              Excursions
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold text-ritcars-black md:text-4xl">
              Routes depuis Tetouan
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Avec votre voiture de location, explorez les magnifiques destinations des environs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {routes.map((route) => (
              <div
                key={route.destination}
                className="route-card overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={route.image}
                    alt={route.destination}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ritcars-orange/10">
                      <route.icon className="h-5 w-5 text-ritcars-orange" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold leading-tight text-ritcars-black">
                        {route.destination}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Route className="h-4 w-4" />
                          {route.distance}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {route.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
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
          <div className="mb-12 text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">
              Acces
            </span>

            <h2 className="mt-2 font-display text-3xl font-bold text-ritcars-black md:text-4xl">
              Aeroports a proximite
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Nous pouvons vous livrer votre voiture directement a l'aeroport.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {airports.map((airport) => (
              <div
                key={airport.code}
                className="airport-card rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ritcars-orange/10">
                    <airport.icon className="h-6 w-6 text-ritcars-orange" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold leading-tight text-ritcars-black">
                      {airport.name}
                    </h3>

                    <span className="font-mono text-sm font-bold text-ritcars-orange">
                      {airport.code}
                    </span>
                  </div>
                </div>

                <div className="mb-4 space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Route className="h-4 w-4 shrink-0 text-gray-400" />
                    {airport.distance}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                    {airport.duration} en voiture
                  </p>
                </div>

                <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                  {airport.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ritcars-orange py-16">
        <div className="max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-display text-3xl font-bold text-white">
            Pret a explorer Tetouan ?
          </h2>

          <p className="mb-8 text-lg text-white/90">
            Reservez votre voiture des maintenant et commencez votre aventure.
          </p>

          <Link
            to="/reservation"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-semibold text-ritcars-orange transition-colors hover:bg-gray-100"
          >
            Reserver maintenant
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DiscoverPage;
