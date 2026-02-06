import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import ModelFilter from '@/components/products/ModelFilter';
import { mockProducts } from '@/data/mockProducts';
import { Search } from 'lucide-react';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialModel = searchParams.get('model') || 'All';
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [searchQuery, setSearchQuery] = useState('');

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    if (model === 'All') {
      searchParams.delete('model');
    } else {
      searchParams.set('model', model);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesModel = selectedModel === 'All' || product.product_model === selectedModel;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesModel && matchesSearch;
    });
  }, [selectedModel, searchQuery]);

  return (
    <>
      <Helmet>
        <title>{selectedModel === 'All' ? 'All Products' : `${selectedModel} Models`} | MiniWheels Diecast Cars</title>
        <meta name="description" content={`Browse our collection of premium ${selectedModel === 'All' ? '' : selectedModel + ' '}1:18 scale diecast model cars. Authentic replicas with stunning detail.`} />
        <meta name="keywords" content={`${selectedModel} diecast, ${selectedModel} model car, 1:18 scale, diecast collection, premium model cars`} />
      </Helmet>
      <Layout>
        {/* Header */}
        <section className="py-16 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <p className="text-accent font-semibold mb-2">Premium Collection</p>
            <h1 className="section-title text-5xl md:text-6xl mb-6">
              {selectedModel === 'All' ? 'ALL PRODUCTS' : `${selectedModel.toUpperCase()} COLLECTION`}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated selection of premium diecast scale models. 
              Each piece is crafted with exceptional attention to detail.
            </p>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            {/* Search & Filter */}
            <div className="mb-8 space-y-6">
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-styled pl-12"
                />
              </div>

              {/* Model Filter */}
              <ModelFilter 
                selectedModel={selectedModel} 
                onModelChange={handleModelChange} 
              />
            </div>

            {/* Results Count */}
            <p className="text-center text-muted-foreground mb-8">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-2xl font-heading text-muted-foreground">No products found</p>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Products;
