import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { services, getServiceBySlug } from "@/data/services";
import Layout from "@/components/Layout";

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    serviceCategory: searchParams.get("service") || "",
    packageSelected: searchParams.get("package") || "",
    assignmentDetails: "",
    dueDate: "",
    notes: "",
  });

  const selectedService = getServiceBySlug(form.serviceCategory);
  const selectedPackage = selectedService?.packages.find(p => p.name === form.packageSelected);
  const isConditional = form.serviceCategory === "academic" || form.serviceCategory === "research";

  useEffect(() => {
    const svc = searchParams.get("service");
    const pkg = searchParams.get("package");
    if (svc) setForm(f => ({ ...f, serviceCategory: svc }));
    if (pkg) setForm(f => ({ ...f, packageSelected: pkg }));
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === "serviceCategory") setForm(f => ({ ...f, packageSelected: "", [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPackage?.isCustom || !selectedPackage?.price) {
      alert("Thank you! Your quote request has been submitted. We'll contact you via WhatsApp within 1–4 hours.");
    } else {
      alert("In production, this would redirect to PayFast for payment of " + selectedPackage.priceLabel);
    }
  };

  return (
    <Layout>
      <section className="gradient-hero dot-pattern pt-28 pb-16">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-dark-bg-foreground mb-4">Book a Service</h1>
          <p className="text-dark-bg-foreground/70">Fill in your details and we'll get back to you within 1–4 hours.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 md:p-8 space-y-5">
            <div>
              <label className="block text-sm font-bold text-foreground mb-1">Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1">WhatsApp Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="076 088 4005" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1">Institution</label>
              <input name="institution" value={form.institution} onChange={handleChange} placeholder="e.g. SANTS, UNISA, UJ" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1">Service Category *</label>
                <select name="serviceCategory" value={form.serviceCategory} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                  <option value="">Select a service</option>
                  {services.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1">Package *</label>
                <select name="packageSelected" value={form.packageSelected} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                  <option value="">Select a package</option>
                  {selectedService?.packages.map(p => <option key={p.name} value={p.name}>{p.name} — {p.priceLabel}</option>)}
                </select>
              </div>
            </div>
            {isConditional && (
              <>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Assignment / Research Details</label>
                  <textarea name="assignmentDetails" value={form.assignmentDetails} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Due Date</label>
                  <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-bold text-foreground mb-1">Additional Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" />
            </div>

            {/* Price summary */}
            {selectedPackage && (
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{selectedPackage.name}</span>
                  <span className="text-2xl font-display font-bold text-primary">{selectedPackage.priceLabel}</span>
                </div>
              </div>
            )}

            <button type="submit" className="w-full py-4 rounded-lg bg-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity">
              {selectedPackage?.isCustom || !selectedPackage?.price ? "Request a Quote" : `Pay ${selectedPackage?.priceLabel || ""}`}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default BookingPage;
