import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, GraduationCap, User } from "lucide-react";

type LoginTab = "client" | "tutor" | "admin";

const tabConfig: { value: LoginTab; label: string; icon: React.ReactNode; redirect: string }[] = [
  { value: "client", label: "Client", icon: <User className="w-4 h-4" />, redirect: "/dashboard" },
  { value: "tutor", label: "Tutor", icon: <GraduationCap className="w-4 h-4" />, redirect: "/provider" },
  { value: "admin", label: "Admin", icon: <ShieldCheck className="w-4 h-4" />, redirect: "/admin" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [activeTab, setActiveTab] = useState<LoginTab>("client");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setLoading(false);
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }

    // Get logged-in user and verify role for admin/tutor tabs
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      toast({ title: "Login failed", description: "Could not retrieve user.", variant: "destructive" });
      return;
    }

    const requiredRole = activeTab === "tutor" ? "provider" : activeTab;

    if (activeTab !== "client") {
      const { data: hasRole } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: requiredRole as "admin" | "provider" | "client" | "moderator",
      });

      if (!hasRole) {
        setLoading(false);
        toast({
          title: "Access denied",
          description: `Your account does not have ${activeTab} access. Please sign in as a client instead.`,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(false);
    const redirect = tabConfig.find((t) => t.value === activeTab)?.redirect ?? "/dashboard";
    navigate(redirect);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "Password reset link has been sent." });
      setForgotMode(false);
    }
  };

  return (
    <Layout>
      <section className="pt-28 pb-16 min-h-[80vh] flex items-center">
        <div className="container max-w-md mx-auto">
          <div className="bg-card rounded-xl border border-border p-8">
            <h1 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
              {forgotMode ? "Reset Password" : "Sign In"}
            </h1>

            {!forgotMode && (
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as LoginTab)}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-3">
                  {tabConfig.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 text-xs sm:text-sm">
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}

            <form onSubmit={forgotMode ? handleForgotPassword : handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              {!forgotMode && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : forgotMode
                    ? "Send Reset Link"
                    : `Sign In as ${tabConfig.find((t) => t.value === activeTab)?.label}`}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground space-y-2">
              <button onClick={() => setForgotMode(!forgotMode)} className="text-primary hover:underline block mx-auto">
                {forgotMode ? "Back to sign in" : "Forgot password?"}
              </button>
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
