import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Users, DoorOpen, Gauge, Check } from 'lucide-react';

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
      features: ['Climatisation', 'USB', 'Bluetooth'],
      price: 350,
    },
    {
      id: 2,
      name: 'Dacia Sandero',
      image: '/images/dacia-sandero.jpg',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Climatisation', 'USB', 'Bluetooth'],
      price: 350,
    },
    {
      id: 3,
      name: 'Dacia Sandero Stepway',
      image: '/images/dacia-stepway-grey.jpg',
      seats: 5,
      doors: 5,
      transmission: 'Boite Automatique',
      features: ['Essence' , 'Climatisation', 'USB', 'Bluetooth'],
      price: 350,
    },
    {
      id: 4,
      name: 'Dacia Sandero Stepway',
      image: '/images/dacia-stepway-grey.jpg',
      seats: 5,
      doors: 5,
      transmission: 'Boite Automatique',
      features: ['Essence' , 'Climatisation', 'USB', 'Bluetooth', 'Barres de toit'],
      price: 350,
    },
    {
      id: 5,
      name: 'Dacia Sandero Stepway',
      image: '/images/dacia-stepway-black.jpg',
      seats: 5,
      doors: 5,
      transmission: 'Manuelle',
      features: ['Climatisation', 'USB', 'Bluetooth', 'Barres de toit'],
      price: 350,
    },
    {
      id: 6,
      name: 'Dacia Logan',
      image: '/images/dacia-logan-black.jpg',
      seats: 5,
      doors: 4,
      transmission: 'Manuelle',
      features: ['Climatisation', 'USB', 'Bluetooth', 'Grand coffre'],
      price: 350,
    },
    {
      id: 7,
      name: 'Dacia Logan',
      image: '/images/dacia-logan.jpg',
      seats: 5,
      doors: 4,
      transmission: 'Boite Automatique',
      features: ['Essence' , 'Climatisation', 'USB', 'Bluetooth', 'Grand coffre'],
      price: 350,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header */}
      <section className="pt-28 pb-12 bg-gray-50">
        <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-ritcars-orange font-medium text-sm uppercase tracking-wider">Notre Flotte</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ritcars-black mt-2 mb-4">
              7 véhicules Dacia à votre service
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tous nos véhicules sont récents, propres et parfaitement entretenus. 
              Prix unique : <span className="font-bold text-ritcars-orange">A partir de 350 MAD/jour</span>
            </p>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section ref={carsRef} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fleetCars.map((car) => (
              <div
                key={car.id}
                className="fleet-car bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-ritcars-black mb-3">
                    {car.name}
                  </h3>

                  {/* Specs */}
                  <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {car.seats} places
                    </span>
                    <span className="flex items-center gap-1">
                      <DoorOpen className="w-4 h-4" /> {car.doors} portes
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="w-4 h-4" /> {car.transmission}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {car.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                      >
                        <Check className="w-3 h-3 text-ritcars-orange" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-gray-500 text-sm">Prix/jour</span>
                      <p className="font-display text-2xl font-bold text-ritcars-orange">
                        {car.price} <span className="text-sm text-gray-500">MAD</span>
                      </p>
                    </div>
                    <Link
                      to="/reservation"
                      className="bg-ritcars-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-ritcars-orange transition-colors"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-600">
              <span className="font-semibold">Note :</span> Les prix peuvent varier selon la saison. 
              Contactez-nous pour des tarifs de longue durée.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-ritcars-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Vous avez trouvé votre voiture ?
          </h2>
          <p className="text-gray-400 mb-8">
            Réservez maintenant et profitez de votre séjour à Tétouan.
          </p>
          <Link
            to="/reservation"
            className="inline-block bg-ritcars-orange text-white px-10 py-4 rounded-xl font-semibold hover:bg-ritcars-orange/90 transition-colors"
          >
            Réserver maintenant
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FleetPage;
