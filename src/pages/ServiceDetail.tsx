import { useParams, Link, Navigate } from "react-router-dom";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { getServiceBySlug, institutions } from "@/data/services";
import Layout from "@/components/Layout";

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = getServiceBySlug(slug || "");

  if (!service) return <Navigate to="/services" replace />;

  const isAcademic = slug === "academic" || slug === "research";

  return (
    <Layout>
      <section className="gradient-hero dot-pattern pt-28 pb-16">
        <div className="container">
          <span className="text-gold text-sm font-bold uppercase tracking-wider">{service.highlight}</span>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-dark-bg-foreground mt-2 mb-4">{service.heroTagline}</h1>
          <p className="text-dark-bg-foreground/70 max-w-lg">{service.description}</p>
        </div>
      </section>

      {isAcademic && (
        <div className="bg-primary/5 border-b border-primary/10">
          <div className="container py-3 flex items-center gap-2 text-sm text-primary">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold">NO AI USED</span>
            <span className="text-muted-foreground">— All support is provided by qualified human professionals</span>
          </div>
        </div>
      )}

      {/* Packages */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground text-center mb-10">Packages & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {service.packages.map((pkg, i) => (
              <div key={i} className={`relative bg-card rounded-xl border-2 p-6 flex flex-col ${pkg.badge ? "border-accent shadow-lg" : "border-border"}`}>
                {pkg.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-accent text-accent-foreground">{pkg.badge}</span>
                )}
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{pkg.name}</h3>
                <div className="text-3xl font-display font-bold text-primary mb-4">{pkg.priceLabel}</div>
                <ul className="flex-1 space-y-2 mb-6">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-whatsapp mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/book?service=${service.slug}&package=${encodeURIComponent(pkg.name)}`}
                  className={`text-center py-3 rounded-lg font-bold transition-colors ${pkg.badge ? "bg-accent text-accent-foreground hover:opacity-90" : "bg-primary text-primary-foreground hover:opacity-90"}`}
                >
                  {pkg.isCustom ? "Get a Quote" : "Book This Package"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutions grid for academic */}
      {slug === "academic" && (
        <section className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="text-2xl font-display font-bold text-foreground text-center mb-8">Institutions We Support</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
              {institutions.slice(0, 10).map(inst => (
                <div key={inst} className="bg-card rounded-lg border border-border p-3 text-center text-sm font-semibold text-foreground">{inst}</div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Research services list */}
      {slug === "research" && (
        <section className="py-16 bg-muted/50">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-display font-bold text-foreground text-center mb-8">Services We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Dissertation/Thesis Support", "Research Proposal", "Literature Review", "Data Analysis (SPSS/R/Excel)", "Research Methodology (Chapter 3)", "Capstone/Final Year Projects", "Journal Article Writing", "Proofreading & Referencing", "Turnitin Similarity Guidance", "Viva Preparation"].map(s => (
                <div key={s} className="flex items-center gap-2 bg-card rounded-lg border border-border p-3 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-gold shrink-0" /> {s}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a href="https://wa.me/27760884005" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 rounded-lg bg-whatsapp text-accent-foreground font-bold hover:opacity-90 transition-opacity">WhatsApp for a Quote</a>
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      {isAcademic && (
        <section className="py-8 border-t border-border">
          <div className="container max-w-3xl">
            <div className="bg-muted rounded-xl p-6 text-sm text-muted-foreground">
              <p className="font-bold text-foreground mb-2">Academic Integrity Disclaimer</p>
              <p>Asante Andi Consulting provides study support, guidance, and assistance services. Our work is intended to serve as a learning aid and reference material. Students are responsible for ensuring their submissions comply with their institution's academic integrity policies. We do not condone or facilitate academic dishonesty.</p>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ServiceDetail;
