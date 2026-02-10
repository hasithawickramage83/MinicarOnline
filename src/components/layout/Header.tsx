import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const { itemCount } = useCart();
  const { isAuthenticated, logout, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  console.log('Header - itemCount:', itemCount, 'isAuthenticated:', isAuthenticated);

  // Force re-render when auth state changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading text-xl">M</span>
            </div>
            <span className="font-heading text-2xl tracking-wider">
              MINI<span className="text-primary">WHEELS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link text-accent">Admin</Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-secondary rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{useAuth().user?.username || useAuth().user?.first_name || 'User'}</span>
                </div>
                <Link to="/orders">
                  <Button variant="ghost" size="sm">My Orders</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button variant="hero" size="sm">
                  <User className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col gap-2">
              <Link to="/" className="px-4 py-3 hover:bg-secondary rounded-lg" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" className="px-4 py-3 hover:bg-secondary rounded-lg" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link to="/about" className="px-4 py-3 hover:bg-secondary rounded-lg" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link to="/contact" className="px-4 py-3 hover:bg-secondary rounded-lg" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="px-4 py-3 hover:bg-secondary rounded-lg" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                  {isAdmin && (
                    <Link to="/admin" className="px-4 py-3 hover:bg-secondary rounded-lg text-accent" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                  )}
                  <button className="px-4 py-3 hover:bg-secondary rounded-lg text-left text-destructive" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <Link to="/auth" className="px-4 py-3 hover:bg-secondary rounded-lg" onClick={() => setMobileMenuOpen(false)}>Sign In / Register</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
