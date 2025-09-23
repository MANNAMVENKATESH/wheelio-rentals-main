import { motion } from 'framer-motion';
import { Calendar, Users, Fuel, Settings, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Car } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CarCardProps {
  car: Car;
  className?: string;
}

export function CarCard({ car, className }: CarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      {/* Car Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant={car.availability ? 'default' : 'secondary'}
            className={cn(
              'text-xs',
              car.availability ? 'bg-success' : 'bg-muted'
            )}
          >
            {car.availability ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="text-xs">
            {car.type}
          </Badge>
        </div>
      </div>

      {/* Car Details */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-muted-foreground">{car.year}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl text-primary">
              ${car.pricePerDay}
            </p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </div>

        {/* Car Specs */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {car.seats} seats
          </div>
          <div className="flex items-center">
            <Fuel className="h-4 w-4 mr-2" />
            {car.fuel}
          </div>
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            {car.transmission}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {car.location}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/cars/${car.id}`}>
              View Details
            </Link>
          </Button>
          <Button
            variant={car.availability ? "premium" : "secondary"}
            size="sm"
            className="flex-1"
            disabled={!car.availability}
            asChild={car.availability}
          >
            {car.availability ? (
              <Link to={`/cars/${car.id}`}>
                Book Now
              </Link>
            ) : (
              'Unavailable'
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}