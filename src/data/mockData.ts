import { Car, Booking } from '@/types';

export const mockCars: Car[] = [
  {
    id: '1',
    brand: 'BMW',
    model: 'X5',
    type: 'SUV',
    pricePerDay: 120,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop&crop=center',
    availability: true,
    description: 'Luxury SUV with premium comfort and advanced safety features. Perfect for family trips and business travel.',
    features: ['Leather Seats', 'GPS Navigation', 'Bluetooth', 'Backup Camera', 'Premium Sound', 'Sunroof'],
    year: 2023,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    seats: 7,
    location: 'New York'
  },
  {
    id: '2',
    brand: 'Mercedes',
    model: 'C-Class',
    type: 'Sedan',
    pricePerDay: 95,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop&crop=center',
    availability: true,
    description: 'Executive sedan combining luxury, performance, and efficiency for the discerning traveler.',
    features: ['Leather Seats', 'GPS Navigation', 'Bluetooth', 'Climate Control', 'Premium Sound'],
    year: 2023,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    location: 'Los Angeles'
  },
  {
    id: '3',
    brand: 'Toyota',
    model: 'Corolla',
    type: 'Sedan',
    pricePerDay: 55,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=300&fit=crop&crop=center',
    availability: true,
    description: 'Reliable and fuel-efficient sedan perfect for city driving and daily commutes.',
    features: ['GPS Navigation', 'Bluetooth', 'Backup Camera', 'Climate Control'],
    year: 2022,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    location: 'Chicago'
  },
  {
    id: '4',
    brand: 'Audi',
    model: 'Q7',
    type: 'SUV',
    pricePerDay: 140,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop&crop=center',
    availability: false,
    description: 'Premium luxury SUV with cutting-edge technology and spacious interior.',
    features: ['Leather Seats', 'GPS Navigation', 'Bluetooth', 'Panoramic Sunroof', 'Premium Sound', '360° Camera'],
    year: 2023,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    seats: 7,
    location: 'Miami'
  },
  {
    id: '5',
    brand: 'Honda',
    model: 'Civic',
    type: 'Hatchback',
    pricePerDay: 45,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500&h=300&fit=crop&crop=center',
    availability: true,
    description: 'Compact and efficient hatchback ideal for urban adventures and weekend getaways.',
    features: ['GPS Navigation', 'Bluetooth', 'Backup Camera', 'USB Ports'],
    year: 2022,
    fuel: 'Gasoline',
    transmission: 'Manual',
    seats: 5,
    location: 'Seattle'
  },
  {
    id: '6',
    brand: 'Lamborghini',
    model: 'Huracán',
    type: 'Sports',
    pricePerDay: 850,
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=500&h=300&fit=crop&crop=center',
    availability: true,
    description: 'Exotic supercar delivering unmatched performance and head-turning style.',
    features: ['Racing Seats', 'Premium Sound', 'Carbon Fiber Interior', 'Track Mode', 'Launch Control'],
    year: 2023,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    seats: 2,
    location: 'Las Vegas'
  },
  {
    id: '7',
    brand: 'Tesla',
    model: 'Model S',
    type: 'Luxury',
    pricePerDay: 180,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&h=300&fit=crop&crop=center',
    availability: true,
    description: 'All-electric luxury sedan with cutting-edge technology and exceptional range.',
    features: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Supercharging', 'Over-the-Air Updates'],
    year: 2023,
    fuel: 'Electric',
    transmission: 'Automatic',
    seats: 5,
    location: 'San Francisco'
  },
  {
    id: '8',
    brand: 'Porsche',
    model: '911',
    type: 'Sports',
    pricePerDay: 650,
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=500&h=300&fit=crop&crop=center',
    availability: true,
    description: 'Iconic sports car delivering pure driving pleasure and timeless design.',
    features: ['Sport Seats', 'Sport Chrono Package', 'Premium Sound', 'Sport Exhaust', 'Launch Control'],
    year: 2023,
    fuel: 'Gasoline',
    transmission: 'Manual',
    seats: 2,
    location: 'Austin'
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    carId: '1',
    car: mockCars[0],
    userId: 'user1',
    startDate: '2024-08-25',
    endDate: '2024-08-28',
    totalCost: 360,
    status: 'confirmed',
    userDetails: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123'
    },
    createdAt: '2024-08-20T10:00:00Z'
  },
  {
    id: 'b2',
    carId: '3',
    car: mockCars[2],
    userId: 'user1',
    startDate: '2024-08-15',
    endDate: '2024-08-18',
    totalCost: 165,
    status: 'completed',
    userDetails: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123'
    },
    createdAt: '2024-08-10T14:30:00Z'
  }
];