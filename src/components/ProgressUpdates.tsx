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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useProgressUpdates } from '@/hooks/useProgressUpdates';
import { useAssignmentDistribution } from '@/hooks/useAssignmentDistribution';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ProgressUpdatesProps {
  assignmentId: string;
}

export const ProgressUpdates = ({ assignmentId }: ProgressUpdatesProps) => {
  const { user } = useAuth();
  const { updates, loading, fetchProgressUpdates, postProgressUpdate } =
    useProgressUpdates();
  const { assignments } = useAssignmentDistribution();

  const [status, setStatus] = useState<'in_progress' | 'blocked' | 'completed'>('in_progress');
  const [notes, setNotes] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignment = assignments.find(a => a.id === assignmentId);

  useEffect(() => {
    fetchProgressUpdates(assignmentId);
  }, [assignmentId, fetchProgressUpdates]);

  const handlePostUpdate = async () => {
    if (!user?.id || !notes.trim()) return;

    setIsSubmitting(true);
    const result = await postProgressUpdate(
      assignmentId,
      user.id,
      status,
      notes,
      progress
    );

    if (result) {
      setNotes('');
      setProgress(0);
      setStatus('in_progress');
      setIsDialogOpen(false);
      await fetchProgressUpdates(assignmentId);
    }
    setIsSubmitting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'blocked':
        return <AlertCircle className="text-red-600" size={16} />;
      case 'in_progress':
        return <Clock className="text-blue-600" size={16} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Assignment Info */}
      {assignment && (
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Current Assignment</p>
                <p className="text-lg font-semibold">{assignment.client_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Overall Progress</p>
                <Progress value={progress} className="mt-2" />
                <p className="text-sm font-medium mt-2">{progress}% Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto">Post Progress Update</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post Progress Update</DialogTitle>
            <DialogDescription>
              Share your progress, blockers, and next steps
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="status">Current Status</Label>
              <Select value={status} onValueChange={(value: Record<string, unknown>) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Progress: {progress}%</Label>
              <Slider
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Update Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What have you been working on? Any blockers? Next steps?"
                rows={5}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePostUpdate}
                disabled={!notes.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Update'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Progress Updates Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Progress History</CardTitle>
          <CardDescription>Timeline of all updates for this assignment</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading updates...</div>
          ) : updates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No progress updates yet. Post your first update!
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(update.status)}
                    <Badge className={getStatusBadge(update.status)}>
                      {update.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(update.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm mb-3">{update.notes}</p>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Progress: {update.progress_percentage}%</p>
                    <Progress value={update.progress_percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
