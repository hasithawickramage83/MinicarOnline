import React from 'react';
import { Link } from 'react-router-dom';
import { productModels } from '@/data/mockProducts';

const BrandShowcase: React.FC = () => {
  const brands = productModels.filter(m => m !== 'All');

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold mb-2">Authentic Replicas</p>
          <h2 className="section-title text-4xl">BRANDS WE CARRY</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {brands.map((brand) => (
            <Link
              key={brand}
              to={`/products?model=${brand}`}
              className="px-8 py-4 bg-secondary rounded-lg text-lg font-heading tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
            >
              {brand.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
