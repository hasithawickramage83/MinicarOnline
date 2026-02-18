// API Configuration - Connect to Django Backend
//const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://django-postgres-docker.onrender.com/api';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount_percentage: number;
  promotion_text: string;
  product_model: string;
  product_dimension: string;
  is_active: boolean;
  images?: ProductImage[];
  created_at?: string;
}

export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: string;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Helper function for authenticated requests
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// API Functions
export const api = {
  // Auth
  async register(data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    return response.json();
  },

  async login(username: string, password: string): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    const tokens = await response.json();
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    return tokens;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },


  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/me/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },
async createProduct(data: Partial<Product>, images?: File[]): Promise<Product> {
  const formData = new FormData();

  // Add product data
  Object.keys(data).forEach(key => {
    if (data[key as keyof Product] !== undefined) {
      formData.append(key, String(data[key as keyof Product]));
    }
  });

  // Add images if provided
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append('images_upload', image); // <-- must match serializer field
    });
  }

  const response = await fetch(`${API_BASE_URL}/products/`, {
    method: 'POST',
    headers: {
      ...(localStorage.getItem('access_token') && { 
        'Authorization': `Bearer ${localStorage.getItem('access_token')}` 
      }),
      // Do NOT set Content-Type manually for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Failed to create product');
  }

  return response.json();
},

  async updateProduct(id: number, data: Partial<Product>, images?: File[]): Promise<Product> {
    // If images are provided, use FormData
    if (images && images.length > 0) {
      const formData = new FormData();
      
      // Add product data
      Object.keys(data).forEach(key => {
        if (data[key as keyof Product] !== undefined) {
          formData.append(key, String(data[key as keyof Product]));
        }
      });
      
      // Add images
      images.forEach((image) => {
        formData.append('images_upload', image);
      });

      const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
        method: 'PUT',
        headers: {
          // Don't set Content-Type for FormData - browser sets it with boundary
          ...(localStorage.getItem('access_token') && { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }),
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    } else {
      // Use JSON for regular data updates
      const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    }
  },

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },

  // Cart
  async getCart(): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/orders/cart/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to fetch cart (${response.status}: ${response.statusText})`);
    }
    return response.json();
  },

  async addToCart(productId: number, quantity: number): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/orders/cart/add/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },
  
  async reduceFromCart(productId: number, quantity: number): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/orders/cart/reduce/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId, quantity }),
    });
    if (!response.ok) throw new Error('Failed to reduce from cart');
    return response.json();
  },
  
  async removeFromCart(id: number): Promise<void> {
    alert(id)
    const response = await fetch(`${API_BASE_URL}/orders/cart/remove/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete cart item');
  },

  // Orders
  async checkout(): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/checkout/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to checkout');
    return response.json();
  },

  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },
};

export default api;
