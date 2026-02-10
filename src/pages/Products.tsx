import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import ModelFilter from '@/components/products/ModelFilter';
import { api, Product } from '@/lib/api';
import { Search, Loader2, AlertCircle } from 'lucide-react';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialModel = searchParams.get('model') || 'All';
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    return products.filter((product) => {
      const matchesModel = selectedModel === 'All' || product.product_model === selectedModel;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesModel && matchesSearch;
    });
  }, [products, selectedModel, searchQuery]);

  return (
    <>
      <Helmet>
        <title>Products | MiniWheels Diecast Cars</title>
        <meta name="description" content="Browse our collection of premium 1:18 scale diecast model cars. Authentic replicas with stunning detail." />
        <meta name="keywords" content="diecast cars, model cars, 1:18 scale, diecast collection, premium model cars" />
      </Helmet>
      <Layout>
        {/* Header */}
        <section className="py-16 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <p className="text-accent font-semibold mb-2">Premium Collection</p>
            <h1 className="section-title text-5xl md:text-6xl mb-6">
              {selectedModel === 'All' ? 'ALL PRODUCTS' : `${selectedModel?.toUpperCase() || 'PRODUCTS'} COLLECTION`}
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

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-2xl font-heading text-foreground mb-2">Failed to Load Products</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Results Count */}
            {!loading && !error && (
              <p className="text-center text-muted-foreground mb-8">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <>
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
              </>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Products;
