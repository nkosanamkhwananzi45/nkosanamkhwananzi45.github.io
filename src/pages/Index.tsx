import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Baby, Users, PenTool, Briefcase, Star, CheckCircle, Zap, Shield, Clock, Heart, FlaskConical } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  { icon: <Shield className="w-6 h-6" />, title: "Commitment to Academic Integrity", desc: "We uphold the highest standards of academic honesty. Our support is structured to guide and assist students, ensuring that all work remains ethical and compliant with institutional policies." },
  { icon: <CheckCircle className="w-6 h-6" />, title: "Plagiarism-Free Work", desc: "All documents are carefully developed from original research and writing. We ensure that content is free from plagiarism and properly referenced using approved academic styles." },
  { icon: <Zap className="w-6 h-6" />, title: "Turnitin-Ready Submissions", desc: "Our work is prepared with plagiarism detection systems such as Turnitin in mind. We aim to help students achieve acceptable similarity indexes as required by their institutions." },
  { icon: <Star className="w-6 h-6" />, title: "Responsible Use of AI Tools", desc: "We recognize the growing role of AI in academia. Our approach ensures that any use of AI tools is responsible, transparent, and in line with university guidelines, avoiding misuse or over-reliance." },
  { icon: <Heart className="w-6 h-6" />, title: "Qualified Academic Experts", desc: "Our team consists of experienced professionals, including graduates with Honours, Master's, and PhD qualifications, who understand academic expectations across disciplines." },
  { icon: <FlaskConical className="w-6 h-6" />, title: "Research-Based Approach", desc: "We emphasize critical thinking, proper methodology, and evidence-based research to ensure that all work meets postgraduate academic standards." },
  { icon: <Clock className="w-6 h-6" />, title: "Student Empowerment", desc: "Beyond delivering quality work, we aim to equip students with the knowledge and skills needed to understand and confidently present their research." },
];

const faqs = [
  { q: "What services does Asante Andi Consulting offer?", a: "We offer academic support (assignments, tutoring, exam prep), ECD online training, research & writing support (proposals, dissertations, journal articles), workshops & training, and professional consultation — all tailored for South African students and institutions." },
  { q: "How much do your services cost?", a: "All our services start from R600. We offer tiered packages to suit different needs — from single assignments to full-semester support. Visit our Pricing page for detailed breakdowns." },
  { q: "Which institutions do you support?", a: "We support students from UNISA, University of Johannesburg, Wits, UCT, UKZN, Stadio, NWU, and 15+ other South African universities and colleges." },
  { q: "Is your work plagiarism-free?", a: "Absolutely. All work is developed from original research, properly referenced using approved academic styles, and prepared with Turnitin and other plagiarism detection systems in mind." },
  { q: "Do you use AI tools in your work?", a: "We recognise the growing role of AI in academia. Any use of AI tools is responsible, transparent, and in line with university guidelines — we never encourage misuse or over-reliance." },
  { q: "How do I get started?", a: "Simply click 'Book a Service' to choose your package, or WhatsApp us on 076 088 4005 for a quick consultation. We'll guide you through the process step by step." },
  { q: "What qualifications do your team members have?", a: "Our team includes experienced professionals with Honours, Master's, and PhD qualifications across multiple disciplines, ensuring expert-level support for any academic need." },
  { q: "How fast is the turnaround?", a: "Turnaround times vary by service and complexity. We pride ourselves on fast delivery without compromising quality. Discuss your deadline with us and we'll work to meet it." },
];

const testimonials = [
  { name: "Thandi M.", role: "Student", text: "Asante Andi helped me complete my assignments on time. Their support was amazing and I passed with distinction!" },
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
            {["Research", "Workshops", "Consultation & Training", "Assignment Specialists", "Skills Building", "Entrepreneurship and Business Compliance"].map(badge => (
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

    {/* FAQ */}
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div {...fadeInUp} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Quick answers to the questions we hear most from students and professionals.</p>
        </motion.div>
        <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-primary hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
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
