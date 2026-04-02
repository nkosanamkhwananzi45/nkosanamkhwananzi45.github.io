import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import { AssignmentDistribution } from '@/components/AssignmentDistribution';
import { ProgressUpdates } from '@/components/ProgressUpdates';
import { ProviderPaymentDashboard } from '@/components/ProviderPaymentDashboard';
import { ProviderNotifications } from '@/components/ProviderNotifications';
import { Card, CardContent } from '@/components/ui/card';

const ProviderPortal = () => {
  const { user } = useAuth();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  return (
    <Layout>
      <div className="min-h-screen bg-background pt-28 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Provider Portal</h1>
              <p className="text-muted-foreground">Manage assignments, track progress, and view payments</p>
            </div>
            <ProviderNotifications />
          </div>

          <Tabs defaultValue="assignments" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments">
              <AssignmentDistribution />
            </TabsContent>

            <TabsContent value="progress">
              {selectedAssignmentId ? (
                <ProgressUpdates assignmentId={selectedAssignmentId} />
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <p>Select an assignment from the Assignments tab first, then come here to post progress updates.</p>
                    <p className="text-sm mt-2">
                      To test, enter an assignment ID below:
                    </p>
                    <input
                      type="text"
                      placeholder="Paste assignment ID"
                      className="mt-3 border border-border rounded-md px-3 py-2 text-sm w-64 bg-background text-foreground"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) setSelectedAssignmentId(val);
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="payments">
              <ProviderPaymentDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderPortal;
