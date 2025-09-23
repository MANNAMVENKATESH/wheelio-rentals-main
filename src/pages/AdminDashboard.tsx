import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Car, Users, Calendar, DollarSign, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { mockCars, mockBookings } from '@/data/mockData';
import { Car as CarType, Booking } from '@/types';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [cars, setCars] = useState(mockCars);
  const [bookings] = useState(mockBookings);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [isAddingCar, setIsAddingCar] = useState(false);

  const [carForm, setCarForm] = useState({
    brand: '',
    model: '',
    type: 'Sedan',
    pricePerDay: 0,
    image: '',
    description: '',
    features: '',
    year: new Date().getFullYear(),
    fuel: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    location: ''
  });

  const stats = {
    totalCars: cars.length,
    availableCars: cars.filter(car => car.availability).length,
    totalBookings: bookings.length,
    revenue: bookings.reduce((sum, booking) => sum + booking.totalCost, 0)
  };

  const handleCarStatus = (carId: string, availability: boolean) => {
    setCars(cars.map(car => 
      car.id === carId ? { ...car, availability } : car
    ));
  };

  const handleDeleteCar = (carId: string) => {
    setCars(cars.filter(car => car.id !== carId));
  };

  const handleSaveCar = () => {
    const carData = {
      ...carForm,
      type: carForm.type as CarType['type'],
      features: carForm.features.split(',').map(f => f.trim()),
      availability: true
    };

    if (editingCar) {
      setCars(cars.map(car => 
        car.id === editingCar.id ? { ...car, ...carData } : car
      ));
    } else {
      const newCar = {
        ...carData,
        id: Math.random().toString(36).substr(2, 9)
      } as CarType;
      setCars([...cars, newCar]);
    }

    setEditingCar(null);
    setIsAddingCar(false);
    setCarForm({
      brand: '',
      model: '',
      type: 'Sedan',
      pricePerDay: 0,
      image: '',
      description: '',
      features: '',
      year: new Date().getFullYear(),
      fuel: 'Gasoline',
      transmission: 'Automatic',
      seats: 5,
      location: ''
    });
  };

  const openEditDialog = (car: CarType) => {
    setEditingCar(car);
    setCarForm({
      ...car,
      features: car.features.join(', ')
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'cars', label: 'Manage Cars', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-primary-foreground/80">Manage your car rental business</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCars}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.availableCars} available
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Cars</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.availableCars}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.availableCars / stats.totalCars) * 100).toFixed(1)}% availability
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    Active rentals
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.revenue}</div>
                  <p className="text-xs text-muted-foreground">
                    From all bookings
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Car</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          {booking.car.brand} {booking.car.model}
                        </TableCell>
                        <TableCell>{booking.userDetails.name}</TableCell>
                        <TableCell>
                          {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${booking.totalCost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Cars Management Tab */}
        {activeTab === 'cars' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Manage Cars</h2>
              <Dialog open={isAddingCar} onOpenChange={setIsAddingCar}>
                <DialogTrigger asChild>
                  <Button variant="premium">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Car
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingCar ? 'Edit Car' : 'Add New Car'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={carForm.brand}
                        onChange={(e) => setCarForm({...carForm, brand: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={carForm.model}
                        onChange={(e) => setCarForm({...carForm, model: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={carForm.type} onValueChange={(value) => setCarForm({...carForm, type: value as any})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Sedan">Sedan</SelectItem>
                          <SelectItem value="Hatchback">Hatchback</SelectItem>
                          <SelectItem value="Luxury">Luxury</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pricePerDay">Price per Day</Label>
                      <Input
                        id="pricePerDay"
                        type="number"
                        value={carForm.pricePerDay}
                        onChange={(e) => setCarForm({...carForm, pricePerDay: Number(e.target.value)})}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={carForm.image}
                        onChange={(e) => setCarForm({...carForm, image: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={carForm.description}
                        onChange={(e) => setCarForm({...carForm, description: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="features">Features (comma separated)</Label>
                      <Input
                        id="features"
                        value={carForm.features}
                        onChange={(e) => setCarForm({...carForm, features: e.target.value})}
                        placeholder="GPS Navigation, Bluetooth, Leather Seats"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsAddingCar(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCar}>
                      {editingCar ? 'Update Car' : 'Add Car'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Car</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price/Day</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img src={car.image} alt={car.model} className="w-12 h-8 object-cover rounded" />
                            <div>
                              <p className="font-medium">{car.brand} {car.model}</p>
                              <p className="text-sm text-muted-foreground">{car.year}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{car.type}</TableCell>
                        <TableCell>${car.pricePerDay}</TableCell>
                        <TableCell>{car.location}</TableCell>
                        <TableCell>
                          <Badge variant={car.availability ? 'default' : 'secondary'}>
                            {car.availability ? 'Available' : 'Unavailable'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(car)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={car.availability ? 'secondary' : 'success'}
                              size="sm"
                              onClick={() => handleCarStatus(car.id, !car.availability)}
                            >
                              {car.availability ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteCar(car.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-foreground">All Bookings</h2>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Car</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Rental Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img src={booking.car.image} alt={booking.car.model} className="w-12 h-8 object-cover rounded" />
                            <div>
                              <p className="font-medium">{booking.car.brand} {booking.car.model}</p>
                              <p className="text-sm text-muted-foreground">{booking.car.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.userDetails.name}</p>
                            <p className="text-sm text-muted-foreground">{booking.userDetails.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{booking.userDetails.phone}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{format(new Date(booking.startDate), 'MMM dd, yyyy')}</p>
                            <p className="text-muted-foreground">to {format(new Date(booking.endDate), 'MMM dd, yyyy')}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'completed' ? 'secondary' : 'destructive'
                          }>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">${booking.totalCost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}