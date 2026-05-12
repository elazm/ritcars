import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { FaBars as Menu, FaXmark as X } from "react-icons/fa6";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/flotte", label: "Notre Flotte" },
  { to: "/decouvrir-tetouan", label: "Decouvrir Tetouan" },
];

const WHATSAPP_URL =
  "https://wa.me/212762253818?text=Bonjour%20je%20veux%20reserver%20une%20voiture";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md"
        style={{ background: "linear-gradient(90deg, #ff5a1f 0%, #7c2d12 60%, #0b0b0c 100%)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5">
          <Link
            to="/"
            className="font-display text-[2.2rem] font-bold uppercase tracking-[0.12em] text-white"
            style={{ fontFamily: '"SF Sports Night NS Upright", "Space Grotesk", sans-serif' }}
          >
            RIT CARS
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? "bg-white text-[#7c2d12] shadow-sm"
                    : "text-white/78 hover:bg-white/8 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[52px] min-w-[148px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,211,102,0.22)] transition-colors hover:bg-[#20bd5a]"
            >
              <FaWhatsapp className="size-5 text-white" />
              WhatsApp
            </a>

            <a
              href="tel:+212762253818"
              className="flex h-[52px] min-w-[176px] flex-col items-center justify-center rounded-xl border border-white/35 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-colors hover:border-white/60"
            >
              <span className="text-[0.95rem] leading-tight">+212 762253818</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
                Contact us
              </span>
            </a>

            <Link
              to="/reservation"
              className="flex h-[52px] min-w-[148px] items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-[#20110c] shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#fff4ee]"
            >
              Reserver
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-white md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[100] transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "#0B0B0C" }}
      >
        <div className="p-6">
          <div className="mb-10 flex items-center justify-between">
            <span
              className="font-display text-[1.9rem] font-bold uppercase tracking-[0.12em] text-white"
              style={{ fontFamily: '"SF Sports Night NS Upright", "Space Grotesk", sans-serif' }}
            >
              RIT CARS
            </span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="size-8 text-white" />
            </button>
          </div>

          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-3 text-lg font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 space-y-3 border-t border-white/10 pt-8">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-[#25D366] font-semibold text-white"
            >
              <FaWhatsapp className="size-5 text-white" />
              WhatsApp
            </a>
            <a
              href="tel:+212762253818"
              className="flex h-[52px] flex-col items-center justify-center rounded-xl border border-white/35 bg-white/[0.03] font-semibold text-white"
            >
              <span className="text-[0.95rem] leading-tight">+212 762253818</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
                Contact us
              </span>
            </a>
            <Link
              to="/reservation"
              onClick={() => setMobileOpen(false)}
              className="flex h-[52px] items-center justify-center rounded-xl bg-white font-semibold text-[#20110c]"
            >
              Reserver
            </Link>
          </div>
        </div>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_rgba(37,211,102,0.38)] transition-all hover:-translate-y-0.5 hover:bg-[#20bd5a] hover:shadow-[0_18px_42px_rgba(37,211,102,0.42)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 md:bottom-7 md:right-7 md:h-16 md:w-16"
      >
        <FaWhatsapp className="size-7 text-white md:size-8" />
      </a>

      <div className="h-[52px]" />
    </>
  );
}
