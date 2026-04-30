import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  FaCalendarDays as Calendar,
  FaCarSide as Car,
  FaCheck as Check,
  FaChevronDown as ChevronDown,
  FaEnvelope as Mail,
  FaLocationDot as MapPin,
  FaPhone as Phone,
  FaUser as User,
} from 'react-icons/fa6';

const BookingPage = () => {
  const apiBaseUrl = useMemo(() => {
    const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim();

    if (import.meta.env.DEV && configuredUrl) {
      return configuredUrl;
    }

    return import.meta.env.DEV ? 'http://localhost:5000' : '';
  }, []);

  const reservationEndpoint = useMemo(() => {
    if (apiBaseUrl) {
      return `${apiBaseUrl}/api/reservations`;
    }

    return '/api/reservations';
  }, [apiBaseUrl]);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    carType: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    name: '',
    phone: '',
    email: '',
    message: '',
    website: '',
  });

  const carTypes = [
    { value: 'sandero', label: 'Dacia Sandero' },
    { value: 'stepway', label: 'Dacia Sandero Stepway' },
    { value: 'logan', label: 'Dacia Logan' },
  ];

  const pickupLocations = [
    { value: 'agence', label: 'Notre agence (Tetouan)' },
    { value: 'tetouan-airport', label: 'Aeroport de Tetouan (Sania Ramel)' },
    { value: 'tanger-airport', label: 'Aeroport de Tanger (Ibn Battouta)' },
    { value: 'tanger-ville', label: 'Centre-ville de Tanger' },
    { value: 'chefchaouen', label: 'Chefchaouen' },
    { value: 'marrakech-airport', label: 'Aeroport de Marrakech Menara' },
    { value: 'casablanca-airport', label: 'Aeroport de Casablanca Mohammed V' },
  ];

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;

    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const diffTime = returnDate.getTime() - pickup.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const totalPrice = calculateDays() * 350;
  const selectedCarLabel =
    carTypes.find((car) => car.value === formData.carType)?.label || '';
  const selectedPickupLocationLabel =
    pickupLocations.find((location) => location.value === formData.pickupLocation)?.label || '';

  const hasValidDates =
    Boolean(formData.pickupDate) &&
    Boolean(formData.returnDate) &&
    formData.pickupDate >= today &&
    formData.returnDate > formData.pickupDate;

  const canContinueToStepTwo =
    Boolean(formData.carType) &&
    Boolean(formData.pickupLocation) &&
    hasValidDates;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(reservationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          email: formData.email,
          car: selectedCarLabel,
          pickupLocation: selectedPickupLocationLabel,
          pickupDate: formData.pickupDate,
          returnDate: formData.returnDate,
          message: formData.message,
          website: formData.website,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        let errorMessage = 'Erreur lors de la reservation.';
        
        if (data?.details && Array.isArray(data.details)) {
          errorMessage = data.details[0] || errorMessage;
        } else if (data?.error) {
          errorMessage = data.error;
        } else if (response.status === 429) {
          errorMessage = 'Trop de tentatives. Veuillez reessayer dans quelques minutes.';
        } else if (response.status >= 500) {
          errorMessage = 'Le serveur rencontre un probleme technique. Veuillez reessayer plus tard.';
        }
        
        throw new Error(errorMessage);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Reservation submit error:', error);
      let userMessage = 'Une erreur est survenue lors de votre demande.';
      
      if (error instanceof TypeError) {
        userMessage = 'Probleme de connexion. Verifiez votre Internet et reessayez.';
      } else if (error instanceof Error) {
        userMessage = error.message;
      }
      
      setSubmitError(userMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="pt-28 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg md:p-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Check className="h-10 w-10 text-green-600" />
              </div>

              <h1 className="mb-4 font-display text-3xl font-bold text-ritcars-black">
                Demande envoyee
              </h1>

              <p className="mb-6 text-gray-600">
                Merci pour votre demande de reservation. Nous vous contacterons rapidement
                au <span className="font-semibold">{formData.phone}</span> pour confirmer
                votre reservation.
              </p>

              <div className="mb-8 rounded-xl bg-gray-50 p-6 text-left">
                <h3 className="mb-4 font-semibold text-ritcars-black">Recapitulatif</h3>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Voiture :</span> {selectedCarLabel}
                  </p>
                  <p>
                    <span className="text-gray-500">Date de retrait :</span>{' '}
                    {formData.pickupDate}
                  </p>
                  <p>
                    <span className="text-gray-500">Date de retour :</span>{' '}
                    {formData.returnDate}
                  </p>
                  <p>
                    <span className="text-gray-500">Lieu de retrait :</span>{' '}
                    {selectedPickupLocationLabel}
                  </p>
                  <p>
                    <span className="text-gray-500">Duree :</span> {calculateDays()} jour(s)
                  </p>
                  <p className="border-t pt-2 text-lg font-semibold text-ritcars-orange">
                    Total estime : {totalPrice} MAD
                  </p>
                </div>
              </div>

              <Link
                to="/"
                className="inline-block rounded-xl bg-ritcars-orange px-8 py-3 font-semibold text-white transition-colors hover:bg-ritcars-orange/90"
              >
                Retour a l'accueil
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="mb-4 font-display text-4xl font-bold text-ritcars-black">
              Reserver votre voiture
            </h1>
            <p className="text-gray-600">
              Remplissez le formulaire ci-dessous et nous vous contacterons pour confirmer
              votre reservation.
            </p>
          </div>

          <div className="mb-10 flex items-center justify-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                step >= 1 ? 'bg-ritcars-orange text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </div>

            <div className={`h-1 w-16 ${step >= 2 ? 'bg-ritcars-orange' : 'bg-gray-200'}`} />

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                step >= 2 ? 'bg-ritcars-orange text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-lg md:p-10"
          >
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="mb-6 font-display text-xl font-bold text-ritcars-black">
                  Details de la location
                </h2>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Type de voiture
                  </label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <select
                      name="carType"
                      value={formData.carType}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                    >
                      <option value="">Selectionnez une voiture</option>
                      {carTypes.map((car) => (
                        <option key={car.value} value={car.value}>
                          {car.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Date de retrait
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        min={today}
                        required
                        className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Date de retour
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        min={formData.pickupDate || today}
                        required
                        className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Lieu de retrait
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <select
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                    >
                      <option value="">Selectionnez un lieu</option>
                      {pickupLocations.map((location) => (
                        <option key={location.value} value={location.value}>
                          {location.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {calculateDays() > 0 && (
                  <div className="flex items-center justify-between rounded-xl bg-ritcars-orange/10 p-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Estimation ({calculateDays()} jour(s))
                      </p>
                      <p className="font-display text-2xl font-bold text-ritcars-orange">
                        {totalPrice} MAD
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">350 MAD/jour</p>
                  </div>
                )}

                {formData.pickupDate && formData.pickupDate < today && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    La date de retrait ne peut pas etre dans le passe.
                  </div>
                )}

                {formData.pickupDate &&
                  formData.returnDate &&
                  formData.returnDate <= formData.pickupDate && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      La date de retour doit etre apres la date de retrait.
                    </div>
                  )}

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canContinueToStepTwo}
                  className="w-full rounded-xl bg-ritcars-orange py-4 font-semibold text-white transition-colors hover:bg-ritcars-orange/90 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Continuer
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="mb-6 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-ritcars-orange hover:underline"
                  >
                    ← Retour
                  </button>
                </div>

                <h2 className="mb-6 font-display text-xl font-bold text-ritcars-black">
                  Vos coordonnees
                </h2>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                      placeholder="Votre nom complet"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Telephone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                      placeholder="Votre numero de telephone"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email (optionnel)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Message (optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                    placeholder="Demandes speciales, questions, details supplementaires..."
                  />
                </div>

                {submitError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <p className="font-semibold mb-2">Erreur:</p>
                    <p>{submitError}</p>
                    <p className="mt-3 text-xs text-red-600">
                      Verifiez votre connexion Internet et reessayez. Si le probleme persiste, contactez-nous par WhatsApp ou telephone.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-ritcars-orange py-4 font-semibold text-white transition-colors hover:bg-ritcars-orange/90 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                  </button>
                  
                  {submitError && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-xl border border-gray-300 px-4 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Modifier
                    </button>
                  )}
                </div>

                <p className="text-center text-sm text-gray-500">
                  Nous vous contacterons sous peu pour confirmer votre reservation.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
