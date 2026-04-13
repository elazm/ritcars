import { useState, useEffect } from 'react';
import { Menu, X, Instagram, Phone } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Fleet', id: 'fleet' },
    { label: 'How it works', id: 'why' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${
          isScrolled
            ? 'bg-ritcars-black/90 backdrop-blur-md py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-2xl font-bold text-ritcars-white tracking-tight hover:text-ritcars-orange transition-colors"
          >
            RITCARS
          </button>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Desktop menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="hidden md:flex items-center gap-2 text-ritcars-white hover:text-ritcars-orange transition-colors"
            >
              <span className="font-mono text-xs uppercase tracking-widest">Menu</span>
              <Menu className="w-5 h-5" />
            </button>

            {/* Book now CTA */}
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-primary text-sm"
            >
              Book now
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-ritcars-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full screen menu overlay */}
      <div
        className={`fixed inset-0 z-[300] bg-ritcars-black transition-transform duration-500 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Menu header */}
          <div className="flex items-center justify-between px-6 lg:px-12 py-6">
            <span className="font-display text-2xl font-bold text-ritcars-white">
              RITCARS
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-ritcars-white hover:text-ritcars-orange transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Menu content */}
          <div className="flex-1 flex flex-col justify-center px-6 lg:px-24">
            <nav className="space-y-8">
              {navLinks.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block font-display text-5xl md:text-7xl font-bold text-ritcars-white hover:text-ritcars-orange transition-colors text-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Menu footer */}
          <div className="px-6 lg:px-12 py-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <a
                  href="tel:0762253818"
                  className="flex items-center gap-2 text-ritcars-gray hover:text-ritcars-orange transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-mono text-sm">0762253818</span>
                </a>
                <a
                  href="https://instagram.com/ritcars.ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-ritcars-gray hover:text-ritcars-orange transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="font-mono text-sm">@ritcars.ma</span>
                </a>
              </div>
              <p className="font-mono text-xs text-ritcars-gray uppercase tracking-widest">
                Lotissement Alia 3 Lot 102 Touilaa - Tetouan
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
