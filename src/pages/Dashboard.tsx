import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Booking {
  id: string;
  service_category: string;
  package_selected: string;
  status: string;
  payment_status: string;
  amount: number | null;
  created_at: string;
  due_date: string | null;
}

const statusIcon: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4 text-gold" />,
  "in-progress": <AlertCircle className="w-4 h-4 text-primary" />,
  completed: <CheckCircle className="w-4 h-4 text-green-600" />,
};

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null }>({ full_name: null });

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [{ data: bookingsData }, { data: profileData }] = await Promise.all([
        supabase.from("bookings").select("id, service_category, package_selected, status, payment_status, amount, created_at, due_date").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("full_name").eq("id", user.id).single(),
      ]);
      setBookings(bookingsData || []);
      if (profileData) setProfile(profileData);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <Layout>
      <section className="pt-28 pb-16">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Welcome{profile.full_name ? `, ${profile.full_name}` : ""}
              </h1>
              <p className="text-muted-foreground">Manage your bookings and track progress.</p>
            </div>
            <div className="flex gap-2">
              <Link to="/book">
                <Button><Plus className="w-4 h-4 mr-2" /> New Booking</Button>
              </Link>
              <Button variant="outline" onClick={signOut}>Sign Out</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Bookings", value: bookings.length, icon: <BookOpen className="w-5 h-5 text-primary" /> },
              { label: "Pending", value: bookings.filter(b => b.status === "pending").length, icon: <Clock className="w-5 h-5 text-gold" /> },
              { label: "In Progress", value: bookings.filter(b => b.status === "in-progress").length, icon: <AlertCircle className="w-5 h-5 text-primary" /> },
              { label: "Completed", value: bookings.filter(b => b.status === "completed").length, icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-xs text-muted-foreground">{s.label}</span></div>
                <span className="text-2xl font-display font-bold text-foreground">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Bookings List */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-display font-bold text-foreground">Your Bookings</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No bookings yet. Start your academic journey!</p>
                <Link to="/book"><Button>Book a Service</Button></Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {bookings.map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {statusIcon[b.status] || statusIcon.pending}
                      <div>
                        <span className="font-semibold text-foreground capitalize">{b.service_category.replace(/-/g, " ")}</span>
                        <span className="block text-xs text-muted-foreground">{b.package_selected} · {new Date(b.created_at).toLocaleDateString("en-ZA")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={b.payment_status === "paid" ? "default" : "secondary"}>
                        {b.payment_status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">{b.status}</Badge>
                      {b.amount ? <span className="text-sm font-bold text-foreground">R{b.amount}</span> : null}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
