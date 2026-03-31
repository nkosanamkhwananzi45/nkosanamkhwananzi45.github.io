import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { services } from "@/data/services";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location]);

  const navBg = scrolled || !isHome
    ? "bg-card/95 backdrop-blur-md shadow-sm border-b border-border"
    : "bg-transparent";

  const textColor = scrolled || !isHome ? "text-foreground" : "text-dark-bg-foreground";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBg}`}>
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className={`text-2xl font-display font-bold ${scrolled || !isHome ? "text-primary" : "text-gold"}`}>A</span>
          <div className={`leading-tight ${textColor}`}>
            <span className="font-display font-bold text-sm md:text-base">Asante Andi</span>
            <span className="block text-xs opacity-70">Consulting</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className={`hidden md:flex items-center gap-6 ${textColor}`}>
          <Link to="/" className="text-sm font-semibold hover:opacity-80 transition-opacity">Home</Link>
          <div className="relative group" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button className="flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity">
              Services <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-card rounded-lg shadow-xl border border-border py-2">
                <Link to="/services" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">All Services</Link>
                {services.map(s => (
                  <Link key={s.slug} to={`/services/${s.slug}`} className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">{s.title}</Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/pricing" className="text-sm font-semibold hover:opacity-80 transition-opacity">Pricing</Link>
          <Link to="/about" className="text-sm font-semibold hover:opacity-80 transition-opacity">About</Link>
          <Link to="/contact" className="text-sm font-semibold hover:opacity-80 transition-opacity">Contact</Link>
          <Link to="/book" className="ml-2 px-5 py-2.5 rounded-lg bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 transition-opacity">
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className={`md:hidden ${textColor}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border shadow-xl">
          <div className="container py-4 flex flex-col gap-1">
            <Link to="/" className="py-3 px-4 text-foreground font-semibold rounded-lg hover:bg-muted">Home</Link>
            <button onClick={() => setServicesOpen(!servicesOpen)} className="flex items-center justify-between py-3 px-4 text-foreground font-semibold rounded-lg hover:bg-muted">
              Services <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && (
              <div className="pl-4">
                <Link to="/services" className="block py-2 px-4 text-sm text-muted-foreground hover:text-foreground">All Services</Link>
                {services.map(s => (
                  <Link key={s.slug} to={`/services/${s.slug}`} className="block py-2 px-4 text-sm text-muted-foreground hover:text-foreground">{s.title}</Link>
                ))}
              </div>
            )}
            <Link to="/pricing" className="py-3 px-4 text-foreground font-semibold rounded-lg hover:bg-muted">Pricing</Link>
            <Link to="/about" className="py-3 px-4 text-foreground font-semibold rounded-lg hover:bg-muted">About</Link>
            <Link to="/contact" className="py-3 px-4 text-foreground font-semibold rounded-lg hover:bg-muted">Contact</Link>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              <Link to="/book" className="text-center py-3 rounded-lg bg-accent text-accent-foreground font-bold">Book Now</Link>
              <a href="https://wa.me/27760884005" target="_blank" rel="noopener noreferrer" className="text-center py-3 rounded-lg bg-whatsapp text-accent-foreground font-bold">WhatsApp Us</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
