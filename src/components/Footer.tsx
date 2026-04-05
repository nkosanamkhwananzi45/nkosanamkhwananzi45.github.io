import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
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
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/reacademysa" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="https://www.instagram.com/asante_andi_consulting?igsh=MWkxem5pbXA3Z29hMw==" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href="https://www.tiktok.com/@asanteandi" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="TikTok">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13v-3.5a6.37 6.37 0 0 0-.88-.07 6.34 6.34 0 0 0 0 12.68 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 3.76.92V6.69Z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/asanteandi" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              <a href="https://x.com/asanteandi" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="X">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
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
              <span className="flex items-start gap-2 opacity-70"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> No. 2151 Moretlwa Street, Tlhabane, Fox Lake, Unit B, Rustenburg 0308, South Africa</span>
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
