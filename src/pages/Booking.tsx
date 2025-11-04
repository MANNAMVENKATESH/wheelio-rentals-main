import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Car, User, Calendar, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';

interface BookingData {
  car: {
    brand: string;
    model: string;
    type: string;
    image: string;
  };
  startDate: string;
  endDate: string;
  totalCost: number;
}

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const bookingData = location.state as BookingData | undefined;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobileNumber: '',
    license: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'USA'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No booking data found</h1>
          <Button onClick={() => navigate('/cars')}>Browse Cars</Button>
        </div>
      </div>
    );
  }

  const { car, startDate, endDate, totalCost } = bookingData;
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem('userData') || 'null');
      const username = currentUser?.username || currentUser?.email || 'guest';

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobileNumber) {
        toast({ 
          title: 'Missing required fields', 
          description: 'Please fill in all required customer information', 
          variant: 'destructive' 
        });
        setIsProcessing(false);
        return;
      }

      // Create enhanced payment record in backend with customer details
      const paymentData = {
        username,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        amount: totalCost,
        paymentMethod: 'Credit Card',
        paymentStatus: 'COMPLETED',
        billingAddress: formData.billingAddress || formData.address,
        billingCity: formData.billingCity || formData.city,
        billingState: formData.billingState || formData.state,
        billingZipCode: formData.billingZipCode || formData.zipCode,
        billingCountry: formData.billingCountry || formData.country
      };

      const payment = await apiRequest('/payment', {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });

      const id = 'WH' + Math.random().toString(36).slice(2, 11).toUpperCase();
      
      // Persist enhanced booking locally
      try {
        const existing = JSON.parse(localStorage.getItem('myBookings') || '[]');
        const newBooking = {
          id,
          carId: '',
          car,
          userId: username,
          startDate,
          endDate,
          totalCost,
          status: 'confirmed',
          userDetails: { 
            name: formData.firstName + ' ' + formData.lastName, 
            email: formData.email, 
            phone: formData.mobileNumber,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          },
          paymentDetails: {
            transactionId: payment?.transactionId,
            paymentMethod: payment?.paymentMethod,
            amount: payment?.amount
          },
          createdAt: new Date().toISOString(),
          paymentId: payment?.id ?? null,
        };
        localStorage.setItem('myBookings', JSON.stringify([newBooking, ...existing]));
      } catch {}
      
      setBookingId(id);
      setBookingConfirmed(true);
      toast({ title: 'Booking Confirmed!', description: `Your booking ID is ${id}` });
    } catch (err) {
      toast({ title: 'Booking failed', description: 'Could not save payment/booking', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center p-8"
        >
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Your booking has been successfully confirmed. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Booking ID</p>
            <p className="text-xl font-bold text-primary">{bookingId}</p>
          </div>
          <div className="space-y-3">
            <Button onClick={() => navigate('/bookings')} className="w-full" variant="premium">
              View My Bookings
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-8">Complete Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" /> Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="mobileNumber">Mobile Number *</Label>
                      <Input id="mobileNumber" name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleInputChange} required placeholder="+1 (555) 123-4567" />
                    </div>
                    <div>
                      <Label htmlFor="license">Driver's License Number</Label>
                      <Input id="license" name="license" value={formData.license} onChange={handleInputChange} placeholder="D123456789" />
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" /> Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main Street" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="New York" />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleInputChange} placeholder="NY" />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="10001" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" name="country" value={formData.country} onChange={handleInputChange} />
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" /> Billing Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="billingAddress">Billing Address</Label>
                      <Input id="billingAddress" name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} placeholder="Same as above" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billingCity">City</Label>
                        <Input id="billingCity" name="billingCity" value={formData.billingCity} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="billingState">State</Label>
                        <Input id="billingState" name="billingState" value={formData.billingState} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="billingZipCode">ZIP Code</Label>
                        <Input id="billingZipCode" name="billingZipCode" value={formData.billingZipCode} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billingCountry">Country</Label>
                      <Input id="billingCountry" name="billingCountry" value={formData.billingCountry} onChange={handleInputChange} />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" /> Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" name="cardName" value={formData.cardName} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={handleInputChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" name="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" name="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} required />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" variant="premium" size="lg" className="w-full" disabled={isProcessing}>
                  {isProcessing ? 'Processing Payment...' : `Pay & Confirm - $${totalCost}`}
                </Button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" /> Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Car Info */}
                  <div className="flex items-center space-x-3">
                    <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-16 h-12 object-cover rounded" />
                    <div>
                      <p className="font-semibold text-foreground">{car.brand} {car.model}</p>
                      <p className="text-sm text-muted-foreground">{car.type}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Dates */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pickup Date:</span>
                      <span className="font-medium">{format(startDateObj, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Return Date:</span>
                      <span className="font-medium">{format(endDateObj, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rental Cost:</span>
                      <span className="font-medium">${totalCost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Fee:</span>
                      <span className="font-medium">$0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Insurance:</span>
                      <span className="font-medium text-success">Included</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Total:</span>
                    <span className="text-primary">${totalCost}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
