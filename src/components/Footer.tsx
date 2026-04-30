import { Link } from 'react-router-dom';
import {
  FaInstagram as Instagram,
  FaLocationDot as MapPin,
  FaPhone as Phone,
} from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-ritcars-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="mb-4 inline-block">
              <span className="font-display text-2xl font-bold">
                RIT<span className="text-ritcars-orange">CARS</span>
              </span>
            </Link>
            <p className="mb-4 text-sm text-gray-400">
              Location de voitures a Tetouan. Des vehicules propres, des prix
              equitables, sans surprises.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-400 transition-colors hover:text-ritcars-orange"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/flotte"
                  className="text-sm text-gray-400 transition-colors hover:text-ritcars-orange"
                >
                  Notre Flotte
                </Link>
              </li>
              <li>
                <Link
                  to="/decouvrir-tetouan"
                  className="text-sm text-gray-400 transition-colors hover:text-ritcars-orange"
                >
                  Decouvrir Tetouan
                </Link>
              </li>
              <li>
                <Link
                  to="/reservation"
                  className="text-sm text-gray-400 transition-colors hover:text-ritcars-orange"
                >
                  Reserver
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+212762253818"
                  className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-ritcars-orange"
                >
                  <Phone className="size-4 shrink-0" />
                  +212 762253818
                </a>
              </li>
              <li>
                <a
                  href="tel:+212628789702"
                  className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-ritcars-orange"
                >
                  <Phone className="size-4 shrink-0" />
                  +212 628789702
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/ritcars.ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-ritcars-orange"
                >
                  <Instagram className="size-4 shrink-0" />
                  @ritcars.ma
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Adresse</h4>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>Lotissement Alia 3 Lot 102 Touilaa - Tetouan</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Ritcars. Tous droits reserves.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
