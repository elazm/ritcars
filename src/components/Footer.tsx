import { Link } from 'react-router-dom';
import { Phone, Instagram, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ritcars-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold">
                RIT<span className="text-ritcars-orange">CARS</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Location de voitures à Tétouan. Des véhicules propres, des prix équitables, sans surprises.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-ritcars-orange transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/flotte" className="text-gray-400 hover:text-ritcars-orange transition-colors text-sm">
                  Notre Flotte
                </Link>
              </li>
              <li>
                <Link to="/decouvrir-tetouan" className="text-gray-400 hover:text-ritcars-orange transition-colors text-sm">
                  Découvrir Tétouan
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="text-gray-400 hover:text-ritcars-orange transition-colors text-sm">
                  Réserver
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:0762253818" className="flex items-center gap-2 text-gray-400 hover:text-ritcars-orange transition-colors text-sm">
                  <Phone className="w-4 h-4" />
                  0762253818
                </a>
              </li>
              <li>
                <a href="tel:0628789702" className="flex items-center gap-2 text-gray-400 hover:text-ritcars-orange transition-colors text-sm">
                  <Phone className="w-4 h-4" />
                  0628789702
                </a>
              </li>
              <li>
                <a href="https://instagram.com/ritcars.ma" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-ritcars-orange transition-colors text-sm">
                  <Instagram className="w-4 h-4" />
                  @ritcars.ma
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold mb-4">Adresse</h4>
            <div className="flex items-start gap-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Lotissement Alia 3 Lot 102 Touilaa - Tétouan</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Ritcars. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
