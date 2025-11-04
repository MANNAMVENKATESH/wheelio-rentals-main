import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Car, MapPin, Clock, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Booking } from '@/types';
import { apiRequest } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-accent text-accent-foreground';
      case 'completed':
        return 'bg-success text-white';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const canCancelBooking = (booking: Booking) => {
    const startDate = new Date(booking.startDate);
    const now = new Date();
    const hoursDiff = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return booking.status === 'confirmed' && hoursDiff > 24;
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const all = JSON.parse(localStorage.getItem('myBookings') || '[]');
      const updated = (all as any[]).map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      localStorage.setItem('myBookings', JSON.stringify(updated));
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)));
      toast({ title: 'Booking cancelled', description: `Booking ${bookingId} has been cancelled.` });
    } catch (e) {
      toast({ title: 'Cancel failed', description: 'Could not cancel booking', variant: 'destructive' });
    }
  };

  useEffect(() => {
    async function fetchBookings() {
      try {
        const currentUser = JSON.parse(localStorage.getItem('userData') || 'null');
        const username = currentUser?.username || currentUser?.email || 'guest';
        // Combine locally stored detailed bookings with backend payments as fallback
        const local = JSON.parse(localStorage.getItem('myBookings') || '[]') as any[];
        const localMine = local.filter((b) => (b.userId || '').toLowerCase() === String(username).toLowerCase());

        const payments = await apiRequest('/payments');
        const paymentMine = (payments || []).filter((p: any) => (p.username || '').toLowerCase() === String(username).toLowerCase());
        const paymentAsBookings: Booking[] = paymentMine.map((p: any, idx: number) => ({
          id: String(p.id ?? `p${idx}`),
          carId: '',
          car: { id: '', brand: 'N/A', model: 'N/A', type: 'Sedan', pricePerDay: 0, image: '', availability: true, description: '', features: [], year: new Date().getFullYear(), fuel: '', transmission: '', seats: 4, location: '' },
          userId: username,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          totalCost: Number(p.amount ?? 0),
          status: 'confirmed',
          userDetails: { name: '', email: username, phone: '' },
          createdAt: p.date || new Date().toISOString(),
        }));

        // Prefer local detailed bookings at the top
        setBookings([...(localMine as any), ...paymentAsBookings]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-lg text-muted-foreground">Loading your bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">My Bookings</h1>
            <p className="text-lg text-muted-foreground">Manage your car rental bookings</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">Start exploring our amazing car collection</p>
            <Button variant="premium" asChild>
              <a href="/cars">Browse Cars</a>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Car className="h-5 w-5" />
                      <span>
                        {(booking.car?.brand || 'Car')} {(booking.car?.model || '')}
                      </span>
                    </CardTitle>
                    <Badge className={cn('capitalize', getStatusColor(booking.status))}>{booking.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="md:col-span-1">
                        {booking.car?.image ? (
                          <img src={booking.car.image} alt="car" className="w-full h-24 object-cover rounded" />
                        ) : (
                          <div className="w-full h-24 rounded bg-muted flex items-center justify-center text-muted-foreground">No image</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Pickup: {format(new Date(booking.startDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Return: {format(new Date(booking.endDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {Math.max(1, Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)))} day(s)
                          </span>
                        </div>
                      </div>
                      <div className="md:col-span-1 text-right">
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div className="text-xl font-bold">${booking.totalCost}</div>
                      </div>
                      <div className="md:col-span-1 flex justify-end space-x-2">
                        {canCancelBooking(booking) && (
                          <Button variant="outline" onClick={() => handleCancelBooking(booking.id)}>
                            Cancel
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="secondary">
                              <Eye className="h-4 w-4 mr-2" /> Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Booking Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 text-sm">
                              <div>Booking ID: {booking.id}</div>
                              <div>Car: {(booking.car?.brand || 'Car')} {(booking.car?.model || '')}</div>
                              <div>Start: {format(new Date(booking.startDate), 'PPpp')}</div>
                              <div>End: {format(new Date(booking.endDate), 'PPpp')}</div>
                              <div>Total: ${booking.totalCost}</div>
                              <div>Status: {booking.status}</div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
