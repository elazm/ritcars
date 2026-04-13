import { Phone, Instagram, MapPin, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ritcars-black border-t border-white/10">
      <div className="px-6 lg:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {/* Brand */}
            <div>
              <h3 className="font-display text-3xl font-bold text-ritcars-white mb-4">
                RITCARS
              </h3>
              <p className="text-ritcars-gray text-sm leading-relaxed mb-6">
                Modern car rentals in Tetouan, Morocco. Clean cars, fair pricing, 
                and no surprises. Your journey starts here.
              </p>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-ritcars-orange hover:text-white transition-colors group"
              >
                <span className="font-mono text-xs uppercase tracking-wider">
                  Back to top
                </span>
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-ritcars-orange mb-4">
                Quick Links
              </h4>
              <nav className="space-y-3">
                <a
                  href="#fleet"
                  className="block text-ritcars-gray hover:text-white transition-colors"
                >
                  Our Fleet
                </a>
                <a
                  href="#why"
                  className="block text-ritcars-gray hover:text-white transition-colors"
                >
                  Why Ritcars
                </a>
                <a
                  href="#contact"
                  className="block text-ritcars-gray hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-ritcars-orange mb-4">
                Contact
              </h4>
              <div className="space-y-4">
                <a
                  href="tel:0762253818"
                  className="flex items-center gap-3 text-ritcars-gray hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>0762253818</span>
                </a>
                <a
                  href="tel:0628789702"
                  className="flex items-center gap-3 text-ritcars-gray hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>0628789702</span>
                </a>
                <a
                  href="https://instagram.com/ritcars.ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-ritcars-gray hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@ritcars.ma</span>
                </a>
                <div className="flex items-start gap-3 text-ritcars-gray">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>Lotissement Alia 3 Lot 102 Touilaa - Tetouan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-ritcars-gray text-sm">
              © {new Date().getFullYear()} Ritcars. All rights reserved.
            </p>
            <p className="font-mono text-xs text-ritcars-gray/60 uppercase tracking-wider">
              Drive Morocco · Simple · Modern · Yours
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
