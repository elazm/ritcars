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

// Single authoritative accent — warmer, less raw than #FF5A1F
const ACCENT       = '#bf4813';
const ACCENT_HOVER = '#963a0f';

const allCars = [
  { id: 1,  name: 'Dacia Sandero',         image: '/images/dacia-sandero.jpg',      seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 250 },
  { id: 2,  name: 'Dacia Sandero Stepway', image: '/images/dacia-stepway-grey.jpg', seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 320 },
  { id: 3,  name: 'Dacia Logan',           image: '/images/dacia-logan.jpg',        seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 300 },
  { id: 4,  name: 'Dacia Duster',          image: '/images/Daciaduster1.png',       seats: 5, fuel: 'Diesel',  transmission: 'Manuelle', price: 400 },
  { id: 5,  name: 'Dacia Jogger',          image: '/images/Daciajogger1.png',       seats: 7, fuel: 'Diesel',  transmission: 'Manuelle', price: 400 },
  { id: 6,  name: 'Peugeot 208',           image: '/images/peugeot2081.png',        seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 300 },
  { id: 7,  name: 'Peugeot 2008',          image: '/images/peugeot20081.png',       seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 500 },
  { id: 8,  name: 'Renault Clio 5',        image: '/images/Clio51.png',             seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 300 },
  { id: 9,  name: 'Renault Clio 5',        image: '/images/Clio51.png',             seats: 5, fuel: 'Diesel',  transmission: 'Manuelle', price: 250 },
  { id: 10, name: 'Seat Ibiza',            image: '/images/Seatibiza1.png',         seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 400 },
  { id: 11, name: 'Citroën C3 Aircross',   image: '/images/Citroenc3aircross.png',  seats: 5, fuel: 'Essence', transmission: 'Manuelle', price: 450 },
  { id: 12, name: 'Hyundai i20',                image: '/images/i20.png',    seats: 5, fuel: 'Essence', transmission: 'Automatique', price: 350 },
  { id: 13, name: 'Hyundai i20',                image: '/images/i20.png',    seats: 5, fuel: 'Essence', transmission: 'Automatique', price: 350 },
  { id: 14, name: 'Hyundai Accent',             image: '/images/Accent.png', seats: 5, fuel: 'Essence', transmission: 'Automatique', price: 400 },
  { id: 15, name: 'Hyundai Tucson',             image: '/images/Tucson.png', seats: 5, fuel: 'Diesel',  transmission: 'Automatique', price: 500 },
  { id: 16, name: 'Hyundai Tucson Full Option', image: '/images/Tucson.png', seats: 5, fuel: 'Diesel',  transmission: 'Automatique', price: 700 },
];

const reviews = [
  {
    name: 'Karim B.',
    origin: 'Casablanca',
    trip: 'Séjour familial à Tétouan',
    rating: 5,
    text: 'On a loué une Dacia Sandero pour une semaine. Voiture propre, plein fait, et livrée directement à notre riad. Le monsieur a répondu sur WhatsApp en quelques minutes. Aucun souci du début à la fin.',
  },
  {
    name: 'Sophie M.',
    origin: 'Lyon, France',
    trip: 'Road trip nord du Maroc',
    rating: 5,
    text: 'Nous avons fait Tétouan, Chefchaouen et Asilah avec la Clio. Voiture en très bon état, kilométrage illimité comme promis, et le prix était exactement celui annoncé. Pas de surprise à la restitution.',
  },
  {
    name: 'Youssef A.',
    origin: 'Tétouan',
    trip: 'Location longue durée',
    rating: 5,
    text: 'J\'habite Tétouan et je fais appel à Ritcars régulièrement quand ma voiture est en révision. Prix honnête, assurance incluse, et on sent que c\'est une vraie agence locale — pas un intermédiaire.',
  },
];

