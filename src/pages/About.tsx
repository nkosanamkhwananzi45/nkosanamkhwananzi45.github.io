import { motion } from "framer-motion";
import { Heart, BookOpen, Users, Shield } from "lucide-react";
import Layout from "@/components/Layout";

const values = [
  { icon: <BookOpen className="w-6 h-6" />, title: "Accessible", desc: "Making quality education support available to every South African learner." },
  { icon: <Users className="w-6 h-6" />, title: "Practical", desc: "Hands-on, real-world approaches that deliver measurable results." },
  { icon: <Shield className="w-6 h-6" />, title: "Ethical", desc: "Upholding academic integrity in every service we provide." },
  { icon: <Heart className="w-6 h-6" />, title: "Community", desc: "Building a network of learners who grow further together." },
];

const AboutPage = () => (
  <Layout>
    <section className="gradient-hero dot-pattern pt-28 pb-16">
      <div className="container">
        <span className="text-gold text-sm font-bold uppercase tracking-wider">Our Story</span>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-dark-bg-foreground mt-2 mb-4">About Asante Andi</h1>
        <p className="text-dark-bg-foreground/70 max-w-lg">"Asante" means "Thank You" in Swahili — a reminder that education is a gift we pay forward.</p>
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-3xl">
        <div className="bg-card rounded-xl border border-border p-8 mb-12">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Ingrid Andiswa Thomo</h2>
          <p className="text-gold font-semibold mb-4">Founder & CEO</p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Asante Andi Consulting started as a WhatsApp-based tutoring service for ECD practitioners. What began as simple study group support quickly grew as word spread — students across South Africa were looking for affordable, ethical, and practical academic guidance.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Today, Asante Andi is a multi-service consultancy supporting 500+ students across 10+ institutions, offering everything from assignment support and research guidance to workshops and professional training. Based in Centurion, we serve learners nationwide through digital-first, mobile-friendly delivery.
          </p>
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-8">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {values.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border p-6">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold mb-3">{v.icon}</div>
              <h3 className="font-display font-bold text-foreground mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="gradient-hero rounded-xl p-8 text-center">
          <p className="text-lg md:text-xl font-display italic text-dark-bg-foreground/90 max-w-lg mx-auto">
            "Our mission is to make quality academic support accessible to every South African learner, empowering them to go further — together."
          </p>
          <p className="text-gold font-bold mt-4">— Ingrid Andiswa Thomo</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default AboutPage;
