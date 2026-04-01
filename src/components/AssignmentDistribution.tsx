import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useAssignmentDistribution } from '@/hooks/useAssignmentDistribution';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export const AssignmentDistribution = () => {
  const { user } = useAuth();
  const { assignments, loading, fetchAssignments, acceptAssignment, rejectAssignment } =
    useAssignmentDistribution();

  const [rejectReason, setRejectReason] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchAssignments(user.id);
    }
  }, [user?.id, fetchAssignments]);

  const handleAccept = async (assignmentId: string) => {
    if (user?.id) {
      await acceptAssignment(assignmentId, user.id);
      await fetchAssignments(user.id);
    }
  };

  const handleReject = async () => {
    if (user?.id && selectedAssignment) {
      await rejectAssignment(selectedAssignment, user.id, rejectReason);
      setRejectReason('');
      setSelectedAssignment(null);
      setIsRejectDialogOpen(false);
      await fetchAssignments(user.id);
    }
  };

  const pendingAssignments = assignments.filter(a => a.status === 'assigned');
  const activeAssignments = assignments.filter(a => a.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="text-blue-600 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600">Pending Assignment</p>
              <p className="text-2xl font-bold text-blue-600">{pendingAssignments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
              <p className="text-sm text-gray-600">Active Assignments</p>
              <p className="text-2xl font-bold text-green-600">{activeAssignments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-purple-600">{assignments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>New Assignments</CardTitle>
          <CardDescription>Review and accept new assignments from clients</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading assignments...</div>
          ) : pendingAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending assignments at this time
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAssignments.map(assignment => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {assignment.client_name}
                        <p className="text-xs text-gray-500">{assignment.client_email}</p>
                      </TableCell>
                      <TableCell className="capitalize">{assignment.service_type}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {assignment.service_description}
                      </TableCell>
                      <TableCell>
                        {new Date(assignment.deadline).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(assignment.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept
                        </Button>
                        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setSelectedAssignment(assignment.id)}
                            >
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Assignment</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting this assignment
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="reason">Reason for Rejection</Label>
                                <Textarea
                                  id="reason"
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  placeholder="Explain why you're declining this assignment..."
                                  rows={4}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsRejectDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleReject}
                                  disabled={!rejectReason.trim()}
                                >
                                  Confirm Rejection
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Active Assignments</CardTitle>
          <CardDescription>Assignments you are currently working on</CardDescription>
        </CardHeader>
        <CardContent>
          {activeAssignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No active assignments
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeAssignments.map(assignment => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.client_name}</TableCell>
                      <TableCell className="capitalize">{assignment.service_type}</TableCell>
                      <TableCell>{new Date(assignment.start_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(assignment.deadline).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">In Progress</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
