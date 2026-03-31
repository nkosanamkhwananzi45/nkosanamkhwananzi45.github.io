import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { services } from "@/data/services";
import Layout from "@/components/Layout";

const PricingPage = () => (
  <Layout>
    <section className="gradient-hero dot-pattern pt-28 pb-16">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-dark-bg-foreground mb-4">Transparent Pricing</h1>
        <p className="text-dark-bg-foreground/70 max-w-lg mx-auto">Affordable packages for every academic and professional need.</p>
      </div>
    </section>

    <section className="py-16">
      <div className="container">
        {services.map(service => (
          <div key={service.slug} className="mb-16 last:mb-0">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">{service.highlight}</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-1">{service.title}</h2>
            </div>
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
                    className={`text-center py-3 rounded-lg font-bold transition-colors ${pkg.badge ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"} hover:opacity-90`}
                  >
                    {pkg.isCustom ? "Get a Quote" : "Book This Package"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  </Layout>
);

export default PricingPage;
