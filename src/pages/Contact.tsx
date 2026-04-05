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
          <a href="https://www.facebook.com/AsanteAndiConsulting" target="_blank" rel="noopener noreferrer" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <Facebook className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-display font-bold text-foreground mb-1">Facebook</h3>
            <p className="text-sm text-muted-foreground">Asante Andi Consulting</p>
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <MapPin className="w-6 h-6 text-gold mb-2" />
            <h3 className="font-display font-bold text-foreground mb-1">Location</h3>
            <p className="text-sm text-muted-foreground">Centurion, South Africa, 0157</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <Clock className="w-6 h-6 text-gold mb-2" />
            <h3 className="font-display font-bold text-foreground mb-1">Response Time</h3>
            <p className="text-sm text-muted-foreground">Within 1–4 hours</p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default ContactPage;
