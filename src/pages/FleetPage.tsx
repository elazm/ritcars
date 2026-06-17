import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  FaCarSide as Car,
  FaGasPump as Fuel,
  FaUsers as Users,
  FaWhatsapp as WhatsApp,
  FaGaugeHigh as Gauge,
} from 'react-icons/fa6';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_BASE = 'https://wa.me/212762253818';

const fleetCars = [
  { id: 1,  name: 'Dacia Sandero',         image: '/images/dacia-sandero.jpg',      seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 250 },
  { id: 2,  name: 'Dacia Sandero Stepway', image: '/images/dacia-stepway-grey.jpg', seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 320 },
  { id: 3,  name: 'Dacia Logan',           image: '/images/dacia-logan.jpg',         seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 300 },
  { id: 4,  name: 'Dacia Duster',          image: '/images/Daciaduster1.png',        seats: 5, fuel: 'Diesel',  transmission: 'Manuelle', price: 400 },
  { id: 5,  name: 'Dacia Jogger',          image: '/images/Daciajogger1.png',        seats: 7, fuel: 'Diesel',  transmission: 'Manuelle', price: 400 },
  { id: 6,  name: 'Peugeot 208',           image: '/images/peugeot2081.png',         seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 300 },
  { id: 7,  name: 'Peugeot 2008 GT',       image: '/images/peugeot20081.png',        seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 500 },
  { id: 8,  name: 'Renault Clio 5',        image: '/images/Clio51.png',              seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 300 },
  { id: 9,  name: 'Renault Clio 5 Diesel', image: '/images/Clio51.png',              seats: 5, fuel: 'Diesel',  transmission: 'Manuelle', price: 250 },
  { id: 10, name: 'Seat Ibiza',            image: '/images/Seatibiza1.png',          seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 400 },
  { id: 11, name: 'Citroën C3 Aircross',   image: '/images/Citroenc3aircross.png',   seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 450 },
  { id: 12, name: 'Hyundai i20',                image: '/images/i20.png',     seats: 5, fuel: 'Essence', transmission: 'Automatique', price: 350 },
  { id: 13, name: 'Hyundai i20',                image: '/images/i20.png',     seats: 5, fuel: 'Essence', transmission: 'Automatique', price: 350 },
  { id: 14, name: 'Hyundai Accent',             image: '/images/Accent.png',  seats: 5, fuel: 'Essence', transmission: 'Automatique', price: 400 },
  { id: 15, name: 'Hyundai Tucson',             image: '/images/Tucson.png',  seats: 5, fuel: 'Diesel',  transmission: 'Automatique', price: 500 },
  { id: 16, name: 'Hyundai Tucson Full Option', image: '/images/tucsonfullop.png',  seats: 5, fuel: 'Diesel',  transmission: 'Automatique', price: 700 },
];

function CarCard({ car }: { car: typeof fleetCars[0] }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const waLink = `${WHATSAPP_BASE}?text=${encodeURIComponent(`Bonjour, je veux réserver la ${car.name}. Pouvez-vous me confirmer la disponibilité et le prix ?`)}`;

  return (
    <div className="fleet-car flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100 text-gray-400">
            <Car className="size-12" />
            <span className="text-sm font-medium">{car.name}</span>
          </div>
        ) : (
          <img
            src={car.image}
            alt={`${car.name} - location voiture Tétouan`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`h-full w-full object-cover transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {/* Fuel badge */}
        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white ${car.fuel === 'Diesel' ? 'bg-blue-600' : 'bg-green-600'}`}>
          {car.fuel}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 font-display text-lg font-bold text-ritcars-black">{car.name}</h3>

        <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><Users className="size-4 text-ritcars-orange" />{car.seats} places</span>
          <span className="flex items-center gap-1.5"><Fuel className="size-4 text-ritcars-orange" />{car.fuel}</span>
          <span className="flex items-center gap-1.5"><Gauge className="size-4 text-ritcars-orange" />{car.transmission}</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-xs text-gray-400">À partir de</p>
            <p className="font-display text-2xl font-bold text-ritcars-orange">
              {car.price} <span className="text-sm font-normal text-gray-400">MAD/jour</span>
            </p>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#20ba59]"
          >
            <WhatsApp className="size-4" />
            Réserver
          </a>
        </div>
      </div>
    </div>
  );
}

const FleetPage = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const carsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      gsap.fromTo('.fleet-car', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: carsRef.current, start: 'top 80%' } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header */}
      <section className="bg-gray-50 pb-12 pt-28">
        <div ref={headerRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">Notre Flotte</span>
            <h1 className="mb-4 mt-2 font-display text-4xl font-bold text-ritcars-black md:text-5xl">
              16 véhicules à votre service
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Tous nos véhicules sont récents, propres et parfaitement entretenus.{' '}
              <span className="font-bold text-ritcars-orange">À partir de 250 MAD/jour</span>
            </p>
            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              {['✅ Assurance incluse', '✅ Kilométrage illimité', '✅ Sans dépôt', '✅ Support 24/7'].map(b => (
                <span key={b} className="rounded-full bg-white px-4 py-2 shadow-sm font-medium">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cars grid */}
      <section ref={carsRef} className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fleetCars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ritcars-black py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-display text-3xl font-bold text-white">Vous avez trouvé votre voiture ?</h2>
          <p className="mb-8 text-gray-400">Réservez maintenant et profitez de votre séjour à Tétouan.</p>
          <a
            href={`${WHATSAPP_BASE}?text=${encodeURIComponent('Bonjour, je veux réserver une voiture. Pouvez-vous m\'aider ?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-ritcars-orange px-10 py-4 font-semibold text-white transition-colors hover:bg-[#C2410C]"
          >
            <WhatsApp className="size-5" />
            Réserver sur WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FleetPage;
