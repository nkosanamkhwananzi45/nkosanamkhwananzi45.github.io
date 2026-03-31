import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Facebook } from "lucide-react";
import { services } from "@/data/services";
import logo from "@/assets/logo.jpg";

const Footer = () => (
  <footer>
    {/* CTA Banner */}
    <section className="gradient-cta py-12 md:py-16">
      <div className="container text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-accent-foreground mb-4">Ready to Grow? Let's Start Today</h2>
        <p className="text-accent-foreground/80 mb-6 max-w-md mx-auto font-body">Take the first step towards academic and professional success with Asante Andi.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/book" className="px-6 py-3 rounded-lg bg-card text-foreground font-bold hover:bg-card/90 transition-colors">Book a Service</Link>
          <a href="https://wa.me/27760884005" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg border-2 border-accent-foreground text-accent-foreground font-bold hover:bg-accent-foreground/10 transition-colors">WhatsApp Us</a>
        </div>
      </div>
    </section>

    {/* Footer columns */}
    <div className="gradient-hero text-dark-bg-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Asante Andi Consulting" className="h-10 w-auto rounded-md" />
              <div>
                <span className="font-display font-bold">Asante Andi</span>
                <span className="block text-xs opacity-70">Consulting</span>
              </div>
            </div>
            <p className="text-sm opacity-70 mb-4">Skills development and academic support consultancy based in South Africa.</p>
            <a href="https://www.facebook.com/AsanteAndiConsulting" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100">
              <Facebook className="w-4 h-4" /> Facebook
            </a>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4">Services</h4>
            <div className="flex flex-col gap-2">
              {services.map(s => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="text-sm opacity-70 hover:opacity-100 transition-opacity">{s.shortTitle}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-70 hover:opacity-100">Home</Link>
              <Link to="/pricing" className="text-sm opacity-70 hover:opacity-100">Pricing</Link>
              <Link to="/about" className="text-sm opacity-70 hover:opacity-100">About Us</Link>
              <Link to="/contact" className="text-sm opacity-70 hover:opacity-100">Contact</Link>
              <Link to="/book" className="text-sm opacity-70 hover:opacity-100">Book Now</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:+27760884005" className="flex items-center gap-2 opacity-70 hover:opacity-100"><Phone className="w-4 h-4" /> 076 088 4005</a>
              <a href="mailto:info@asanteandi.co.za" className="flex items-center gap-2 opacity-70 hover:opacity-100"><Mail className="w-4 h-4" /> info@asanteandi.co.za</a>
              <span className="flex items-center gap-2 opacity-70"><MapPin className="w-4 h-4" /> Centurion, South Africa</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-bg-foreground/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-60">
          <span>© {new Date().getFullYear()} Asante Andi Consulting. All rights reserved.</span>
          <span className="font-display italic">Further Together 🇿🇦</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
