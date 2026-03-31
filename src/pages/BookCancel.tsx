import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import Layout from "@/components/Layout";

const BookCancel = () => (
  <Layout>
    <section className="min-h-[70vh] flex items-center justify-center pt-20">
      <div className="container max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-6">Your payment was not completed. You can try again or contact us for help.</p>
        <div className="flex flex-col gap-3">
          <Link to="/book" className="py-3 rounded-lg bg-accent text-accent-foreground font-bold">Try Again</Link>
          <a href="https://wa.me/27760884005" target="_blank" rel="noopener noreferrer" className="py-3 rounded-lg bg-whatsapp text-accent-foreground font-bold">Get Help on WhatsApp</a>
        </div>
      </div>
    </section>
  </Layout>
);

export default BookCancel;
