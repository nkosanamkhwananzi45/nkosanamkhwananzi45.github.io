import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, UserPlus, Trash2, Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface UserWithRoles {
  id: string;
  email: string | null;
  full_name: string | null;
  roles: AppRole[];
}

const AVAILABLE_ROLES: AppRole[] = ['admin', 'moderator', 'client', 'provider'];

const roleBadgeVariant = (role: AppRole) => {
  switch (role) {
    case 'admin': return 'destructive';
    case 'moderator': return 'default';
    case 'provider': return 'secondary';
    default: return 'outline';
  }
};

export const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Record<string, AppRole>>({});

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const roleMap: Record<string, AppRole[]> = {};
      roles?.forEach(r => {
        if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
        roleMap[r.user_id].push(r.role);
      });

      const usersWithRoles: UserWithRoles[] = (profiles || []).map(p => ({
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        roles: roleMap[p.id] || [],
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAddRole = async (userId: string) => {
    const role = selectedRole[userId];
    if (!role) { toast.error('Select a role first'); return; }

    setActionLoading(`add-${userId}`);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) {
        if (error.code === '23505') toast.error('User already has this role');
        else throw error;
      } else {
        toast.success(`Role "${role}" assigned successfully`);
        setSelectedRole(prev => { const n = { ...prev }; delete n[userId]; return n; });
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to add role:', error);
      toast.error('Failed to assign role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    setActionLoading(`remove-${userId}-${role}`);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;
      toast.success(`Role "${role}" revoked successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to remove role:', error);
      toast.error('Failed to revoke role');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" /> User Management
        </CardTitle>
        <CardDescription>Assign and revoke roles for registered users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Current Roles</TableHead>
              <TableHead>Assign Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => {
              const availableToAdd = AVAILABLE_ROLES.filter(r => !user.roles.includes(r));
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || '—'}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{user.email || '—'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length === 0 && <span className="text-sm text-muted-foreground">No roles</span>}
                      {user.roles.map(role => (
                        <Badge key={role} variant={roleBadgeVariant(role) as unknown} className="gap-1">
                          {role}
                          <button
                            onClick={() => handleRemoveRole(user.id, role)}
                            disabled={actionLoading === `remove-${user.id}-${role}`}
                            className="ml-0.5 hover:text-destructive-foreground"
                            title={`Remove ${role} role`}
                          >
                            {actionLoading === `remove-${user.id}-${role}` ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {availableToAdd.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedRole[user.id] || ''}
                          onValueChange={(val) => setSelectedRole(prev => ({ ...prev, [user.id]: val as AppRole }))}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Role..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableToAdd.map(r => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => handleAddRole(user.id)}
                          disabled={!selectedRole[user.id] || actionLoading === `add-${user.id}`}
                        >
                          {actionLoading === `add-${user.id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">All roles assigned</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No users found</div>
        )}
      </CardContent>
    </Card>
  );
};
