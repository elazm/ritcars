import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  FaCarSide as Car,
  FaChevronRight as ChevronRight,
  FaLocationDot as MapPin,
  FaShieldHalved as Shield,
  FaStar as Star,
  FaWhatsapp as WhatsApp,
  FaInfinity as InfiniteIcon,
  FaHeadset as Headset,
  FaCircleCheck as CircleCheck,
} from 'react-icons/fa6';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_BASE = 'https://wa.me/212762253818';

const allCars = [
  { id: 1,  name: 'Dacia Sandero',      image: '/images/dacia-sandero.jpg',      seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 280 },
  { id: 2,  name: 'Dacia Sandero Stepway', image: '/images/dacia-stepway-grey.jpg', seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 320 },
  { id: 3,  name: 'Dacia Logan',         image: '/images/dacia-logan.jpg',         seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 300 },
  { id: 4,  name: 'Dacia Duster',        image: '/images/Daciaduster1.png',        seats: 5, fuel: 'Diesel',  transmission: 'Manuelle', price: 400 },
  { id: 5,  name: 'Dacia Jogger',        image: '/images/Daciajogger1.png',        seats: 7, fuel: 'Diesel',  transmission: 'Manuelle', price: 400 },
  { id: 6,  name: 'Peugeot 208',         image: '/images/peugeot2081.png',         seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 300 },
  { id: 7,  name: 'Peugeot 2008',        image: '/images/peugeot20081.png',        seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 500 },
  { id: 8,  name: 'Renault Clio 5',      image: '/images/Clio51.png',              seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 300 },
  { id: 9,  name: 'Renault Clio 5',      image: '/images/Clio51.png',              seats: 5, fuel: 'Diesel',  transmission: 'Manuelle', price: 250 },
  { id: 10, name: 'Seat Ibiza',          image: '/images/Seatibiza1.png',          seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 400 },
  { id: 11, name: 'Citroën C3 Aircross', image: '/images/Citroenc3aircross.png',   seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 450 },
];

const reviews = [
  { name: 'Karim B.', rating: 5, text: 'Super service, voiture propre et en parfait état. Je recommande vivement Ritcars pour votre séjour à Tétouan !' },
  { name: 'Sophie M.', rating: 5, text: 'Prix très corrects, équipe sympa et réactive sur WhatsApp. La voiture était disponible à l\'heure.' },
  { name: 'Youssef A.', rating: 5, text: 'Excellent rapport qualité-prix. Assurance incluse, kilométrage illimité — pas de mauvaises surprises.' },
];

function carBadge(car: typeof allCars[0]): string {
  if (car.seats === 7) return 'Familial';
  if (car.price >= 450) return 'Premium';
  if (car.price <= 280) return 'Économique';
  if (car.name.toLowerCase().includes('duster') || car.name.toLowerCase().includes('2008') || car.name.toLowerCase().includes('aircross')) return 'SUV';
  return 'Populaire';
}

