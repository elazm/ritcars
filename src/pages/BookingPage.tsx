import { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  Calendar,
  User,
  Phone,
  Mail,
  Car,
  MapPin,
  Check,
  ChevronDown,
} from 'lucide-react';

const BookingPage = () => {
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
  });

  const carTypes = [
    { value: 'sandero', label: 'Dacia Sandero' },
    { value: 'stepway', label: 'Dacia Sandero Stepway' },
    { value: 'logan', label: 'Dacia Logan' },
  ];

  const pickupLocations = [
    { value: 'agence', label: 'Notre agence (Tétouan)' },
    { value: 'tetouan-airport', label: 'Aéroport de Tétouan (Sania Ramel)' },
    { value: 'tanger-airport', label: 'Aéroport de Tanger (Ibn Battouta)' },
    { value: 'tanger-ville', label: 'Centre-ville de Tanger' },
    { value: 'chefchaouen', label: 'Chefchaouen' },
    { value: 'marrakech-airport', label: 'Aéroport de Marrakech Menara' },
    { value: 'casablanca-airport', label: 'Aéroport de Casablanca Mohammed V' },
  ];

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
    const returnD = new Date(formData.returnDate);
    const diffTime = returnD.getTime() - pickup.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const totalPrice = calculateDays() * 350;

  const selectedCarLabel =
    carTypes.find((c) => c.value === formData.carType)?.label || '';

  const selectedPickupLocationLabel =
    pickupLocations.find((l) => l.value === formData.pickupLocation)?.label || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/reservations', {
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
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erreur serveur');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Reservation submit error:', error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Erreur inconnue, vérifiez le serveur'
      );
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
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>

              <h1 className="font-display text-3xl font-bold text-ritcars-black mb-4">
                Demande envoyée
              </h1>

              <p className="text-gray-600 mb-6">
                Merci pour votre demande de réservation. Nous vous contacterons rapidement
                au <span className="font-semibold">{formData.phone}</span> pour confirmer
                votre réservation.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-ritcars-black mb-4">Récapitulatif</h3>

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
                    <span className="text-gray-500">Durée :</span> {calculateDays()} jour(s)
                  </p>
                  <p className="font-semibold text-ritcars-orange text-lg pt-2 border-t">
                    Total estimé : {totalPrice} MAD
                  </p>
                </div>
              </div>

              <a
                href="/"
                className="inline-block bg-ritcars-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-ritcars-orange/90 transition-colors"
              >
                Retour à l'accueil
              </a>
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
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-ritcars-black mb-4">
              Réserver votre voiture
            </h1>
            <p className="text-gray-600">
              Remplissez le formulaire ci-dessous et nous vous contacterons pour
              confirmer votre réservation.
            </p>
          </div>

          <div className="flex items-center justify-center mb-10">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step >= 1
                  ? 'bg-ritcars-orange text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </div>

            <div className={`w-16 h-1 ${step >= 2 ? 'bg-ritcars-orange' : 'bg-gray-200'}`} />

            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step >= 2
                  ? 'bg-ritcars-orange text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-ritcars-black mb-6">
                  Détails de la location
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de voiture
                  </label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="carType"
                      value={formData.carType}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange appearance-none bg-white"
                    >
                      <option value="">Sélectionnez une voiture</option>
                      {carTypes.map((car) => (
                        <option key={car.value} value={car.value}>
                          {car.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de retrait
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de retour
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu de retrait
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange appearance-none bg-white"
                    >
                      <option value="">Sélectionnez un lieu</option>
                      {pickupLocations.map((loc) => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {calculateDays() > 0 && (
                  <div className="bg-ritcars-orange/10 rounded-xl p-4 flex items-center justify-between">
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

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={
                    !formData.carType ||
                    !formData.pickupDate ||
                    !formData.returnDate ||
                    !formData.pickupLocation
                  }
                  className="w-full bg-ritcars-orange text-white py-4 rounded-xl font-semibold hover:bg-ritcars-orange/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continuer
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-ritcars-orange hover:underline"
                  >
                    ← Retour
                  </button>
                </div>

                <h2 className="font-display text-xl font-bold text-ritcars-black mb-6">
                  Vos coordonnées
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange"
                      placeholder="Votre nom complet"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange"
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (optionnel)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange resize-none"
                    placeholder="Demandes spéciales, questions, détails supplémentaires..."
                  />
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-ritcars-orange text-white py-4 rounded-xl font-semibold hover:bg-ritcars-orange/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Nous vous contacterons sous peu pour confirmer votre réservation.
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