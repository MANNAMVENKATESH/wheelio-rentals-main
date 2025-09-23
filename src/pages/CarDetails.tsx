import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Fuel, Settings, MapPin, ArrowLeft, Star, Shield, Check } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockCars } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const car = mockCars.find(c => c.id === id);

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Car not found</h1>
          <Button onClick={() => navigate('/cars')}>Back to Cars</Button>
        </div>
      </div>
    );
  }

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalCost = calculateDays() * car.pricePerDay;

  const handleBookNow = () => {
    if (!startDate || !endDate) {
      alert('Please select both pickup and return dates');
      return;
    }
    navigate('/booking', {
      state: {
        car,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalCost
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="bg-muted/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Car Image */}
              <div className="relative rounded-lg overflow-hidden mb-6 aspect-[16/10]">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={car.availability ? 'default' : 'secondary'}
                    className={cn(
                      'text-sm',
                      car.availability ? 'bg-success' : 'bg-muted'
                    )}
                  >
                    {car.availability ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="text-sm">
                    {car.type}
                  </Badge>
                </div>
              </div>

              {/* Car Info */}
              <div className="bg-card rounded-lg border border-border p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {car.brand} {car.model}
                    </h1>
                    <p className="text-lg text-muted-foreground">{car.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      ${car.pricePerDay}
                    </p>
                    <p className="text-sm text-muted-foreground">per day</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  {car.description}
                </p>

                {/* Car Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{car.seats} Seats</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Fuel className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{car.fuel}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Settings className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{car.transmission}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{car.location}</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-success mr-2" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Safety & Insurance */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Safety & Insurance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-success mr-2" />
                    <span className="text-sm text-muted-foreground">Full Insurance Coverage</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-success mr-2" />
                    <span className="text-sm text-muted-foreground">24/7 Roadside Assistance</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-success mr-2" />
                    <span className="text-sm text-muted-foreground">Free Cancellation</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-success mr-2" />
                    <span className="text-sm text-muted-foreground">Professional Cleaning</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-lg border border-border p-6 sticky top-20"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">Book This Car</h3>

              {/* Date Selection */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Pickup Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !startDate && 'text-muted-foreground'
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Select pickup date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Return Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !endDate && 'text-muted-foreground'
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Select return date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Pricing Summary */}
              {startDate && endDate && (
                <div className="border-t border-border pt-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        ${car.pricePerDay} × {calculateDays()} days
                      </span>
                      <span className="text-foreground">${totalCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="text-foreground">$0</span>
                    </div>
                  </div>
                  <div className="border-t border-border mt-2 pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">${totalCost}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <Button
                onClick={handleBookNow}
                variant="premium"
                size="lg"
                className="w-full"
                disabled={!car.availability || !startDate || !endDate}
              >
                {car.availability ? 'Book Now' : 'Unavailable'}
              </Button>

              <p className="text-xs text-muted-foreground mt-3 text-center">
                Free cancellation up to 24 hours before pickup
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}