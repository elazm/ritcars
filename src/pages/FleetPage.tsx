import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  FaCheck as Check,
  FaDoorOpen as DoorOpen,
  FaGaugeHigh as Gauge,
  FaUsers as Users,
} from 'react-icons/fa6';

gsap.registerPlugin(ScrollTrigger);

const FleetPage = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const carsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.fleet-car',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: carsRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const fleetCars = [
    {
      id: 1,
      name: 'Dacia Sandero',
      image: '/images/dacia-sandero.jpg',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Essence', 'Climatisation', 'USB', 'Bluetooth'],
      price: 280,
    },
    {
      id: 2,
      name: 'Dacia Sandero Stepway',
      image: '/images/dacia-stepway-grey.jpg',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Essence', 'Climatisation', 'USB', 'Bluetooth', 'Barres de toit'],
      price: 320,
    },
    {
      id: 3,
      name: 'Dacia Logan',
      image: '/images/dacia-logan.jpg',
      seats: 5,
      doors: 4,
      transmission: 'Manuelle',
      features: ['Essence', 'Climatisation', 'USB', 'Bluetooth', 'Grand coffre'],
      price: 300,
    },
    {
      id: 4,
      name: 'Dacia Duster',
      image: '/images/Daciaduster1.png',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Diesel', 'Climatisation', 'USB', 'Bluetooth', '4x4'],
      price: 400,
    },
    {
      id: 5,
      name: 'Dacia Jogger',
      image: '/images/Daciajogger1.png',
      seats: 7,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Diesel', 'Climatisation', 'USB', 'Bluetooth', '7 Places'],
      price: 400,
    },
    {
      id: 6,
      name: 'Peugeot 208',
      image: '/images/peugeot2081.png',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Essence', 'Climatisation', 'USB', 'Bluetooth'],
      price: 300,
    },
    {
      id: 7,
      name: 'Peugeot 2008',
      image: '/images/peugeot20081.png',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Essence', 'Climatisation', 'USB', 'Bluetooth', 'SUV'],
      price: 500,
    },
    {
      id: 8,
      name: 'Renault Clio 5',
      image: '/images/Clio51.png',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Essence', 'Climatisation', 'USB', 'Bluetooth'],
      price: 300,
    },
    {
      id: 9,
      name: 'Renault Clio 5',
      image: '/images/Clio51.png',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Diesel', 'Climatisation', 'USB', 'Bluetooth'],
      price: 250,
    },
    {
      id: 10,
      name: 'Seat Ibiza',
      image: '/images/Seatibiza1.png',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Essence', 'Climatisation', 'USB', 'Bluetooth'],
      price: 400,
    },
    {
      id: 11,
      name: 'Citroën C3 Aircross',
      image: '/images/Citroenc3aircross.png',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Essence', 'Climatisation', 'USB', 'Bluetooth', 'SUV'],
      price: 450,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="bg-gray-50 pt-28 pb-12">
        <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">
              Notre Flotte
            </span>
            <h1 className="mt-2 mb-4 font-display text-4xl font-bold text-ritcars-black md:text-5xl">
              11 véhicules à votre service
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Tous nos véhicules sont récents, propres et parfaitement entretenus.
              À partir de{' '}
              <span className="font-bold text-ritcars-orange">250 MAD/jour</span>
            </p>
          </div>
        </div>
      </section>

      <section ref={carsRef} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {fleetCars.map((car) => (
              <div
                key={car.id}
                className="fleet-car overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="mb-3 font-display text-xl font-bold text-ritcars-black">
                    {car.name}
                  </h3>

                  <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {car.seats} places
                    </span>
                    <span className="flex items-center gap-1">
                      <DoorOpen className="h-4 w-4" /> {car.doors} portes
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" /> {car.transmission}
                    </span>
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {car.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                      >
                        <Check className="h-3 w-3 text-ritcars-orange" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div>
                      <span className="text-sm text-gray-500">Prix/jour</span>
                      <p className="font-display text-2xl font-bold text-ritcars-orange">
                        {car.price} <span className="text-sm text-gray-500">MAD</span>
                      </p>
                    </div>
                    <Link
                      to="/reservation"
                      className="rounded-lg bg-ritcars-black px-6 py-2.5 font-medium text-white transition-colors hover:bg-ritcars-orange"
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

      <section className="bg-ritcars-black py-16">
        <div className="max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-display text-3xl font-bold text-white">
            Vous avez trouve votre voiture ?
          </h2>
          <p className="mb-8 text-gray-400">
            Reservez maintenant et profitez de votre sejour a Tetouan.
          </p>
          <Link
            to="/reservation"
            className="inline-block rounded-xl bg-ritcars-orange px-10 py-4 font-semibold text-white transition-colors hover:bg-ritcars-orange/90"
          >
            Reserver maintenant
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FleetPage;
