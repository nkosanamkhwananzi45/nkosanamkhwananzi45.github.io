import { Link } from "react-router-dom";
import { GraduationCap, BookOpen, Baby, Users, PenTool, Briefcase } from "lucide-react";
import { services } from "@/data/services";
import Layout from "@/components/Layout";

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  BookOpen: <BookOpen className="w-8 h-8" />,
  Baby: <Baby className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  PenTool: <PenTool className="w-8 h-8" />,
  Briefcase: <Briefcase className="w-8 h-8" />,
};

const ServicesPage = () => (
  <Layout>
    <section className="gradient-hero dot-pattern pt-28 pb-16">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-dark-bg-foreground mb-4">Our Services</h1>
        <p className="text-dark-bg-foreground/70 max-w-lg mx-auto">Comprehensive support across 6 categories to help you succeed academically and professionally.</p>
      </div>
    </section>
    <section className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="bg-card rounded-xl border border-border p-8 hover:shadow-xl hover:border-primary/20 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {iconMap[s.icon]}
              </div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">{s.highlight}</span>
              <h2 className="font-display font-bold text-xl text-foreground mt-1 mb-3">{s.title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{s.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">From {s.startingPrice}</span>
                <span className="text-accent font-semibold group-hover:translate-x-1 transition-transform">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default ServicesPage;
