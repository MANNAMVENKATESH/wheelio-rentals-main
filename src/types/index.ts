export interface Car {
  id: string;
  brand: string;
  model: string;
  type: 'SUV' | 'Sedan' | 'Hatchback' | 'Luxury' | 'Sports';
  pricePerDay: number;
  image: string;
  availability: boolean;
  description: string;
  features: string[];
  year: number;
  fuel: string;
  transmission: string;
  seats: number;
  location: string;
}

export interface Booking {
  id: string;
  carId: string;
  car: Car;
  userId: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface SearchFilters {
  location: string;
  type: string;
  priceRange: [number, number];
  startDate?: Date;
  endDate?: Date;
}