function carBadge(car: typeof allCars[0]): string {
  if (car.seats === 7) return 'Familial';
  if (car.price >= 450) return 'Premium';
  if (car.price <= 280) return 'Économique';
  if (['duster','2008','aircross'].some(k => car.name.toLowerCase().includes(k))) return 'SUV';
  return 'Populaire';
}

/* ─── Section label — consistent eyebrow style across all sections ─── */
function Label({ children }: { children: string }) {
  return (
    <span className="block text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
      {children}
    </span>
  );
}

/* ─── Car card ─── */
function CarCard({ car }: { car: typeof allCars[0] }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const waLink = `${WHATSAPP_BASE}?text=${encodeURIComponent(`Bonjour, je voudrais réserver la ${car.name}. Pouvez-vous me confirmer la disponibilité ?`)}`;
  const badge  = carBadge(car);

  return (
    <div
      className="car-card group flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-[3px]"
      style={{
        border:     '1px solid rgba(0,0,0,0.07)',
        boxShadow:  '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.05)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)')}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: '#f0eeeb' }}>
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 animate-pulse" style={{ background: '#e8e5e0' }} />
        )}
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: '#f0eeeb' }}>
            <Car className="size-12 text-gray-300" />
            <span className="text-sm text-gray-400">{car.name}</span>
          </div>
        ) : (
          <img
            src={car.image}
            alt={`${car.name} — location voiture Tétouan`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {/* Ground shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/10 to-transparent" />

        <span className="absolute left-3 top-3 rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-600"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.10)' }}>
          {badge}
        </span>
        <span className={`absolute right-3 top-3 rounded px-2 py-0.5 text-[11px] font-semibold text-white ${car.fuel === 'Diesel' ? 'bg-blue-700' : 'bg-emerald-600'}`}>
          {car.fuel}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        {/* Price */}
        <div className="mb-1.5 flex items-baseline gap-1.5">
          <span className="text-[1.75rem] font-bold leading-none" style={{ color: ACCENT }}>{car.price}</span>
          <span className="text-sm text-gray-400">MAD / jour</span>
        </div>

        {/* Name */}
        <h3 className="mb-3.5 text-base font-semibold leading-snug text-gray-900">{car.name}</h3>

        {/* Specs */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {[`${car.seats} places`, car.transmission, car.fuel].map(spec => (
            <span key={spec} className="rounded px-2.5 py-1 text-[11px] font-medium text-gray-500"
              style={{ background: '#f4f3f1', border: '1px solid rgba(0,0,0,0.06)' }}>
              {spec}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ background: ACCENT }}
          onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
          onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
        >
          <WhatsApp className="size-4" />
          Réserver ce véhicule
        </a>
      </div>
    </div>
  );
}

/* ─── Booking form ─── */
function BookingForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate,   setEndDate]   = useState('');
  const [carType,   setCarType]   = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Bonjour, je veux louer une voiture${carType ? ` (${carType})` : ''} du ${startDate} au ${endDate}. Pouvez-vous me confirmer la disponibilité ?`;
    window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const inputCls = "min-h-[46px] w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-[#bf4813] focus:outline-none focus:ring-2 focus:ring-[#bf4813]/15";

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6"
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)' }}>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">Date de début</label>
          <input type="date" min={today} value={startDate} onChange={e => setStartDate(e.target.value)} required className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">Date de fin</label>
          <input type="date" min={startDate || today} value={endDate} onChange={e => setEndDate(e.target.value)} required className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">Véhicule</label>
          <select value={carType} onChange={e => setCarType(e.target.value)} className={inputCls}>
            <option value="">Tous les véhicules</option>
            {['Dacia Sandero','Dacia Sandero Stepway','Dacia Logan','Dacia Duster','Dacia Jogger',
              'Peugeot 208','Peugeot 2008','Renault Clio 5','Seat Ibiza','Citroën C3 Aircross'].map(v => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit"
        className="flex w-full min-h-[50px] items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-colors"
        style={{ background: ACCENT }}
        onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
        onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
      >
        <WhatsApp className="size-4" />
        Vérifier la disponibilité sur WhatsApp
      </button>
    </form>
  );
}

/* ─── Page ─── */
const HomePage = () => {
  const statsRef    = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const carsRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-content', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.stat-item',    { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: statsRef.current,    start: 'top 82%' } });
      gsap.fromTo('.feature-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.10, ease: 'power3.out', scrollTrigger: { trigger: featuresRef.current, start: 'top 78%' } });
      gsap.fromTo('.car-card',     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: carsRef.current,    start: 'top 78%' } });
    });
    return () => ctx.revert();
  }, []);

  const googleMapsUrl      = 'https://maps.app.goo.gl/3RabpB7KomELm1og7';
  const googleMapsEmbedUrl = 'https://www.google.com/maps?q=Ritcars%20Lotissement%20Alia%203%20Lot%20102%20Touilaa%20Tetouan%20Morocco&output=embed';

  return (
    <div className="min-h-screen bg-white" style={{ color: '#1a1a1a' }}>
      <Navigation />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#0d0d0d] pt-20 pb-20 md:pt-28 md:pb-28">
        <img src="/images/hero-city.png" alt="Location voiture Tétouan"
          className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.15 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65) 100%)' }} />

        <div className="relative mx-auto max-w-3xl px-5 sm:px-6">
          <div className="hero-content mb-10 text-center">
            {/* Rating */}
            <div className="mb-7 flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-yellow-400 text-yellow-400" />)}
              <span className="ml-1.5 text-sm text-white/60">4.9/5 · 200+ avis clients</span>
            </div>

            {/* H1 */}
            <h1 className="mb-5 text-[2.6rem] font-bold leading-[1.12] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.5rem]">
              Votre voiture vous attend<br className="hidden sm:block" />{' '}
              <span style={{ color: '#e07040' }}>à Tétouan</span>
            </h1>

            {/* Sub */}
            <p className="mx-auto mb-7 max-w-lg text-[0.97rem] leading-relaxed text-white/60 sm:text-base">
              Location simple, rapide et fiable — livraison disponible à Tétouan, Martil, M'diq et environs.
            </p>

            {/* Trust line */}
            <p className="mb-9 text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
              Assurance incluse · Kilométrage illimité · Réservation rapide sur WhatsApp
            </p>
          </div>

          <div className="hero-content">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="border-b border-gray-100 bg-white py-5">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {[
              { icon: Shield,       label: 'Assurance tous risques incluse' },
              { icon: InfiniteIcon, label: 'Kilométrage illimité' },
              { icon: CircleCheck,  label: 'Sans frais cachés' },
              { icon: Headset,      label: 'Réponse WhatsApp rapide' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-gray-600">
                <Icon className="size-4 shrink-0" style={{ color: ACCENT }} />
                <span className="text-[0.82rem] font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="bg-[#0f0f0f] py-14">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '250+', label: 'MAD / jour' },
              { value: '11',   label: 'Véhicules' },
              { value: '200+', label: 'Clients satisfaits' },
              { value: '24/7', label: 'Assistance' },
            ].map(({ value, label }) => (
              <div key={label} className="stat-item text-center">
                <p className="mb-1.5 text-4xl font-bold leading-none md:text-5xl" style={{ color: '#e07040' }}>{value}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section ref={featuresRef} className="bg-[#f8f7f5] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-14 text-center">
            <Label>Pourquoi nous choisir</Label>
            <h2 className="mt-3 text-[1.85rem] font-bold leading-tight tracking-tight text-gray-900 md:text-[2.2rem]">
              Les avantages Ritcars
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: Shield,       title: 'Assurance tous risques', desc: 'Chaque véhicule est assuré tous risques. Vous roulez couvert, sans vous en préoccuper.' },
              { icon: InfiniteIcon, title: 'Kilométrage illimité',   desc: 'Tétouan, Chefchaouen, Tanger, Martil — roulez où vous voulez, sans compter les km.' },
              { icon: CircleCheck,  title: 'Prix clairs, sans frais cachés', desc: 'Le prix annoncé est le prix payé. Pas de frais de restitution, pas de surprises.' },
              { icon: Headset,      title: 'Contact direct sur WhatsApp', desc: 'Vous parlez directement à l\'équipe Ritcars — pas à un call center, pas à un bot.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-card rounded-2xl bg-white p-7"
                style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(191,72,19,0.08)' }}>
                  <Icon className="size-5" style={{ color: ACCENT }} />
                </div>
                <h3 className="mb-2 text-[0.95rem] font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLEET ── */}
      <section ref={carsRef} className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Label>Notre flotte</Label>
              <h2 className="mt-3 text-[1.85rem] font-bold leading-tight tracking-tight text-gray-900 md:text-[2.2rem]">
                16 véhicules disponibles
              </h2>
            </div>
            <Link to="/flotte" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
              Voir tous les détails <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allCars.map(car => <CarCard key={car.id} car={car} />)}
          </div>

          <div className="mt-12 text-center">
            <a
              href={`${WHATSAPP_BASE}?text=${encodeURIComponent('Bonjour, je veux réserver une voiture. Pouvez-vous me confirmer la disponibilité ?')}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#25D366] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1fa855]"
            >
              <WhatsApp className="size-4" />
              Réserver sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="bg-[#f8f7f5] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-12 text-center">
            <Label>Avis clients</Label>
            <h2 className="mt-3 text-[1.85rem] font-bold leading-tight tracking-tight text-gray-900">
              Ils nous ont fait confiance
            </h2>
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />)}
              <span className="ml-1 text-sm font-semibold text-gray-800">4.9 / 5</span>
              <span className="text-sm text-gray-400">· plus de 200 locations</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {reviews.map(r => (
              <div key={r.name} className="rounded-2xl bg-white p-7"
                style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="mb-4 flex gap-0.5">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} className="size-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="mb-5 text-[0.9rem] leading-relaxed text-gray-600">"{r.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">{r.origin} · {r.trip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section id="contact" className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Label>Notre agence</Label>
              <h2 className="mt-3 text-[1.85rem] font-bold leading-tight tracking-tight text-gray-900 md:text-[2.2rem]">
                Trouvez Ritcars à Tétouan
              </h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-gray-500">
                Notre agence est basée à Tétouan. Vous pouvez récupérer le véhicule sur place, ou opter pour la livraison à Martil, M'diq, Cabo Negro ou à votre hébergement.
              </p>
              <div className="mt-7 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(191,72,19,0.08)' }}>
                  <MapPin className="size-4" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Adresse</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">Lotissement Alia 3 Lot 102 Touilaa — Tétouan</p>
                </div>
              </div>
              <a
                href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors"
                style={{ background: ACCENT }}
                onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
                onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
              >
                <MapPin className="size-4" />
                Ouvrir Google Maps
              </a>
            </div>
            <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <iframe title="Carte Ritcars Tétouan" src={googleMapsEmbedUrl}
                className="h-[360px] w-full border-0 md:h-[440px]"
                loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 md:py-24" style={{ background: '#1a1a1a' }}>
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-6">
          <h2 className="mb-4 text-[1.85rem] font-bold leading-tight tracking-tight text-white md:text-[2.2rem]">
            Prêt à prendre la route ?
          </h2>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-gray-400">
            Écrivez-nous sur WhatsApp — on vous répond rapidement avec les disponibilités et le meilleur tarif pour votre séjour.
          </p>
          <a
            href={`${WHATSAPP_BASE}?text=${encodeURIComponent('Bonjour, je veux réserver une voiture. Pouvez-vous m\'aider ?')}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl px-9 py-3 text-sm font-semibold text-white transition-colors"
            style={{ background: ACCENT }}
            onMouseEnter={e => (e.currentTarget.style.background = ACCENT_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
          >
            <WhatsApp className="size-4" />
            Réserver sur WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
