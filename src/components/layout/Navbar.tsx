import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Cars', href: '/cars' },
  { name: 'My Bookings', href: '/bookings' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userData');
      if (stored) setUser(JSON.parse(stored));
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'userData') {
        try { setUser(e.newValue ? JSON.parse(e.newValue) : null); } catch { setUser(null); }
      }
    };
    const onLocalEvent = () => {
      try {
        const current = localStorage.getItem('userData');
        setUser(current ? JSON.parse(current) : null);
      } catch { setUser(null); }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('userDataChanged', onLocalEvent as any);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/');
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Wheelio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors relative',
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth/Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-foreground/80 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {user.username || user.email || 'User'}
                </span>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/bookings">My Bookings</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button variant="premium" size="sm" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'block px-3 py-2 text-base font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-2 space-y-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-foreground/80 flex items-center">
                      <User className="h-4 w-4 mr-2" /> {user.username || user.email || 'User'}
                    </div>
                    <Button variant="secondary" className="w-full" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/bookings">My Bookings</Link>
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => { setIsOpen(false); handleLogout(); }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/login">
                        <User className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button variant="premium" className="w-full" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}