function CarCard({ car }: { car: typeof allCars[0] }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const waLink = `${WHATSAPP_BASE}?text=${encodeURIComponent(`Bonjour, je voudrais réserver la ${car.name}. Pouvez-vous me confirmer la disponibilité ?`)}`;
  const badge = carBadge(car);

  return (
    <div className="car-card group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image — taller, more dominant */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 animate-pulse bg-gray-100" />
        )}
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50 text-gray-300">
            <Car className="size-14" />
            <span className="text-sm font-medium text-gray-400">{car.name}</span>
          </div>
        ) : (
          <img
            src={car.image}
            alt={`${car.name} — location voiture Tétouan`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Badge top-left */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700 shadow-sm backdrop-blur-sm">
          {badge}
        </span>

        {/* Fuel top-right */}
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${car.fuel === 'Diesel' ? 'bg-blue-600' : 'bg-emerald-500'}`}>
          {car.fuel}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">

        {/* Price — dominant, first */}
        <div className="mb-3">
          <span className="font-display text-3xl font-bold text-ritcars-orange">{car.price}</span>
          <span className="ml-1.5 text-sm font-medium text-gray-400">MAD / jour</span>
        </div>

        {/* Car name */}
        <h3 className="mb-4 text-xl font-bold leading-snug text-gray-900">{car.name}</h3>

        {/* Specs — minimal, pill style */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
            {car.seats} places
          </span>
          <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
            {car.transmission}
          </span>
          <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
            {car.fuel}
          </span>
        </div>

        {/* CTA — full width, prominent */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-ritcars-orange font-bold text-white transition-colors hover:bg-[#C2410C]"
        >
          <WhatsApp className="size-5" />
          Réserver ce véhicule
        </a>
      </div>
    </div>
  );
}

function BookingForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [carType, setCarType] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Bonjour, je veux louer une voiture${carType ? ` (${carType})` : ''} du ${startDate} au ${endDate}. Pouvez-vous me confirmer la disponibilité ?`;
    window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"
    >
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Date de début</label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
            className="min-h-[48px] rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:border-ritcars-orange focus:outline-none focus:ring-2 focus:ring-ritcars-orange/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Date de fin</label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
            className="min-h-[48px] rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:border-ritcars-orange focus:outline-none focus:ring-2 focus:ring-ritcars-orange/20"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Véhicule</label>
          <select
            value={carType}
            onChange={e => setCarType(e.target.value)}
            className="min-h-[48px] rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:border-ritcars-orange focus:outline-none focus:ring-2 focus:ring-ritcars-orange/20"
          >
            <option value="">Tous les véhicules</option>
            <option>Dacia Sandero</option>
            <option>Dacia Sandero Stepway</option>
            <option>Dacia Logan</option>
            <option>Dacia Duster</option>
            <option>Dacia Jogger</option>
            <option>Peugeot 208</option>
            <option>Peugeot 2008</option>
            <option>Renault Clio 5</option>
            <option>Seat Ibiza</option>
            <option>Citroën C3 Aircross</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="flex w-full min-h-[52px] items-center justify-center gap-2 rounded-xl bg-ritcars-orange px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[#C2410C]"
      >
        <WhatsApp className="size-5" />
        Vérifier la disponibilité sur WhatsApp
      </button>
    </form>
  );
}

