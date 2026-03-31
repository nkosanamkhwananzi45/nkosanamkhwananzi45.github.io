import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
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
            <form onSubmit={forgotMode ? handleForgotPassword : handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              {!forgotMode && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : forgotMode ? "Send Reset Link" : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground space-y-2">
              <button onClick={() => setForgotMode(!forgotMode)} className="text-primary hover:underline block mx-auto">
                {forgotMode ? "Back to sign in" : "Forgot password?"}
              </button>
              <p>Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link></p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
