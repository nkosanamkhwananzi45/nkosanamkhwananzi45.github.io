import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
  redirectTo?: string;
}

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(!!requiredRole);
  const [authorized, setAuthorized] = useState(!requiredRole);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (!requiredRole) {
      setChecking(false);
      setAuthorized(true);
      return;
    }

    const checkRole = async () => {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: requiredRole,
      });

      if (error || !data) {
        setAuthorized(false);
        navigate('/dashboard', { replace: true });
      } else {
        setAuthorized(true);
      }
      setChecking(false);
    };

    checkRole();
  }, [user, authLoading, requiredRole, navigate, redirectTo]);

  if (authLoading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !authorized) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
