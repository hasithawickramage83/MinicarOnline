import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { mockProducts } from '@/data/mockProducts';

const FeaturedProducts: React.FC = () => {
  const featuredProducts = mockProducts
    .filter(p => p.discount_percentage > 0 || p.promotion_text)
    .slice(0, 4);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          <div>
            <p className="text-accent font-semibold mb-2">Curated Selection</p>
            <h2 className="section-title text-4xl md:text-5xl">FEATURED MODELS</h2>
          </div>
          <Link to="/products">
            <Button variant="outline" size="lg">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
