import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Instagram, Linkedin } from "lucide-react";
import Layout from "@/components/Layout";

const ContactPage = () => (
  <Layout>
    <section className="gradient-hero dot-pattern pt-28 pb-16">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-dark-bg-foreground mb-4">Get in Touch</h1>
        <p className="text-dark-bg-foreground/70 max-w-lg mx-auto">We'd love to hear from you. Reach out via WhatsApp for the fastest response.</p>
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a href="https://wa.me/27760884005" target="_blank" rel="noopener noreferrer" className="bg-whatsapp/10 rounded-xl border border-whatsapp/20 p-6 hover:shadow-lg transition-shadow group">
            <MessageCircle className="w-8 h-8 text-whatsapp mb-3" />
            <h3 className="font-display font-bold text-foreground mb-1">WhatsApp (Preferred)</h3>
            <p className="text-sm text-muted-foreground">076 088 4005</p>
            <p className="text-xs text-whatsapp font-semibold mt-2">Fastest response →</p>
          </a>
          <a href="tel:+27760884005" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <Phone className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-display font-bold text-foreground mb-1">Phone</h3>
            <p className="text-sm text-muted-foreground">076 088 4005</p>
          </a>
          <a href="mailto:info@asanteandi.co.za" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <Mail className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-display font-bold text-foreground mb-1">Email</h3>
            <p className="text-sm text-muted-foreground">info@asanteandi.co.za</p>
          </a>
          <a href="https://www.facebook.com/reacademysa" target="_blank" rel="noopener noreferrer" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <Facebook className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-display font-bold text-foreground mb-1">Facebook</h3>
            <p className="text-sm text-muted-foreground">Asante Andi Consulting</p>
          </a>
          <a href="https://www.instagram.com/asante_andi_consulting?igsh=MWkxem5pbXA3Z29hMw==" target="_blank" rel="noopener noreferrer" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <Instagram className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-display font-bold text-foreground mb-1">Instagram</h3>
            <p className="text-sm text-muted-foreground">@asante_andi_consulting</p>
          </a>
          <a href="https://www.tiktok.com/@asanteandi" target="_blank" rel="noopener noreferrer" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <svg className="w-8 h-8 text-primary mb-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13v-3.5a6.37 6.37 0 0 0-.88-.07 6.34 6.34 0 0 0 0 12.68 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 3.76.92V6.69Z"/></svg>
            <h3 className="font-display font-bold text-foreground mb-1">TikTok</h3>
            <p className="text-sm text-muted-foreground">@asanteandi</p>
          </a>
          <a href="https://www.linkedin.com/company/asanteandi" target="_blank" rel="noopener noreferrer" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <Linkedin className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-display font-bold text-foreground mb-1">LinkedIn</h3>
            <p className="text-sm text-muted-foreground">Asante Andi Consulting</p>
          </a>
          <a href="https://x.com/asanteandi" target="_blank" rel="noopener noreferrer" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <svg className="w-8 h-8 text-primary mb-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <h3 className="font-display font-bold text-foreground mb-1">X (Twitter)</h3>
            <p className="text-sm text-muted-foreground">@asanteandi</p>
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <MapPin className="w-6 h-6 text-gold mb-2" />
            <h3 className="font-display font-bold text-foreground mb-1">Location</h3>
            <p className="text-sm text-muted-foreground">No. 2151 Moretlwa Street, Tlhabane, Fox Lake, Unit B, Rustenburg 0308, South Africa</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <Clock className="w-6 h-6 text-gold mb-2" />
            <h3 className="font-display font-bold text-foreground mb-1">Response Time</h3>
            <p className="text-sm text-muted-foreground">Within 1–4 hours</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl overflow-hidden border border-border">
          <iframe
            title="Asante Andi Consulting Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.5!2d27.2468!3d-25.6718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQwJzE4LjUiUyAyN8KwMTQnNDguNSJF!5e0!3m2!1sen!2sza!4v1700000000000"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  </Layout>
);

export default ContactPage;
