import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { Package, Plus, Edit, Trash2, ShoppingBag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { mockProducts } from '@/data/mockProducts';
import { getProductImage } from '@/lib/productImages';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock orders for admin
const mockAdminOrders = [
  { id: 1001, customer: 'John Doe', email: 'john@example.com', date: '2024-01-15', total: 359.98, status: 'delivered' },
  { id: 1002, customer: 'Jane Smith', email: 'jane@example.com', date: '2024-01-20', total: 159.99, status: 'processing' },
  { id: 1003, customer: 'Mike Johnson', email: 'mike@example.com', date: '2024-01-22', total: 449.97, status: 'shipped' },
];

const Admin: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState(mockProducts);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // For demo purposes, we'll allow access. In production, check isAdmin
  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=/admin" replace />;
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const handleSaveProduct = (product: any) => {
    if (editingProduct?.id) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...product } : p));
      toast.success('Product updated successfully');
    } else {
      const newProduct = { ...product, id: Date.now() };
      setProducts([...products, newProduct]);
      toast.success('Product created successfully');
    }
    setEditingProduct(null);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | MiniWheels</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="section-title text-4xl">ADMIN DASHBOARD</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === 'products' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Package className="w-5 h-5" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === 'orders' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Orders
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">{products.length} products</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="hero" onClick={() => setEditingProduct({})}>
                      <Plus className="w-4 h-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-2xl">
                        {editingProduct?.id ? 'Edit Product' : 'Add New Product'}
                      </DialogTitle>
                    </DialogHeader>
                    <ProductForm 
                      product={editingProduct} 
                      onSave={handleSaveProduct}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4">Product</th>
                      <th className="text-left py-4 px-4">Model</th>
                      <th className="text-left py-4 px-4">Price</th>
                      <th className="text-left py-4 px-4">Discount</th>
                      <th className="text-left py-4 px-4">Stock</th>
                      <th className="text-right py-4 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getProductImage(product.product_model)}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{product.product_model}</td>
                        <td className="py-4 px-4">${product.price.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          {product.discount_percentage > 0 ? (
                            <span className="px-2 py-1 bg-accent text-accent-foreground text-sm rounded">
                              {product.discount_percentage}%
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="py-4 px-4">{product.quantity}</td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setEditingProduct(product)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle className="font-heading text-2xl">Edit Product</DialogTitle>
                                </DialogHeader>
                                <ProductForm 
                                  product={product} 
                                  onSave={handleSaveProduct}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <p className="text-muted-foreground mb-6">{mockAdminOrders.length} orders</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4">Order #</th>
                      <th className="text-left py-4 px-4">Customer</th>
                      <th className="text-left py-4 px-4">Date</th>
                      <th className="text-left py-4 px-4">Total</th>
                      <th className="text-left py-4 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAdminOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-4 px-4 font-medium">#{order.id}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">{order.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 font-semibold text-primary">${order.total.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                            order.status === 'shipped' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

// Product Form Component
const ProductForm: React.FC<{ product: any; onSave: (product: any) => void }> = ({ product, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    quantity: product?.quantity || '',
    discount_percentage: product?.discount_percentage || 0,
    promotion_text: product?.promotion_text || '',
    product_model: product?.product_model || 'Ferrari',
    product_dimension: product?.product_dimension || '24 cm',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price as string),
      quantity: parseInt(formData.quantity as string),
      discount_percentage: parseInt(formData.discount_percentage as string),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-styled"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-styled min-h-[100px]"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="input-styled"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="input-styled"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Discount %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.discount_percentage}
            onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
            className="input-styled"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <select
            value={formData.product_model}
            onChange={(e) => setFormData({ ...formData, product_model: e.target.value })}
            className="input-styled"
          >
            {['Ferrari', 'Porsche', 'Lamborghini', 'BMW', 'Mercedes', 'Audi', 'McLaren', 'Toyota', 'Nissan', 'Ford', 'Chevrolet', 'Bugatti'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Promotion Text</label>
          <input
            type="text"
            value={formData.promotion_text}
            onChange={(e) => setFormData({ ...formData, promotion_text: e.target.value })}
            className="input-styled"
            placeholder="e.g., Limited Edition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dimension</label>
          <input
            type="text"
            value={formData.product_dimension}
            onChange={(e) => setFormData({ ...formData, product_dimension: e.target.value })}
            className="input-styled"
          />
        </div>
      </div>
      <Button variant="hero" type="submit" className="w-full">
        {product?.id ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
};

export default Admin;
