import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";

const BookSuccess = () => (
  <Layout>
    <section className="min-h-[70vh] flex items-center justify-center pt-20">
      <div className="container max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-whatsapp/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-whatsapp" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">Payment Successful 🎉</h1>
        <p className="text-muted-foreground mb-6">Thank you! Your booking has been confirmed. We'll be in touch via WhatsApp shortly.</p>
        <div className="flex flex-col gap-3">
          <a href="https://wa.me/27760884005" target="_blank" rel="noopener noreferrer" className="py-3 rounded-lg bg-whatsapp text-accent-foreground font-bold">Follow Up on WhatsApp</a>
          <Link to="/" className="py-3 rounded-lg border border-border text-foreground font-bold hover:bg-muted transition-colors">Back to Home</Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default BookSuccess;