const HomePage = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const carsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-content', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.stat-item', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: statsRef.current, start: 'top 80%' } });
      gsap.fromTo('.feature-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: featuresRef.current, start: 'top 75%' } });
      gsap.fromTo('.car-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: carsRef.current, start: 'top 75%' } });
    });
    return () => ctx.revert();
  }, []);

  const googleMapsUrl = 'https://maps.app.goo.gl/3RabpB7KomELm1og7';
  const googleMapsEmbedUrl = 'https://www.google.com/maps?q=Ritcars%20Lotissement%20Alia%203%20Lot%20102%20Touilaa%20Tetouan%20Morocco&output=embed';

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* HERO */}
      <section className="relative overflow-hidden bg-ritcars-black pt-20 pb-16 md:pt-28 md:pb-24">
        {/* Background image with strong controlled overlay */}
        <img
          src="/images/hero-city.png"
          alt="Location voiture Tétouan"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.18 }}
        />
        {/* Gradient overlay for depth and text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="hero-content mb-10 text-center">

            {/* Rating pill */}
            <div className="mb-6 flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />)}
              <span className="ml-1 text-sm font-medium text-white/75">4.9/5 · 200+ avis clients</span>
            </div>

            {/* Headline */}
            <h1 className="mb-5 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Votre voiture vous attend<br className="hidden sm:block" />{' '}
              <span className="text-ritcars-orange">à Tétouan</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-8 max-w-xl text-base text-white/70 sm:text-lg">
              Location simple, rapide et fiable — livraison disponible à Tétouan, Martil, M'diq et environs.
            </p>

            {/* Trust line */}
            <p className="mb-8 text-xs font-medium uppercase tracking-widest text-white/50">
              Assurance incluse · Kilométrage illimité · Réservation rapide sur WhatsApp
            </p>
          </div>

          {/* Booking form */}
          <div className="hero-content">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-white py-8 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {[
              { icon: Shield, label: 'Assurance incluse' },
              { icon: InfiniteIcon, label: 'Kilométrage illimité' },
              { icon: CircleCheck, label: 'Sans dépôt' },
              { icon: Headset, label: 'Support 24/7' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-gray-700">
                <Icon className="size-5 text-ritcars-orange" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="bg-ritcars-black py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '250+', label: 'MAD/jour' },
              { value: '11', label: 'Véhicules' },
              { value: '200+', label: 'Clients satisfaits' },
              { value: '24/7', label: 'Assistance' },
            ].map(({ value, label }) => (
              <div key={label} className="stat-item text-center">
                <p className="mb-1 font-display text-4xl font-bold text-ritcars-orange md:text-5xl">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section ref={featuresRef} className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">Pourquoi nous choisir</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ritcars-black md:text-4xl">Les avantages Ritcars</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: Shield,      title: 'Assurance incluse',      desc: 'Tous nos véhicules sont assurés pour votre tranquillité.' },
              { icon: InfiniteIcon, title: 'Kilométrage illimité',   desc: 'Roulez sans souci, sans compteur kilométrique.' },
              { icon: CircleCheck, title: 'Sans dépôt de garantie', desc: 'Pas de caution bloquée, réservation simple et rapide.' },
              { icon: Headset,     title: 'Support 24/7',           desc: 'Service client disponible à tout moment sur WhatsApp.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-card rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ritcars-orange/10">
                  <Icon className="size-6 text-ritcars-orange" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-ritcars-black">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL CARS */}
      <section ref={carsRef} className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">Notre flotte</span>
              <h2 className="mt-1 font-display text-3xl font-bold text-ritcars-black md:text-4xl">
                11 véhicules disponibles
              </h2>
            </div>
            <Link to="/flotte" className="flex items-center gap-1 font-medium text-ritcars-orange hover:underline">
              Voir tous les détails <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allCars.map(car => <CarCard key={car.id} car={car} />)}
          </div>

          <div className="mt-10 text-center">
            <a
              href={`${WHATSAPP_BASE}?text=${encodeURIComponent('Bonjour, je veux réserver une voiture. Pouvez-vous me confirmer la disponibilité ?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#25D366] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#20ba59]"
            >
              <WhatsApp className="size-5" />
              Réserver sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">Avis clients</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ritcars-black">Ce que disent nos clients</h2>
            <div className="mt-3 flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />)}
              <span className="ml-1 font-bold text-ritcars-black">4.9/5</span>
              <span className="text-gray-500">· 200+ avis</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {reviews.map(r => (
              <div key={r.name} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-3 flex gap-1">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="mb-4 text-sm text-gray-600">"{r.text}"</p>
                <p className="font-semibold text-ritcars-black">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="contact" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-ritcars-orange">Notre agence</span>
              <h2 className="mt-2 font-display text-3xl font-bold text-ritcars-black md:text-4xl">Trouvez Ritcars à Tétouan</h2>
              <p className="mt-4 text-gray-600">Venez récupérer votre voiture directement à notre agence, ou ouvrez l'itinéraire dans Google Maps.</p>
              <div className="mt-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ritcars-orange/10">
                  <MapPin className="size-5 text-ritcars-orange" />
                </div>
                <div>
                  <p className="font-semibold text-ritcars-black">Adresse</p>
                  <p className="mt-1 text-gray-600">Lotissement Alia 3 Lot 102 Touilaa - Tétouan</p>
                </div>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-ritcars-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-[#C2410C]"
              >
                <MapPin className="size-4" />
                Ouvrir Google Maps
              </a>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
              <iframe
                title="Carte Ritcars Tétouan"
                src={googleMapsEmbedUrl}
                className="h-[360px] w-full border-0 md:h-[460px]"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-ritcars-orange py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">Prêt à partir à l'aventure ?</h2>
          <p className="mb-8 text-lg text-white/90">Réservez votre voiture maintenant et découvrez Tétouan et ses environs.</p>
          <a
            href={`${WHATSAPP_BASE}?text=${encodeURIComponent('Bonjour, je veux réserver une voiture. Pouvez-vous m\'aider ?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-10 py-4 font-semibold text-ritcars-orange transition-colors hover:bg-gray-100"
          >
            <WhatsApp className="size-5" />
            Réserver maintenant
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
