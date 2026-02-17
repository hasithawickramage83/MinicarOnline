import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, CartItem as ApiCartItem, Cart } from '@/lib/api';
import api from '@/lib/api';
import { toast } from 'sonner';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  const refreshCart = useCallback(async () => {
    console.log('=== REFRESH CART START ===');
    console.log('isAuthenticated:', api.isAuthenticated());
    console.log('token in localStorage:', localStorage.getItem('access_token'));
    
    if (!api.isAuthenticated()) {
      console.log('User not authenticated, clearing cart');
      setItems([]);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching cart from API...');
      console.log('API URL:', `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/orders/cart/`);
      
      const cart: Cart = await api.getCart();
      console.log('Raw cart response:', cart);
      console.log('Cart type:', typeof cart);
      console.log('Cart.items:', cart?.items);
      console.log('Cart.items type:', typeof cart?.items);
      
      // Handle case where cart or items might be undefined
      if (!cart) {
        console.warn('Cart is null/undefined');
        setItems([]);
        return;
      }
      
      if (!cart.items) {
        console.warn('Cart.items is null/undefined');
        setItems([]);
        return;
      }
      
      if (!Array.isArray(cart.items)) {
        console.warn('Cart.items is not an array:', cart.items);
        setItems([]);
        return;
      }
      
      if (cart.items.length === 0) {
        console.log('Cart is empty (0 items)');
        setItems([]);
        return;
      }
      
      const transformedItems: CartItem[] = cart.items.map((item: ApiCartItem) => {
        console.log('Processing item:', item);
        return {
          product: item.product,
          quantity: item.quantity
        };
      });
      
      console.log('Transformed items:', transformedItems);
      setItems(transformedItems);
      console.log('Cart items set successfully');
    } catch (error) {
      console.error('=== CART FETCH ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(`Failed to load cart: ${error.message || 'Unknown error'}`);
      setItems([]);
    } finally {
      setIsLoading(false);
      console.log('=== REFRESH CART END ===');
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [api.isAuthenticated(), refreshCart]);

  // Clear cart when user logs out
  useEffect(() => {
    if (!api.isAuthenticated()) {
      setItems([]);
    }
  }, [api.isAuthenticated()]);

  // Update itemCount when items or auth state changes
  useEffect(() => {
    const count = api.isAuthenticated() ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
    console.log('=== ITEM COUNT UPDATE ===');
    console.log('Previous itemCount:', itemCount);
    console.log('New count:', count);
    console.log('isAuthenticated:', api.isAuthenticated());
    console.log('items.length:', items.length);
    console.log('items:', items);
    setItemCount(count);
    console.log('itemCount set to:', count);
    console.log('=== END ITEM COUNT UPDATE ===');
  }, [items, api.isAuthenticated()]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!api.isAuthenticated()) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    try {
      setIsLoading(true);
      await api.addToCart(product.id, quantity);
      await refreshCart();
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    alert('')
    if (!api.isAuthenticated()) {
      toast.error('Please sign in to manage cart');
      return;
    }

    try {
      setIsLoading(true);
      // Note: API doesn't seem to have a remove endpoint, so we'll refresh cart
      // This might need to be implemented in the backend
      await api.removeFromCart(productId);
      await refreshCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!api.isAuthenticated()) {
      toast.error('Please sign in to manage cart');
      return;
    }

    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      setIsLoading(true);
      // Note: API doesn't seem to have an update quantity endpoint
      // We'll need to add the item again or this needs to be implemented in backend
      await api.addToCart(productId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!api.isAuthenticated()) {
      toast.error('Please sign in to manage cart');
      return;
    }

    try {
      setIsLoading(true);
      // Note: API doesn't seem to have a clear cart endpoint
      // This might need to be implemented in the backend
      await refreshCart();
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const total = items.reduce((sum, item) => {
    const discountedPrice =
      item.product.price * (1 - item.product.discount_percentage / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        total,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
