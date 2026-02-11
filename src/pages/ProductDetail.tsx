import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ShoppingCart, Minus, Plus, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { api, Product } from '@/lib/api';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch product and related products
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const prod = await api.getProduct(Number(id));
        setProduct(prod);

        // Fetch all products for related ones
        const allProducts = await api.getProducts();
        const related = allProducts
          .filter(p => p.product_model === prod.product_model && p.id !== prod.id)
          .slice(0, 4);

        setRelatedProducts(related);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg">Loading product details...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="section-title text-4xl mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button variant="hero">Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const price = Number(product.price);
  const discountPercentage = Number(product.discount_percentage);
  const discountedPrice = price * (1 - discountPercentage / 100);
  const hasDiscount = discountPercentage > 0;

  // Use product images from API
  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.image)
    : ['/placeholder.png']; // fallback image

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product, quantity);
      navigate('/cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to buy now');
    }
  };

  return (
    <>
      <Helmet>
        <title>Product Detail | MiniWheels Diecast Cars</title>
        <meta name="description" content="Product details for MiniWheels diecast cars" />
        <meta property="og:title" content="Product Detail" />
        <meta property="og:description" content="Product details for MiniWheels diecast cars" />
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </button>
          </nav>

          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="product-card aspect-square overflow-hidden">
                {hasDiscount && (
                  <div className="discount-badge z-10">-{discountPercentage}%</div>
                )}
                {product.promotion_text && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-full">
                    {product.promotion_text}
                  </div>
                )}
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <p className="text-accent font-semibold mb-2">{product.product_model}</p>
                <h1 className="section-title text-4xl md:text-5xl">{product.name}</h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {hasDiscount && (
                  <span className="price-original text-xl">${price.toFixed(2)}</span>
                )}
                <span className="text-4xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="px-2 py-1 bg-accent text-accent-foreground text-sm font-bold rounded">
                    Save ${(price - discountedPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Dimensions</p>
                  <p className="font-semibold">{product.product_dimension}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Availability</p>
                  <p className="font-semibold text-green-500 flex items-center gap-1">
                    <Check className="w-4 h-4" /> In Stock ({product.quantity} available)
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button variant="hero" size="xl" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button variant="gold" size="xl" className="flex-1" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Free Shipping<br />Orders $100+</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Secure<br />Packaging</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">30-Day<br />Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="py-12 border-t border-border">
              <h2 className="section-title text-3xl mb-8">MORE FROM {product.product_model.toUpperCase()}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </Layout>
    </>
  );
};

export default ProductDetail;
