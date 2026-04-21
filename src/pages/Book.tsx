import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { services, getServiceBySlug } from "@/data/services";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to book a service.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const amount = selectedPackage?.price || 0;

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          institution: form.institution || null,
          service_category: form.serviceCategory,
          package_selected: form.packageSelected,
          assignment_details: form.assignmentDetails || null,
          due_date: form.dueDate || null,
          notes: form.notes || null,
          amount,
          status: 'pending',
          payment_status: amount > 0 ? 'unpaid' : 'quote_requested',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (selectedPackage?.isCustom || !selectedPackage?.price) {
        toast({
          title: "Quote Request Submitted! 🎉",
          description: "We'll contact you via WhatsApp within 1–4 hours.",
        });
        setForm({
          fullName: "", email: "", phone: "", institution: "",
          serviceCategory: "", packageSelected: "", assignmentDetails: "",
          dueDate: "", notes: "",
        });
      } else {
        // For paid packages, attempt PayFast redirect
        try {
          const { data, error: fnError } = await supabase.functions.invoke('payfast-payment', {
            body: {
              bookingId: booking.id,
              amount: amount,
              itemName: `${selectedService?.title} - ${selectedPackage.name}`,
              email: form.email,
              firstName: form.fullName.split(' ')[0],
            },
          });

          if (fnError) throw fnError;

          if (data?.redirectUrl) {
            window.location.href = data.redirectUrl;
            return;
          }
        } catch {
          // PayFast not configured yet — show success anyway
          toast({
            title: "Booking Submitted! 🎉",
            description: `Amount: ${selectedPackage.priceLabel}. We'll send payment details via WhatsApp shortly.`,
          });
          setForm({
            fullName: "", email: "", phone: "", institution: "",
            serviceCategory: "", packageSelected: "", assignmentDetails: "",
            dueDate: "", notes: "",
          });
        }
      }
    } catch (error: unknown) {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again or WhatsApp us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageTransition>
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
                <input name="institution" value={form.institution} onChange={handleChange} placeholder="e.g. UNISA, UJ" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
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

              {selectedPackage && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{selectedPackage.name}</span>
                    <span className="text-2xl font-display font-bold text-primary">{selectedPackage.priceLabel}</span>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-4 rounded-lg bg-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Submitting..." : selectedPackage?.isCustom || !selectedPackage?.price ? "Request a Quote" : `Pay ${selectedPackage?.priceLabel || ""}`}
              </button>
            </form>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default BookingPage;
