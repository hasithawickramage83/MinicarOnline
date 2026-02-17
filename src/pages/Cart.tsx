import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getProductImage } from '@/lib/productImages';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart, isLoading, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/cart');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated, refreshCart]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to checkout');
      navigate('/auth?redirect=/cart');
      return;
    }
    // Proceed to checkout
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/orders');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </Layout>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Layout>
        <Helmet>
          <title>Shopping Cart | MiniWheels</title>
        </Helmet>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="section-title text-4xl mb-4">YOUR CART IS EMPTY</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products">
            <Button variant="hero" size="xl">
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart | MiniWheels</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="section-title text-4xl md:text-5xl">SHOPPING CART</h1>
            <Button 
              variant="outline" 
              onClick={refreshCart} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.filter(item => item && item.product).map((item) => {
                // Defensive check for item and product data
                if (!item || !item.product) {
                  console.warn('Invalid cart item:', item);
                  return null;
                }
                
                const price = Number(item.product.price || 0);
                const discountPercentage = Number(item.product.discount_percentage || 0);
                const discountedPrice = price * (1 - discountPercentage / 100);
                const hasDiscount = discountPercentage > 0;

                return (
                  <div key={item.product.id} className="card-gradient rounded-xl p-4 flex gap-4">
                    {/* Image */}
                    <Link to={`/products/${item.product.id}`} className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                      <img
                       src={item.product.images?.[0]?.image}
                        
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors truncate">
                          {item.product.name || 'Unknown Product'}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.product.product_model || 'Unknown Model'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {hasDiscount && (
                          <span className="text-sm line-through text-muted-foreground">
                            ${price.toFixed(2)}
                          </span>
                        )}
                        <span className="font-bold text-primary">${discountedPrice.toFixed(2)}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              try {
                                await updateQuantity(item.product.id, item.quantity - 1);
                              } catch (error) {
                                // Error is handled in the context
                              }
                            }}
                            className="w-8 h-8 rounded bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={async () => {
                              try {
                                await updateQuantity(item.product.id, item.quantity + 1);
                              } catch (error) {
                                // Error is handled in the context
                              }
                            }}
                            className="w-8 h-8 rounded bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold">
                            ${(discountedPrice * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={async () => {
                              try {
                                await removeFromCart(item.product.id);
                              } catch (error) {
                                // Error is handled in the context
                              }
                            }}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={async () => {
                  try {
                    await clearCart();
                  } catch (error) {
                    // Error is handled in the context
                  }
                }}
                className="text-sm text-destructive hover:underline"
              >
                Clear all items
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-gradient rounded-xl p-6 sticky top-24">
                <h2 className="font-heading text-2xl mb-6">ORDER SUMMARY</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-500">{total >= 100 ? 'FREE' : '$9.99'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (estimated)</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-xl">TOTAL</span>
                    <span className="text-2xl font-bold text-primary">
                      ${(total + (total >= 100 ? 0 : 9.99) + total * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button variant="hero" size="xl" className="w-full" onClick={handleCheckout}>
                  {isAuthenticated ? 'Checkout' : 'Sign In to Checkout'}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  {total < 100 && `Add $${(100 - total).toFixed(2)} more for free shipping!`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Cart;
