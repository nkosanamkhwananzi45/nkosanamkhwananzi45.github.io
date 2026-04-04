import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Baby, Users, PenTool, Briefcase, Star, CheckCircle, Zap, Shield, Clock, Heart } from "lucide-react";
import { services, institutions } from "@/data/services";
import Layout from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Baby: <Baby className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  PenTool: <PenTool className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
};

const trustFeatures = [
  { icon: <Shield className="w-6 h-6" />, title: "Academic Integrity", desc: "We uphold the highest standards of academic honesty, ensuring all work is ethical and compliant with institutional policies." },
  { icon: <CheckCircle className="w-6 h-6" />, title: "Plagiarism-Free Work", desc: "All documents are developed from original research and writing, properly referenced using approved academic styles." },
  { icon: <Zap className="w-6 h-6" />, title: "Turnitin-Ready", desc: "Our work is prepared with plagiarism detection systems in mind, helping students achieve acceptable similarity indexes." },
  { icon: <Star className="w-6 h-6" />, title: "Responsible AI Use", desc: "Any use of AI tools is responsible, transparent, and in line with university guidelines — no misuse or over-reliance." },
  { icon: <Heart className="w-6 h-6" />, title: "Qualified Experts", desc: "Our team includes graduates with Honours, Master's, and PhD qualifications across disciplines." },
  { icon: <Clock className="w-6 h-6" />, title: "Student Empowerment", desc: "We equip students with knowledge and skills to understand and confidently present their research." },
];

const testimonials = [
  { name: "Thandi M.", role: "SANTS Student", text: "Asante Andi helped me complete my assignments on time. Their support was amazing and I passed with distinction!" },
  { name: "Sipho K.", role: "UNISA Honours", text: "The research guidance I received for my dissertation was invaluable. Professional and thorough." },
  { name: "Nomsa D.", role: "ECD Practitioner", text: "The ECD training sessions are well-structured and practical. I recommend them to every practitioner." },
  { name: "James L.", role: "UJ Postgrad", text: "From proposal to viva prep, they walked with me every step. Truly further together!" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

const HomePage = () => (
  <Layout>
    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/90 via-dark-bg/75 to-dark-bg/50" />
        <div className="absolute inset-0 dot-pattern" />
      </div>
      <div className="container py-16 md:py-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
          <div className="flex flex-wrap gap-2 mb-6">
            {["Research", "Workshops", "Consultation & Training", "SANTS Specialist"].map(badge => (
              <span key={badge} className="px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-gold border border-gold/30">{badge}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-dark-bg-foreground leading-tight mb-6">
            Go <span className="text-gradient-gold">Further</span> Together 🇿🇦
          </h1>
          <p className="text-lg md:text-xl text-dark-bg-foreground/80 font-body mb-8 max-w-lg">
            Skills development, academic support, and research guidance for South African students and professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/book" className="px-8 py-4 rounded-lg bg-accent text-accent-foreground font-bold text-center hover:opacity-90 transition-opacity">
              Book a Service
            </Link>
            <a href="https://wa.me/27760884005" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-lg border-2 border-dark-bg-foreground/30 text-dark-bg-foreground font-bold text-center hover:bg-dark-bg-foreground/10 transition-colors">
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <motion.section {...fadeInUp} transition={{ duration: 0.5 }} className="bg-primary text-primary-foreground py-6">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: "500+", label: "Students Supported" },
            { value: "From R600", label: "Starting Price" },
            { value: "10+", label: "Institutions" },
            { value: "Fast", label: "Turnaround" },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-display font-bold text-gold">{stat.value}</div>
              <div className="text-xs md:text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* Institutions Ticker */}
    <section className="bg-muted py-4 overflow-hidden">
      <div className="flex animate-ticker">
        {[...institutions, ...institutions].map((inst, i) => (
          <span key={i} className="px-6 text-sm font-semibold text-muted-foreground whitespace-nowrap">{inst}</span>
        ))}
      </div>
    </section>

    {/* Services */}
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div {...fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Our Services</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Comprehensive academic support and skills development tailored for South African learners.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.slug} {...fadeInUp} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Link to={`/services/${s.slug}`} className="block bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all group h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {iconMap[s.icon]}
                </div>
                <span className="text-xs font-bold text-gold uppercase">{s.highlight}</span>
                <h3 className="font-display font-bold text-lg text-foreground mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">From {s.startingPrice}</span>
                  <span className="text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform">Learn More →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <motion.div {...fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Why Choose Asante Andi?</h2>
        </motion.div>
        <motion.p {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }} className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          We are committed to supporting students with integrity, quality, and academic excellence. Our services align with university standards while empowering students to succeed independently.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {trustFeatures.map((f, i) => (
            <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-card rounded-xl p-6 border border-border">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold mb-3">{f.icon}</div>
              <h4 className="font-display font-bold text-foreground mb-1">{f.title}</h4>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.p {...fadeInUp} transition={{ duration: 0.5 }} className="text-center text-lg font-display font-bold text-primary italic">
          "We don't just assist you to submit — we prepare you to succeed."
        </motion.p>

        <motion.h3 {...fadeInUp} transition={{ duration: 0.5 }} className="text-2xl font-display font-bold text-foreground text-center mt-16 mb-8">What Our Students Say</motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="bg-card rounded-xl p-6 border border-border">
              <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-gold text-gold" />)}</div>
              <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
              <div><span className="font-bold text-foreground">{t.name}</span> <span className="text-xs text-muted-foreground">· {t.role}</span></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <motion.section {...fadeInUp} transition={{ duration: 0.6 }} className="gradient-cta py-16">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-accent-foreground mb-4">Start Your Journey Today</h2>
        <p className="text-accent-foreground/80 mb-8 max-w-md mx-auto">Join 500+ students who have taken the step towards academic excellence.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/book" className="px-8 py-4 rounded-lg bg-card text-foreground font-bold hover:bg-card/90 transition-colors">Book a Service</Link>
          <a href="https://wa.me/27760884005" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-lg border-2 border-accent-foreground text-accent-foreground font-bold hover:bg-accent-foreground/10 transition-colors">WhatsApp Us</a>
        </div>
      </div>
    </motion.section>
  </Layout>
);

export default HomePage;
