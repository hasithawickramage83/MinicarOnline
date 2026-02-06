import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-cars.jpg';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium diecast car collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <p className="text-accent font-semibold mb-4 animate-fade-in">
            Premium Diecast Collections
          </p>
          <h1 className="section-title text-5xl md:text-7xl lg:text-8xl mb-6 animate-slide-up">
            COLLECT THE
            <br />
            <span className="text-gradient">EXTRAORDINARY</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl animate-fade-in">
            Discover our exclusive collection of precision-crafted 1:18 scale diecast 
            models. From legendary supercars to iconic sports cars, every detail is 
            meticulously recreated.
          </p>
          <div className="flex flex-wrap gap-4 animate-slide-up">
            <Link to="/products">
              <Button variant="hero" size="xl">
                Explore Collection
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="xl">
                Our Story
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="glass-effect p-6 rounded-xl flex items-center gap-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Hand-finished details</p>
            </div>
          </div>
          <div className="glass-effect p-6 rounded-xl flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">Orders over $100</p>
            </div>
          </div>
          <div className="glass-effect p-6 rounded-xl flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Packaging</h3>
              <p className="text-sm text-muted-foreground">Collector-grade protection</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
