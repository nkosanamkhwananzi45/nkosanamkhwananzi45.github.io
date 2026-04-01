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
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase';
import { toast } from 'sonner';
import { Check, X, Users } from 'lucide-react';

interface Booking {
  id: string;
  client_name: string;
  service_type: string;
  status: string;
  allocated_to?: string;
  created_at: string;
}

interface Provider {
  id: string;
  name: string;
  specialization: string;
  available: boolean;
}

export const BookingAllocation = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBookingsAndProviders();
  }, [filterStatus]);

  const fetchBookingsAndProviders = async () => {
    setLoading(true);
    try {
      // Fetch unallocated bookings
      let query = supabase
        .from('bookings')
        .select('*');

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data: bookingData } = await query.order('created_at', { ascending: false });

      // Fetch available providers
      const { data: providerData } = await supabase
        .from('providers')
        .select('*')
        .eq('available', true);

      setBookings(bookingData || []);
      setProviders(providerData || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = async () => {
    if (!selectedBooking || !selectedProvider) {
      toast.error('Please select both booking and provider');
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          allocated_to: selectedProvider,
          status: 'allocated',
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      // Send notification to provider
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: selectedProvider,
            type: 'booking_allocated',
            title: 'New Booking Assignment',
            message: `You have been allocated a new ${selectedBooking.service_type} booking from ${selectedBooking.client_name}`,
            booking_id: selectedBooking.id,
          },
        ]);

      toast.success('Booking allocated successfully');
      setSelectedBooking(null);
      setSelectedProvider('');
      fetchBookingsAndProviders();
    } catch (error) {
      toast.error('Failed to allocate booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'allocated':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const unallocatedBookings = bookings.filter(b => b.status === 'pending' || !b.allocated_to);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Booking Allocation</CardTitle>
            <CardDescription>Assign providers to client bookings</CardDescription>
          </div>
          <div className="text-sm font-semibold">
            Available Providers: <span className="text-blue-600">{providers.length}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter */}
        <div className="flex gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Unallocated</SelectItem>
              <SelectItem value="allocated">Allocated</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Allocated To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading bookings...
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.client_name}</TableCell>
                    <TableCell className="capitalize">{booking.service_type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.allocated_to ? (
                        <span className="text-sm font-medium">{booking.allocated_to}</span>
                      ) : (
                        <span className="text-xs text-gray-500">Unallocated</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {!booking.allocated_to && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Users size={14} className="mr-1" />
                              Allocate
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Allocate Booking</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Booking Details</Label>
                                <div className="mt-2 p-3 bg-gray-50 rounded">
                                  <p className="text-sm">
                                    <strong>Client:</strong> {selectedBooking?.client_name}
                                  </p>
                                  <p className="text-sm">
                                    <strong>Service:</strong> {selectedBooking?.service_type}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="provider">Select Provider</Label>
                                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a provider" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {providers.map((provider) => (
                                      <SelectItem key={provider.id} value={provider.id}>
                                        {provider.name} - {provider.specialization}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline">Cancel</Button>
                                <Button onClick={handleAllocate}>
                                  <Check size={14} className="mr-1" />
                                  Allocate
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="bg-yellow-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Unallocated</p>
                <p className="text-2xl font-bold text-yellow-600">{unallocatedBookings.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Allocated</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'allocated').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Available Providers</p>
                <p className="text-2xl font-bold text-green-600">{providers.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
