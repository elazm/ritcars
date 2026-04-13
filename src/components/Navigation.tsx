import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Notre Flotte', path: '/flotte' },
    { label: 'Découvrir Tétouan', path: '/decouvrir-tetouan' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold text-ritcars-black">
                RIT<span className="text-ritcars-orange">CARS</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-ritcars-orange'
                      : 'text-ritcars-black hover:text-ritcars-orange'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://wa.me/212762253818?text=Bonjour%20je%20veux%20réserver%20une%20voiture"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>

              <a
                href="tel:0762253818"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ritcars-orange text-ritcars-orange font-semibold hover:bg-ritcars-orange hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                Contact
              </a>

              <Link
                to="/reservation"
                className="bg-ritcars-orange text-white px-5 py-2.5 rounded-lg font-medium hover:bg-ritcars-orange/90 transition-colors"
              >
                Réserver
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-ritcars-black" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[100] bg-white transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <span className="font-display text-2xl font-bold text-ritcars-black">
              RIT<span className="text-ritcars-orange">CARS</span>
            </span>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-xl font-medium py-2 ${
                  isActive(link.path)
                    ? 'text-ritcars-orange'
                    : 'text-ritcars-black'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t space-y-3">
            <a
              href="https://wa.me/212762253818?text=Bonjour%20je%20veux%20réserver%20une%20voiture"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>

            <a
              href="tel:0628789702"
              className="flex items-center justify-center gap-2 border border-ritcars-orange text-ritcars-orange px-5 py-3 rounded-lg font-medium hover:bg-ritcars-orange hover:text-white transition-colors"
            >
              <Phone className="w-5 h-5" />
              Contact
            </a>

            <Link
              to="/reservation"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full bg-ritcars-orange text-white text-center px-5 py-3 rounded-lg font-medium hover:bg-ritcars-orange/90 transition-colors"
            >
              Réserver
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;