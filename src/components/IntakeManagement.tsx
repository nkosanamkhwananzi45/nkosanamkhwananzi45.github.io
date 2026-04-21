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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIntakeManagement } from '@/hooks/useIntakeManagement';
import { Intake, IntakeFilter } from '@/types/intake';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import IntakeForm from './IntakeForm';
import IntakeDetail from './IntakeDetail';

export const IntakeManagement = () => {
  const {
    intakes,
    loading,
    fetchIntakes,
    updateIntakeStatus,
    deleteIntake,
  } = useIntakeManagement();

  const [filters, setFilters] = useState<IntakeFilter>({});
  const [selectedIntake, setSelectedIntake] = useState<Intake | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchIntakes(filters, pageSize, currentPage);
  }, [filters, currentPage]);

  const handleStatusChange = async (id: string, newStatus: Intake['status']) => {
    await updateIntakeStatus(id, newStatus);
    fetchIntakes(filters, pageSize, currentPage);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this intake?')) {
      await deleteIntake(id);
      fetchIntakes(filters, pageSize, currentPage);
    }
  };

  const handleFilterChange = (key: keyof IntakeFilter, value: Record<string, unknown>) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setCurrentPage(0);
  };

  const statusColors: Record<Intake['status'], string> = {
    new: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-yellow-100 text-yellow-800',
    allocated: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  const priorityColors: Record<Intake['priority'], string> = {
    low: 'bg-green-50 text-green-700',
    medium: 'bg-yellow-50 text-yellow-700',
    high: 'bg-red-50 text-red-700',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Intake Management</CardTitle>
            <CardDescription>Manage client service requests and intakes</CardDescription>
          </div>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                New Intake
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Intake</DialogTitle>
              </DialogHeader>
              <IntakeForm
                onSuccess={() => {
                  setIsEditOpen(false);
                  fetchIntakes(filters, pageSize, currentPage);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name, email, or description..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              handleFilterChange('status', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="allocated">Allocated</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.priority || 'all'}
            onValueChange={(value) =>
              handleFilterChange('priority', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.serviceType || 'all'}
            onValueChange={(value) =>
              handleFilterChange('serviceType', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="tutoring">Tutoring</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Loading intakes...
                  </TableCell>
                </TableRow>
              ) : intakes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No intakes found
                  </TableCell>
                </TableRow>
              ) : (
                intakes.map((intake) => (
                  <TableRow key={intake.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{intake.client_name}</p>
                        <p className="text-sm text-gray-500">{intake.client_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{intake.service_type}</TableCell>
                    <TableCell>
                      <Select
                        value={intake.status}
                        onValueChange={(value) =>
                          handleStatusChange(intake.id, value as Intake['status'])
                        }
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="allocated">Allocated</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[intake.priority]}>
                        {intake.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(intake.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedIntake(intake)}
                          >
                            <Eye size={16} />
                          </Button>
                        </DialogTrigger>
                        {selectedIntake && (
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Intake Details</DialogTitle>
                            </DialogHeader>
                            <IntakeDetail intake={selectedIntake} />
                          </DialogContent>
                        )}
                      </Dialog>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedIntake(intake);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(intake.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {intakes.length} of {intakes.length} intakes
          </p>
          <div className="space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={intakes.length < pageSize}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
