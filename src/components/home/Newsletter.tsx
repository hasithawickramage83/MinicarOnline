import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <section className="py-20 hero-gradient">
      <div className="container mx-auto px-4 text-center">
        <p className="text-accent font-semibold mb-2">Stay Updated</p>
        <h2 className="section-title text-4xl md:text-5xl mb-4">
          JOIN THE COLLECTORS CLUB
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Be the first to know about new arrivals, exclusive deals, and collector events.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input-styled flex-1"
            required
          />
          <Button variant="hero" size="lg" type="submit">
            Subscribe
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
