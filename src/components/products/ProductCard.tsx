import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { getProductImage } from '@/lib/productImages';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Convert price to number in case API returns it as string
  const price = Number(product.price);
  const discountPercentage = Number(product.discount_percentage);
  const discountedPrice = price * (1 - discountPercentage / 100);
  const hasDiscount = discountPercentage > 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart(product, 1);
    } catch (error) {
      // Error is handled in the context
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="product-card">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="discount-badge">
            -{discountPercentage}%
          </div>
        )}

        {/* Promotion Text */}
        {product.promotion_text && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-full">
            {product.promotion_text}
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={getProductImage(product.product_model)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Actions */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <Button variant="glass" size="sm" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
            <Button variant="glass" size="icon" className="shrink-0">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.product_model}</p>
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.product_dimension}</p>

          <div className="flex items-center gap-2 pt-2">
            {hasDiscount && (
              <span className="price-original">${price.toFixed(2)}</span>
            )}
            <span className={hasDiscount ? 'price-discounted' : 'text-xl font-bold text-primary'}>
              ${discountedPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
