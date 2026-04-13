import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Instagram, MapPin, Send, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  className?: string;
}

const ContactSection = ({ className = '' }: ContactSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { x: '-6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        rightRef.current,
        { x: '6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        pickupDate: '',
        returnDate: '',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`relative bg-ritcars-light py-20 md:py-32 ${className}`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-ritcars-orange" />

      <div className="px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
          {/* Left column - Contact info */}
          <div ref={leftRef}>
            <span className="font-mono text-xs uppercase tracking-widest text-ritcars-orange mb-4 block">
              Get in touch
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ritcars-black mb-6">
              Ready to drive?
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-md">
              Send a request and we'll confirm availability within minutes.
            </p>

            {/* Contact details */}
            <div className="space-y-6">
              <a
                href="tel:0762253818"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-ritcars-black rounded-full flex items-center justify-center group-hover:bg-ritcars-orange transition-colors">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-500">
                    Phone
                  </p>
                  <p className="font-display text-xl text-ritcars-black group-hover:text-ritcars-orange transition-colors">
                    0762253818
                  </p>
                </div>
              </a>

              <a
                href="tel:0628789702"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-ritcars-black rounded-full flex items-center justify-center group-hover:bg-ritcars-orange transition-colors">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-500">
                    Phone
                  </p>
                  <p className="font-display text-xl text-ritcars-black group-hover:text-ritcars-orange transition-colors">
                    0628789702
                  </p>
                </div>
              </a>

              <a
                href="https://instagram.com/ritcars.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-ritcars-black rounded-full flex items-center justify-center group-hover:bg-ritcars-orange transition-colors">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-500">
                    Instagram
                  </p>
                  <p className="font-display text-xl text-ritcars-black group-hover:text-ritcars-orange transition-colors">
                    @ritcars.ma
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ritcars-black rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-500">
                    Address
                  </p>
                  <p className="font-display text-lg text-ritcars-black">
                    Lotissement Alia 3 Lot 102 Touilaa - Tetouan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div ref={rightRef}>
            <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-ritcars-black mb-2">
                    Request Sent!
                  </h3>
                  <p className="text-gray-600">
                    We'll get back to you within minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-ritcars-black focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-ritcars-black focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-ritcars-black focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange transition-colors"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Pick-up Date
                      </label>
                      <input
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-ritcars-black focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Return Date
                      </label>
                      <input
                        type="date"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-ritcars-black focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-ritcars-black focus:outline-none focus:border-ritcars-orange focus:ring-1 focus:ring-ritcars-orange transition-colors resize-none"
                      placeholder="Any special requests or questions?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-ritcars-orange text-white px-6 py-4 rounded-lg font-medium hover:bg-ritcars-orange/90 transition-colors"
                  >
                    <span>Send request</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
